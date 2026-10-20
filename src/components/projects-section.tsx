"use client";

import { useState, type ReactElement } from "react";
import { ArrowLeft } from "lucide-react";

type Category = "web-app" | "landing" | "store";

type Project = {
  id: string;
  category: Category;
  thumbnail: (props: { className?: string }) => ReactElement;
  stamp: { label: string; tone: "coral" | "teal" | "mustard" };
  tech: { label: string; tone: "ink" | "coral" | "teal" };
  meta: { left: string; leftTone: string; right: string };
  title: string;
  body: string;
  cta: string;
  badge: string;
};

const STAMP_TONES = {
  coral: "riso-stamp",
  teal: "riso-stamp-teal",
  mustard: "riso-stamp-mustard",
} as const;

const TECH_TONES = {
  ink: "bg-indigo-ink text-paper",
  coral: "bg-coral text-white",
  teal: "bg-teal-craft text-white",
} as const;

function EnvironmentMonitorThumb({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 400 200"
      aria-hidden
    >
      <rect x="10" y="10" width="380" height="180" strokeDasharray="4 4" strokeWidth="2" />
      <path d="M 20 160 Q 80 80, 140 120 T 260 50 T 380 90" fill="none" stroke="#e76f51" strokeWidth="3" />
      <circle cx="140" cy="120" r="5" fill="#264653" />
      <circle cx="260" cy="50" r="5" fill="#e76f51" />
      <circle cx="380" cy="90" r="5" fill="#dda15e" />
      <text fill="#264653" fontFamily="var(--font-mono)" fontSize="12" x="30" y="45">
        AQI: 42 (Clean) | Temp: 21.4°C | CO2: 412ppm
      </text>
    </svg>
  );
}

function BakeryStoreThumb({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 400 200" aria-hidden>
      <rect x="20" y="20" width="110" height="150" stroke="#264653" strokeWidth="2" />
      <rect x="145" y="20" width="110" height="150" stroke="#e76f51" strokeWidth="2" />
      <rect x="270" y="20" width="110" height="150" stroke="#264653" strokeWidth="2" />
      <circle cx="75" cy="70" r="25" stroke="#e76f51" strokeWidth="2" />
      <circle cx="200" cy="70" r="25" stroke="#264653" strokeWidth="2" />
      <circle cx="325" cy="70" r="25" stroke="#e76f51" strokeWidth="2" />
      <text fill="#264653" fontFamily="var(--font-mono)" fontSize="11" x="35" y="140">
        Artisan Bread
      </text>
      <text fill="#e76f51" fontFamily="var(--font-mono)" fontSize="11" x="160" y="140">
        Pour-over
      </text>
      <text fill="#264653" fontFamily="var(--font-mono)" fontSize="11" x="285" y="140">
        Pastry Box
      </text>
    </svg>
  );
}

function SaasLandingThumb({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 400 200" aria-hidden>
      <path d="M 40 150 L 120 120 L 200 135 L 280 80 L 360 40" stroke="#264653" strokeWidth="3" />
      <rect x="310" y="25" width="70" height="25" fill="#fbeee9" stroke="#e76f51" strokeWidth="1.5" />
      <text
        fill="#e76f51"
        fontFamily="var(--font-mono)"
        fontSize="11"
        fontWeight="bold"
        x="318"
        y="42"
      >
        +40% CONV
      </text>
      <line x1="40" x2="360" y1="160" y2="160" stroke="#3c6373" strokeDasharray="3 3" />
    </svg>
  );
}

function ClinicPortalThumb({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 400 200" aria-hidden>
      <rect x="40" y="30" width="320" height="140" rx="4" stroke="#264653" strokeWidth="2" />
      <rect x="60" y="55" width="80" height="40" fill="#e0f2f1" stroke="#264653" />
      <rect x="160" y="55" width="80" height="40" fill="#fbeee9" stroke="#e76f51" />
      <rect x="260" y="55" width="80" height="40" fill="#e0f2f1" stroke="#264653" />
      <circle cx="100" cy="130" r="14" fill="#dda15e" />
      <text fill="#264653" fontFamily="var(--font-mono)" fontSize="12" x="130" y="135">
        دکتر م. رضایی - وقت‌های باز امروز
      </text>
    </svg>
  );
}

const PROJECTS: Project[] = [
  {
    id: "environment-monitor",
    category: "web-app",
    thumbnail: EnvironmentMonitorThumb,
    stamp: { label: "مهر تایید فنی IoT", tone: "coral" },
    tech: { label: "NEXT.JS 15", tone: "ink" },
    meta: {
      left: "سیستم پایش آلودگی محیط زیست",
      leftTone: "text-teal-craft",
      right: "زمان اجرا: ۴ روز",
    },
    title: "سامانه تحلیلی پایش آنلاین شاخص‌های بهداشت محیط",
    body: "داشبورد داده‌محور اختصاصی جهت مانیتورینگ آنلاین کیفیت هوا، میکروکلیمای شهری و پارامترهای بهداشتی محیط کار با نمودارهای واکنش‌گرا و هشدار خودکار.",
    cta: "درخواست ساخت سیستم مشابه",
    badge: "کدنویسی بهینه",
  },
  {
    id: "artisan-bakery",
    category: "store",
    thumbnail: BakeryStoreThumb,
    stamp: { label: "سبد خرید فوق‌سریع", tone: "mustard" },
    tech: { label: "VUE + PINIA", tone: "coral" },
    meta: {
      left: "کافه و نانوایی دست‌ساز",
      leftTone: "text-coral",
      right: "زمان اجرا: ۶ روز",
    },
    title: "وب‌سایت فروشگاهی اختصاصی نان فانتزی و کافه تخصصی",
    body: "سبک، بسیار سریع با رابط کاربری اشتهاآور و مدرن؛ تسویه حساب دو مرحله‌ای، سبد خرید فوری و بارگذاری کمتر از ۰.۸ ثانیه روی سرور داخلی.",
    cta: "سفارش فروشگاه اینترنتی",
    badge: "لود ۰.۸ ثانیه",
  },
  {
    id: "saas-landing",
    category: "landing",
    thumbnail: SaasLandingThumb,
    stamp: { label: "نرخ تبدیل بالا (+۴۰٪)", tone: "teal" },
    tech: { label: "REACT + FRAMER", tone: "teal" },
    meta: {
      left: "B2B SaaS کمپین مارکتینگ",
      leftTone: "text-indigo-ink",
      right: "زمان اجرا: ۳ روز",
    },
    title: "لندینگ‌پیج افزایش مشتری پلتفرم نرم‌افزاری ابری",
    body: "طراحی مهندسی‌شده مسیر تبدیل کاربر به خریدار، انیمیشن‌های مینیمال در هاورها و تست A/B موفق که منجر به جهش ۴۰ درصدی ثبت‌نام نسخه آزمایشی شد.",
    cta: "مشاوره برای لندینگ پیج",
    badge: "A/B تست‌شده",
  },
  {
    id: "clinic-portal",
    category: "web-app",
    thumbnail: ClinicPortalThumb,
    stamp: { label: "نوبت‌دهی خودکار پیامکی", tone: "coral" },
    tech: { label: "TYPESCRIPT", tone: "ink" },
    meta: {
      left: "بهداشت و سلامت دیجیتال",
      leftTone: "text-teal-craft",
      right: "زمان اجرا: ۵ روز",
    },
    title: "پورتال نوبت‌دهی آنلاین کلینیک تخصصی و دندانپزشکی",
    body: "سامانه رزرو خودکار با پیامک تایید آنی، مدیریت پزشکان بدون سردرگمی بیماران، و تطابق با استانداردهای بهداشت دیجیتال و حریم خصوصی.",
    cta: "درخواست دمو سامانه نوبت‌دهی",
    badge: "سامانه پیامکی",
  },
];

const FILTERS = [
  { value: "all", label: "همه کارها" },
  { value: "web-app", label: "وب‌اپ و ابزارها" },
  { value: "landing", label: "لندینگ تبلیغاتی" },
  { value: "store", label: "فروشگاه اختصاصی" },
] as const;

export function ProjectsSection() {
  const [active, setActive] = useState<(typeof FILTERS)[number]["value"]>("all");

  const visible =
    active === "all" ? PROJECTS : PROJECTS.filter((project) => project.category === active);

  return (
    <section
      id="projects-container"
      className="w-full border-b-[2.5px] border-indigo-ink bg-paper px-4 py-20 sm:px-8 lg:px-12"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-col justify-between gap-4 border-b-[2px] border-indigo-ink pb-6 md:flex-row md:items-end">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="riso-stamp text-[11px]">ویترین کارهای دست‌ساز</span>
            </div>
            <h2 className="text-[26px] font-black text-indigo-ink sm:text-[34px]">
              پروژه‌های منتخب
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {FILTERS.map((filter) => {
              const isActive = active === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActive(filter.value)}
                  className={`craft-btn shrink-0 rounded-sm px-4 py-1.5 text-xs font-bold whitespace-nowrap ${
                    isActive
                      ? "bg-coral text-white"
                      : "bg-paper-light text-indigo-ink transition-colors hover:bg-mustard/30"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {visible.map((project) => (
            <div
              key={project.id}
              className="craft-card relative flex flex-col justify-between rounded-sm bg-paper-light p-5"
            >
              <div className="relative mb-4 flex h-60 w-full items-center justify-center overflow-hidden rounded-sm border-[2px] border-indigo-ink bg-paper-dim p-3">
                <project.thumbnail className="h-full w-full text-indigo-ink opacity-90" />
                <div
                  className={`absolute top-2.5 right-2.5 bg-paper-light shadow-sm text-[10px] ${STAMP_TONES[project.stamp.tone]}`}
                >
                  {project.stamp.label}
                </div>
                <div
                  className={`absolute bottom-2.5 left-2.5 rounded px-2 py-0.5 font-mono text-[10px] font-bold ${TECH_TONES[project.tech.tone]}`}
                >
                  {project.tech.label}
                </div>
              </div>

              <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-indigo-light">
                <span className={`font-bold ${project.meta.leftTone}`}>
                  {project.meta.left}
                </span>
                <span className="font-bold text-coral">{project.meta.right}</span>
              </div>

              <h3 className="mb-2 text-[20px] font-black text-indigo-ink">
                {project.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-indigo-light">
                {project.body}
              </p>

              <div className="flex items-center justify-between border-t-2 border-dashed border-indigo-ink/20 pt-3">
                <a
                  href="#contact-section"
                  className="group inline-flex items-center gap-1.5 text-xs font-extrabold text-coral hover:text-indigo-ink"
                >
                  <span>{project.cta}</span>
                  <ArrowLeft className="size-[17px] transition-transform group-hover:-translate-x-0.5" />
                </a>
                <span className="rounded border border-indigo-ink/30 bg-mustard/30 px-2 py-0.5 font-mono text-[11px] text-indigo-ink">
                  {project.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
