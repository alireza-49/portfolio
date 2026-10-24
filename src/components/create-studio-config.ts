import {
  ChartLine,
  LayoutGrid,
  PanelsTopLeft,
  ShoppingBag,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { themeToCssVars, type CreateComponentTheme } from "./create-components/theme";
import type { IconLibraryId } from "./create-components/icon-set";
import { resolveTheme } from "./create-components/style-presets";
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
  | "corporate"
  | "nova"
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

/** Elevation presets the sidebar can pin over the active style. */
export type ShadowId = "none" | "soft" | "raised" | "hard" | "glow";
/** `style` keeps the active preset's own shadow signature. */
export type ShadowChoice = ShadowId | "style";

export type ShadowOption = {
  id: ShadowId;
  label: string;
  caption: string;
  /** Resting shadow, written against `--cc-*` tokens so every preset re-skins. */
  shadow: string;
  shadowHover: string;
};
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
    label: "المان‌های خام",
    shortLabel: "المان‌ها",
    description: "کاتالوگ تایپوگرافی، فرم، بازخورد، داده و زمان‌بندی",
    demoHost: "elements.demo-kodology.ir",
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

/**
 * Picker order: the sidebar renders this array group by group, so the first
 * entry is the first tile a visitor sees. `corporate` leads because it is also
 * the style `/create` opens with (see `DEFAULT_STUDIO_CONFIG`).
 */
export const STYLES: StyleOption[] = [
  {
    id: "corporate",
    label: "شرکتی رادیال",
    description: "سطح روشن، قوس فیروزه‌ای، گوشهٔ نرم",
    font: "samim",
    group: "modern",
  },
  {
    id: "nova",
    label: "نووا مدرن",
    description: "چاپ گرم، خط مرکب و سایهٔ آفست",
    font: "vazir",
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

/**
 * Shadow ink: the text colour pulled toward the page tone, so one elevation
 * list works on paper-light and dark presets alike. Never a raw hex — the
 * palette editor repaints it with the rest of the theme.
 */
const SHADOW_INK =
  "color-mix(in srgb, var(--cc-surface-foreground) 55%, var(--cc-background))";

/**
 * Box-shadow presets. Every value stays inside the token layer, which means
 * the exported snippet and the canvas always agree and a palette edit
 * re-tints the elevation instead of leaving a stale black.
 */
export const SHADOWS: ShadowOption[] = [
  {
    id: "none",
    label: "بدون سایه",
    caption: "صاف",
    shadow: "none",
    shadowHover: "none",
  },
  {
    id: "soft",
    label: "نرم",
    caption: "ملایم",
    shadow: `0 1px 2px 0 color-mix(in srgb, ${SHADOW_INK} 22%, transparent)`,
    shadowHover: `0 8px 18px -8px color-mix(in srgb, ${SHADOW_INK} 40%, transparent)`,
  },
  {
    id: "raised",
    label: "برجسته",
    caption: "شناور",
    shadow: `0 12px 28px -18px color-mix(in srgb, ${SHADOW_INK} 55%, transparent)`,
    shadowHover: `0 18px 34px -16px color-mix(in srgb, ${SHADOW_INK} 65%, transparent)`,
  },
  {
    id: "hard",
    label: "چاپی",
    caption: "آفست سخت",
    shadow: `4px 4px 0 0 ${SHADOW_INK}`,
    shadowHover: `2px 2px 0 0 ${SHADOW_INK}`,
  },
  {
    id: "glow",
    label: "هاله",
    caption: "رنگ برند",
    shadow:
      "0 0 0 1px color-mix(in srgb, var(--cc-primary) 32%, transparent), 0 0 24px -6px color-mix(in srgb, var(--cc-primary) 55%, transparent)",
    shadowHover:
      "0 0 0 1px color-mix(in srgb, var(--cc-primary) 45%, transparent), 0 0 30px -4px color-mix(in srgb, var(--cc-primary) 68%, transparent)",
  },
];

export const DEFAULT_SHADOW: ShadowChoice = "style";

/**
 * Theme overrides for the chosen elevation. `style` returns an empty object so
 * the preset keeps owning its own shadow signature.
 */
export function shadowOverrides(
  choice: ShadowChoice,
): Partial<Pick<CreateComponentTheme, "shadow" | "shadowHover">> {
  const option = SHADOWS.find((item) => item.id === choice);
  return option ? { shadow: option.shadow, shadowHover: option.shadowHover } : {};
}

/**
 * Sidebar swatches sit outside the preset's `--cc-*` scope, so they swap the
 * token references for the colours resolved from the active palette.
 */
export function resolveShadowCss(
  value: string,
  tokens: { ink: string; background: string; primary: string },
): string {
  return value
    .split("var(--cc-surface-foreground)")
    .join(tokens.ink)
    .split("var(--cc-background)")
    .join(tokens.background)
    .split("var(--cc-primary)")
    .join(tokens.primary);
}

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

export type StudioThemeInput = {
  palette: StudioPalette;
  radius: number;
  style: StyleId;
  fontStack: string;
  iconStyle?: IconStyle;
  /** Elevation override; `style` keeps the preset's own shadow. */
  shadow?: ShadowChoice;
};

/**
 * The resolved theme shared by the canvas, the exported CSS and the hand-off
 * payload. Keeping one builder means the token map a visitor exports can never
 * drift from the snippet it is pasted next to.
 */
export function buildStudioTheme(
  input: StudioThemeInput,
): CreateComponentTheme {
  const icons = resolveIconStyle(input.iconStyle ?? DEFAULT_ICON_STYLE);

  // Same layering as the canvas: roles always apply, neutrals and chart
  // overrides only when the visitor edited them.
  return resolveTheme(input.style, {
    ...paletteThemeOverrides(input.palette, input.style),
    radius: input.radius,
    fontFamily: input.fontStack,
    iconScale: icons.scale,
    iconStroke: icons.stroke,
    iconColor: icons.color,
    ...shadowOverrides(input.shadow ?? DEFAULT_SHADOW),
  });
}

export function buildThemeSnippet(input: StudioThemeInput): string {
  const theme = buildStudioTheme(input);
  const primary = theme.primary;
  const primarySubtle = theme.secondary;
  const shadow = theme.shadow || "none";

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
