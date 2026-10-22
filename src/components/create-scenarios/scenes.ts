/**
 * Class-name map for `scenes.css`.
 *
 * The studio's Turbopack config runs the Tailwind loader over every `*.css`
 * file, which means CSS-Module exports aren't available here. The stylesheet
 * is therefore global and every class is prefixed with `sc-`; this map keeps
 * the JSX readable and typo-safe.
 */
export const sc = {
  art: "sc-art",
  surface: "sc-surface",
  paper: "sc-paper",
  muted: "sc-muted",
  ink: "sc-ink",
  inkSoft: "sc-inkSoft",
  brand: "sc-brand",
  brandSoft: "sc-brandSoft",
  brandFaint: "sc-brandFaint",
  accent: "sc-accent",
  accentSoft: "sc-accentSoft",
  success: "sc-success",
  warning: "sc-warning",
  danger: "sc-danger",
  garment: "sc-garment",
  garmentSoft: "sc-garmentSoft",
  garmentDeep: "sc-garmentDeep",
  outlined: "sc-outlined",
  line: "sc-line",
  inkLine: "sc-inkLine",
  brandLine: "sc-brandLine",
  hairline: "sc-hairline",
  stitch: "sc-stitch",
  brandStitch: "sc-brandStitch",
  strokeDash: "sc-strokeDash",
  sway: "sc-sway",
  swaySlow: "sc-swaySlow",
  hang: "sc-hang",
  hangSlow: "sc-hangSlow",
  float: "sc-float",
  floatSlow: "sc-floatSlow",
  pulse: "sc-pulse",
  blink: "sc-blink",
  spin: "sc-spin",
  spinSlow: "sc-spinSlow",
  orbit: "sc-orbit",
  shimmer: "sc-shimmer",
  draw: "sc-draw",
  drawSlow: "sc-drawSlow",
  typing: "sc-typing",
  ticker: "sc-ticker",
  tickerTrack: "sc-tickerTrack",
} as const;
