export type Swatch = { label: string; value: string };

/** All colour choices resolve to the article's own tokens, never a hex value. */
export const TEXT_COLORS: Swatch[] = [
  { label: "جوهر", value: "var(--color-indigo-ink)" },
  { label: "مرجانی", value: "var(--color-coral)" },
  { label: "مرجانی تیره", value: "var(--color-coral-dark)" },
  { label: "خردلی", value: "var(--color-mustard-deep)" },
  { label: "فیروزه‌ای", value: "var(--color-teal-craft)" },
  { label: "سرمه‌ای روشن", value: "var(--color-indigo-light)" },
];

export const HIGHLIGHTS: Swatch[] = [
  { label: "خردلی", value: "var(--color-mustard)" },
  { label: "مرجانی روشن", value: "var(--color-coral-soft)" },
  { label: "فیروزه‌ای روشن", value: "var(--color-teal-light)" },
  { label: "کاغذ", value: "var(--color-paper-dim)" },
];

export const CELL_COLORS: Swatch[] = [
  { label: "بدون رنگ", value: "" },
  { label: "خردلی", value: "var(--color-mustard)" },
  { label: "مرجانی روشن", value: "var(--color-coral-soft)" },
  { label: "فیروزه‌ای روشن", value: "var(--color-teal-light)" },
  { label: "کاغذ تیره", value: "var(--color-paper-dim)" },
];

export const FONT_FAMILIES: Swatch[] = [
  { label: "پیش‌فرض", value: "" },
  { label: "وزیرمتن", value: "var(--font-sans)" },
  { label: "نمایشی", value: "var(--font-display)" },
  { label: "سریف", value: "var(--font-serif)" },
  { label: "مونو", value: "var(--font-mono)" },
  { label: "وزیر", value: "Vazir" },
  { label: "صمیم", value: "Samim" },
  { label: "گندم", value: "Gandom" },
  { label: "دیروز", value: "Dirooz" },
];

export const FONT_SIZES = [
  "",
  "12px",
  "13px",
  "14px",
  "15px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "28px",
  "32px",
  "36px",
  "40px",
];

export const LINE_HEIGHTS = ["", "1.4", "1.6", "1.8", "2", "2.4"];

export const TABLE_STYLES = [
  { label: "پیش‌فرض", value: "" },
  { label: "راه‌راه", value: "striped" },
  { label: "فشرده", value: "compact" },
  { label: "ساده", value: "plain" },
];

export function fontLabel(value: string): string {
  return FONT_FAMILIES.find((item) => item.value === value)?.label ?? "پیش‌فرض";
}

export function fontSizeLabel(value: string): string {
  return value ? value.replace("px", "") : "پیش‌فرض";
}
