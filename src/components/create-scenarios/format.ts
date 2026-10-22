const numberFormatter = new Intl.NumberFormat("fa-IR");

/** Persian digits, grouped. */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Persian digits with the Toman suffix. */
export function formatToman(value: number): string {
  return `${numberFormatter.format(value)} تومان`;
}
