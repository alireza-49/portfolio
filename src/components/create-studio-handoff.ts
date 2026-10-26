import {
  ARCHETYPES,
  DEFAULT_ICON_STYLE,
  DEFAULT_SHADOW,
  FONTS,
  FONT_STACKS,
  ICON_LIBRARIES,
  ICON_SIZES,
  ICON_TONES,
  ICON_WEIGHTS,
  SHADOWS,
  STYLE_FONTS,
  STYLES,
  buildStudioTheme,
  buildThemeSnippet,
  type FontId,
  type StyleId,
} from "./create-studio-config";
import { themeToCssVars, type ThemeCssVars } from "./create-components/theme";
import { createThemePresets } from "./create-components/style-presets";
import {
  COLOR_TOKENS,
  ROLE_IDS,
  STYLE_PALETTES,
  activePalettePresetId,
  paletteForStyle,
  paletteLabel,
  resolvePaletteToken,
  type PaletteChartId,
  type PaletteNeutralId,
} from "./create-studio-palette";
import {
  resolveFontStack,
  type CustomFont,
} from "./create-studio-custom-fonts";
import {
  DEFAULT_STUDIO_CONFIG,
  DEFAULT_STYLE_ID,
  parseStudioConfig,
  type StudioConfig,
} from "./create-studio-store";

/**
 * Hand-off model shared by `/create` and the home-page contact form.
 *
 * The store only knows *what* was saved. This module answers the two questions
 * the form has to ask before it can present anything:
 *
 * 1. did the visitor actually choose a theme, or did they only look at the
 *    studio and keep its default combination (`studioConfigStatus`), and
 * 2. what exactly did they choose, in every dimension — including the resolved
 *    `--cc-*` tokens and the CSS they could export (`buildStudioHandoff`).
 *
 * Everything here is derived from the stored configuration, never persisted,
 * so the answer can never go stale. The same payload powers the JSON export in
 * the studio, which means a copied configuration can be re-imported verbatim
 * (`parseStudioConfigPayload`).
 */
export type StudioThemeStatus = "none" | "defaults" | "customized";

/** Labels shared by the studio badge and the contact form. */
export const STUDIO_STATUS_LABELS: Record<StudioThemeStatus, string> = {
  none: "بدون تم",
  defaults: "ترکیب پیش‌فرض استودیو",
  customized: "تم سفارشی",
};

export type StudioSummaryItem = { label: string; value: string };

export type StudioOptionItem = {
  label: string;
  value: string;
  /** Set for colour rows so the form can paint a swatch next to the hex. */
  swatch?: string;
};

export type StudioOptionGroup = {
  id: "scenario" | "colors" | "shape" | "typography" | "icons";
  label: string;
  items: StudioOptionItem[];
};

export type StudioHandoff = {
  version: 1;
  source: "create-studio";
  status: StudioThemeStatus;
  customized: boolean;
  config: StudioConfig;
  summary: StudioSummaryItem[];
  font: { id: string; label: string; stack: string; builtin: boolean };
  options: StudioOptionGroup[];
  /** Resolved `--cc-*` custom properties, exactly as the canvas renders them. */
  theme: ThemeCssVars;
  /** The Tailwind v4 snippet the export dialog copies. */
  css: string;
};

export type StudioImportResult =
  | { status: "ok"; config: StudioConfig }
  | { status: "error"; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Built-in or uploaded face — the same check the import dialog needs. */
export function isStudioFontAvailable(
  fontId: string,
  customFonts: CustomFont[] = [],
): boolean {
  return (
    Boolean(FONT_STACKS[fontId as FontId]) ||
    customFonts.some((font) => font.id === fontId)
  );
}

export function studioFontLabel(
  fontId: string,
  customFonts: CustomFont[] = [],
): string {
  const builtin = FONTS.find((font) => font.id === fontId);
  if (builtin) return builtin.label;
  const custom = customFonts.find((font) => font.id === fontId);
  return custom ? `${custom.name} (سفارشی)` : "فونت سفارشی (حذف‌شده)";
}

/**
 * The combination a style pick installs (see `selectStyle` in
 * `create-studio.tsx`): matched palette, preset radius, style face, the
 * «پیرو سبک» elevation and the default icon setup. A stored configuration that
 * matches this — on the default style — is “visited but untouched”.
 */
function styleBaseline(styleId: StyleId) {
  return {
    palette: paletteForStyle(styleId),
    radius: createThemePresets[styleId].tokens.radius ?? 4,
    shadow: DEFAULT_SHADOW,
    font: STYLE_FONTS[styleId],
    iconLibrary: DEFAULT_STUDIO_CONFIG.iconLibrary,
    iconStyle: DEFAULT_ICON_STYLE,
  };
}

/**
 * Did the visitor really change something? The scenario is deliberately
 * ignored (tabs are navigation, not a theme choice), and picking another style
 * always counts even when every other value happens to match by accident.
 */
export function isStudioConfigCustomized(config: StudioConfig): boolean {
  const baseline = styleBaseline(config.styleId);

  return (
    config.styleId !== DEFAULT_STYLE_ID ||
    activePalettePresetId(config.palette) !== STYLE_PALETTES[config.styleId] ||
    config.radius !== baseline.radius ||
    config.shadow !== baseline.shadow ||
    config.font !== baseline.font ||
    config.iconLibrary !== baseline.iconLibrary ||
    config.iconStyle.size !== baseline.iconStyle.size ||
    config.iconStyle.weight !== baseline.iconStyle.weight ||
    config.iconStyle.tone !== baseline.iconStyle.tone
  );
}

/** Three states the contact form reports; `null` means the studio was never used. */
export function studioConfigStatus(
  config: StudioConfig | null,
): StudioThemeStatus {
  if (!config) return "none";
  return isStudioConfigCustomized(config) ? "customized" : "defaults";
}

/** Human-readable chips shared by the contact form and its confirmation. */
export function describeStudioConfig(
  config: StudioConfig,
  customFonts: CustomFont[] = [],
): StudioSummaryItem[] {
  const style = STYLES.find((item) => item.id === config.styleId);
  const archetype = ARCHETYPES.find((item) => item.id === config.archetype);
  const shadow = SHADOWS.find((item) => item.id === config.shadow);
  const library = ICON_LIBRARIES.find((item) => item.id === config.iconLibrary);
  const size = ICON_SIZES.find((item) => item.id === config.iconStyle.size);
  const weight = ICON_WEIGHTS.find((item) => item.id === config.iconStyle.weight);
  const tone = ICON_TONES.find((item) => item.id === config.iconStyle.tone);

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
    { label: "فونت", value: studioFontLabel(config.font, customFonts) },
    { label: "کتابخانه آیکون", value: library?.label ?? config.iconLibrary },
    { label: "اندازه آیکون", value: size?.label ?? config.iconStyle.size },
    { label: "وزن آیکون", value: weight?.label ?? config.iconStyle.weight },
    { label: "رنگ آیکون", value: tone?.label ?? config.iconStyle.tone },
  ];
}

/**
 * The complete, grouped option list. Roles always come from the palette,
 * neutrals/charts are listed only when the visitor overrode the style's own
 * values — which is exactly what they chose.
 */
export function describeStudioOptions(
  config: StudioConfig,
  customFonts: CustomFont[] = [],
): StudioOptionGroup[] {
  const style = STYLES.find((item) => item.id === config.styleId);
  const archetype = ARCHETYPES.find((item) => item.id === config.archetype);
  const shadow = SHADOWS.find((item) => item.id === config.shadow);
  const library = ICON_LIBRARIES.find((item) => item.id === config.iconLibrary);
  const size = ICON_SIZES.find((item) => item.id === config.iconStyle.size);
  const weight = ICON_WEIGHTS.find((item) => item.id === config.iconStyle.weight);
  const tone = ICON_TONES.find((item) => item.id === config.iconStyle.tone);

  const roles: StudioOptionItem[] = ROLE_IDS.map((role) => {
    const token = COLOR_TOKENS.find((item) => item.id === role);
    const hex = config.palette.colors[role];
    return { label: token?.label ?? role, value: hex, swatch: hex };
  });

  const overrides: StudioOptionItem[] = COLOR_TOKENS.filter((token) => {
    if (token.group === "roles") return false;
    const key = token.id as PaletteNeutralId | PaletteChartId;
    return Boolean(config.palette.overrides[key]);
  }).map((token) => {
    const hex = resolvePaletteToken(token.id, config.palette, config.styleId);
    return { label: token.label, value: hex, swatch: hex };
  });

  return [
    {
      id: "scenario",
      label: "سناریو و سبک",
      items: [
        { label: "سناریوی بوم", value: archetype?.label ?? config.archetype },
        { label: "سبک", value: style?.label ?? config.styleId },
        { label: "پالت", value: paletteLabel(config.palette) },
      ],
    },
    {
      id: "colors",
      label: "رنگ‌ها",
      items:
        overrides.length > 0
          ? [...roles, ...overrides]
          : [
              ...roles,
              { label: "بازنویسی خنثی و نمودار", value: "ندارد (پیرو سبک)" },
            ],
    },
    {
      id: "shape",
      label: "شکل و سایه",
      items: [
        { label: "گردی گوشه", value: `${config.radius}px` },
        {
          label: "سایه",
          value:
            config.shadow === "style"
              ? "پیرو سبک"
              : (shadow?.label ?? "سفارشی"),
        },
      ],
    },
    {
      id: "typography",
      label: "تایپوگرافی",
      items: [
        { label: "فونت", value: studioFontLabel(config.font, customFonts) },
        {
          label: "پشتهٔ فونت",
          value: resolveFontStack(config.font, customFonts),
        },
      ],
    },
    {
      id: "icons",
      label: "آیکون‌ها",
      items: [
        { label: "کتابخانه", value: library?.label ?? config.iconLibrary },
        { label: "اندازه", value: size?.label ?? config.iconStyle.size },
        { label: "وزن", value: weight?.label ?? config.iconStyle.weight },
        { label: "رنگ", value: tone?.label ?? config.iconStyle.tone },
      ],
    },
  ];
}

/**
 * Everything the contact form submits, the studio downloads and an import
 * restores. Deterministic: no timestamps, so the same configuration always
 * produces byte-identical JSON.
 */
export function buildStudioHandoff(
  config: StudioConfig,
  customFonts: CustomFont[] = [],
): StudioHandoff {
  const fontStack = resolveFontStack(config.font, customFonts);
  const theme = buildStudioTheme({
    palette: config.palette,
    radius: config.radius,
    style: config.styleId,
    fontStack,
    iconStyle: config.iconStyle,
    shadow: config.shadow,
  });

  return {
    version: 1,
    source: "create-studio",
    status: studioConfigStatus(config),
    customized: isStudioConfigCustomized(config),
    config,
    summary: describeStudioConfig(config, customFonts),
    font: {
      id: config.font,
      label: studioFontLabel(config.font, customFonts),
      stack: fontStack,
      builtin: Boolean(FONT_STACKS[config.font as FontId]),
    },
    options: describeStudioOptions(config, customFonts),
    theme: themeToCssVars(theme),
    css: buildThemeSnippet({
      palette: config.palette,
      radius: config.radius,
      style: config.styleId,
      fontStack,
      iconStyle: config.iconStyle,
      shadow: config.shadow,
    }),
  };
}

/**
 * The console downloads a submission as `{ applicant, studioConfig: <hand-off
 * wrapper> }`, and the wrapper itself carries the configuration as `config`.
 * Both keys are unwrapped here so any file the site produces round-trips.
 */
export function unwrapConfig(value: unknown): Record<string, unknown> | null {
  if (!isRecord(value)) return null;
  if (isRecord(value.config)) return unwrapConfig(value.config);
  if (isRecord(value.studioConfig)) return unwrapConfig(value.studioConfig);
  return value;
}

/**
 * Parse a pasted/downloaded configuration.
 *
 * Accepts every shape the site produces — the hand-off wrapper the contact
 * form submits (`{ config, … }`), the console's submission export
 * (`{ studioConfig: … }`) and a bare `StudioConfig` — and rejects anything that
 * is not a studio configuration (CSS snippets, `{}`, random JSON) instead of
 * silently applying the defaults.
 */
export function parseStudioConfigPayload(raw: string): StudioImportResult {
  const text = raw.trim();
  if (!text) {
    return { status: "error", message: "محتوای پیکربندی خالی است." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {
      status: "error",
      message:
        "این متن JSON معتبری نیست؛ پیکربندی کپی‌شده را کامل بچسبانید (نه کد CSS را).",
    };
  }

  if (!isRecord(parsed)) {
    return {
      status: "error",
      message: "ساختار پیکربندی درست نیست؛ باید یک شیء JSON باشد.",
    };
  }

  const candidate = unwrapConfig(parsed);
  if (!candidate || !STYLES.some((style) => style.id === candidate.styleId)) {
    return {
      status: "error",
      message:
        "این داده یک پیکربندی استودیو نیست؛ دکمهٔ «کپی پیکربندی (JSON)» را در استودیو بزنید.",
    };
  }

  const config = parseStudioConfig(candidate);
  if (!config) {
    return {
      status: "error",
      message: "پیکربندی خوانده شد ولی قابل استفاده نیست؛ فایل را دوباره بگیرید.",
    };
  }

  return { status: "ok", config };
}

