import type { CreateComponentTheme } from "../theme";

/**
 * Every design language shipped by the studio.
 *
 * `modern` is the neutral base used by the library defaults and by any code
 * that renders without a preset; the thirteen others are the picker choices.
 */
export type CreateThemePreset =
  | "modern"
  | "nova"
  | "corporate"
  | "editorial"
  | "swiss"
  | "edtech"
  | "terracotta"
  | "zine"
  | "memphis"
  | "manga"
  | "blueprint"
  | "terminal"
  | "glass"
  | "steampunk";

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

export type ChartPalette = Pick<
  CreateComponentTheme,
  | "chart1"
  | "chart2"
  | "chart3"
  | "chart4"
  | "chart5"
  | "chart6"
  | "chartGrid"
>;
