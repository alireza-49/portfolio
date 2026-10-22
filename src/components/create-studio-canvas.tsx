"use client";

import { useState, type CSSProperties } from "react";
import {
  Bolt,
  CheckCircle2,
  Clock,
  Coffee,
  Cookie,
  Croissant,
  Handshake,
  Info,
  LayoutDashboard,
  LayoutGrid,
  PanelsTopLeft,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import {
  FONT_STACKS,
  mixWithWhite,
  type ArchetypeId,
  type FontId,
  type IconLibraryId,
  type StyleId,
} from "@/components/create-studio-config";
import {
  createComponentTheme,
  themeToCssVars,
} from "@/components/create-components/theme";
import { Alert } from "@/components/create-components/alert";
import { Badge } from "@/components/create-components/badge";
import { CheckboxField } from "@/components/create-components/checkbox";
import { Progress } from "@/components/create-components/progress";
import {
  RadioGroup,
  RadioGroupField,
} from "@/components/create-components/radio-group";
import { Select } from "@/components/create-components/select";
import { Separator } from "@/components/create-components/separator";
import { Slider } from "@/components/create-components/slider";

type CanvasProps = {
  archetype: ArchetypeId;
  primary: string;
  primarySubtle: string;
  radius: number;
  styleId: StyleId;
  font: FontId;
  iconLibrary: IconLibraryId;
};

type ViewProps = {
  primary: string;
  primarySubtle: string;
  radius: number;
  itemStyle: CSSProperties;
  accentStyle: CSSProperties;
  accentText: CSSProperties;
  subtleStyle: CSSProperties;
  headingClass: string;
};

type StyleToken = {
  borderWidth: number;
  shadow: string;
  /** null = honour the user-selected radius */
  radius: number | null;
  heading: string;
};

const STYLE_TOKENS: Record<StyleId, StyleToken> = {
  nova: {
    borderWidth: 2,
    shadow: "4px 4px 0 0 #264653",
    radius: null,
    heading: "font-black",
  },
  riso: {
    borderWidth: 2,
    shadow: "5px 5px 0 0 #e76f51",
    radius: null,
    heading: "font-black",
  },
  brutalist: {
    borderWidth: 3,
    shadow: "8px 8px 0 0 #264653",
    radius: 0,
    heading: "font-black uppercase tracking-tight",
  },
  editorial: {
    borderWidth: 1,
    shadow: "2px 2px 0 0 #264653",
    radius: null,
    heading: "font-serif font-bold",
  },
  swiss: {
    borderWidth: 2,
    shadow: "3px 3px 0 0 #264653",
    radius: 0,
    heading: "font-bold tracking-tight",
  },
  terminal: {
    borderWidth: 2,
    shadow: "4px 4px 0 0 #2a9d8f",
    radius: 0,
    heading: "font-mono font-bold",
  },
};

const LIBRARY_ICONS: Record<IconLibraryId, typeof LayoutDashboard> = {
  google: LayoutDashboard,
  lucide: LayoutGrid,
  tabler: PanelsTopLeft,
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

const PROJECT_TYPES = [
  { value: "landing", label: "لندینگ پیج" },
  { value: "ecommerce", label: "فروشگاه آنلاین" },
  { value: "dashboard", label: "داشبورد داده" },
  { value: "blog", label: "وبلاگ و محتوا" },
];

const PRIORITIES = [
  { value: "low", label: "کم", description: "بدون عجله" },
  { value: "normal", label: "معمولی", description: "زمان‌بندی استاندارد" },
  { value: "high", label: "فوری", description: "تحویل سریع" },
];

export function CreateStudioCanvas({
  archetype,
  primary,
  primarySubtle,
  radius,
  styleId,
  font,
  iconLibrary,
}: CanvasProps) {
  const token = STYLE_TOKENS[styleId];
  const effectiveRadius = token.radius ?? radius;

  const itemStyle: CSSProperties = { borderRadius: effectiveRadius };
  const accentStyle: CSSProperties = {
    backgroundColor: primary,
    color: "#ffffff",
    borderRadius: effectiveRadius,
  };
  const accentText: CSSProperties = { color: primary };
  const subtleStyle: CSSProperties = {
    backgroundColor: primarySubtle,
    borderRadius: effectiveRadius,
  };

  const ChromeIcon = LIBRARY_ICONS[iconLibrary];

  const theme = createComponentTheme({
    primary,
    primaryForeground: "#ffffff",
    primaryHover: primary,
    secondary: primarySubtle,
    secondaryForeground: primary,
    secondaryHover: mixWithWhite(primarySubtle, 0.1),
    accent: "#dda15e",
    accentForeground: "#1f2937",
    background: "#fdfaf5",
    surface: "#ffffff",
    surfaceForeground: "#264653",
    muted: "#f3f4f6",
    mutedForeground: "#6b7280",
    border: "#264653",
    ring: primary,
    radius: effectiveRadius,
    borderWidth: token.borderWidth,
    shadow: token.shadow,
    fontFamily: FONT_STACKS[font],
    fontSize: 14,
    density: 1,
    duration: "150ms",
  });

  const viewProps: ViewProps = {
    primary,
    primarySubtle,
    radius: effectiveRadius,
    itemStyle,
    accentStyle,
    accentText,
    subtleStyle,
    headingClass: token.heading,
  };

  return (
    <section className="dot-grid order-2 flex w-full flex-col gap-4 overflow-x-hidden bg-paper-shade p-4 sm:p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:p-8">
      <div
        className="paper-pattern relative min-h-[640px] w-full overflow-hidden rounded-sm bg-paper transition-all"
        style={{
          borderStyle: "solid",
          borderWidth: token.borderWidth,
          borderColor: "#264653",
          boxShadow: token.shadow,
          fontFamily: FONT_STACKS[font],
        }}
      >
        <div
          className="flex w-full select-none items-center justify-between border-b-2 border-indigo-ink px-4 py-2.5"
          style={{ backgroundColor: primarySubtle }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full border border-indigo-ink bg-coral" />
              <span className="size-3 rounded-full border border-indigo-ink bg-mustard" />
              <span className="size-3 rounded-full border border-indigo-ink bg-teal-craft" />
            </div>
            <span className="mx-1 h-4 w-px bg-indigo-ink/20" />
            <div className="flex items-center gap-1.5 text-xs font-black text-indigo-ink">
              <ChromeIcon className="size-4 text-coral" />
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

        <div
          className="flex flex-col gap-6 p-5 sm:p-7"
          style={themeToCssVars(theme)}
        >
          {archetype === "components" ? <ComponentsView /> : null}
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

function ComponentsView() {
  const [projectType, setProjectType] = useState("landing");
  const [budget, setBudget] = useState(40);
  const [priority, setPriority] = useState("normal");
  const [newsletter, setNewsletter] = useState(true);
  const [support, setSupport] = useState(false);
  const [progress, setProgress] = useState(65);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-black text-[color:var(--cc-surface-foreground)]">
            کامپوننت‌های پایه
          </h2>
          <p className="text-sm text-[color:var(--cc-muted-foreground)]">
            پیش‌نمایش زنده با تم انتخابی شما
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="solid">نسخه ۱.۰</Badge>
          <Badge variant="soft">ریسپانسیو</Badge>
          <Badge variant="outline">دسترس‌پذیر</Badge>
        </div>
      </div>

      <Alert variant="info" title="راهنما" icon={<Info className="size-4" />}>
        این کامپوننت‌ها از تم انتخابی شما استفاده می‌کنند. رنگ، شعاع و فونت را از
        پنل کنار تغییر دهید.
      </Alert>

      <Separator label="فرم نمونه" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[color:var(--cc-surface-foreground)]">
            نوع پروژه
          </label>
          <Select
            options={PROJECT_TYPES}
            value={projectType}
            onValueChange={setProjectType}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[color:var(--cc-surface-foreground)]">
            بودجه (میلیون تومان)
          </label>
          <Slider
            min={0}
            max={100}
            step={5}
            value={budget}
            onChange={(event) => setBudget(Number(event.target.value))}
          />
          <span className="text-xs text-[color:var(--cc-muted-foreground)]">
            {budget} میلیون تومان
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[color:var(--cc-surface-foreground)]">
            اولویت
          </span>
          <RadioGroup value={priority} onValueChange={setPriority}>
            {PRIORITIES.map((item) => (
              <RadioGroupField
                key={item.value}
                value={item.value}
                label={item.label}
                description={item.description}
              />
            ))}
          </RadioGroup>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[color:var(--cc-surface-foreground)]">
            گزینه‌ها
          </span>
          <CheckboxField
            label="ارسال خبرنامه"
            description="جدیدترین مقالات و آموزش‌ها"
            checked={newsletter}
            onCheckedChange={setNewsletter}
          />
          <CheckboxField
            label="پشتیبانی ۲۴ ساعته"
            description="دسترسی به تیم پشتیبانی در تمام ساعات"
            checked={support}
            onCheckedChange={setSupport}
          />
        </div>
      </div>

      <Separator label="وضعیت پیشرفت" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm text-[color:var(--cc-surface-foreground)]">
          <span>تکمیل پروژه</span>
          <span className="text-[color:var(--cc-muted-foreground)]">
            {progress}%
          </span>
        </div>
        <Progress value={progress} showValue />
        <Slider
          min={0}
          max={100}
          step={5}
          value={progress}
          onChange={(event) => setProgress(Number(event.target.value))}
        />
      </div>

      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="success">فعال</Badge>
          <Badge variant="warning">در انتظار</Badge>
          <Badge variant="danger">خطا</Badge>
        </div>
        <span className="text-xs text-[color:var(--cc-muted-foreground)]">
          آخرین به‌روزرسانی: همین حالا
        </span>
      </div>
    </div>
  );
}

function LandingView({
  primary,
  itemStyle,
  accentStyle,
  subtleStyle,
  headingClass,
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
          <h2
            className={`text-xl leading-tight text-indigo-ink sm:text-2xl ${headingClass}`}
          >
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
          className="flex w-full flex-col gap-3 rounded-sm border border-indigo-ink p-4 shadow-craft md:w-64"
          style={subtleStyle}
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
            <h4 className={`text-sm text-indigo-ink ${headingClass}`}>
              {feature.title}
            </h4>
            <p className="text-xs text-indigo-light">{feature.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EcommerceView({
  itemStyle,
  accentStyle,
  subtleStyle,
  headingClass,
}: ViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-indigo-ink/20 pb-2">
        <div>
          <span className="font-mono text-xs font-bold text-coral">
            ARCHETYPE: ARTISANAL BAKERY &amp; COFFEE
          </span>
          <h3 className={`text-base text-indigo-ink ${headingClass}`}>
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
              className="relative flex h-36 w-full flex-col items-center justify-center overflow-hidden rounded-sm border border-indigo-ink text-indigo-light"
              style={subtleStyle}
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
              <h4 className={`text-sm text-indigo-ink ${headingClass}`}>
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

function ClinicView({
  itemStyle,
  accentStyle,
  subtleStyle,
  headingClass,
}: ViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-indigo-ink/20 pb-2">
        <div>
          <span className="font-mono text-xs font-bold text-coral">
            ARCHETYPE: MEDICAL CLINIC &amp; BOOKING
          </span>
          <h3 className={`text-base text-indigo-ink ${headingClass}`}>
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
              <h4 className={`text-sm text-indigo-ink ${headingClass}`}>
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
            <h4 className={`text-sm text-indigo-ink ${headingClass}`}>
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
            className="rounded-sm border border-indigo-ink p-3 text-xs"
            style={subtleStyle}
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

function DashboardView({
  primary,
  itemStyle,
  accentStyle,
  accentText,
  subtleStyle,
  headingClass,
}: ViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-indigo-ink/20 pb-2">
        <div>
          <span className="font-mono text-xs font-bold text-coral">
            ARCHETYPE: DATA MONITORING &amp; TELEMETRY
          </span>
          <h3 className={`text-base text-indigo-ink ${headingClass}`}>
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
            <span
              className="mt-1 block font-mono text-xl font-black"
              style={accentText}
            >
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
        <h4 className={`text-sm text-indigo-ink ${headingClass}`}>
          وضعیت نودهای توزیع‌شده استودیو
        </h4>
        <div className="flex flex-col gap-2 text-xs">
          {NODES.map((node) => (
            <div
              key={node.name}
              className="flex items-center justify-between rounded-sm border border-indigo-ink p-2.5"
              style={subtleStyle}
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: primary }}
                />
                <span className="font-bold text-indigo-ink">{node.name}</span>
              </div>
              <span className="font-mono text-indigo-light">{node.load}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="self-start border border-indigo-ink px-3 py-1.5 text-xs font-bold shadow-craft-sm transition-all active:translate-x-0.5 active:translate-y-0.5"
          style={accentStyle}
        >
          بروزرسانی داده‌های زنده
        </button>
      </div>
    </div>
  );
}
