import { useSyncExternalStore } from "react";
import {
  ARCHETYPES,
  DEFAULT_ICON_STYLE,
  DEFAULT_SHADOW,
  FONTS,
  ICON_LIBRARIES,
  ICON_SIZES,
  ICON_TONES,
  ICON_WEIGHTS,
  SHADOWS,
  STYLES,
  type ArchetypeId,
  type IconLibraryId,
  type IconStyle,
  type ShadowChoice,
  type StyleId,
} from "./create-studio-config";
import {
  COLOR_TOKENS,
  DEFAULT_PALETTE,
  PALETTE_PRESETS,
  ROLE_IDS,
  normalizeHex,
  paletteForStyle,
  paletteLabel,
  type PaletteChartId,
  type PaletteNeutralId,
  type PalettePresetId,
  type StudioPalette,
} from "./create-studio-palette";

/**
 * Persisted studio settings.
 *
 * The whole sidebar configuration (scenario, style, palette, radius, shadow,
 * font and icon setup) lives in localStorage so a visitor can leave the page
 * and come back to the exact combination they were building. The store is
 * exposed through `useSyncExternalStore` with a `null` server snapshot: the
 * prerendered HTML therefore shows the defaults and the saved configuration
 * is applied right after hydration, exactly like the uploaded-font store.
 *
 * Storage is only touched from the subscribe/mutation helpers, never during
 * rendering, and every parse is defensive so an old or corrupted payload can
 * never break the canvas.
 */
export const STUDIO_CONFIG_KEY = "cc-studio-config-v1";
export const STUDIO_TOUR_KEY = "cc-studio-tour-v1";

export type StudioConfig = {
  archetype: ArchetypeId;
  styleId: StyleId;
  palette: StudioPalette;
  radius: number;
  shadow: ShadowChoice;
  /** Built-in `FontId` or the id of an uploaded font in IndexedDB. */
  font: string;
  iconLibrary: IconLibraryId;
  iconStyle: IconStyle;
};

/** What `/create` renders before it has ever stored anything. */
export const DEFAULT_STUDIO_CONFIG: StudioConfig = {
  archetype: "landing",
  styleId: "nova",
  // Derived from the default style, so the first paint can never show a
  // palette that the style picker would immediately replace.
  palette: paletteForStyle("nova"),
  radius: 4,
  shadow: DEFAULT_SHADOW,
  font: "vazir",
  iconLibrary: "google",
  iconStyle: DEFAULT_ICON_STYLE,
};

let snapshot: StudioConfig | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePalette(value: unknown): StudioPalette {
  if (!isRecord(value)) return DEFAULT_PALETTE;

  const base = PALETTE_PRESETS.some((preset) => preset.id === value.base)
    ? (value.base as PalettePresetId)
    : DEFAULT_PALETTE.base;
  const storedColors = isRecord(value.colors) ? value.colors : {};
  const colors = { ...DEFAULT_PALETTE.colors };

  for (const role of ROLE_IDS) {
    const raw = storedColors[role];
    const hex = typeof raw === "string" ? normalizeHex(raw) : null;
    if (hex) colors[role] = hex;
  }

  const overrides: StudioPalette["overrides"] = {};
  if (isRecord(value.overrides)) {
    for (const [token, raw] of Object.entries(value.overrides)) {
      if (!COLOR_TOKENS.some((colorToken) => colorToken.id === token)) continue;
      if (ROLE_IDS.some((role) => role === token)) continue;
      const hex = typeof raw === "string" ? normalizeHex(raw) : null;
      if (hex) overrides[token as PaletteNeutralId | PaletteChartId] = hex;
    }
  }

  return { base, colors, overrides };
}

function parseIconStyle(value: unknown): IconStyle {
  if (!isRecord(value)) return DEFAULT_ICON_STYLE;

  return {
    size: ICON_SIZES.some((option) => option.id === value.size)
      ? (value.size as IconStyle["size"])
      : DEFAULT_ICON_STYLE.size,
    weight: ICON_WEIGHTS.some((option) => option.id === value.weight)
      ? (value.weight as IconStyle["weight"])
      : DEFAULT_ICON_STYLE.weight,
    tone: ICON_TONES.some((option) => option.id === value.tone)
      ? (value.tone as IconStyle["tone"])
      : DEFAULT_ICON_STYLE.tone,
  };
}

function parseRadius(value: unknown): number {
  const radius = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(radius)) return DEFAULT_STUDIO_CONFIG.radius;
  return Math.min(48, Math.max(0, Math.round(radius)));
}

function parseConfig(value: unknown): StudioConfig | null {
  if (!isRecord(value)) return null;

  const styleId = STYLES.some((style) => style.id === value.styleId)
    ? (value.styleId as StyleId)
    : DEFAULT_STUDIO_CONFIG.styleId;
  const archetype = ARCHETYPES.some((item) => item.id === value.archetype)
    ? (value.archetype as ArchetypeId)
    : DEFAULT_STUDIO_CONFIG.archetype;
  const shadow =
    value.shadow === "style" || SHADOWS.some((item) => item.id === value.shadow)
      ? (value.shadow as ShadowChoice)
      : DEFAULT_STUDIO_CONFIG.shadow;
  const iconLibrary = ICON_LIBRARIES.some(
    (library) => library.id === value.iconLibrary,
  )
    ? (value.iconLibrary as IconLibraryId)
    : DEFAULT_STUDIO_CONFIG.iconLibrary;
  const font =
    typeof value.font === "string" && value.font.trim().length > 0
      ? value.font
      : DEFAULT_STUDIO_CONFIG.font;

  return {
    archetype,
    styleId,
    palette: parsePalette(value.palette),
    radius: parseRadius(value.radius),
    shadow,
    font,
    iconLibrary,
    iconStyle: parseIconStyle(value.iconStyle),
  };
}

function persist(config: StudioConfig): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STUDIO_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // Storage blocked or full: the studio keeps working for this session.
  }
}

/** Read the stored configuration once, right after the first subscription. */
function ensureLoaded(): void {
  if (loaded) return;
  loaded = true;
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(STUDIO_CONFIG_KEY);
    if (!raw) return;
    const config = parseConfig(JSON.parse(raw));
    if (!config) return;
    snapshot = config;
    notify();
  } catch {
    // Unreadable payload: keep the defaults.
  }
}

export function subscribeStudioConfig(listener: () => void): () => void {
  listeners.add(listener);
  ensureLoaded();
  return () => {
    listeners.delete(listener);
  };
}

/** `null` until a configuration exists; the canvas falls back to defaults. */
export function getStudioConfigSnapshot(): StudioConfig | null {
  return snapshot;
}

export function getStudioConfigServerSnapshot(): StudioConfig | null {
  return null;
}

export function useStudioConfig(): StudioConfig | null {
  return useSyncExternalStore(
    subscribeStudioConfig,
    getStudioConfigSnapshot,
    getStudioConfigServerSnapshot,
  );
}

export function updateStudioConfig(patch: Partial<StudioConfig>): StudioConfig {
  ensureLoaded();
  const next = { ...(snapshot ?? DEFAULT_STUDIO_CONFIG), ...patch };
  snapshot = next;
  persist(next);
  notify();
  return next;
}

/**
 * Restore the documented defaults from the sidebar's reset button.
 *
 * The scenario survives: tabs are navigation, while the sidebar owns the theme
 * (style, palette, radius, shadow, font and icons). The restored combination is
 * persisted like any other edit, so the contact form still attaches exactly
 * what is on screen and a reload keeps showing it.
 */
export function resetStudioConfig(): StudioConfig {
  ensureLoaded();
  return updateStudioConfig({
    ...DEFAULT_STUDIO_CONFIG,
    archetype: snapshot?.archetype ?? DEFAULT_STUDIO_CONFIG.archetype,
  });
}

/**
 * Saving the untouched defaults is still a valid hand-off: the contact form
 * should receive the exact combination the visitor saw on the canvas.
 */
export function materializeStudioConfig(): StudioConfig {
  return updateStudioConfig({});
}

export function hasSeenStudioTour(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(STUDIO_TOUR_KEY) === "1";
  } catch {
    return true;
  }
}

export function markStudioTourSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STUDIO_TOUR_KEY, "1");
  } catch {
    // Nothing to do; the guide simply opens again next time.
  }
}

export type StudioConfigSummaryItem = { label: string; value: string };

/** Human-readable chips shared by the contact form and its confirmation. */
export function describeStudioConfig(
  config: StudioConfig,
): StudioConfigSummaryItem[] {
  const style = STYLES.find((item) => item.id === config.styleId);
  const archetype = ARCHETYPES.find((item) => item.id === config.archetype);
  const font = FONTS.find((item) => item.id === config.font);
  const shadow = SHADOWS.find((item) => item.id === config.shadow);
  const library = ICON_LIBRARIES.find(
    (item) => item.id === config.iconLibrary,
  );

  return [
    { label: "سناریو", value: archetype?.label ?? config.archetype },
    { label: "سبک", value: style?.label ?? config.styleId },
    { label: "پالت", value: paletteLabel(config.palette) },
    { label: "گردی گوشه", value: `${config.radius}px` },
    {
      label: "سایه",
      value:
        config.shadow === "style" ? "پیرو سبک" : (shadow?.label ?? "سفارشی"),
    },
    { label: "فونت", value: font?.label ?? "فونت سفارشی" },
    { label: "آیکون", value: library?.label ?? config.iconLibrary },
  ];
}
