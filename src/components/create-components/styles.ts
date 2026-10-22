/**
 * Shared Tailwind class fragments that bind a component to the theme tokens.
 *
 * Keeping them in one place means every control speaks the same typographic
 * voice, so a preset can flip headings to serif or labels to mono without each
 * primitive hard-coding weights and transforms.
 */
export const labelType = [
  "[font-family:var(--cc-label-font-family)]",
  "[font-weight:var(--cc-label-weight)]",
  "[letter-spacing:var(--cc-label-letter-spacing)]",
  "[text-transform:var(--cc-label-transform)]",
].join(" ");

export const headingType = [
  "[font-family:var(--cc-heading-font-family)]",
  "[font-weight:var(--cc-heading-weight)]",
  "[letter-spacing:var(--cc-heading-letter-spacing)]",
  "[text-transform:var(--cc-heading-transform)]",
  "[line-height:var(--cc-heading-line-height)]",
].join(" ");

export const bodyType = [
  "[font-weight:var(--cc-font-weight)]",
  "[letter-spacing:var(--cc-letter-spacing)]",
  "[line-height:var(--cc-line-height)]",
].join(" ");

/** Applied to every outlined element so `borderStyle` is honoured. */
export const borderChrome = "[border-style:var(--cc-border-style)]";

/** Shared transition so presets can tune speed and easing. */
export const motion = [
  "transition-[color,background-color,border-color,box-shadow,translate]",
  "duration-[var(--cc-duration)]",
  "[transition-timing-function:var(--cc-ease)]",
].join(" ");
