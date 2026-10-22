import { createComponentTheme, type CreateComponentTheme } from "./theme";

/**
 * Full design-language presets for the `create-components` library.
 *
 * A preset owns the neutral palette, geometry, typography voice, motion and
 * texture. Brand colours (`primary`, `secondary`, `ring`) and the body font
 * are injected by the caller, so the studio sidebar can keep driving them
 * while the preset still decides how the whole kit looks.
 */
export type CreateThemePreset =
  | "modern"
  | "nova"
  | "riso"
  | "brutalist"
  | "editorial"
  | "swiss"
  | "terminal";

export type ThemePresetDefinition = {
  tone: "light" | "dark";
  tokens: Partial<CreateComponentTheme>;
};

export type ThemedProps = {
  /** Design-language preset id. Also exposed as `data-cc-style`. */
  preset?: CreateThemePreset;
  /** Partial overrides merged on top of the preset. */
  theme?: Partial<CreateComponentTheme>;
};

type ChartPalette = Pick<
  CreateComponentTheme,
  | "chart1"
  | "chart2"
  | "chart3"
  | "chart4"
  | "chart5"
  | "chart6"
  | "chartGrid"
>;

/**
 * Data-series palettes, one identity per design language.
 *
 * Presets intentionally do *not* live inside `tokens` because the canvas keeps
 * injecting the brand colour afterwards: charts must stay readable when the
 * brand swatch changes, so each style ships its own series ramp.
 */
const chartPalettes: Record<CreateThemePreset, ChartPalette> = {
  modern: {
    chart1: "#4f46e5",
    chart2: "#0ea5e9",
    chart3: "#f59e0b",
    chart4: "#10b981",
    chart5: "#ef4444",
    chart6: "#8b5cf6",
    chartGrid: "#e5e7eb",
  },
  nova: {
    chart1: "#e76f51",
    chart2: "#264653",
    chart3: "#e9c46a",
    chart4: "#2a9d8f",
    chart5: "#8d6e63",
    chart6: "#a3b18a",
    chartGrid: "rgba(38, 70, 83, 0.22)",
  },
  riso: {
    chart1: "#e94f8a",
    chart2: "#00a6c0",
    chart3: "#1c1917",
    chart4: "#f0b429",
    chart5: "#7bbf6a",
    chart6: "#9b8bd0",
    chartGrid: "rgba(28, 25, 23, 0.24)",
  },
  brutalist: {
    chart1: "#0a0a0a",
    chart2: "#facc15",
    chart3: "#ef4444",
    chart4: "#2563eb",
    chart5: "#16a34a",
    chart6: "#9ca3af",
    chartGrid: "#0a0a0a",
  },
  editorial: {
    chart1: "#8c6a3f",
    chart2: "#5b6e4f",
    chart3: "#a4553f",
    chart4: "#3f5a6b",
    chart5: "#c2a878",
    chart6: "#7a7d85",
    chartGrid: "#e0d8c8",
  },
  swiss: {
    chart1: "#111111",
    chart2: "#d7263d",
    chart3: "#4b5563",
    chart4: "#6b7280",
    chart5: "#9ca3af",
    chart6: "#d1d5db",
    chartGrid: "#d4d4d4",
  },
  terminal: {
    chart1: "#34d399",
    chart2: "#10b981",
    chart3: "#2dd4bf",
    chart4: "#84cc16",
    chart5: "#fbbf24",
    chart6: "#7ea99a",
    chartGrid: "rgba(31, 111, 87, 0.55)",
  },
};

export const createThemePresets: Record<CreateThemePreset, ThemePresetDefinition> = {
  modern: {
    tone: "light",
    tokens: {
      background: "#f8fafc",
      surface: "#ffffff",
      surfaceForeground: "#0f172a",
      muted: "#f1f5f9",
      mutedForeground: "#64748b",
      border: "#e2e8f0",
      radius: 10,
      radiusSm: 6,
      radiusLg: 14,
      borderWidth: 1,
      shadow:
        "0 1px 2px rgb(15 23 42 / 0.06), 0 8px 24px -18px rgb(15 23 42 / 0.35)",
      shadowHover: "0 10px 24px -14px rgb(15 23 42 / 0.35)",
      hoverTranslate: "0px",
      badgeRadius: 999,
      avatarRadius: 999,
      progressHeight: 8,
      alertRuleWidth: 0,
      focusRingWidth: 2,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "0em",
      headingFontFamily: "inherit",
      headingWeight: 650,
      headingLetterSpacing: "-0.02em",
      headingTransform: "none",
      headingLineHeight: 1.2,
      labelFontFamily: "inherit",
      labelWeight: 500,
      labelLetterSpacing: "0em",
      labelTransform: "none",
      density: 1,
      duration: "180ms",
      ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      pagePattern: "none",
      pagePatternSize: "auto",
    },
  },
  nova: {
    tone: "light",
    tokens: {
      background: "#fdfaf5",
      surface: "#ffffff",
      surfaceForeground: "#264653",
      muted: "#f3f4f6",
      mutedForeground: "#6b7280",
      border: "#264653",
      radius: 4,
      radiusSm: 2,
      radiusLg: 8,
      borderWidth: 2,
      shadow: "4px 4px 0 0 #264653",
      shadowHover: "2px 2px 0 0 #264653",
      hoverTranslate: "2px",
      badgeRadius: 4,
      avatarRadius: 999,
      progressHeight: 10,
      alertRuleWidth: 2,
      focusRingWidth: 2,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.55,
      letterSpacing: "0em",
      headingFontFamily: "inherit",
      headingWeight: 900,
      headingLetterSpacing: "-0.01em",
      headingTransform: "none",
      headingLineHeight: 1.15,
      labelFontFamily: "inherit",
      labelWeight: 700,
      labelLetterSpacing: "0em",
      labelTransform: "none",
      density: 1,
      duration: "150ms",
      ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      pagePattern:
        "radial-gradient(rgb(38 70 83 / 0.14) 0.65px, transparent 0.65px), radial-gradient(rgb(231 111 81 / 0.14) 0.65px, var(--cc-background) 0.65px)",
      pagePatternSize: "26px 26px",
    },
  },
  riso: {
    tone: "light",
    tokens: {
      background: "#f6f1e6",
      surface: "#fffdf7",
      surfaceForeground: "#1c1917",
      muted: "#efe7d6",
      mutedForeground: "#6b6255",
      border: "#1c1917",
      radius: 3,
      radiusSm: 2,
      radiusLg: 6,
      borderWidth: 2,
      shadow: "5px 5px 0 0 var(--cc-primary)",
      shadowHover: "3px 3px 0 0 var(--cc-primary)",
      hoverTranslate: "2px",
      badgeRadius: 2,
      avatarRadius: 4,
      progressHeight: 12,
      alertRuleWidth: 2,
      focusRingWidth: 2,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.55,
      letterSpacing: "0em",
      headingFontFamily: "inherit",
      headingWeight: 900,
      headingLetterSpacing: "-0.01em",
      headingTransform: "none",
      headingLineHeight: 1.12,
      labelFontFamily:
        '"Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace',
      labelWeight: 700,
      labelLetterSpacing: "0.06em",
      labelTransform: "uppercase",
      density: 1,
      duration: "120ms",
      ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      pagePattern:
        "radial-gradient(circle at 1px 1px, rgb(28 25 23 / 0.16) 1px, transparent 0)",
      pagePatternSize: "12px 12px",
    },
  },

  // ------------------------------------------------------------------------
  brutalist: {
    tone: "light",
    tokens: {
      background: "#ffffff",
      surface: "#ffffff",
      surfaceForeground: "#0a0a0a",
      muted: "#f5f5f5",
      mutedForeground: "#4b5563",
      border: "#0a0a0a",
      radius: 0,
      radiusSm: 0,
      radiusLg: 0,
      borderWidth: 3,
      shadow: "8px 8px 0 0 #0a0a0a",
      shadowHover: "4px 4px 0 0 #0a0a0a",
      hoverTranslate: "4px",
      badgeRadius: 0,
      avatarRadius: 0,
      progressHeight: 14,
      alertRuleWidth: 4,
      focusRingWidth: 3,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.55,
      letterSpacing: "0em",
      headingFontFamily: "inherit",
      headingWeight: 900,
      headingLetterSpacing: "-0.02em",
      headingTransform: "uppercase",
      headingLineHeight: 1.05,
      labelFontFamily: "inherit",
      labelWeight: 800,
      labelLetterSpacing: "0.08em",
      labelTransform: "uppercase",
      density: 1.05,
      duration: "90ms",
      ease: "cubic-bezier(0.2, 0, 0, 1)",
      pagePattern:
        "linear-gradient(rgb(10 10 10 / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(10 10 10 / 0.06) 1px, transparent 1px)",
      pagePatternSize: "24px 24px",
    },
  },
  editorial: {
    tone: "light",
    tokens: {
      background: "#fbf7ef",
      surface: "#fffdf8",
      surfaceForeground: "#1c1917",
      muted: "#f1ece1",
      mutedForeground: "#6f675c",
      border: "#d9d2c3",
      radius: 2,
      radiusSm: 1,
      radiusLg: 4,
      borderWidth: 1,
      shadow: "0 24px 48px -40px rgb(28 25 23 / 0.55)",
      shadowHover: "0 24px 48px -36px rgb(28 25 23 / 0.45)",
      hoverTranslate: "0px",
      badgeRadius: 999,
      avatarRadius: 999,
      progressHeight: 6,
      alertRuleWidth: 0,
      focusRingWidth: 2,
      fontSize: 15,
      fontWeight: 400,
      lineHeight: 1.75,
      letterSpacing: "0em",
      headingFontFamily: '"Newsreader", Georgia, "Vazirmatn", serif',
      headingWeight: 600,
      headingLetterSpacing: "-0.01em",
      headingTransform: "none",
      headingLineHeight: 1.15,
      labelFontFamily: "inherit",
      labelWeight: 600,
      labelLetterSpacing: "0.1em",
      labelTransform: "uppercase",
      density: 1.05,
      duration: "240ms",
      ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      pagePattern:
        "radial-gradient(rgb(28 25 23 / 0.06) 0.6px, transparent 0.6px)",
      pagePatternSize: "18px 18px",
    },
  },
  swiss: {
    tone: "light",
    tokens: {
      background: "#ffffff",
      surface: "#ffffff",
      surfaceForeground: "#111111",
      muted: "#f2f2f2",
      mutedForeground: "#525252",
      border: "#111111",
      radius: 0,
      radiusSm: 0,
      radiusLg: 0,
      borderWidth: 1,
      shadow: "none",
      shadowHover: "none",
      hoverTranslate: "0px",
      badgeRadius: 0,
      avatarRadius: 0,
      progressHeight: 4,
      alertRuleWidth: 0,
      focusRingWidth: 2,
      fontSize: 13,
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0em",
      headingFontFamily:
        '"Helvetica Neue", Helvetica, Arial, "Vazirmatn", sans-serif',
      headingWeight: 700,
      headingLetterSpacing: "-0.03em",
      headingTransform: "none",
      headingLineHeight: 1.1,
      labelFontFamily: "inherit",
      labelWeight: 700,
      labelLetterSpacing: "0.1em",
      labelTransform: "uppercase",
      density: 0.9,
      duration: "120ms",
      ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      pagePattern:
        "linear-gradient(to right, rgb(17 17 17 / 0.06) 1px, transparent 1px)",
      pagePatternSize: "80px 80px",
    },
  },
  terminal: {
    tone: "dark",
    tokens: {
      background: "#07100d",
      surface: "#0b1512",
      surfaceForeground: "#d1fae5",
      muted: "#12211c",
      mutedForeground: "#7ea99a",
      border: "#1f6f57",
      danger: "#f87171",
      dangerForeground: "#1f2937",
      success: "#34d399",
      successForeground: "#04120e",
      warning: "#fbbf24",
      warningForeground: "#1f2937",
      radius: 0,
      radiusSm: 0,
      radiusLg: 0,
      borderWidth: 1,
      shadow: "0 0 0 1px #1f6f57, 0 0 24px -8px #2a9d8f",
      shadowHover: "0 0 0 1px #2a9d8f, 0 0 28px -4px #2a9d8f",
      hoverTranslate: "0px",
      badgeRadius: 0,
      avatarRadius: 0,
      progressHeight: 6,
      alertRuleWidth: 2,
      focusRingWidth: 1,
      fontSize: 13,
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "0em",
      headingFontFamily:
        'ui-monospace, SFMono-Regular, "Fira Code", Menlo, monospace',
      headingWeight: 700,
      headingLetterSpacing: "0.02em",
      headingTransform: "none",
      headingLineHeight: 1.2,
      labelFontFamily:
        'ui-monospace, SFMono-Regular, "Fira Code", Menlo, monospace',
      labelWeight: 700,
      labelLetterSpacing: "0.08em",
      labelTransform: "uppercase",
      density: 0.95,
      duration: "60ms",
      ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      pagePattern:
        "repeating-linear-gradient(0deg, rgb(42 157 143 / 0.06) 0 1px, transparent 1px 3px)",
      pagePatternSize: "auto",
    },
  },
};

/**
 * Merge a preset with per-instance overrides.
 * Overrides always win, so the canvas can keep driving colours, radius and
 * fonts while the preset contributes the rest of the visual identity.
 */
export function resolveTheme(
  preset: CreateThemePreset = "modern",
  overrides: Partial<CreateComponentTheme> = {},
): CreateComponentTheme {
  const definition = createThemePresets[preset] ?? createThemePresets.modern;
  const palette = chartPalettes[preset] ?? chartPalettes.modern;
  return createComponentTheme({ ...definition.tokens, ...palette, ...overrides });
}
