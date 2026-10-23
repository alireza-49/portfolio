import { createComponentTheme, type CreateComponentTheme } from "../theme";
import { chartPalettes } from "./chart-palettes";
import { classicPresets } from "./presets-classic";
import { darkPresets } from "./presets-dark";
import { expressivePresets } from "./presets-expressive";
import type { CreateThemePreset, ThemePresetDefinition } from "./types";

/**
 * Full design-language presets for the `create-components` library.
 *
 * A preset owns the neutral palette, geometry, typography voice, motion and
 * texture. Brand colours (`primary`, `secondary`, `ring`) and the body font
 * are injected by the caller, so the studio sidebar can keep driving them
 * while the preset still decides how the whole kit looks.
 *
 * The definitions are split by temperament (classic / expressive / dark) to
 * keep each file readable; this module is still the single import surface.
 */
export const createThemePresets: Record<
  CreateThemePreset,
  ThemePresetDefinition
> = {
  ...classicPresets,
  ...expressivePresets,
  ...darkPresets,
};

/** Chart ramps are public: the palette editor previews them per style. */
export { chartPalettes };

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

export type {
  ChartPalette,
  CreateThemePreset,
  ThemePresetDefinition,
  ThemedProps,
} from "./types";
