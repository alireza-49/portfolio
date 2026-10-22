import type { CSSProperties } from "react";

/**
 * The single source of truth for the `create-components` library.
 *
 * Every component in this folder reads its colours, radius, border weight,
 * shadow, typography and density from these values (exposed as `--cc-*`
 * CSS custom properties). Nothing here depends on the host project's
 * design tokens, so the studio can re-skin the whole set from one object.
 */
export type CreateComponentTheme = {
  /** Brand colour: primary actions, active states, focus rings. */
  primary: string;
  primaryForeground: string;
  primaryHover: string;

  /** Low-emphasis filled surfaces (secondary buttons, soft badges). */
  secondary: string;
  secondaryForeground: string;
  secondaryHover: string;

  /** Highlight colour for accents, warnings and decorative marks. */
  accent: string;
  accentForeground: string;

  /** Page-level background behind the components. */
  background: string;
  /** Card / input / popover surface. */
  surface: string;
  surfaceForeground: string;

  /** Recessed surfaces and disabled fills. */
  muted: string;
  mutedForeground: string;

  /** Hairlines, dividers and control outlines. */
  border: string;
  /** Focus ring colour. */
  ring: string;

  danger: string;
  dangerForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;

  // ------------------------------------------------------------------ charts
  /** Data-series palette, in order. Charts and gauges cycle through these. */
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  chart6: string;
  /** Colour of chart grid lines and tick marks. */
  chartGrid: string;

  // ---------------------------------------------------------------- geometry
  /** Default corner radius in px. */
  radius: number;
  /** Small radius (checkbox, tab trigger, menu item). */
  radiusSm: number;
  /** Large radius (cards, dialogs, popovers). */
  radiusLg: number;
  /** Border thickness in px. Set to 0 for a borderless look. */
  borderWidth: number;
  /** Border style shared by every outlined control. */
  borderStyle: "solid" | "dashed" | "dotted" | "double";
  /** Resting shadow. Use "none" to flatten. */
  shadow: string;
  /** Shadow on hover / pressed controls. */
  shadowHover: string;
  /** Translation applied on hover (paper / brutalist press moves). */
  hoverTranslate: string;
  /** Badge corner radius in px (999 = pill). */
  badgeRadius: number;
  /** Avatar corner radius in px (999 = circle, 0 = square). */
  avatarRadius: number;
  /** Progress bar height in px. */
  progressHeight: number;
  /** Extra inline-start border on alerts in px. */
  alertRuleWidth: number;
  /** Focus ring width in px. */
  focusRingWidth: number;

  // -------------------------------------------------------------- typography
  /** Any valid CSS `font-family` stack for body copy. */
  fontFamily: string;
  /** Base font size in px. */
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;

  /** Heading voice. */
  headingFontFamily: string;
  headingWeight: number;
  headingLetterSpacing: string;
  headingTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  headingLineHeight: number;

  /** Labels: buttons, badges, tabs, table heads, field labels. */
  labelFontFamily: string;
  labelWeight: number;
  labelLetterSpacing: string;
  labelTransform: "none" | "uppercase" | "lowercase" | "capitalize";

  // ------------------------------------------------------- rhythm + texture
  /** Padding / gap multiplier. 0.75 = compact, 1 = default, 1.25 = roomy. */
  density: number;
  /** Any valid CSS `transition-duration` value. */
  duration: string;
  /** Any valid CSS `transition-timing-function` value. */
  ease: string;
  /** Page-level background pattern painted on the theme wrapper. */
  pagePattern: string;
  /** `background-size` for `pagePattern`. */
  pagePatternSize: string;
};


export const defaultCreateComponentTheme: CreateComponentTheme = {
  primary: "#4f46e5",
  primaryForeground: "#ffffff",
  primaryHover: "#4338ca",

  secondary: "#eef2ff",
  secondaryForeground: "#312e81",
  secondaryHover: "#e0e7ff",

  accent: "#f59e0b",
  accentForeground: "#1f2937",

  background: "#ffffff",
  surface: "#ffffff",
  surfaceForeground: "#111827",

  muted: "#f3f4f6",
  mutedForeground: "#6b7280",

  border: "#e5e7eb",
  ring: "#4f46e5",

  danger: "#dc2626",
  dangerForeground: "#ffffff",
  success: "#16a34a",
  successForeground: "#ffffff",
  warning: "#f59e0b",
  warningForeground: "#1f2937",

  chart1: "#4f46e5",
  chart2: "#0ea5e9",
  chart3: "#f59e0b",
  chart4: "#10b981",
  chart5: "#ef4444",
  chart6: "#8b5cf6",
  chartGrid: "#e5e7eb",

  radius: 8,
  radiusSm: 6,
  radiusLg: 12,
  borderWidth: 1,
  borderStyle: "solid",
  shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  shadowHover: "0 6px 16px -6px rgb(0 0 0 / 0.18)",
  hoverTranslate: "0px",
  badgeRadius: 8,
  avatarRadius: 999,
  progressHeight: 8,
  alertRuleWidth: 0,
  focusRingWidth: 2,

  fontFamily: "inherit",
  fontSize: 14,
  fontWeight: 400,
  lineHeight: 1.5,
  letterSpacing: "0em",

  headingFontFamily: "inherit",
  headingWeight: 600,
  headingLetterSpacing: "0em",
  headingTransform: "none",
  headingLineHeight: 1.2,

  labelFontFamily: "inherit",
  labelWeight: 500,
  labelLetterSpacing: "0em",
  labelTransform: "none",

  density: 1,
  duration: "150ms",
  ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  pagePattern: "none",
  pagePatternSize: "auto",
};

/** Merge partial overrides onto the defaults. */
export function createComponentTheme(
  overrides: Partial<CreateComponentTheme> = {},
): CreateComponentTheme {
  return { ...defaultCreateComponentTheme, ...overrides };
}

function parseHex(hex: string): [number, number, number] | null {
  const clean = hex.trim().replace("#", "");
  const expanded =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null;
  return [0, 2, 4].map((offset) =>
    parseInt(expanded.slice(offset, offset + 2), 16),
  ) as [number, number, number];
}

function toHex([red, green, blue]: [number, number, number]): string {
  return `#${[red, green, blue]
    .map((channel) =>
      Math.round(Math.min(255, Math.max(0, channel)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/**
 * Mix `hex` toward another hex colour. `amount` is 0..1.
 * Useful for hover tints that work on light and dark palettes alike.
 */
export function mixHex(hex: string, target: string, amount: number): string {
  const from = parseHex(hex);
  const to = parseHex(target);
  if (!from || !to) return hex;
  const ratio = Math.min(1, Math.max(0, amount));
  return toHex([
    from[0] + (to[0] - from[0]) * ratio,
    from[1] + (to[1] - from[1]) * ratio,
    from[2] + (to[2] - from[2]) * ratio,
  ]);
}

/** Relative luminance (WCAG) of a hex colour, used for contrast decisions. */
export function getLuminance(hex: string): number {
  const channels = parseHex(hex);
  if (!channels) return 1;
  const [red, green, blue] = channels.map((channel) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/** Pick dark or light text for a filled surface. */
export function readableForeground(hex: string): "#111827" | "#ffffff" {
  return getLuminance(hex) > 0.55 ? "#111827" : "#ffffff";
}

export type ThemeCssVars = CSSProperties & Record<`--cc-${string}`, string>;


/**
 * Flatten a theme into the `--cc-*` custom properties consumed by the
 * components. Radii are explicit tokens now, so a preset can shape each
 * element independently instead of deriving everything from one value.
 */
const px = (value: number) => `${value}px`;

export function themeToCssVars(theme: CreateComponentTheme): ThemeCssVars {
  return {
    "--cc-primary": theme.primary,
    "--cc-primary-foreground": theme.primaryForeground,
    "--cc-primary-hover": theme.primaryHover,

    "--cc-secondary": theme.secondary,
    "--cc-secondary-foreground": theme.secondaryForeground,
    "--cc-secondary-hover": theme.secondaryHover,

    "--cc-accent": theme.accent,
    "--cc-accent-foreground": theme.accentForeground,

    "--cc-background": theme.background,
    "--cc-surface": theme.surface,
    "--cc-surface-foreground": theme.surfaceForeground,

    "--cc-muted": theme.muted,
    "--cc-muted-foreground": theme.mutedForeground,

    "--cc-border": theme.border,
    "--cc-ring": theme.ring,

    "--cc-danger": theme.danger,
    "--cc-danger-foreground": theme.dangerForeground,
    "--cc-success": theme.success,
    "--cc-success-foreground": theme.successForeground,
    "--cc-warning": theme.warning,
    "--cc-warning-foreground": theme.warningForeground,

    "--cc-chart-1": theme.chart1,
    "--cc-chart-2": theme.chart2,
    "--cc-chart-3": theme.chart3,
    "--cc-chart-4": theme.chart4,
    "--cc-chart-5": theme.chart5,
    "--cc-chart-6": theme.chart6,
    "--cc-chart-grid": theme.chartGrid,

    "--cc-radius": px(theme.radius),
    "--cc-radius-sm": px(theme.radiusSm),
    "--cc-radius-lg": px(theme.radiusLg),
    "--cc-border-width": px(theme.borderWidth),
    "--cc-border-style": theme.borderStyle,
    "--cc-shadow": theme.shadow,
    "--cc-shadow-hover": theme.shadowHover,
    "--cc-hover-translate": theme.hoverTranslate,
    "--cc-badge-radius": px(theme.badgeRadius),
    "--cc-avatar-radius": px(theme.avatarRadius),
    "--cc-progress-height": px(theme.progressHeight),
    "--cc-alert-rule-width": px(theme.alertRuleWidth),
    "--cc-focus-ring-width": px(theme.focusRingWidth),

    "--cc-font-family": theme.fontFamily,
    "--cc-font-size": px(theme.fontSize),
    "--cc-font-weight": String(theme.fontWeight),
    "--cc-line-height": String(theme.lineHeight),
    "--cc-letter-spacing": theme.letterSpacing,

    "--cc-heading-font-family": theme.headingFontFamily,
    "--cc-heading-weight": String(theme.headingWeight),
    "--cc-heading-letter-spacing": theme.headingLetterSpacing,
    "--cc-heading-transform": theme.headingTransform,
    "--cc-heading-line-height": String(theme.headingLineHeight),

    "--cc-label-font-family": theme.labelFontFamily,
    "--cc-label-weight": String(theme.labelWeight),
    "--cc-label-letter-spacing": theme.labelLetterSpacing,
    "--cc-label-transform": theme.labelTransform,

    "--cc-density": String(theme.density),
    "--cc-duration": theme.duration,
    "--cc-ease": theme.ease,
    "--cc-page-pattern": theme.pagePattern,
    "--cc-page-pattern-size": theme.pagePatternSize,
  } as ThemeCssVars;
}
