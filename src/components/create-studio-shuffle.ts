import {
  FONTS,
  ICON_LIBRARIES,
  ICON_SIZES,
  ICON_TONES,
  ICON_WEIGHTS,
  RADII,
  SHADOWS,
  STYLES,
  type IconLibraryId,
  type IconSizeId,
  type IconToneId,
  type IconWeightId,
  type ShadowChoice,
  type StyleId,
} from "./create-studio-config";
import { paletteForStyle } from "./create-studio-palette";
import type { StudioConfig } from "./create-studio-store";

/**
 * Random source. Injectable so the roll can be exercised deterministically
 * instead of stubbing `Math.random`.
 */
export type Dice = () => number;

export type StudioRollOptions = {
  /** Defaults to `Math.random`. */
  dice?: Dice;
  /**
   * Face ids from outside `FONTS` (uploaded fonts). They join the built-in
   * list, so the dice covers everything the typography picker offers.
   */
  extraFontIds?: readonly string[];
};

/**
 * One roll of the dice: style, the palette that style matches, font, elevation,
 * radius and the icon setup (library + size / weight / tone).
 *
 * Two rules keep the button useful:
 *
 * 1. Every dimension is rerolled, and every dimension *skips the value already
 *    on screen*, so a press always repaints something visible.
 * 2. Each dimension stays inside the values the sidebar can actually render:
 *    fonts cover every built-in `FONTS` entry plus uploaded faces, and the
 *    shadow pool includes «پیرو سبک» so a roll may land on a preset signature.
 *
 * The palette is not rolled on its own: it comes from `paletteForStyle()`, the
 * same map a style pick uses. A rolled theme is therefore always a coherent
 * style + palette pair (mint under the terminal, brass under steampunk) instead
 * of a random brand colour fighting the design language. Ready palettes own the
 * five roles, so stale neutral/chart overrides are dropped by
 * `studioPaletteFromPreset` and the new style keeps its own neutrals and ramp.
 *
 * Display faces are part of the font pool on purpose: the dice explores the
 * whole typography list, including the faces whose Persian glyphs read rough in
 * body copy. Pick a body face from the picker when a rolled one is too loose.
 *
 * The scenario is deliberately untouched: rolling a theme must not swap the
 * page the visitor is evaluating.
 */
export function rollStudioConfig(
  config: StudioConfig,
  options: StudioRollOptions = {},
): StudioConfig {
  const { dice = Math.random, extraFontIds = [] } = options;
  const fontPool = Array.from(
    new Set([...FONTS.map((option) => option.id), ...extraFontIds]),
  );

  const styleId = pickDifferent<StyleId>(
    STYLES.map((style) => style.id),
    config.styleId,
    dice,
  );

  const shadowOptions: ShadowChoice[] = [
    "style",
    ...SHADOWS.map((option) => option.id),
  ];
  const shadow = pickDifferent<ShadowChoice>(
    shadowOptions,
    config.shadow,
    dice,
  );

  return {
    ...config,
    styleId,
    // Follows the rolled style; see the note above. Neutral/chart overrides are
    // style-scoped, so a roll starts the new style on its own tokens.
    palette: paletteForStyle(styleId),
    radius: pickDifferent(
      RADII.map((option) => option.value),
      config.radius,
      dice,
    ),
    shadow,
    // The whole typography list is eligible: built-in faces plus any uploaded
    // ids, so the dice never gets stuck on the same handful of faces.
    font: pickDifferent<string>(fontPool, config.font, dice),
    iconLibrary: pickDifferent<IconLibraryId>(
      ICON_LIBRARIES.map((library) => library.id),
      config.iconLibrary,
      dice,
    ),
    iconStyle: {
      size: pickDifferent<IconSizeId>(
        ICON_SIZES.map((option) => option.id),
        config.iconStyle.size,
        dice,
      ),
      // Material glyphs are filled and ignore the weight (the `Icon`
      // component drops the stroke), but the value still applies the moment a
      // line library is picked again.
      weight: pickDifferent<IconWeightId>(
        ICON_WEIGHTS.map((option) => option.id),
        config.iconStyle.weight,
        dice,
      ),
      tone: pickDifferent<IconToneId>(
        ICON_TONES.map((option) => option.id),
        config.iconStyle.tone,
        dice,
      ),
    },
  };
}

/** Uniform pick; the clamp keeps a dice that returns 1 (or a stray edge) safe. */
function pick<T>(options: readonly T[], dice: Dice): T {
  const index = Math.floor(dice() * options.length);
  return options[Math.min(options.length - 1, Math.max(0, index))];
}

/**
 * Pick from the pool while avoiding the current value, so consecutive rolls
 * never look like the button did nothing. Pools with a single entry keep it.
 */
function pickDifferent<T>(
  options: readonly T[],
  current: T | undefined,
  dice: Dice,
): T {
  const pool =
    options.length > 1
      ? options.filter((option) => option !== current)
      : options;
  return pick(pool, dice);
}
