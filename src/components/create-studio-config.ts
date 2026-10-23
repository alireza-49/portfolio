import {
  ChartLine,
  LayoutGrid,
  PanelsTopLeft,
  ShoppingBag,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { themeToCssVars } from "./create-components/theme";
import type { IconLibraryId } from "./create-components/icon-set";
import {
  createThemePresets,
  resolveTheme,
} from "./create-components/style-presets";
import {
  paletteThemeOverrides,
  type StudioPalette,
} from "./create-studio-palette";

export type ArchetypeId =
  | "components"
  | "landing"
  | "ecommerce"
  | "clinic"
  | "dashboard";

export type StyleId =
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

export type StyleGroupId = "modern" | "technical" | "expressive";

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

export type { IconLibraryId };

/** How large every canvas glyph renders relative to its call site. */
export type IconSizeId = "sm" | "md" | "lg";
/** Stroke weight for line icons (Lucide and Tabler). */
export type IconWeightId = "light" | "regular" | "bold";
/** Which token paints the glyphs; `inherit` keeps the surrounding text. */
export type IconToneId = "inherit" | "primary" | "accent" | "muted";

export type IconStyle = {
  size: IconSizeId;
  weight: IconWeightId;
  tone: IconToneId;
};

export type IconSizeOption = { id: IconSizeId; label: string; scale: number };
export type IconWeightOption = {
  id: IconWeightId;
  label: string;
  stroke: number;
};
export type IconToneOption = { id: IconToneId; label: string; color: string };

export type Archetype = {
  id: ArchetypeId;
  label: string;
  /** Compact name for the studio header tabs. */
  shortLabel: string;
  description: string;
  /** Demo address shown in the preview window's browser bar. */
  demoHost: string;
};
export type StyleOption = {
  id: StyleId;
  label: string;
  /** One line explaining what the style promises visually. */
  description: string;
  /** Built-in body face applied when the style is selected. */
  font: FontId;
  group: StyleGroupId;
};
export type StyleGroup = {
  id: StyleGroupId;
  label: string;
  caption: string;
};
export type RadiusOption = { value: number; label: string; caption: string };
export type FontOption = {
  id: FontId;
  label: string;
  note: string;
  /** Body faces read as text; display faces are for headlines and accents. */
  kind: "text" | "display";
};
export type IconLibrary = { id: IconLibraryId; label: string; note: string };

export const ARCHETYPES: Archetype[] = [
  {
    id: "landing",
    label: "لندینگ تدریس آنلاین",
    shortLabel: "لندینگ",
    description: "صفحهٔ فرود آکادمی با ثبت‌نام و برنامهٔ کلاس‌ها",
    demoHost: "academy.demo-kodology.ir",
  },
  {
    id: "ecommerce",
    label: "فروشگاه پوشاک",
    shortLabel: "فروشگاه",
    description: "ویترین پوشاک با فیلتر، سبد خرید و پیشنهادها",
    demoHost: "shop.demo-kodology.ir",
  },
  {
    id: "clinic",
    label: "سامانه نوبت‌دهی کلینیک",
    shortLabel: "کلینیک",
    description: "رزرو نوبت چهار مرحله‌ای با تقویم شمسی",
    demoHost: "clinic.demo-kodology.ir",
  },
  {
    id: "dashboard",
    label: "داشبورد داده و آمار",
    shortLabel: "داشبورد",
    description: "شاخص‌ها، نمودارها، جدول سفارش و سلامت سیستم",
    demoHost: "insight.demo-kodology.ir",
  },
  {
    id: "components",
    label: "کامپوننت‌ها و ویجت‌ها",
    shortLabel: "کامپوننت",
    description: "گالری فرم‌ها، بازخورد، جدول و نمودارها",
    demoHost: "ui.demo-kodology.ir",
  },
];

/**
 * Fixed glyph per scenario. Shared by the studio header tabs and the preview
 * window chrome so the frame never follows the sidebar's icon-library setting.
 */
export const ARCHETYPE_ICONS: Record<ArchetypeId, LucideIcon> = {
  components: LayoutGrid,
  landing: PanelsTopLeft,
  ecommerce: ShoppingBag,
  clinic: Stethoscope,
  dashboard: ChartLine,
};

export const STYLE_GROUPS: StyleGroup[] = [
  {
    id: "modern",
    label: "مدرن و شرکتی",
    caption: "خوانا، منظم، قابل اعتماد",
  },
  {
    id: "technical",
    label: "دیجیتال و تکنیکال",
    caption: "داده، خط، مونو",
  },
  {
    id: "expressive",
    label: "بیان‌گرا و آزمایشی",
    caption: "رنگ، بافت، شخصیت",
  },
];

export const STYLES: StyleOption[] = [
  {
    id: "nova",
    label: "نووا مدرن",
    description: "چاپ گرم، خط مرکب و سایهٔ آفست",
    font: "vazir",
    group: "modern",
  },
  {
    id: "corporate",
    label: "شرکتی رادیال",
    description: "سطح روشن، قوس فیروزه‌ای، گوشهٔ نرم",
    font: "samim",
    group: "modern",
  },
  {
    id: "editorial",
    label: "ادیتوریال مینیمال",
    description: "کاغذ گرم، خط مو و فاصلهٔ زیاد",
    font: "samim",
    group: "modern",
  },
  {
    id: "swiss",
    label: "سازمانی سوییسی",
    description: "شبکهٔ دقیق، صفر گردی، یک لهجهٔ رنگی",
    font: "samim",
    group: "modern",
  },
  {
    id: "blueprint",
    label: "نقشهٔ مهندسی",
    description: "کاغذ آبی، خط سفید، برچسب مونو",
    font: "vazir",
    group: "technical",
  },
  {
    id: "terminal",
    label: "ترمینال تکنیکال",
    description: "CRT سبز، اسکن‌لاین، اعداد مونو",
    font: "vazir",
    group: "technical",
  },
  {
    id: "glass",
    label: "گلَس نئونی",
    description: "پنل شفاف، هالهٔ فیروزه‌ای، گوشهٔ بزرگ",
    font: "dirooz",
    group: "technical",
  },
  {
    id: "edtech",
    label: "آموزشی بازی‌وار",
    description: "نارنجی و بنفش، گوشهٔ بزرگ، نشان پیشرفت",
    font: "gandom",
    group: "expressive",
  },
  {
    id: "terracotta",
    label: "سفال مدیترانه",
    description: "خاک رس، قوس معماری، بافت گچ",
    font: "gandom",
    group: "expressive",
  },
  {
    id: "zine",
    label: "کلاژ کاغذی",
    description: "کاغذ کرم، برش خط‌چین، تیتر دست‌نویس",
    font: "vazir",
    group: "expressive",
  },
  {
    id: "memphis",
    label: "ممفیس",
    description: "رنگ متضاد، خط سه‌پیکسلی، چرخش بازیگوش",
    font: "dirooz",
    group: "expressive",
  },
  {
    id: "manga",
    label: "کمیک مانگا",
    description: "سیاه‌وسفید، پنل مورب، اسکرین‌تون",
    font: "vazir",
    group: "expressive",
  },
  {
    id: "steampunk",
    label: "استیم‌پانک نجومی",
    description: "برنج و مس، قاب دوتایی، آسمان ستاره‌ای",
    font: "vazir",
    group: "expressive",
  },
];

/** Body face each style wants when it is picked (still overridable). */
export const STYLE_FONTS: Record<StyleId, FontId> = STYLES.reduce(
  (accumulator, style) => {
    accumulator[style.id] = style.font;
    return accumulator;
  },
  {} as Record<StyleId, FontId>,
);

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
  { id: "google", label: "نمادهای گوگل", note: "Material" },
  { id: "lucide", label: "لوسید آیکون", note: "Lucide" },
  { id: "tabler", label: "تب‌لر آیکون", note: "Tabler" },
];

/** Icon size steps; the value is a multiplier on top of each call site's size. */
export const ICON_SIZES: IconSizeOption[] = [
  { id: "sm", label: "کوچک", scale: 0.85 },
  { id: "md", label: "معمولی", scale: 1 },
  { id: "lg", label: "بزرگ", scale: 1.25 },
];

/** Stroke weight for line icons; filled Material glyphs ignore it. */
export const ICON_WEIGHTS: IconWeightOption[] = [
  { id: "light", label: "نازک", stroke: 1.5 },
  { id: "regular", label: "معمولی", stroke: 2 },
  { id: "bold", label: "ضخیم", stroke: 2.75 },
];

/** Colour roles for icons, all routed through the active style's tokens. */
export const ICON_TONES: IconToneOption[] = [
  { id: "inherit", label: "متن", color: "currentColor" },
  { id: "primary", label: "برند", color: "var(--cc-primary)" },
  { id: "accent", label: "تأکید", color: "var(--cc-accent)" },
  { id: "muted", label: "ملایم", color: "var(--cc-muted-foreground)" },
];

export const DEFAULT_ICON_STYLE: IconStyle = {
  size: "md",
  weight: "regular",
  tone: "inherit",
};

/** Flatten the three picker ids into the theme tokens the canvas consumes. */
export function resolveIconStyle(style: IconStyle): {
  scale: number;
  stroke: number;
  color: string;
} {
  return {
    scale:
      (ICON_SIZES.find((option) => option.id === style.size) ?? ICON_SIZES[1])
        .scale,
    stroke:
      (
        ICON_WEIGHTS.find((option) => option.id === style.weight) ??
        ICON_WEIGHTS[1]
      ).stroke,
    color:
      (ICON_TONES.find((option) => option.id === style.tone) ?? ICON_TONES[0])
        .color,
  };
}

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

export function buildThemeSnippet(input: {
  palette: StudioPalette;
  radius: number;
  style: StyleId;
  fontStack: string;
  iconStyle?: IconStyle;
}): string {
  const preset = createThemePresets[input.style];
  const shadow = preset.tokens.shadow ?? "none";
  const icons = resolveIconStyle(input.iconStyle ?? DEFAULT_ICON_STYLE);

  // Same layering as the canvas: roles always apply, neutrals and chart
  // overrides only when the visitor edited them.
  const theme = resolveTheme(input.style, {
    ...paletteThemeOverrides(input.palette, input.style),
    radius: input.radius,
    fontFamily: input.fontStack,
    iconScale: icons.scale,
    iconStroke: icons.stroke,
    iconColor: icons.color,
  });
  const primary = theme.primary;
  const primarySubtle = theme.secondary;

  const vars = Object.entries(themeToCssVars(theme))
    .map(([token, value]) => `  ${token}: ${value};`)
    .join("\n");

  return `/* استودیو کُدولوژی // ${input.style} theme (Tailwind CSS v4) */
@import "tailwindcss";

@theme {
  --color-primary: ${primary};
  --color-primary-subtle: ${primarySubtle};
  --color-accent: ${theme.accent};
  --color-success: ${theme.success};
  --color-warning: ${theme.warning};
  --color-danger: ${theme.danger};
  --radius-craft: ${input.radius}px;
  --font-craft: ${input.fontStack};
  --shadow-craft: ${shadow};
}

:root {
  --primary: ${primary};
  --primary-subtle: ${primarySubtle};
  --radius: ${input.radius}px;
  --preset-style: "${input.style}";
  --font-family: ${input.fontStack};
  --box-shadow-offset: ${shadow};

  /* create-components design language */
${vars}
}`;
}
