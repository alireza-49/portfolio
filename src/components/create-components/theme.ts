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

  /** Corner radius in px. */
  radius: number;
  /** Border thickness in px. Set to 0 for a borderless look. */
  borderWidth: number;
  /** Any valid CSS `box-shadow` value. Use "none" to flatten. */
  shadow: string;
  /** Any valid CSS `font-family` stack. */
  fontFamily: string;
  /** Base font size in px. */
  fontSize: number;
  /** Padding / gap multiplier. 0.75 = compact, 1 = default, 1.25 = roomy. */
  density: number;
  /** Any valid CSS `transition-duration` value. */
  duration: string;
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

  radius: 8,
  borderWidth: 1,
  shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  fontFamily: "inherit",
  fontSize: 14,
  density: 1,
  duration: "150ms",
};

/** Merge partial overrides onto the defaults. */
export function createComponentTheme(
  overrides: Partial<CreateComponentTheme> = {},
): CreateComponentTheme {
  return { ...defaultCreateComponentTheme, ...overrides };
}

export type ThemeCssVars = CSSProperties & Record<`--cc-${string}`, string>;

/**
 * Flatten a theme into the `--cc-*` custom properties consumed by the
 * components. Derived values (radius-sm / radius-lg) are computed here so
 * components never have to do arithmetic.
 */
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

    "--cc-radius": `${theme.radius}px`,
    "--cc-radius-sm": `${Math.max(theme.radius - 2, 0)}px`,
    "--cc-radius-lg": `${theme.radius + 4}px`,
    "--cc-border-width": `${theme.borderWidth}px`,
    "--cc-shadow": theme.shadow,
    "--cc-font-family": theme.fontFamily,
    "--cc-font-size": `${theme.fontSize}px`,
    "--cc-density": String(theme.density),
    "--cc-duration": theme.duration,
  } as ThemeCssVars;
}
