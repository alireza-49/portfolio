/**
 * Content model for the analytics dashboard scenario.
 *
 * Every series is generated from a deterministic hash so server and client
 * render identical charts (no `Math.random`, no effects).
 */

import { formatNumber } from "../format";

export type RangeId = "7d" | "30d" | "12m";

export const RANGES: { id: RangeId; label: string }[] = [
  { id: "7d", label: "۷ روز" },
  { id: "30d", label: "۳۰ روز" },
  { id: "12m", label: "۱۲ ماه" },
];

function hash(seed: string): number {
  let value = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return Math.abs(value);
}

/** Deterministic 0..1 noise for a key. */
const noise = (seed: string) => (hash(seed) % 1000) / 1000;

export type DashboardRange = {
  id: RangeId;
  label: string;
  revenue: {
    label: string;
    revenue: number;
    previous: number;
    orders: number;
  }[];
  /**
   * Period-level comparison block. Revenue and order totals are summed from the
   * rows above, so only the figures that cannot be derived live here — every
   * KPI delta on the canvas is computed from this block.
   */
  summary: {
    visitors: number;
    conversion: number;
    previousConversion: number;
    churn: number;
    previousChurn: number;
    previousOrders: number;
  };
};

const LABELS: Record<RangeId, string[]> = {
  "7d": ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"],
  "30d": ["هفتهٔ ۱", "هفتهٔ ۲", "هفتهٔ ۳", "هفتهٔ ۴", "هفتهٔ ۵", "هفتهٔ ۶"],
  "12m": [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ],
};

export const DASHBOARD_RANGES: Record<RangeId, DashboardRange> = {
  "7d": {
    id: "7d",
    label: "۷ روز گذشته",
    revenue: LABELS["7d"].map((label, index) => {
      const base = 42 + noise(`rev-7-${index}`) * 22 + index * 2.4;
      return {
        label,
        revenue: Math.round(base),
        previous: Math.round(base * (0.72 + noise(`prev-7-${index}`) * 0.2)),
        orders: Math.round(120 + noise(`ord-7-${index}`) * 90),
      };
    }),
    summary: {
      visitors: 18240,
      conversion: 3.8,
      previousConversion: 4.2,
      churn: 4.1,
      previousChurn: 4.6,
      previousOrders: 1035,
    },
  },
  "30d": {
    id: "30d",
    label: "۳۰ روز گذشته",
    revenue: LABELS["30d"].map((label, index) => {
      const base = 260 + noise(`rev-30-${index}`) * 120 + index * 14;
      return {
        label,
        revenue: Math.round(base),
        previous: Math.round(base * (0.68 + noise(`prev-30-${index}`) * 0.22)),
        orders: Math.round(620 + noise(`ord-30-${index}`) * 380),
      };
    }),
    summary: {
      visitors: 76200,
      conversion: 4.1,
      previousConversion: 3.9,
      churn: 3.8,
      previousChurn: 4.0,
      previousOrders: 4620,
    },
  },
  "12m": {
    id: "12m",
    label: "۱۲ ماه گذشته",
    revenue: LABELS["12m"].map((label, index) => {
      const seasonal = 1 + Math.sin((index / 12) * Math.PI * 2) * 0.16;
      const base =
        (310 + noise(`rev-12-${index}`) * 150 + index * 26) * seasonal;
      return {
        label,
        revenue: Math.round(base),
        previous: Math.round(base * (0.7 + noise(`prev-12-${index}`) * 0.18)),
        orders: Math.round(880 + noise(`ord-12-${index}`) * 620 + index * 30),
      };
    }),
    summary: {
      visitors: 268400,
      conversion: 4.4,
      previousConversion: 3.6,
      churn: 3.4,
      previousChurn: 4.1,
      previousOrders: 14740,
    },
  },
};

export const TRAFFIC_SOURCES = [
  { label: "جست‌وجوی ارگانیک", value: 42180 },
  { label: "کمپین ایمیلی", value: 18420 },
  { label: "شبکه‌های اجتماعی", value: 12960 },
  { label: "ارجاع مستقیم", value: 8420 },
  { label: "تبلیغات کلیکی", value: 4310 },
];

export const CHANNELS = [
  { key: "organic", label: "ارگانیک" },
  { key: "paid", label: "تبلیغات" },
  { key: "email", label: "ایمیل" },
] as const;

export const SIGNUP_WEEKS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
].map((label, index) => ({
  label,
  organic: Math.round(180 + noise(`sig-o-${index}`) * 160),
  paid: Math.round(90 + noise(`sig-p-${index}`) * 120),
  email: Math.round(40 + noise(`sig-e-${index}`) * 90),
}));

export const HEATMAP_HOURS = ["۸", "۱۰", "۱۲", "۱۴", "۱۶", "۱۸", "۲۰", "۲۲"];
export const HEATMAP_DAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

export const HEATMAP_CELLS = HEATMAP_DAYS.flatMap((day, dayIndex) =>
  HEATMAP_HOURS.map((hour, hourIndex) => {
    const peak = 1 - Math.abs(hourIndex - 4.2) / 6;
    const raw =
      peak *
      (0.55 + noise(`heat-${dayIndex}-${hourIndex}`) * 0.45) *
      (dayIndex === 6 ? 0.42 : 1);
    return {
      row: day,
      column: hour,
      intensity: Math.max(0.04, Math.min(1, raw)),
      label: `${day} ساعت ${hour} — ${formatNumber(Math.round(raw * 180))} بازدید`,
    };
  }),
);

export const FUNNEL_STAGES = [
  { label: "بازدید صفحهٔ محصول", value: 18420, note: "۱۰۰٪" },
  { label: "افزودن به سبد", value: 6240, note: "۳۴٪" },
  { label: "شروع پرداخت", value: 2810, note: "۴۵٪" },
  { label: "پرداخت موفق", value: 1920, note: "۶۸٪" },
  { label: "خرید دوم", value: 640, note: "۳۳٪" },
];

export type OrderStatus = "پرداخت‌شده" | "در انتظار" | "لغوشده" | "ارسال‌شده";

export type DashboardOrder = {
  id: string;
  customer: string;
  city: string;
  plan: string;
  amount: number;
  status: OrderStatus;
  channel: string;
  date: string;
};

const STATUS_TONES: Record<
  OrderStatus,
  "success" | "warning" | "danger" | "soft"
> = {
  "پرداخت‌شده": "success",
  "در انتظار": "warning",
  "لغوشده": "danger",
  "ارسال‌شده": "soft",
};

export const statusTone = (status: OrderStatus) => STATUS_TONES[status];

const CUSTOMER_NAMES = [
  "آرمان رضایی",
  "سارا محمدی",
  "کیان صادقی",
  "نگار احمدی",
  "پویا کریمی",
  "هستی موسوی",
  "سامان نوری",
  "مریم شفیعی",
  "بابک تهرانی",
  "آیدا حیدری",
  "رضا دلاور",
  "شیدا بابایی",
  "امید کاشانی",
  "لیلا فرجی",
  "طاها سلطانی",
  "رها امینی",
];

const CITIES = ["تهران", "اصفهان", "شیراز", "تبریز", "مشهد", "رشت", "کرج"];
const PLANS = ["اشتراک سالانه", "اشتراک ماهانه", "بستهٔ سازمانی", "خرید تک‌نوبت"];
export const ORDER_STATUSES: OrderStatus[] = [
  "پرداخت‌شده",
  "ارسال‌شده",
  "در انتظار",
  "لغوشده",
];
const CHANNEL_NAMES = ["وب", "اپلیکیشن", "تلفن", "اینستاگرام"];

export const ORDERS: DashboardOrder[] = CUSTOMER_NAMES.map((customer, index) => ({
  id: `AT-${2400 + index * 3}`,
  customer,
  city: CITIES[index % CITIES.length],
  plan: PLANS[index % PLANS.length],
  amount: 240000 + Math.round(noise(`amt-${index}`) * 46) * 100000,
  status: ORDER_STATUSES[index % ORDER_STATUSES.length],
  channel: CHANNEL_NAMES[index % CHANNEL_NAMES.length],
  date: `۱۴۰۵/۰${(index % 7) + 1}/۰${(index % 9) + 1}`,
}));

/**
 * Revenue split by subscription plan, derived from `ORDERS` so the billing
 * donut can never disagree with the table underneath it.
 */
export const PLAN_MIX = PLANS.map((plan) => ({
  label: plan,
  value: ORDERS.filter((order) => order.plan === plan).reduce(
    (sum, order) => sum + order.amount,
    0,
  ),
}));

export const TOP_PAGES = [
  { path: "/pricing", visits: 8420, share: 82, trend: 12 },
  { path: "/blog/scaling-react", visits: 6180, share: 64, trend: 28 },
  { path: "/docs/getting-started", visits: 4920, share: 48, trend: -6 },
  { path: "/changelog", visits: 3240, share: 32, trend: 9 },
  { path: "/case-studies", visits: 2110, share: 22, trend: 41 },
];

export const GAUGES = {
  monthlyGoal: {
    value: 78,
    label: "۷۸٪",
    hint: "هدف ماهانه",
    footnote: "۴٬۷۸۰ از ۶٬۱۰۰ میلیون",
  },
  satisfaction: {
    value: 92,
    label: "۴.۶",
    hint: "رضایت مشتری",
    footnote: "از ۱٬۲۴۰ نظرسنجی",
  },
};

export const ALERTS = [
  {
    title: "افزایش خطای ۵۰۰ روی سرویس پرداخت",
    detail: "۲.۴٪ در ۱۵ دقیقهٔ گذشته — تیم زیرساخت در حال بررسی است.",
    tone: "danger" as const,
    time: "۲ دقیقه پیش",
  },
  {
    title: "کمپین بهاره به سقف بودجه رسید",
    detail: "هزینهٔ کلیک ۱۸٪ بیشتر از هدف؛ پیشنهاد توقف موقت کمپین.",
    tone: "warning" as const,
    time: "۲۴ دقیقه پیش",
  },
  {
    title: "نود فرانکفورت به ظرفیت ۸۵٪ رسید",
    detail: "افزایش خودکار نمونهٔ جدید در صف اجرا قرار گرفت.",
    tone: "info" as const,
    time: "۱ ساعت پیش",
  },
];

export const ACTIVITY = [
  {
    title: "استقرار نسخهٔ ۲.۱۴.۰",
    description: "نمودارهای داشبورد و API گزارش‌ها به‌روزرسانی شد.",
    meta: "۰۹:۴۲",
    tone: "success" as const,
  },
  {
    title: "اتصال درگاه پرداخت دوم",
    description: "درگاه جدید با موفقیت در محیط آزمایشی تست شد.",
    meta: "۰۸:۱۵",
    tone: "primary" as const,
  },
  {
    title: "بازبینی دسترسی‌ها",
    description: "دو نقش قدیمی حذف و دسترسی گزارش‌ها محدود شد.",
    meta: "دیروز",
    tone: "muted" as const,
  },
  {
    title: "هشدار مصرف بودجهٔ ابری",
    description: "مصرف این ماه ۱۲٪ بیشتر از میانگین سه ماه گذشته است.",
    meta: "۲ روز پیش",
    tone: "warning" as const,
  },
];

export const SYSTEM_HEALTH = [
  { name: "API اصلی", uptime: 99.98, latency: 182, status: "پایدار" },
  { name: "پردازش صف", uptime: 99.86, latency: 341, status: "پایدار" },
  { name: "ذخیره‌سازی", uptime: 99.99, latency: 62, status: "پایدار" },
  { name: "سرویس پرداخت", uptime: 98.42, latency: 512, status: "هشدار" },
];

export const NODES = [
  { name: "Fra-1 · فرانکفورت", load: 62, region: "EU" },
  { name: "Ist-2 · استانبول", load: 48, region: "TR" },
  { name: "Thr-1 · تهران", load: 85, region: "IR" },
  { name: "Dub-1 · دبی", load: 34, region: "AE" },
];

export const KPI_SERIES = {
  revenue: [24, 28, 26, 34, 31, 39, 44, 42, 49],
  users: [12, 15, 14, 19, 22, 21, 26, 29, 32],
  conversion: [3.2, 3.4, 3.1, 3.8, 3.6, 4.0, 3.9, 4.2, 4.4],
  churn: [5.2, 4.9, 5.1, 4.6, 4.4, 4.2, 4.5, 4.1, 3.8],
};

/** Seeded jitter used by the "refresh" button — deterministic per tick. */
export function jitter(base: number, tick: number, spread = 0.06): number {
  const delta = noise(`tick-${tick}-${base}`) * 2 - 1;
  return Math.round(base * (1 + delta * spread));
}

