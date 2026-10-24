const numberFormatter = new Intl.NumberFormat("fa-IR");

/** Persian digits, grouped. */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Persian digits with the Toman suffix. */
export function formatToman(value: number): string {
  return `${numberFormatter.format(value)} تومان`;
}

const percentFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 1,
});

/** Persian digits with the Persian percent sign (`۴٫۱٪`). */
export function formatPercent(value: number): string {
  return `${percentFormatter.format(value)}٪`;
}
