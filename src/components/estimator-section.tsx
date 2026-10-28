"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { cn } from "cn";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { setEstimate } from "@/components/estimate-store";

const PROJECT_TYPES = [
  {
    value: "landing",
    label: "لندینگ‌پیج معرفی و تبلیغاتی",
    base: "پایه ۱ م.ت",
  },
  {
    value: "wordpress",
    label: "سایت وردپرسی و قالب آماده",
    base: "پایه ۲ م.ت",
  },
  {
    value: "ecommerce",
    label: "آنلاین شاپ (همراه با صفحه معرفی و لندینگ رایگان)",
    base: "پایه ۵ م.ت",
  },
  {
    value: "webapp",
    label:
      "اپلیکیشن بر پایه وب / داشبورد مدیریتی (همراه با صفحه معرفی و لندینگ رایگان)",
    base: "پایه ۶ م.ت",
  },
] as const;

const SPEEDS = [
  {
    value: "standard",
    title: "عادی (۱۰ تا ۱۴ روز)",
    note: "بدون هزینه اضافه",
    nominal: "",
  },
  { value: "fast", title: "سریع (۵ تا ۷ روز)", note: "", nominal: "+۱۰٪" },
  { value: "urgent", title: "فوری (۳ تا ۵ روز)", note: "", nominal: "+۱۵٪" },
] as const;

const ADDONS = [
  {
    value: "cms",
    label: "پنل مدیریت محتوای (وبلاگ اختصاصی)",
    price: "+۱ م.ت",
    struckPrice: "",
  },
  {
    value: "support",
    label: "پشتیبانی و مراقبت ۶ ماهه",
    price: "+۱ م.ت",
    struckPrice: "",
  },
  {
    value: "motion",
    label: "انیمیشن‌های اضافه",
    price: "رایگان",
    struckPrice: "۰٫۵ م.ت",
  },
  {
    value: "payportal",
    label: "پرتال پرداخت",
    price: "رایگان",
    struckPrice: "",
  },
] as const;

type ProjectType = (typeof PROJECT_TYPES)[number]["value"];
type Speed = (typeof SPEEDS)[number]["value"];
type Addon = (typeof ADDONS)[number]["value"];

/**
 * Base UI draws each control as a `<span role="checkbox|radio">` beside a
 * visually hidden native input, and a `<label>` around that pair forwards label
 * taps (plus the focus that tags along) to the clipped input — on mobile the
 * browser scrolls the page to it, which lands on the top of the estimator. So
 * the row handles its own tap: a tap on the control arrives with
 * `defaultPrevented` already set (Base UI toggled it), every other tap is
 * cancelled here and applied by hand. Click-anywhere and the label's accessible
 * name stay intact.
 */
const rowClick =
  (activate: () => void) => (event: MouseEvent<HTMLLabelElement>) => {
    if (event.defaultPrevented) return;
    event.preventDefault();
    activate();
  };

/**
 * Which timing and which modules each project type can take. The form only
 * offers a combination that exists, so a project type can never be paired with
 * a timing or a module that is not built for it:
 * landing → every timing, every module except the payment portal;
 * wordpress → standard/fast, every module except extra animations;
 * online shop → standard/fast, every module;
 * web app → standard/fast, every module except the payment portal.
 */
const TIMINGS: Record<ProjectType, readonly Speed[]> = {
  landing: ["standard", "fast", "urgent"],
  wordpress: ["standard", "fast"],
  ecommerce: ["standard", "fast"],
  webapp: ["standard", "fast"],
};

const MODULES: Record<ProjectType, readonly Addon[]> = {
  landing: ["cms", "support", "motion"],
  wordpress: ["cms", "support", "payportal"],
  ecommerce: ["cms", "support", "motion", "payportal"],
  webapp: ["cms", "support", "motion"],
};

const PRICES: Record<ProjectType, { min: number; max: number; title: string }> =
  {
    landing: { min: 1, max: 2, title: "لندینگ‌پیج معرفی و تبلیغاتی" },
    wordpress: { min: 2, max: 3, title: "سایت وردپرسی و قالب آماده" },
    ecommerce: {
      min: 5,
      max: 7,
      title: "آنلاین شاپ (همراه با صفحه معرفی و لندینگ رایگان)",
    },
    webapp: {
      min: 6,
      max: 8,
      title:
        "اپلیکیشن بر پایه وب / داشبورد مدیریتی (همراه با صفحه معرفی و لندینگ رایگان)",
    },
  };

/**
 * The rush surcharge (+۱۰٪ / +۱۵٪) is advertised struck through and waived
 * right now, so the estimate is priced at the base range for every timing.
 */
const SPEED_TIMELINES: Record<Speed, string> = {
  standard: "۱۰ تا ۱۴ روز کاری",
  fast: "۵ تا ۷ روز کاری (شتاب‌یافته)",
  urgent: "۳ تا ۵ روز کاری (تحویل فوری)",
};

const ADDON_PRICES: Record<Addon, number> = {
  cms: 1,
  support: 1,
  motion: 0,
  payportal: 0,
};

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Renders Latin digits as Persian ones, with the Persian decimal separator. */
function toPersianDigits(value: string | number) {
  return String(value)
    .replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)])
    .replace(/\./g, "٫");
}

/** A whole price reads `۴`, not `۴٫۰`; a real half keeps its decimal. */
function trimZero(value: string) {
  return value.replace(/\.0$/, "");
}

export function EstimatorSection() {
  const [projectType, setProjectType] = useState<ProjectType>("landing");
  const [speed, setSpeed] = useState<Speed>("standard");
  const [addons, setAddons] = useState<Addon[]>([]);

  const estimate = useMemo(() => {
    const base = PRICES[projectType];
    const addonSum = addons.reduce(
      (total, addon) => total + ADDON_PRICES[addon],
      0,
    );

    return {
      min: trimZero((base.min + addonSum).toFixed(1)),
      max: trimZero((base.max + addonSum).toFixed(1)),
      typeTitle: base.title,
      timeline: SPEED_TIMELINES[speed],
      addonsCount: addons.length,
    };
  }, [projectType, speed, addons]);

  useEffect(() => {
    setEstimate({
      typeTitle: estimate.typeTitle,
      timeline: estimate.timeline,
      min: estimate.min,
      max: estimate.max,
      addonsCount: estimate.addonsCount,
    });
  }, [estimate]);

  /** Switching the project type drops choices that type cannot take. */
  const selectProjectType = (next: ProjectType) => {
    setProjectType(next);
    if (!TIMINGS[next].includes(speed)) {
      setSpeed("standard");
    }
    setAddons((current) =>
      current.filter((addon) => MODULES[next].includes(addon)),
    );
  };

  const toggleAddon = (addon: Addon) => {
    if (!MODULES[projectType].includes(addon)) return;
    setAddons((current) =>
      current.includes(addon)
        ? current.filter((item) => item !== addon)
        : [...current, addon],
    );
  };

  return (
    <section
      id='estimator-section'
      className='w-full scroll-mt-16 border-b-[2.5px] border-indigo-ink bg-paper-dim px-4 py-12 sm:px-8 lg:px-12'
    >
      <div className='mx-auto flex max-w-7xl flex-col gap-10'>
        <div className='border-b-[2px] border-indigo-ink pb-6 text-right'>
          <h2 className='text-[1.625rem] font-black text-indigo-ink sm:text-[2.125rem]'>
            برآورد رایگان زمان و هزینه پروژه شما
          </h2>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
          <Card className='craft-card flex flex-col gap-6 rounded-sm bg-paper-light p-6 sm:p-8 lg:col-span-7'>
            <div>
              <span className='mb-3 flex items-center gap-2 text-[1rem] font-black text-indigo-ink'>
                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-coral font-mono text-xs text-white'>
                  ۱
                </span>
                <span>نوع وب‌سایت یا پروژه مورد نیاز:</span>
              </span>
              <RadioGroup
                value={projectType}
                onValueChange={(value) =>
                  selectProjectType(value as ProjectType)
                }
                className='grid grid-cols-1 gap-3 sm:grid-cols-2'
              >
                {PROJECT_TYPES.map((type) => {
                  const checked = projectType === type.value;
                  return (
                    <label
                      key={type.value}
                      onClick={rowClick(() => selectProjectType(type.value))}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-2 rounded-sm border-[2px] p-3.5 transition-colors",
                        checked
                          ? "border-coral bg-coral/10"
                          : "border-indigo-ink bg-paper hover:bg-mustard/20",
                      )}
                    >
                      <div className='flex items-start gap-2.5'>
                        <RadioGroupItem
                          value={type.value}
                          className='mt-1 shrink-0'
                        />
                        <span className='text-sm font-bold text-indigo-ink'>
                          {type.label}
                        </span>
                      </div>
                      <span className='shrink-0 whitespace-nowrap font-mono text-[0.75rem] font-bold text-coral'>
                        {type.base}
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            <div>
              <span className='mb-3 flex items-center gap-2 text-[1rem] font-black text-indigo-ink'>
                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-coral font-mono text-xs text-white'>
                  ۲
                </span>
                <span>اولویت زمان‌بندی و تحویل کار:</span>
              </span>
              <RadioGroup
                value={speed}
                onValueChange={(value) => setSpeed(value as Speed)}
                className='grid grid-cols-1 gap-3 sm:grid-cols-3'
              >
                {SPEEDS.map((option) => {
                  const available = TIMINGS[projectType].includes(option.value);
                  const checked = speed === option.value;
                  return (
                    <label
                      key={option.value}
                      onClick={rowClick(() => {
                        if (available) setSpeed(option.value);
                      })}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 rounded-sm border-[2px] p-3 text-center transition-colors",
                        !available
                          ? "cursor-not-allowed border-dashed border-indigo-ink/30 bg-paper-dim text-indigo-ink/45"
                          : checked
                            ? "cursor-pointer border-coral bg-coral/10"
                            : "cursor-pointer border-indigo-ink bg-paper hover:bg-mustard/20",
                      )}
                    >
                      <RadioGroupItem
                        value={option.value}
                        disabled={!available}
                        className='sr-only'
                      />
                      <div
                        className={cn(
                          "text-sm font-bold",
                          !available
                            ? "line-through decoration-indigo-ink/40"
                            : "text-indigo-ink",
                        )}
                      >
                        {option.title}
                      </div>
                      {available ? (
                        <div className='mt-0.5 flex items-center gap-1 font-mono text-[0.6875rem]'>
                          {option.nominal ? (
                            <>
                              <span className='text-indigo-light line-through'>
                                {option.nominal}
                              </span>
                              <span className='font-black text-coral'>۰٪</span>
                            </>
                          ) : (
                            <span className='text-indigo-light'>
                              {option.note}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className='mt-0.5 font-mono text-[0.625rem] font-bold text-indigo-ink/55'>
                          برای این نوع پروژه نیست
                        </div>
                      )}
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            <div>
              <span className='mb-3 flex items-center gap-2 text-[1rem] font-black text-indigo-ink'>
                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-coral font-mono text-xs text-white'>
                  ۳
                </span>
                <span>امکانات اضافه:</span>
              </span>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                {ADDONS.map((addon) => {
                  const available = MODULES[projectType].includes(addon.value);
                  const checked = addons.includes(addon.value);
                  return (
                    <label
                      key={addon.value}
                      onClick={rowClick(() => toggleAddon(addon.value))}
                      className={cn(
                        "flex items-center gap-2.5 rounded-sm border-[1.5px] p-3",
                        !available
                          ? "cursor-not-allowed border-dashed border-indigo-ink/30 bg-paper-dim"
                          : checked
                            ? "cursor-pointer border-coral bg-coral/10"
                            : "cursor-pointer border-indigo-ink/40 bg-paper hover:border-indigo-ink",
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={!available}
                        onCheckedChange={() => toggleAddon(addon.value)}
                      />
                      <span className='flex items-baseline gap-1.5'>
                        <span
                          className={cn(
                            "text-xs font-medium sm:text-sm",
                            !available
                              ? "text-indigo-ink/45 line-through decoration-indigo-ink/40"
                              : "text-indigo-ink",
                          )}
                        >
                          {addon.label}
                        </span>
                        <span className='shrink-0 whitespace-nowrap font-mono text-[0.6875rem] font-bold text-coral'>
                          {addon.struckPrice ? (
                            <s className='me-1 text-indigo-light'>
                              {addon.struckPrice}
                            </s>
                          ) : null}
                          {addon.price}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className='craft-card relative flex flex-col justify-between gap-6 rounded-sm bg-paper-light p-6 sm:p-8 lg:col-span-5'>
            <div className='flex flex-col gap-5'>
              <div className='border-b-[2px] border-indigo-ink pb-3'>
                <h3 className='text-base font-black text-indigo-ink'>
                  پیش‌فاکتور
                </h3>
              </div>

              <div className='space-y-3 text-sm text-indigo-light'>
                <div className='flex items-center justify-between border-b border-indigo-ink/15 py-1.5'>
                  <span>پروژه انتخابی:</span>
                  <span className='font-extrabold text-indigo-ink'>
                    {estimate.typeTitle}
                  </span>
                </div>
                <div className='flex items-center justify-between border-b border-indigo-ink/15 py-1.5'>
                  <span>زمان‌بندی تحویل:</span>
                  <span className='font-extrabold text-teal-craft'>
                    {estimate.timeline}
                  </span>
                </div>
                <div className='flex items-center justify-between border-b border-indigo-ink/15 py-1.5'>
                  <span>امکانات جانبی:</span>
                  <span className='font-extrabold text-coral'>
                    {toPersianDigits(estimate.addonsCount)} مورد انتخاب شده
                  </span>
                </div>
                <div className='flex items-center justify-between gap-3 border-b border-indigo-ink/15 py-1.5'>
                  <span className='shrink-0'>دامنه:</span>
                  <span className='text-left font-extrabold text-teal-craft'>
                    <span dir='ltr' className='font-mono'>
                      .ir
                    </span>{" "}
                    رایگان — <span dir='ltr' className='font-mono'>.com</span>{" "}
                    و بقیه به عهدهٔ خودتان
                  </span>
                </div>
                <div className='flex items-center justify-between gap-3 border-b border-indigo-ink/15 py-1.5'>
                  <span className='shrink-0'>هاست:</span>
                  <span className='text-left font-extrabold text-teal-craft'>
                    ماه اول رایگان، بعدش هزینهٔ پلن انتخابی شما
                  </span>
                </div>
              </div>

              <div className='my-2 flex flex-col items-center gap-2'>
                <span className='inline-flex items-center rounded-full border-[2px] border-indigo-ink bg-coral px-3 py-1 text-[0.6875rem] font-black text-white shadow-craft-sm'>
                  ۲۰٪ تخفیف — فقط برای مدت محدود
                </span>
                <Card className='flex w-full flex-col gap-1 rounded-sm border-[2px] border-indigo-ink bg-mustard/20 p-4 text-center shadow-craft-inset'>
                  <span className='text-xs font-bold text-indigo-ink'>
                    محدوده سرمایه‌گذاری تقریبی
                  </span>
                  <div className='flex items-baseline justify-center gap-1.5'>
                    <span className='font-display text-[2.125rem] font-black text-coral'>
                      {toPersianDigits(estimate.min)}
                    </span>
                    <span className='text-lg font-black text-indigo-ink'>
                      تا
                    </span>
                    <span className='font-display text-[2.125rem] font-black text-coral'>
                      {toPersianDigits(estimate.max)}
                    </span>
                    <span className='text-sm font-bold text-indigo-ink'>
                      میلیون تومان
                    </span>
                  </div>
                  <span className='text-[0.6875rem] text-indigo-light'>
                    شامل صفر تا صد کدنویسی، رسپانسیو و تحویل نهایی
                  </span>
                </Card>
              </div>
            </div>

            <div className='pt-4'>
              <a
                href='#contact-section'
                className='craft-btn flex w-full items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-4 py-3.5 text-base font-black text-white shadow-craft-sm transition-colors hover:bg-coral-dark'
              >
                ثبت در فرم تماس و ارسال پیام ←
              </a>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
