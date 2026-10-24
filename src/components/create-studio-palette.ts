import {
  defaultCreateComponentTheme,
  getContrastRatio,
  getLuminance,
  mixHex,
  readableForeground,
  type CreateComponentTheme,
} from "./create-components/theme";
import {
  chartPalettes,
  createThemePresets,
} from "./create-components/style-presets";
import type { StyleId } from "./create-studio-config";

/**
 * Palette tokens for the studio.
 *
 * Roles are explicit state: picking a ready palette replaces all five at once.
 * Neutrals and charts are optional overrides layered on top of the active
 * style preset, so switching styles keeps their identity until a token is
 * edited. Editing one token never repaints the others.
 */
export type PaletteRoleId =
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger";

export type PaletteNeutralId =
  | "background"
  | "surface"
  | "surfaceForeground"
  | "muted"
  | "mutedForeground"
  | "border";

export type PaletteChartId =
  | "chart1"
  | "chart2"
  | "chart3"
  | "chart4"
  | "chart5"
  | "chart6"
  | "chartGrid";

export type PaletteGroupId = "roles" | "neutrals" | "charts";
export type PaletteTokenId = PaletteRoleId | PaletteNeutralId | PaletteChartId;

export type PalettePresetId =
  | "clay-amber"
  | "forest-ink"
  | "navy-coral"
  | "ocean-teal"
  | "iris-pink"
  | "graphite"
  | "bluebird"
  | "neon-mint"
  | "blueprint-amber"
  | "aurora-cyan"
  | "brass-nebula";

export type PalettePreset = {
  id: PalettePresetId;
  name: string;
  note: string;
  colors: Record<PaletteRoleId, string>;
};

export type PaletteOverrides = Partial<
  Record<PaletteNeutralId | PaletteChartId, string>
>;

export type StudioPalette = {
  /** Last ready palette applied; per-token resets fall back to it. */
  base: PalettePresetId;
  colors: Record<PaletteRoleId, string>;
  overrides: PaletteOverrides;
};

export type ColorToken = {
  id: PaletteTokenId;
  group: PaletteGroupId;
  label: string;
  tag: string;
  token: `--cc-${string}`;
  description: string;
};

export type PaletteGroup = {
  id: PaletteGroupId;
  label: string;
  caption: string;
};

/** Useful for previews: the role order every palette strip follows. */
export const ROLE_IDS: PaletteRoleId[] = [
  "primary",
  "accent",
  "success",
  "warning",
  "danger",
];

export const PALETTE_GROUPS: PaletteGroup[] = [
  { id: "roles", label: "نقش‌ها", caption: "اکشن، لهجه و وضعیت‌ها" },
  { id: "neutrals", label: "خنثی‌ها", caption: "پس‌زمینه، سطح و متن" },
  { id: "charts", label: "نمودارها", caption: "سری‌های داده و شبکه" },
];

/**
 * Every colour the advanced editor can tune. The `description` explains which
 * primitives read the token, so nobody mistakes “Success” for the whole theme.
 */
export const COLOR_TOKENS: ColorToken[] = [
  {
    id: "primary",
    group: "roles",
    label: "رنگ اصلی",
    tag: "Primary",
    token: "--cc-primary",
    description: "دکمه‌ها، لینک‌ها، حالت فعال و حلقهٔ فوکوس",
  },
  {
    id: "accent",
    group: "roles",
    label: "رنگ لهجه",
    tag: "Accent",
    token: "--cc-accent",
    description: "نشانه‌ها، هایلایت و جزئیات تزئینی",
  },
  {
    id: "success",
    group: "roles",
    label: "موفقیت",
    tag: "Success",
    token: "--cc-success",
    description: "وضعیت موفق، رشد و تقویم موجود",
  },
  {
    id: "warning",
    group: "roles",
    label: "هشدار",
    tag: "Warning",
    token: "--cc-warning",
    description: "هشدار، برچسب در انتظار و رنگ میانی",
  },
  {
    id: "danger",
    group: "roles",
    label: "خطا",
    tag: "Danger",
    token: "--cc-danger",
    description: "خطا، حذف و وضعیت معوق",
  },
  {
    id: "background",
    group: "neutrals",
    label: "پس‌زمینهٔ صفحه",
    tag: "Background",
    token: "--cc-background",
    description: "بستر کل سایت داخل پنجره",
  },
  {
    id: "surface",
    group: "neutrals",
    label: "سطح کارت",
    tag: "Surface",
    token: "--cc-surface",
    description: "کارت، فرم، منو و دیالوگ",
  },
  {
    id: "surfaceForeground",
    group: "neutrals",
    label: "متن اصلی",
    tag: "Text",
    token: "--cc-surface-foreground",
    description: "متن روی کارت‌ها و صفحه",
  },
  {
    id: "muted",
    group: "neutrals",
    label: "سطح کم‌رنگ",
    tag: "Muted",
    token: "--cc-muted",
    description: "حالت غیرفعال و سطوح فرورفته",
  },
  {
    id: "mutedForeground",
    group: "neutrals",
    label: "متن کم‌رنگ",
    tag: "Muted text",
    token: "--cc-muted-foreground",
    description: "توضیح‌ها، برچسب‌ها و اعداد کم‌اهمیت",
  },
  {
    id: "border",
    group: "neutrals",
    label: "خط و حاشیه",
    tag: "Border",
    token: "--cc-border",
    description: "حاشیهٔ کنترل‌ها، کارت‌ها و جداکننده‌ها",
  },
  {
    id: "chart1",
    group: "charts",
    label: "سری ۱",
    tag: "Series 1",
    token: "--cc-chart-1",
    description: "رنگ نخست نمودارها",
  },
  {
    id: "chart2",
    group: "charts",
    label: "سری ۲",
    tag: "Series 2",
    token: "--cc-chart-2",
    description: "رنگ دوم نمودارها",
  },
  {
    id: "chart3",
    group: "charts",
    label: "سری ۳",
    tag: "Series 3",
    token: "--cc-chart-3",
    description: "رنگ سوم نمودارها",
  },
  {
    id: "chart4",
    group: "charts",
    label: "سری ۴",
    tag: "Series 4",
    token: "--cc-chart-4",
    description: "رنگ چهارم نمودارها",
  },
  {
    id: "chart5",
    group: "charts",
    label: "سری ۵",
    tag: "Series 5",
    token: "--cc-chart-5",
    description: "رنگ پنجم نمودارها",
  },
  {
    id: "chart6",
    group: "charts",
    label: "سری ۶",
    tag: "Series 6",
    token: "--cc-chart-6",
    description: "رنگ ششم نمودارها",
  },
  {
    id: "chartGrid",
    group: "charts",
    label: "خط شبکه",
    tag: "Grid",
    token: "--cc-chart-grid",
    description: "خطوط راهنما و تیک نمودارها",
  },
];

/**
 * Ready palettes: five coherent roles each. Neutrals and charts are left to
 * the style preset, so a palette never fights the chosen design language.
 */
export const PALETTE_PRESETS: PalettePreset[] = [
  {
    id: "clay-amber",
    name: "سفال کهربایی",
    note: "گرم، دست‌ساز، خط مرکب",
    colors: {
      primary: "#e76f51",
      accent: "#e9c46a",
      success: "#2a9d8f",
      warning: "#dda15e",
      danger: "#c2452d",
    },
  },
  {
    id: "forest-ink",
    name: "جوهر سبز جنگلی",
    note: "آرام، طبیعی، سازمانی",
    colors: {
      primary: "#244234",
      accent: "#7fae8f",
      success: "#2a9d8f",
      warning: "#c9a227",
      danger: "#a63a2b",
    },
  },
  {
    id: "navy-coral",
    name: "سرمه‌ای و مرجان",
    note: "رسمی با لهجهٔ گرم",
    colors: {
      primary: "#1e284a",
      accent: "#e76f51",
      success: "#2a9d8f",
      warning: "#e9c46a",
      danger: "#d1495b",
    },
  },
  {
    id: "ocean-teal",
    name: "اقیانوس فیروزه",
    note: "خنک، داده‌محور، دقیق",
    colors: {
      primary: "#0e7490",
      accent: "#f59e0b",
      success: "#059669",
      warning: "#d97706",
      danger: "#dc2626",
    },
  },
  {
    id: "iris-pink",
    name: "بنفش و صورتی",
    note: "خلاق، جوان، پرانرژی",
    colors: {
      primary: "#6d28d9",
      accent: "#db2777",
      success: "#059669",
      warning: "#d97706",
      danger: "#dc2626",
    },
  },
  {
    id: "graphite",
    name: "گرافیت صنعتی",
    note: "مونوکروم، جدی، بی‌رنگ",
    colors: {
      primary: "#18181b",
      accent: "#52525b",
      success: "#15803d",
      warning: "#a16207",
      danger: "#b91c1c",
    },
  },
  // The five below are shaped by a specific style preset instead of a generic
  // mood: each one repeats the brand colours that preset was drawn with, so
  // pairing them never fights the page (a warm palette on a blueprint, or a
  // navy primary on a navy background, is exactly what they prevent).
  {
    id: "bluebird",
    name: "آبی کلاس درس",
    note: "روشن، آموزشی، خوش‌بین",
    colors: {
      primary: "#2563eb",
      accent: "#ffc107",
      success: "#16a34a",
      warning: "#f59e0b",
      danger: "#e11d48",
    },
  },
  {
    id: "neon-mint",
    name: "نعناع نئونی",
    note: "تیره، ترمینالی، سبز فسفر",
    colors: {
      primary: "#34d399",
      accent: "#2dd4bf",
      success: "#4ade80",
      warning: "#fbbf24",
      danger: "#f87171",
    },
  },
  {
    id: "blueprint-amber",
    name: "نقشهٔ کهربایی",
    note: "کاغذ آبی، خط طلایی",
    colors: {
      primary: "#ffd700",
      accent: "#7fdbff",
      success: "#8ce0c0",
      warning: "#ffc94d",
      danger: "#e85d35",
    },
  },
  {
    id: "aurora-cyan",
    name: "شفق فیروزه‌ای",
    note: "شیشهٔ تیره، درخشش آبی",
    colors: {
      primary: "#4dd8ff",
      accent: "#b79bff",
      success: "#5ce1b0",
      warning: "#ffd166",
      danger: "#ff7a90",
    },
  },
  {
    id: "brass-nebula",
    name: "برنج و سحابی",
    note: "فلز گرم، خلأ سرد",
    colors: {
      primary: "#cd7f32",
      accent: "#b5a642",
      success: "#4e8c7a",
      warning: "#e0b354",
      danger: "#c0392b",
    },
  },
];

export const DEFAULT_PALETTE_PRESET_ID: PalettePresetId = "clay-amber";

const ROLE_TOKEN_SET: ReadonlySet<string> = new Set(ROLE_IDS);
const NEUTRAL_TOKEN_SET: ReadonlySet<string> = new Set<PaletteNeutralId>([
  "background",
  "surface",
  "surfaceForeground",
  "muted",
  "mutedForeground",
  "border",
]);

export function isRoleToken(token: PaletteTokenId): token is PaletteRoleId {
  return ROLE_TOKEN_SET.has(token);
}

export function isNeutralToken(
  token: PaletteTokenId,
): token is PaletteNeutralId {
  return NEUTRAL_TOKEN_SET.has(token);
}

/** Accept `#abc`, `abc`, `#AABBCC`; return a lowercase `#rrggbb` or null. */
export function normalizeHex(raw: string): string | null {
  const clean = raw.trim().replace(/^#/, "");
  const expanded =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;
  return /^[0-9a-fA-F]{6}$/.test(expanded)
    ? `#${expanded.toLowerCase()}`
    : null;
}

export function basePalettePreset(palette: StudioPalette): PalettePreset {
  return (
    PALETTE_PRESETS.find((preset) => preset.id === palette.base) ??
    PALETTE_PRESETS[0]
  );
}

export function studioPaletteFromPreset(
  preset: PalettePreset = PALETTE_PRESETS[0],
): StudioPalette {
  return {
    base: preset.id,
    colors: { ...preset.colors },
    overrides: {},
  };
}

export const DEFAULT_PALETTE: StudioPalette = studioPaletteFromPreset(
  PALETTE_PRESETS.find(
    (preset) => preset.id === DEFAULT_PALETTE_PRESET_ID,
  ) ?? PALETTE_PRESETS[0],
);

/**
 * The ready palette each style was drawn for — the palette counterpart of
 * `STYLE_FONTS`.
 *
 * Picking a style therefore lands on a coherent pair instead of keeping a
 * palette from the previous design language (warm clay under a blueprint, a
 * navy primary on a navy page). Two styles may share one palette when they
 * share a colour family: `nova`/`terracotta` are both warm clay, and
 * `swiss`/`manga` are both ink-on-paper. The palette stays user-controlled
 * afterwards — this map only decides what a style pick (and the dice) syncs to.
 */
export const STYLE_PALETTES: Record<StyleId, PalettePresetId> = {
  nova: "clay-amber",
  corporate: "ocean-teal",
  editorial: "forest-ink",
  swiss: "graphite",
  edtech: "bluebird",
  terracotta: "clay-amber",
  zine: "navy-coral",
  memphis: "iris-pink",
  manga: "graphite",
  blueprint: "blueprint-amber",
  terminal: "neon-mint",
  glass: "aurora-cyan",
  steampunk: "brass-nebula",
};

/** The palette definition a style matches (falls back to the default tile). */
export function stylePalettePreset(styleId: StyleId): PalettePreset {
  return (
    PALETTE_PRESETS.find((preset) => preset.id === STYLE_PALETTES[styleId]) ??
    PALETTE_PRESETS[0]
  );
}

/**
 * A fresh palette for a style: ready roles, no stale neutral/chart overrides,
 * so the style's own neutrals and chart ramp stay in charge.
 */
export function paletteForStyle(styleId: StyleId): StudioPalette {
  return studioPaletteFromPreset(stylePalettePreset(styleId));
}

export function paletteMatchesPreset(
  palette: StudioPalette,
  preset: PalettePreset,
): boolean {
  return ROLE_IDS.every(
    (role) =>
      palette.colors[role].toLowerCase() === preset.colors[role].toLowerCase(),
  );
}

/**
 * The highlighted ready tile only when every role still matches and no
 * neutral/chart override is active — otherwise the state is custom.
 */
export function activePalettePresetId(
  palette: StudioPalette,
): PalettePresetId | null {
  if (Object.keys(palette.overrides).length > 0) return null;
  return (
    PALETTE_PRESETS.find((preset) => paletteMatchesPreset(palette, preset))
      ?.id ?? null
  );
}

export function paletteLabel(palette: StudioPalette): string {
  const activeId = activePalettePresetId(palette);
  return (
    PALETTE_PRESETS.find((preset) => preset.id === activeId)?.name ??
    "پالت سفارشی"
  );
}

/** Change one role without touching the other roles or the overrides. */
export function withRoleColor(
  palette: StudioPalette,
  role: PaletteRoleId,
  hex: string,
): StudioPalette {
  return {
    ...palette,
    colors: { ...palette.colors, [role]: normalizeHex(hex) ?? hex },
  };
}

/** Add/replace a neutral or chart override for the active style preset. */
export function withPaletteOverride(
  palette: StudioPalette,
  token: PaletteNeutralId | PaletteChartId,
  hex: string,
): StudioPalette {
  return {
    ...palette,
    overrides: {
      ...palette.overrides,
      [token]: normalizeHex(hex) ?? hex,
    },
  };
}

/** Route a token edit to the right layer. */
export function withPaletteToken(
  palette: StudioPalette,
  token: PaletteTokenId,
  hex: string,
): StudioPalette {
  return isRoleToken(token)
    ? withRoleColor(palette, token, hex)
    : withPaletteOverride(palette, token, hex);
}

export function isTokenOverridden(
  palette: StudioPalette,
  token: PaletteTokenId,
): boolean {
  if (isRoleToken(token)) {
    const base = basePalettePreset(palette);
    return (
      palette.colors[token].toLowerCase() !== base.colors[token].toLowerCase()
    );
  }
  return token in palette.overrides;
}

export function resetPaletteToken(
  palette: StudioPalette,
  token: PaletteTokenId,
): StudioPalette {
  if (isRoleToken(token)) {
    return withRoleColor(
      palette,
      token,
      basePalettePreset(palette).colors[token],
    );
  }
  const overrides = { ...palette.overrides };
  delete overrides[token];
  return { ...palette, overrides };
}

/** Reset one group: roles go back to the base palette, overrides are dropped. */
export function resetPaletteGroup(
  palette: StudioPalette,
  group: PaletteGroupId,
): StudioPalette {
  if (group === "roles") {
    return { ...palette, colors: { ...basePalettePreset(palette).colors } };
  }
  const overrides = { ...palette.overrides };
  for (const token of Object.keys(overrides) as Array<
    PaletteNeutralId | PaletteChartId
  >) {
    if (COLOR_TOKENS.find((item) => item.id === token)?.group === group) {
      delete overrides[token];
    }
  }
  return { ...palette, overrides };
}

/**
 * Resolve a token the way the canvas renders it: roles from the palette,
 * neutrals/charts from the override or the active style preset.
 */
export function resolvePaletteToken(
  token: PaletteTokenId,
  palette: StudioPalette,
  styleId: StyleId,
): string {
  if (isRoleToken(token)) return palette.colors[token];
  const override = palette.overrides[token];
  if (override) return override;
  if (isNeutralToken(token)) {
    return (
      createThemePresets[styleId].tokens[token] ??
      defaultCreateComponentTheme[token]
    );
  }
  return chartPalettes[styleId][token];
}

/**
 * Theme overrides for the canvas and the exported snippet.
 * Roles always apply; neutrals/charts only when the visitor edited them.
 * The dark-mode check reads the *effective* background, so a custom light
 * surface on a dark preset still gets readable soft fills.
 */
export function paletteThemeOverrides(
  palette: StudioPalette,
  styleId: StyleId,
): Partial<CreateComponentTheme> {
  const { primary, accent, success, warning, danger } = palette.colors;
  const background = resolvePaletteToken("background", palette, styleId);
  const surface = resolvePaletteToken("surface", palette, styleId);
  const isDark = getLuminance(background) < 0.5;

  const secondary = isDark
    ? mixHex(primary, surface, 0.22)
    : mixHex(primary, "#ffffff", 0.9);
  // Soft fills keep a brand-tinted label when it has enough contrast. Shade
  // the role toward the page tone first, then fall back to plain ink/white so
  // light primaries never wash out secondary buttons.
  const brandedSecondaryText = isDark
    ? mixHex(primary, "#ffffff", 0.45)
    : mixHex(primary, "#000000", 0.35);
  const secondaryForeground =
    getContrastRatio(primary, secondary) >= 4.5
      ? primary
      : getContrastRatio(brandedSecondaryText, secondary) >= 4.5
        ? brandedSecondaryText
        : readableForeground(secondary);

  return {
    primary,
    accent,
    success,
    warning,
    danger,
    primaryForeground: readableForeground(primary),
    accentForeground: readableForeground(accent),
    successForeground: readableForeground(success),
    warningForeground: readableForeground(warning),
    dangerForeground: readableForeground(danger),
    primaryHover: mixHex(primary, isDark ? "#ffffff" : "#000000", 0.14),
    secondary,
    secondaryForeground,
    secondaryHover: isDark
      ? mixHex(primary, surface, 0.32)
      : mixHex(primary, "#ffffff", 0.78),
    ring: primary,
    ...palette.overrides,
  };
}

export type PaletteContrastIssue = {
  surface: PaletteNeutralId;
  ratio: number;
};

/**
 * Low-contrast surface/text pairs worth flagging in the advanced editor.
 * WCAG AA for body text is 4.5:1.
 */
export function paletteContrastIssues(
  palette: StudioPalette,
  styleId: StyleId,
): PaletteContrastIssue[] {
  const text = resolvePaletteToken("surfaceForeground", palette, styleId);
  return (["background", "surface"] as PaletteNeutralId[])
    .map((surface) => ({
      surface,
      ratio: getContrastRatio(
        resolvePaletteToken(surface, palette, styleId),
        text,
      ),
    }))
    .filter((issue) => issue.ratio < 4.5);
}

