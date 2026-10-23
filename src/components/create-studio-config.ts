import {
  mixHex,
  readableForeground,
  themeToCssVars,
} from "./create-components/theme";
import { createThemePresets, resolveTheme } from "./create-components/style-presets";

export type ArchetypeId =
  | "components"
  | "landing"
  | "ecommerce"
  | "clinic"
  | "dashboard";

export type StyleId =
  | "nova"
  | "riso"
  | "brutalist"
  | "editorial"
  | "swiss"
  | "terminal";

export type FontId =
  | "vazirmatn"
  | "vazir"
  | "samim"
  | "gandom"
  | "dirooz"
  | "maktab"
  | "ordibehesht"
  | "aghasem"
  | "google"
  | "parvaz";

export type IconLibraryId = "google" | "lucide" | "tabler";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  tagline: string;
  description: string;
};
export type StyleOption = { id: StyleId; label: string };
export type Swatch = {
  hex: string;
  subtle: string;
  name: string;
  role: string;
  tag: string;
};
export type PresetPill = { hex: string; subtle: string; name: string };
export type RadiusOption = { value: number; label: string; caption: string };
export type FontOption = {
  id: FontId;
  label: string;
  note: string;
  /** Body faces read as text; display faces are for headlines and accents. */
  kind: "text" | "display";
};
export type IconLibrary = { id: IconLibraryId; label: string; note: string };
export type ShufflePreset = {
  hex: string;
  subtle: string;
  name: string;
  radius: number;
  style: StyleId;
};

export const ARCHETYPES: Archetype[] = [
  {
    id: "components",
    label: "کامپوننت‌ها و ویجت‌ها",
    tagline: "UI KIT",
    description: "گالری فرم‌ها، بازخورد، جدول و نمودارها",
  },
  {
    id: "landing",
    label: "لندینگ تدریس آنلاین",
    tagline: "LANDING",
    description: "صفحهٔ فرود آکادمی با ثبت‌نام و برنامهٔ کلاس‌ها",
  },
  {
    id: "ecommerce",
    label: "فروشگاه پوشاک",
    tagline: "SHOP",
    description: "ویترین پوشاک با فیلتر، سبد خرید و پیشنهادها",
  },
  {
    id: "clinic",
    label: "سامانه نوبت‌دهی کلینیک",
    tagline: "CLINIC",
    description: "رزرو نوبت چهار مرحله‌ای با تقویم شمسی",
  },
  {
    id: "dashboard",
    label: "داشبورد داده و آمار",
    tagline: "DASHBOARD",
    description: "شاخص‌ها، نمودارها، جدول سفارش و سلامت سیستم",
  },
];

export const STYLES: StyleOption[] = [
  { id: "nova", label: "نووا مدرن" },
  { id: "riso", label: "چاپ دستی ریزو" },
  { id: "brutalist", label: "نئوبروتال جسور" },
  { id: "editorial", label: "ادیتوریال مینیمال" },
  { id: "swiss", label: "سازمانی سوییسی" },
  { id: "terminal", label: "ترمینال تکنیکال" },
];

export const SWATCHES: Swatch[] = [
  {
    hex: "#e76f51",
    subtle: "#fbeee9",
    name: "سفال کهربایی",
    role: "رنگ اصلی اکشن‌ها و دکمه‌های تاکیدی",
    tag: "Primary",
  },
  {
    hex: "#264653",
    subtle: "#e6eef1",
    name: "سرمه‌ای مرکب",
    role: "رنگ متن، عنوان و استروک‌های رسمی",
    tag: "Secondary",
  },
  {
    hex: "#2a9d8f",
    subtle: "#e0f2f1",
    name: "سبز زیتونی پایدار",
    role: "شاخص رشد، وضعیت موفقیت و پایداری",
    tag: "Success",
  },
  {
    hex: "#dda15e",
    subtle: "#fdf7e7",
    name: "خردلی طلایی",
    role: "رنگ هشدار، هایلایت و توجه کارگاهی",
    tag: "Warning",
  },
];

export const PRESET_PILLS: PresetPill[] = [
  { hex: "#e76f51", subtle: "#fbeee9", name: "سفال کهربایی" },
  { hex: "#244234", subtle: "#e7f0ec", name: "جوهر سبز جنگلی" },
  { hex: "#1e284a", subtle: "#edf1fa", name: "مرجانی و سرمه‌ای" },
  { hex: "#18181b", subtle: "#f4f4f5", name: "مونوکروم صنعتی" },
];

export const RADII: RadiusOption[] = [
  { value: 0, label: "0", caption: "تیز" },
  { value: 4, label: "4px", caption: "ملایم" },
  { value: 8, label: "8px", caption: "متوسط" },
  { value: 12, label: "12px", caption: "گرد" },
  { value: 16, label: "16px", caption: "کپسولی" },
];

export const FONTS: FontOption[] = [
  { id: "vazirmatn", label: "وزیرمتن", note: "پیش‌فرض سایت", kind: "text" },
  { id: "vazir", label: "وزیر", note: "کلاسیک", kind: "text" },
  { id: "samim", label: "صمیم", note: "خوانا", kind: "text" },
  { id: "gandom", label: "گندم", note: "گرم", kind: "text" },
  { id: "dirooz", label: "دی‌روز", note: "مدرن", kind: "text" },
  { id: "maktab", label: "مکتب ریتا", note: "نرم", kind: "text" },
  {
    id: "ordibehesht",
    label: "اردیبهشت شابلون",
    note: "تیتر",
    kind: "display",
  },
  { id: "aghasem", label: "ع. قاسم", note: "دست‌نویس", kind: "display" },
  { id: "google", label: "ای‌گوگل", note: "نمایشی", kind: "display" },
  { id: "parvaz", label: "پرواز", note: "نمایشی", kind: "display" },
];

export const ICON_LIBRARIES: IconLibrary[] = [
  { id: "google", label: "نمادهای گوگل", note: "Google" },
  { id: "lucide", label: "لوسید آیکون", note: "Lucide" },
  { id: "tabler", label: "تب‌لر آیکون", note: "Tabler" },
];

export const SHUFFLE_PRESETS: ShufflePreset[] = [
  {
    hex: "#e76f51",
    subtle: "#fbeee9",
    name: "سفال کهربایی",
    radius: 4,
    style: "nova",
  },
  {
    hex: "#244234",
    subtle: "#e7f0ec",
    name: "سبز زیتونی پایدار",
    radius: 0,
    style: "riso",
  },
  {
    hex: "#1e284a",
    subtle: "#edf1fa",
    name: "سرمه‌ای مرکب",
    radius: 8,
    style: "editorial",
  },
  {
    hex: "#dda15e",
    subtle: "#fdf7e7",
    name: "خردلی گرم",
    radius: 12,
    style: "nova",
  },
  {
    hex: "#18181b",
    subtle: "#f4f4f5",
    name: "زغالی مونوکروم",
    radius: 16,
    style: "brutalist",
  },
];

/**
 * Font ids resolved to CSS stacks. Every local face is followed by Vazir and
 * Vazirmatn so characters the display faces lack (A Ghasem has no digits,
 * A Google and Parvaz no Latin letters) fall back to a real glyph instead of
 * a missing-glyph box. Family names match src/app/create/fonts.css.
 */
export const FONT_STACKS: Record<FontId, string> = {
  vazirmatn: "'Vazirmatn', sans-serif",
  vazir: "'Vazir', 'Vazirmatn', sans-serif",
  samim: "'Samim', 'Vazir', 'Vazirmatn', sans-serif",
  gandom: "'Gandom', 'Vazir', 'Vazirmatn', sans-serif",
  dirooz: "'Dirooz', 'Vazir', 'Vazirmatn', sans-serif",
  maktab: "'Maktab Rita', 'Vazir', 'Vazirmatn', sans-serif",
  ordibehesht: "'Ordibehesht', 'Vazir', 'Vazirmatn', sans-serif",
  aghasem: "'A Ghasem', 'Vazir', 'Vazirmatn', sans-serif",
  google: "'A Google', 'Vazir', 'Vazirmatn', sans-serif",
  parvaz: "'Parvaz', 'Vazir', 'Vazirmatn', sans-serif",
};

export function mixWithWhite(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return hex;
  const channels = [0, 2, 4].map((offset) =>
    parseInt(clean.slice(offset, offset + 2), 16),
  );
  const mixed = channels.map((channel) =>
    Math.round(channel + (255 - channel) * amount),
  );
  return `#${mixed.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

export function buildTokenLine(input: {
  primary: string;
  radius: number;
  style: StyleId;
}): string {
  return `--primary: ${input.primary}; --radius: ${input.radius}px; --font-family: ${FONT_STACKS.vazirmatn}; --style: ${input.style};`;
}

export function buildThemeSnippet(input: {
  primary: string;
  primarySubtle: string;
  radius: number;
  style: StyleId;
  fontStack: string;
}): string {
  const preset = createThemePresets[input.style];
  const dark = preset.tone === "dark";
  const surface = preset.tokens.surface ?? "#ffffff";
  const shadow = preset.tokens.shadow ?? "none";

  const theme = resolveTheme(input.style, {
    primary: input.primary,
    primaryForeground: readableForeground(input.primary),
    primaryHover: mixHex(input.primary, dark ? "#ffffff" : "#000000", 0.14),
    secondary: dark
      ? `color-mix(in srgb, ${input.primary} 22%, ${surface})`
      : input.primarySubtle,
    secondaryForeground: dark
      ? mixHex(input.primary, "#ffffff", 0.4)
      : input.primary,
    ring: input.primary,
    radius: input.radius,
    fontFamily: input.fontStack,
  });

  const vars = Object.entries(themeToCssVars(theme))
    .map(([token, value]) => `  ${token}: ${value};`)
    .join("\n");

  return `/* استودیو کُدولوژی // ${input.style} theme (Tailwind CSS v4) */
@import "tailwindcss";

@theme {
  --color-primary: ${input.primary};
  --color-primary-subtle: ${input.primarySubtle};
  --radius-craft: ${input.radius}px;
  --font-craft: ${input.fontStack};
  --shadow-craft: ${shadow};
}

:root {
  --primary: ${input.primary};
  --primary-subtle: ${input.primarySubtle};
  --radius: ${input.radius}px;
  --preset-style: "${input.style}";
  --font-family: ${input.fontStack};
  --box-shadow-offset: ${shadow};

  /* create-components design language */
${vars}
}`;
}
