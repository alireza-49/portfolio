"use client";

import { useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Bolt,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coffee,
  Cookie,
  Croissant,
  Handshake,
  LayoutDashboard,
  ShieldCheck,
  SlidersHorizontal,
  Stethoscope,
} from "lucide-react";
import type { ArchetypeId, StyleId } from "@/components/create-studio-config";

type CanvasProps = {
  archetype: ArchetypeId;
  primary: string;
  primarySubtle: string;
  radius: number;
  styleId: StyleId;
};

type ViewProps = {
  primary: string;
  primarySubtle: string;
  radius: number;
  itemStyle: CSSProperties;
  accentStyle: CSSProperties;
  accentText: CSSProperties;
};

const LANDING_FEATURES = [
  {
    icon: Bolt,
    title: "کد سبک و بهینه‌سازی شده",
    body: "بدون کتابخانه‌های حجیم جانبی؛ خالص‌ترین کد ممکن با بالاترین سرعت رندر.",
    tone: "text-coral",
  },
  {
    icon: ShieldCheck,
    title: "امنیت و پایداری سازمانی",
    body: "رعایت آخرین استانداردهای OWASP و ایزولاسیون کامل کامپوننت‌های فرانت‌اند.",
    tone: "text-indigo-ink",
  },
  {
    icon: Handshake,
    title: "پشتیبانی کارگاهی مستقیم",
    body: "ارتباط بدون واسطه با مهندس طراح و برنامه‌نویس اصلی در تمام فازها.",
    tone: "text-teal-craft",
  },
];

const PRODUCTS = [
  {
    icon: Croissant,
    title: "نان سوخاری چاودار روستیک",
    body: "آرد سبوس‌دار سنگک، بدون مخمر صنعتی و سرشار از فیبر",
    price: "۶۸,۰۰۰ تومان",
    badge: "داغ و تازه",
    note: "تخمیر طولانی ۴۸ ساعته",
    tone: "text-coral",
  },
  {
    icon: Coffee,
    title: "دانه قهوه تخصصی ۲۵۰ گرمی",
    body: "اسیدیته گلی مرکباتی، نوت‌های یاسمن و برشته‌کاری ملایم",
    price: "۳۴۰,۰۰۰ تومان",
    badge: "اتیوپی یرگاچف",
    note: "رست تازه تخصصی",
    tone: "text-indigo-ink",
  },
  {
    icon: Cookie,
    title: "کوکی شکلات دست‌ساز بلژیکی",
    body: "تکه‌های شکلات تلخ ۷۴ درصد با دانه‌های نمک دریا مالدون",
    price: "۴۵,۰۰۰ تومان",
    badge: null,
    note: "دست‌پخت روز",
    tone: "text-teal-craft",
  },
];

const STATS = [
  { label: "کاربران همزمان", value: "۱,۸۴۲", note: "+۱۲٪ نسبت به دیروز" },
  { label: "میانگین لتنسی سرور", value: "۱۸ ms", note: "عملکرد عالی" },
  { label: "نرخ کشینگ لبه (Edge)", value: "۹۹.۴٪", note: "بهینه شده" },
  { label: "خطاهای ۵۰۰ (Error)", value: "۰.۰۰٪", note: "بدون خطا" },
];

const NODES = [
  { name: "نود فرانکفورت (EU-Central)", load: "لود مصرفی: ۳۲٪ | ۲.۴ GB" },
  { name: "نود استانبول (TR-Edge)", load: "لود مصرفی: ۴۱٪ | ۳.۱ GB" },
  { name: "نود تهران (IR-Tehran IXP)", load: "لود مصرفی: ۵۵٪ | ۴.۸ GB" },
];

const CHART_BARS = [
  { x: 25, height: 55, y: 55, label: "آذر", accent: false },
  { x: 95, height: 75, y: 35, label: "دی", accent: false },
  { x: 165, height: 95, y: 15, label: "بهمن", accent: true },
  { x: 235, height: 70, y: 40, label: "اسفند", accent: false },
  { x: 305, height: 102, y: 8, label: "فروردین", accent: true },
  { x: 375, height: 60, y: 50, label: "اردیبهشت", accent: false },
];

export function CreateStudioCanvas({
  archetype,
  primary,
  primarySubtle,
  radius,
  styleId,
}: CanvasProps) {
  const itemStyle: CSSProperties = { borderRadius: radius };
  const accentStyle: CSSProperties = {
    backgroundColor: primary,
    color: "#ffffff",
    borderRadius: radius,
  };
  const accentText: CSSProperties = { color: primary };
  const artboardShadow =
    styleId === "brutalist"
      ? "6px 6px 0 0 #264653"
      : "4px 4px 0 0 #264653";

  const viewProps: ViewProps = {
    primary,
    primarySubtle,
    radius,
    itemStyle,
    accentStyle,
    accentText,
  };

  return (
    <section className="dot-grid order-2 flex w-full flex-col gap-4 overflow-x-hidden bg-paper-shade p-4 sm:p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:p-8">
      <div
        className="paper-pattern relative min-h-[640px] w-full overflow-hidden rounded-sm border-2 border-indigo-ink bg-paper transition-all"
        style={{ boxShadow: artboardShadow }}
      >
        <div className="flex w-full select-none items-center justify-between border-b-2 border-indigo-ink bg-paper-dim px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full border border-indigo-ink bg-coral" />
              <span className="size-3 rounded-full border border-indigo-ink bg-mustard" />
              <span className="size-3 rounded-full border border-indigo-ink bg-teal-craft" />
            </div>
            <span className="mx-1 h-4 w-px bg-indigo-ink/20" />
            <div className="flex items-center gap-1.5 text-xs font-black text-indigo-ink">
              <LayoutDashboard className="size-4 text-coral" />
              <span>میز کارگاه زنده // Live Artboard Canvas</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-sm border border-indigo-ink bg-paper-light px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-ink shadow-craft-sm">
              VIEWPORT: 100%
            </span>
            <span className="flex items-center gap-1 rounded-sm border border-indigo-ink bg-indigo-ink px-2 py-0.5 font-mono text-[10px] font-bold text-paper">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              CANVAS OK
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-5 sm:p-7">
          {archetype === "components" ? (
            <ComponentsView {...viewProps} />
          ) : null}
          {archetype === "landing" ? <LandingView {...viewProps} /> : null}
          {archetype === "ecommerce" ? (
            <EcommerceView {...viewProps} />
          ) : null}
          {archetype === "clinic" ? <ClinicView {...viewProps} /> : null}
          {archetype === "dashboard" ? (
            <DashboardView {...viewProps} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ComponentsView({
  primary,
  radius,
  itemStyle,
  accentStyle,
  accentText,
}: ViewProps) {
  const [threshold, setThreshold] = useState(2500);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
      <div
        className="flex flex-col justify-between gap-4 border border-indigo-ink bg-paper-light p-5 shadow-craft md:col-span-7"
        style={itemStyle}
      >
        <div className="flex items-start justify-between">
          <div>
            <span
              className="mb-1 block font-mono text-xs font-bold"
              style={accentText}
            >
              METRICS &amp; REVENUE // 2025
            </span>
            <h3 className="text-base font-black text-indigo-ink">
              رشد ماهانه و درآمد کارگاه
            </h3>
            <p className="mt-0.5 text-xs text-indigo-light">
              شاخص تراکنش‌های ثبت‌شده از طراحی وب‌سایت‌های سفارشی
            </p>
          </div>
          <span className="rounded-sm border border-indigo-ink bg-paper-dim px-2 py-1 font-mono text-xs font-bold text-indigo-ink">
            +۲۴.۸٪ YoY
          </span>
        </div>

        <div
          className="w-full rounded-sm border border-indigo-ink bg-paper-dim p-3"
          style={itemStyle}
        >
          <svg className="h-32 w-full" fill="none" viewBox="0 0 420 130">
            <line
              stroke="rgba(38,70,83,0.12)"
              strokeDasharray="2,2"
              x1="0"
              x2="420"
              y1="25"
              y2="25"
            />
            <line
              stroke="rgba(38,70,83,0.12)"
              strokeDasharray="2,2"
              x1="0"
              x2="420"
              y1="65"
              y2="65"
            />
            <line
              stroke="rgba(38,70,83,0.12)"
              strokeDasharray="2,2"
              x1="0"
              x2="420"
              y1="105"
              y2="105"
            />
            {CHART_BARS.map((bar) => (
              <g key={bar.label}>
                <rect
                  fill={bar.accent ? primary : "#264653"}
                  height={bar.height}
                  rx="2"
                  width="36"
                  x={bar.x}
                  y={bar.y}
                />
                <text
                  className="fill-indigo-light font-mono text-[11px]"
                  textAnchor="middle"
                  x={bar.x + 18}
                  y="124"
                >
                  {bar.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex items-center justify-between border-t border-indigo-ink/15 pt-2 text-xs">
          <span className="text-indigo-light">
            میانگین سفارش هر پروژه:{" "}
            <b className="font-mono text-indigo-ink">$3,850</b>
          </span>
          <button
            type="button"
            className="flex items-center gap-1 font-bold"
            style={accentText}
          >
            مشاهده ریز گزارشات
            <ArrowLeft className="size-3.5" />
          </button>
        </div>
      </div>

      <div
        className="flex flex-col justify-between gap-4 border border-indigo-ink bg-paper-light p-5 shadow-craft md:col-span-5"
        style={itemStyle}
      >
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-indigo-ink">
              آستانه تسویه حساب
            </h3>
            <SlidersHorizontal className="size-[18px] text-indigo-light" />
          </div>
          <p className="mt-0.5 text-xs text-indigo-light">
            تعیین حداقل موجودی جهت واریز خودکار هفتگی
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-indigo-ink">
              ارز انتخابی تسویه
            </label>
            <div
              className="flex items-center justify-between rounded-sm border border-indigo-ink bg-paper-dim p-2 text-xs font-semibold text-indigo-ink"
              style={itemStyle}
            >
              <span>USD — دلار ایالات متحده</span>
              <ChevronDown className="size-4" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-indigo-light">مبلغ آستانه واریز:</span>
              <span className="font-mono text-sm font-black" style={accentText}>
                ${threshold.toLocaleString("en-US")}.00
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={100}
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
              className="h-2 w-full cursor-pointer rounded-lg border border-indigo-ink bg-paper-dim"
              style={{ accentColor: primary }}
            />
            <div className="flex justify-between font-mono text-[10px] text-indigo-light">
              <span>$500</span>
              <span>$10,000</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-full border border-indigo-ink py-2 text-center text-xs font-bold shadow-craft-sm transition-all active:translate-x-0.5 active:translate-y-0.5"
          style={accentStyle}
        >
          ذخیره تنظیمات تسویه
        </button>
      </div>

      <div
        className="flex flex-col gap-4 border border-indigo-ink bg-paper-light p-5 shadow-craft md:col-span-6"
        style={itemStyle}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-indigo-ink">
            فرم و کنترل‌های تعاملی Shadcn
          </h3>
          <span className="rounded-sm border border-indigo-ink bg-paper-dim px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-ink">
            ATOMIC UI
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-indigo-ink">
              نام مشتری یا سازمان
            </label>
            <input
              type="text"
              placeholder="مثال: شرکت راهکارهای ابری پیشرو"
              className="w-full rounded-sm border border-indigo-ink bg-paper-dim p-2.5 text-xs text-indigo-ink outline-none focus:ring-1 focus:ring-coral"
              style={itemStyle}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 border border-indigo-ink px-3 py-2 text-xs font-bold shadow-craft-sm"
              style={accentStyle}
            >
              <Check className="size-4" />
              دکمه اولیه (Primary)
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 border border-indigo-ink bg-paper-dim px-3 py-2 text-xs font-bold text-indigo-ink shadow-craft-sm hover:bg-paper-light"
              style={itemStyle}
            >
              دکمه ثانویه (Outline)
            </button>
          </div>
          <div
            className="flex items-center justify-between rounded-sm border border-indigo-ink bg-paper-dim p-2.5 text-xs"
            style={itemStyle}
          >
            <span className="font-bold text-indigo-ink">
              فعال‌سازی اطلاع‌رسانی پیامکی
            </span>
            <input
              type="checkbox"
              defaultChecked
              className="size-4"
              style={{ accentColor: primary }}
            />
          </div>
        </div>
      </div>

      <div
        className="flex flex-col justify-between gap-4 border border-indigo-ink bg-paper-light p-5 shadow-craft md:col-span-6"
        style={itemStyle}
      >
        <div>
          <h3 className="text-sm font-black text-indigo-ink">
            بج‌ها و هشدارهای ادیتوریال
          </h3>
          <p className="mt-0.5 text-xs text-indigo-light">
            وضعیت‌های مختلف سیستم همراه با استروک و بردر خطی
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className="border border-indigo-ink px-2.5 py-1 text-xs font-bold shadow-craft-sm"
            style={accentStyle}
          >
            تکمیل شده
          </span>
          <span
            className="border border-indigo-ink bg-indigo-ink px-2.5 py-1 text-xs font-bold text-paper shadow-craft-sm"
            style={itemStyle}
          >
            در حال پردازش
          </span>
          <span
            className="border border-indigo-ink bg-paper-dim px-2.5 py-1 text-xs font-bold text-indigo-ink"
            style={itemStyle}
          >
            بایگانی شده
          </span>
          <span
            className="border border-indigo-ink bg-teal-craft px-2.5 py-1 font-mono text-xs font-bold text-white"
            style={itemStyle}
          >
            v3.4.1 LIVE
          </span>
        </div>
        <div
          className="flex items-start gap-2.5 rounded-sm border border-indigo-ink bg-paper-dim p-3 text-xs"
          style={itemStyle}
        >
          <BadgeCheck className="size-[18px]" style={accentText} />
          <div>
            <span className="block font-bold text-indigo-ink">
              گارانتی تطابق ۱۰۰٪ ریسوگراف
            </span>
            <p className="mt-0.5 text-indigo-light">
              تمام مولفه‌های وب استاندارد با متغیرهای تم هماهنگ هستند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingView({
  primary,
  itemStyle,
  accentStyle,
}: ViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div
        className="flex flex-col items-center justify-between gap-6 border border-indigo-ink bg-paper-light p-6 shadow-craft sm:p-8 md:flex-row"
        style={itemStyle}
      >
        <div className="flex max-w-xl flex-col gap-3">
          <div
            className="inline-flex items-center gap-2 self-start rounded-sm border border-indigo-ink bg-paper-dim px-2.5 py-1 font-mono text-xs font-bold text-indigo-ink"
            style={itemStyle}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: primary }}
            />
            ARCHETYPE: SAAS &amp; STARTUP LANDING
          </div>
          <h2 className="text-xl leading-tight font-black text-indigo-ink sm:text-2xl">
            زیرساخت مدرن برای تیم‌های توسعه محصول دیجیتال با رویکرد بدون کالبد
          </h2>
          <p className="text-xs leading-relaxed text-indigo-light sm:text-sm">
            طراحی سفارشی فرانت‌اند با معماری بدون فریم‌ورک‌های سنگین، لایت‌هاوس
            ۱۰۰ و حس طبیعی چاپ ریسو بر صفحات نمایش.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              className="border border-indigo-ink px-4 py-2 text-xs font-bold shadow-craft-sm transition-all active:translate-x-0.5 active:translate-y-0.5"
              style={accentStyle}
            >
              شروع نسخه آزمایشی ۱۴ روزه
            </button>
            <button
              type="button"
              className="border border-indigo-ink bg-paper-dim px-4 py-2 text-xs font-bold text-indigo-ink transition-all hover:bg-paper-light"
              style={itemStyle}
            >
              مطالعه بنچمارک سرعت
            </button>
          </div>
        </div>

        <div
          className="flex w-full flex-col gap-3 rounded-sm border border-indigo-ink bg-paper-dim p-4 shadow-craft md:w-64"
          style={itemStyle}
        >
          <div className="flex items-center justify-between text-xs font-bold text-indigo-ink">
            <span>امتیاز عملکرد لایت‌هاوس</span>
            <span className="font-mono text-emerald-700">100/100</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full border border-indigo-ink bg-paper-light p-0.5">
            <div className="h-full w-full rounded-full bg-emerald-600" />
          </div>
          <div className="flex justify-between font-mono text-[11px] text-indigo-light">
            <span>FCP: 0.4s</span>
            <span>TTI: 0.7s</span>
            <span>CO2: 0.12g</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {LANDING_FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col gap-2 border border-indigo-ink bg-paper-light p-4 shadow-craft"
            style={itemStyle}
          >
            <div
              className="flex size-8 items-center justify-center rounded-sm border border-indigo-ink bg-paper-dim"
              style={itemStyle}
            >
              <feature.icon className={`size-[18px] ${feature.tone}`} />
            </div>
            <h4 className="text-sm font-bold text-indigo-ink">
              {feature.title}
            </h4>
            <p className="text-xs text-indigo-light">{feature.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EcommerceView({ itemStyle, accentStyle }: ViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-indigo-ink/20 pb-2">
        <div>
          <span className="font-mono text-xs font-bold text-coral">
            ARCHETYPE: ARTISANAL BAKERY &amp; COFFEE
          </span>
          <h3 className="text-base font-black text-indigo-ink">
            فروشگاه آنلاین کارگاهی نان تخمیر طبیعی و قهوه تخصصی
          </h3>
        </div>
        <span className="rounded-sm border border-indigo-ink bg-paper-light px-2.5 py-1 text-xs font-bold text-indigo-ink shadow-craft-sm">
          سبد خرید (۳ قلم)
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {PRODUCTS.map((product) => (
          <div
            key={product.title}
            className="flex flex-col justify-between gap-3 border border-indigo-ink bg-paper-light p-4 shadow-craft"
            style={itemStyle}
          >
            <div
              className="relative flex h-36 w-full flex-col items-center justify-center overflow-hidden rounded-sm border border-indigo-ink bg-paper-dim text-indigo-light"
              style={itemStyle}
            >
              <product.icon className={`size-[42px] ${product.tone}`} />
              <span className="mt-1 font-mono text-[11px] font-bold">
                {product.note}
              </span>
              {product.badge ? (
                <span className="absolute top-2 right-2 rounded-sm border border-indigo-ink bg-paper-light px-1.5 py-0.5 text-[10px] font-bold text-coral">
                  {product.badge}
                </span>
              ) : null}
            </div>
            <div>
              <h4 className="text-sm font-black text-indigo-ink">
                {product.title}
              </h4>
              <p className="mt-0.5 text-xs text-indigo-light">
                {product.body}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-indigo-ink/15 pt-2">
              <span className="font-mono text-sm font-black text-indigo-ink">
                {product.price}
              </span>
              <button
                type="button"
                className="border border-indigo-ink px-3 py-1.5 text-xs font-bold shadow-craft-sm transition-all active:translate-x-0.5 active:translate-y-0.5"
                style={accentStyle}
              >
                + افزودن به سبد
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClinicView({ itemStyle, accentStyle }: ViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-indigo-ink/20 pb-2">
        <div>
          <span className="font-mono text-xs font-bold text-coral">
            ARCHETYPE: MEDICAL CLINIC &amp; BOOKING
          </span>
          <h3 className="text-base font-black text-indigo-ink">
            سامانه نوبت‌دهی آنلاین درمانگاه تخصصی حکیم
          </h3>
        </div>
        <span className="rounded-sm border border-indigo-ink bg-teal-craft px-2.5 py-1 font-mono text-xs font-bold text-white">
          درمانگاه شبانه‌روزی
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        <div
          className="flex flex-col gap-4 border border-indigo-ink bg-paper-light p-5 shadow-craft md:col-span-7"
          style={itemStyle}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex size-12 items-center justify-center rounded-sm border border-indigo-ink bg-paper-dim text-coral"
              style={itemStyle}
            >
              <Stethoscope className="size-[26px]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-indigo-ink">
                دکتر سهراب دیبا
              </h4>
              <span className="text-xs text-indigo-light">
                متخصص قلب و عروق • نظام پزشکی: ۱۰۴۹۲۸
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-indigo-ink">
              انتخاب روز نوبت ویزیت
            </label>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <button
                type="button"
                className="rounded-sm border border-indigo-ink bg-paper-dim p-2 font-mono text-indigo-ink transition-all hover:bg-paper-light"
                style={itemStyle}
              >
                شنبه ۲۴
              </button>
              <button
                type="button"
                className="rounded-sm border border-indigo-ink p-2 font-mono font-bold shadow-craft-sm"
                style={accentStyle}
              >
                یکشنبه ۲۵
              </button>
              <button
                type="button"
                className="rounded-sm border border-indigo-ink bg-paper-dim p-2 font-mono text-indigo-ink transition-all hover:bg-paper-light"
                style={itemStyle}
              >
                دوشنبه ۲۶
              </button>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-sm border border-indigo-ink bg-paper-dim p-2 font-mono text-indigo-ink opacity-40"
                style={itemStyle}
              >
                سه‌شنبه (تکمیل)
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-indigo-ink">
              انتخاب ساعت مراجعه
            </label>
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs font-bold">
              <button
                type="button"
                className="rounded-sm border border-indigo-ink bg-paper-light p-2 text-indigo-ink transition-all hover:bg-paper-dim"
                style={itemStyle}
              >
                ۱۶:۳۰ عصر
              </button>
              <button
                type="button"
                className="rounded-sm border border-indigo-ink p-2 shadow-craft-sm"
                style={accentStyle}
              >
                ۱۷:۱۵ عصر
              </button>
              <button
                type="button"
                className="rounded-sm border border-indigo-ink bg-paper-light p-2 text-indigo-ink transition-all hover:bg-paper-dim"
                style={itemStyle}
              >
                ۱۸:۰۰ عصر
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-indigo-ink/15 pt-2">
            <span className="text-xs text-indigo-light">
              هزینه ویزیت طبق تعرفه مصوب:{" "}
              <b className="font-mono text-indigo-ink">۲۲۰,۰۰۰ تومان</b>
            </span>
            <button
              type="button"
              className="border border-indigo-ink px-4 py-2 text-xs font-bold shadow-craft-sm transition-all active:translate-x-0.5 active:translate-y-0.5"
              style={accentStyle}
            >
              ثبت نهایی و پرداخت
            </button>
          </div>
        </div>

        <div
          className="flex flex-col justify-between gap-4 border border-indigo-ink bg-paper-light p-5 shadow-craft md:col-span-5"
          style={itemStyle}
        >
          <div>
            <h4 className="text-sm font-black text-indigo-ink">
              مدارک و الزامات مراجعه
            </h4>
            <p className="mt-0.5 text-xs text-indigo-light">
              لطفاً پیش از مراجعه حضوری نکات زیر را رعایت فرمایید:
            </p>
          </div>
          <div className="flex flex-col gap-2.5 text-xs text-indigo-ink">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-coral" />
              <span>همراه داشتن کارت شناسایی ملی و دفترچه بیمه</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-coral" />
              <span>
                همراه داشتن کلیه نتایج آزمایشات و نوار قلب ۶ ماه گذشته
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="size-4 shrink-0 text-coral" />
              <span>حضور در کلینیک دست‌کم ۱۵ دقیقه قبل از زمان رزرو</span>
            </div>
          </div>
          <div
            className="rounded-sm border border-indigo-ink bg-paper-dim p-3 text-xs"
            style={itemStyle}
          >
            <span className="mb-0.5 block font-bold text-indigo-ink">
              نشانی درمانگاه:
            </span>
            <span className="text-indigo-light">
              تهران، خیابان ولیعصر، نرسیده به میدان ونک، مجتمع پزشکی حکیم
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ itemStyle }: ViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-indigo-ink/20 pb-2">
        <div>
          <span className="font-mono text-xs font-bold text-coral">
            ARCHETYPE: DATA MONITORING &amp; TELEMETRY
          </span>
          <h3 className="text-base font-black text-indigo-ink">
            میز کار پایش داده‌های سرور و ترافیک لحظه‌ای
          </h3>
        </div>
        <span className="rounded-sm border border-indigo-ink bg-paper-dim px-2 py-0.5 font-mono text-xs font-bold text-indigo-ink">
          LIVE TELEMETRY
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="border border-indigo-ink bg-paper-light p-4 shadow-craft"
            style={itemStyle}
          >
            <span className="block text-xs text-indigo-light">
              {stat.label}
            </span>
            <span className="mt-1 block font-mono text-xl font-black text-indigo-ink">
              {stat.value}
            </span>
            <span className="text-[10px] font-bold text-emerald-700">
              {stat.note}
            </span>
          </div>
        ))}
      </div>

      <div
        className="flex flex-col gap-3 border border-indigo-ink bg-paper-light p-5 shadow-craft"
        style={itemStyle}
      >
        <h4 className="text-sm font-black text-indigo-ink">
          وضعیت نودهای توزیع‌شده استودیو
        </h4>
        <div className="flex flex-col gap-2 text-xs">
          {NODES.map((node) => (
            <div
              key={node.name}
              className="flex items-center justify-between rounded-sm border border-indigo-ink bg-paper-dim p-2.5"
              style={itemStyle}
            >
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-600" />
                <span className="font-bold text-indigo-ink">{node.name}</span>
              </div>
              <span className="font-mono text-indigo-light">{node.load}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
