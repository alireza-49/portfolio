import type { IconName } from "@/components/create-components";

/**
 * The dashboard is a real multi-page app inside the preview canvas: the rail
 * switches one page at a time instead of scrolling a long document. This file
 * is the single source for the rail, the page header and the breadcrumb, so a
 * new page means one entry here plus its component.
 */
export type DashboardPageId =
  | "overview"
  | "sales"
  | "customers"
  | "billing"
  | "infra"
  | "settings";

export type DashboardPageMeta = {
  id: DashboardPageId;
  label: string;
  eyebrow: string;
  description: string;
  icon: IconName;
  /** Decorative route printed in the breadcrumb; the canvas never changes the URL. */
  path: string;
};

export const OVERVIEW_PAGE: DashboardPageMeta = {
  id: "overview",
  label: "نمای کلی",
  eyebrow: "خلاصهٔ دوره",
  description:
    "شاخص‌های اصلی، هشدارهای باز و روند درآمد در برابر دورهٔ قبل؛ همه با یک بازه و یک منبع داده.",
  icon: "dashboard",
  path: "/",
};

export const SALES_PAGE: DashboardPageMeta = {
  id: "sales",
  label: "فروش",
  eyebrow: "قیف و کانال",
  description:
    "از بازدید محصول تا خرید دوم، به‌همراه ترکیب درآمد بر اساس پلن و کانال جذب.",
  icon: "shopping-bag",
  path: "/sales",
};

export const CUSTOMERS_PAGE: DashboardPageMeta = {
  id: "customers",
  label: "مشتریان",
  eyebrow: "رفتار کاربر",
  description: "کی می‌آیند، کجا وقت می‌گذارند و چقدر راضی برمی‌گردند.",
  icon: "users",
  path: "/customers",
};

export const BILLING_PAGE: DashboardPageMeta = {
  id: "billing",
  label: "پرداخت‌ها",
  eyebrow: "پرداخت و سفارش",
  description:
    "جدول سفارش‌ها با جست‌وجو، فیلتر وضعیت، مرتب‌سازی، انتخاب گروهی و خروجی CSV.",
  icon: "credit-card",
  path: "/payments",
};

export const INFRA_PAGE: DashboardPageMeta = {
  id: "infra",
  label: "زیرساخت",
  eyebrow: "عملیات",
  description: "آپ‌تایم سرویس‌ها، مصرف نودها و رویدادهای تیم در یک نگاه.",
  icon: "boxes",
  path: "/infra",
};

export const SETTINGS_PAGE: DashboardPageMeta = {
  id: "settings",
  label: "تنظیمات",
  eyebrow: "پیکربندی",
  description: "گزینه‌هایی که واقعاً روی همین داشبورد اثر می‌گذارند — نه یک فرم تزئینی.",
  icon: "settings",
  path: "/settings",
};

/** Rail order — this array is the page sequence and the breadcrumb source. */
export const DASHBOARD_PAGES: DashboardPageMeta[] = [
  OVERVIEW_PAGE,
  SALES_PAGE,
  CUSTOMERS_PAGE,
  BILLING_PAGE,
  INFRA_PAGE,
  SETTINGS_PAGE,
];
