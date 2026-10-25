import type { CreateThemePreset, ThemePresetDefinition } from "./types";

type DarkPresetId = Extract<
  CreateThemePreset,
  "blueprint" | "terminal" | "glass" | "steampunk"
>;

const mono = "'Vazir Code', ui-monospace, SFMono-Regular, Menlo, monospace";
const displayMono = mono;

/**
 * Dark-first voices. Their surfaces are deliberately deeper than the page so
 * "cards" still read as separate planes without relying on a light shadow.
 */
export const darkPresets: Record<DarkPresetId, ThemePresetDefinition> = {
  /**
   * CAD blueprint: navy plotting paper, white hairlines, amber guides and a
   * measurement-tick grid. Zero radius, zero depth, monospaced data.
   */
  blueprint: {
    tone: "dark",
    tokens: {
      background: "#1c4e80",
      surface: "#17436d",
      surfaceForeground: "#f4f9ff",
      muted: "#123a5f",
      mutedForeground: "#c3d8ea",
      border: "#8ab6d6",
      accent: "#ffd700",
      accentForeground: "#1b1607",
      success: "#8ce0c0",
      successForeground: "#08221a",
      warning: "#ffd700",
      warningForeground: "#1b1607",
      danger: "#e85d35",
      dangerForeground: "#1b0d07",
      radius: 0,
      radiusSm: 0,
      radiusLg: 0,
      borderWidth: 1,
      shadow: "none",
      shadowHover: "0 0 0 1px rgb(255 255 255 / 0.22)",
      hoverTranslate: "0px",
      hoverRotate: "0deg",
      badgeRadius: 0,
      avatarRadius: 0,
      progressHeight: 4,
      alertRuleWidth: 3,
      focusRingWidth: 1,
      fontSize: 13,
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "0em",
      headingFontFamily: "'Vazir', 'Vazirmatn', sans-serif",
      headingWeight: 700,
      headingLetterSpacing: "0em",
      headingTransform: "none",
      headingLineHeight: 1.2,
      labelFontFamily: "'Vazir', 'Vazirmatn', sans-serif",
      labelWeight: 700,
      labelLetterSpacing: "0em",
      labelTransform: "none",
      monoFontFamily: displayMono,
      density: 0.9,
      duration: "120ms",
      ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      pagePattern:
        "linear-gradient(rgb(255 255 255 / 0.09) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.09) 1px, transparent 1px)",
      pagePatternSize: "50px 50px",
      surfacePattern:
        "linear-gradient(rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.05) 1px, transparent 1px)",
      surfacePatternSize: "12px 12px",
    },
  },

  /**
   * Terminal: CRT green on near-black, scanline surfaces and a prompt mark on
   * headings. The scanlines moved from styles.css into a surface token so any
   * surface-bearing primitive inherits them.
   */
  terminal: {
    tone: "dark",
    tokens: {
      background: "#07100d",
      surface: "#0b1512",
      surfaceForeground: "#d1fae5",
      muted: "#12211c",
      mutedForeground: "#8fbfae",
      border: "#1f6f57",
      accent: "#2dd4bf",
      accentForeground: "#04120e",
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
      hoverRotate: "0deg",
      badgeRadius: 0,
      avatarRadius: 0,
      progressHeight: 6,
      alertRuleWidth: 2,
      focusRingWidth: 1,
      fontSize: 13,
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "0em",
      headingFontFamily: "'Vazir', 'Vazirmatn', ui-monospace, monospace",
      headingWeight: 700,
      headingLetterSpacing: "0em",
      headingTransform: "none",
      headingLineHeight: 1.25,
      labelFontFamily: "'Vazir', 'Vazirmatn', sans-serif",
      labelWeight: 700,
      labelLetterSpacing: "0em",
      labelTransform: "none",
      monoFontFamily: displayMono,
      density: 0.95,
      duration: "60ms",
      ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      pagePattern:
        "repeating-linear-gradient(0deg, rgb(42 157 143 / 0.07) 0 1px, transparent 1px 3px)",
      pagePatternSize: "auto",
      surfacePattern:
        "repeating-linear-gradient(0deg, rgb(42 157 143 / 0.06) 0 1px, transparent 1px 3px)",
      surfacePatternSize: "auto",
    },
  },

  /**
   * Synth bonsai glass: near-black bed, translucent panels, cyan glow. The
   * blur itself lives behind an @supports rule; the tokens alone already read
   * as glass thanks to the translucent surface and inner hairline.
   */
  glass: {
    tone: "dark",
    tokens: {
      background: "#050608",
      surface: "rgba(13, 20, 27, 0.72)",
      surfaceForeground: "#e8faff",
      muted: "rgba(155, 232, 255, 0.08)",
      mutedForeground: "#8fb6c4",
      border: "rgba(155, 232, 255, 0.28)",
      accent: "#4dd8ff",
      accentForeground: "#04121a",
      danger: "#ff7a90",
      dangerForeground: "#1a0509",
      success: "#5ce1b0",
      successForeground: "#04140f",
      warning: "#ffd166",
      warningForeground: "#201704",
      radius: 18,
      radiusSm: 10,
      radiusLg: 26,
      borderWidth: 1,
      shadow:
        "0 0 0 1px rgb(155 232 255 / 0.16), 0 26px 60px -34px rgb(77 216 255 / 0.55)",
      shadowHover:
        "0 0 0 1px rgb(155 232 255 / 0.3), 0 30px 70px -28px rgb(77 216 255 / 0.7)",
      hoverTranslate: "0px",
      hoverRotate: "0deg",
      badgeRadius: 999,
      avatarRadius: 999,
      progressHeight: 10,
      alertRuleWidth: 2,
      focusRingWidth: 2,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.65,
      letterSpacing: "0em",
      headingFontFamily: "'Dirooz', 'Vazir', 'Vazirmatn', sans-serif",
      headingWeight: 700,
      headingLetterSpacing: "0em",
      headingTransform: "none",
      headingLineHeight: 1.18,
      labelFontFamily: "'Vazir', 'Vazirmatn', sans-serif",
      labelWeight: 600,
      labelLetterSpacing: "0em",
      labelTransform: "none",
      monoFontFamily:
        "'Space Grotesk', ui-monospace, SFMono-Regular, Menlo, monospace",
      density: 1.05,
      duration: "320ms",
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      pagePattern:
        "radial-gradient(60% 50% at 18% 0%, rgb(77 216 255 / 0.18), transparent 70%), radial-gradient(50% 40% at 85% 100%, rgb(155 232 255 / 0.14), transparent 70%)",
      pagePatternSize: "auto",
      surfacePattern: "none",
      surfacePatternSize: "auto",
    },
  },

  /**
   * Steampunk nebula: deep space bed, brass double borders, engraved display
   * headings and monospaced instrument labels. Warm metal over a cold void.
   */
  steampunk: {
    tone: "dark",
    tokens: {
      background: "#0d1b33",
      surface: "#16233d",
      surfaceForeground: "#f3e3c3",
      muted: "#2b1d0e",
      mutedForeground: "#b9a68e",
      border: "#cd7f32",
      accent: "#b5a642",
      accentForeground: "#1b1206",
      success: "#4e8c7a",
      successForeground: "#04140f",
      warning: "#b87333",
      warningForeground: "#1b1206",
      danger: "#c0392b",
      dangerForeground: "#ffffff",
      radius: 8,
      radiusSm: 3,
      radiusLg: 14,
      borderWidth: 3,
      borderStyle: "double",
      shadow: "0 18px 40px -26px #000000",
      shadowHover:
        "0 0 0 1px rgb(93 58 155 / 0.5), 0 22px 50px -22px #000000",
      hoverTranslate: "0px",
      hoverRotate: "0deg",
      badgeRadius: 4,
      avatarRadius: 999,
      progressHeight: 8,
      alertRuleWidth: 3,
      focusRingWidth: 2,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.65,
      letterSpacing: "0em",
      headingFontFamily: "'Vazir', 'Vazirmatn', sans-serif",
      headingWeight: 900,
      headingLetterSpacing: "0em",
      headingTransform: "none",
      headingLineHeight: 1.2,
      labelFontFamily: "'Vazir', 'Vazirmatn', sans-serif",
      labelWeight: 700,
      labelLetterSpacing: "0em",
      labelTransform: "none",
      monoFontFamily: displayMono,
      density: 1,
      duration: "200ms",
      ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      pagePattern:
        "radial-gradient(rgb(255 255 255 / 0.35) 0.5px, transparent 0.6px), radial-gradient(70% 60% at 75% 15%, rgb(93 58 155 / 0.4), transparent 70%)",
      pagePatternSize: "90px 90px, auto",
      surfacePattern:
        "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.022) 0 1px, transparent 1px 4px)",
      surfacePatternSize: "auto",
    },
  },
};
