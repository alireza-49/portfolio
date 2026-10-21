"use client";

import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PROJECT_TYPES = [
  {
    value: "landing",
    label: "لندینگ‌پیج معرفی و تبلیغاتی",
    base: "پایه ۴ م.ت",
  },
  {
    value: "wordpress",
    label: "سایت وردپرسی و قالب آماده",
    base: "پایه ۴ م.ت",
  },
  { value: "corporate", label: "وب‌سایت شرکتی / خدماتی", base: "پایه ۷ م.ت" },
  { value: "ecommerce", label: "فروشگاه آنلاین دست‌ساز", base: "پایه ۱۱ م.ت" },
  {
    value: "webapp",
    label: "وب‌اپلیکیشن یا پورتال سفارشی",
    base: "پایه ۱۴ م.ت",
  },
] as const;

const SPEEDS = [
  {
    value: "standard",
    title: "عادی (۱۰ تا ۱۴ روز)",
    note: "اقتصادی و آرام",
    noteTone: "text-indigo-light",
  },
  {
    value: "fast",
    title: "سریع (۵ تا ۷ روز)",
    note: "+۲۰٪ شتاب‌یافته",
    noteTone: "text-coral font-bold",
  },
  {
    value: "urgent",
    title: "فوری (۲ تا ۳ روز)",
    note: "+۴۰٪ شیفت شبانه",
    noteTone: "text-coral-dark font-black",
  },
] as const;

const ADDONS = [
  { value: "cms", label: "پنل مدیریت محتوای (+۱ م.ت)" },
  { value: "support", label: "پشتیبانی و مراقبت ۶ ماهه (+۲ م.ت)" },
  { value: "motion", label: "انیمیشن‌های اضافه (۰.۵ م.ت)" },
] as const;

type ProjectType = (typeof PROJECT_TYPES)[number]["value"];
type Speed = (typeof SPEEDS)[number]["value"];
type Addon = (typeof ADDONS)[number]["value"];

const PRICES: Record<ProjectType, { min: number; max: number; title: string }> =
  {
    landing: { min: 4, max: 6, title: "لندینگ‌پیج معرفی و تبلیغاتی" },
    wordpress: { min: 4, max: 5, title: "سایت وردپرسی و قالب آماده" },
    corporate: { min: 7, max: 10, title: "وب‌سایت شرکتی / خدماتی" },
    ecommerce: { min: 11, max: 15, title: "فروشگاه آنلاین دست‌ساز" },
    webapp: { min: 14, max: 22, title: "وب‌اپلیکیشن یا پورتال سفارشی" },
  };

const SPEED_FACTORS: Record<Speed, { factor: number; title: string }> = {
  standard: { factor: 1, title: "۱۰ تا ۱۴ روز کاری" },
  fast: { factor: 1.2, title: "۵ تا ۷ روز کاری (شتاب‌یافته)" },
  urgent: { factor: 1.4, title: "۲ تا ۳ روز کاری (تحویل فوری)" },
};

const ADDON_PRICES: Record<Addon, number> = {
  cms: 1,
  support: 2,
  motion: 0.5,
};

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Renders Latin digits as Persian ones, with the Persian decimal separator. */
function toPersianDigits(value: string | number) {
  return String(value)
    .replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)])
    .replace(/\./g, "٫");
}

export function EstimatorSection() {
  const [projectType, setProjectType] = useState<ProjectType>("landing");
  const [speed, setSpeed] = useState<Speed>("standard");
  const [addons, setAddons] = useState<Addon[]>([]);

  const estimate = useMemo(() => {
    const base = PRICES[projectType];
    const { factor, title } = SPEED_FACTORS[speed];
    const addonSum = addons.reduce(
      (total, addon) => total + ADDON_PRICES[addon],
      0,
    );

    return {
      min: (base.min * factor + addonSum).toFixed(1),
      max: (base.max * factor + addonSum).toFixed(1),
      typeTitle: base.title,
      timeline: title,
      addonsCount: addons.length,
    };
  }, [projectType, speed, addons]);

  const toggleAddon = (addon: Addon) => {
    setAddons((current) =>
      current.includes(addon)
        ? current.filter((item) => item !== addon)
        : [...current, addon],
    );
  };

  const handleBook = () => {
    document
      .getElementById("contact-section")
      ?.scrollIntoView({ behavior: "smooth" });
    window.dispatchEvent(
      new CustomEvent("codology:estimate", {
        detail: {
          typeTitle: estimate.typeTitle,
          timeline: estimate.timeline,
          min: estimate.min,
          max: estimate.max,
        },
      }),
    );
  };

  return (
    <section
      id='estimator-section'
      className='w-full border-b-[2.5px] border-indigo-ink bg-paper-dim px-4 py-12 sm:px-8 lg:px-12'
    >
      <div className='mx-auto flex max-w-7xl flex-col gap-10'>
        <div className='border-b-[2px] border-indigo-ink pb-6 text-right'>
          <h2 className='text-[26px] font-black text-indigo-ink sm:text-[34px]'>
            برآورد رایگان زمان و هزینه پروژه شما
          </h2>
          <p className='max-w-2xl pt-2 text-base font-medium text-indigo-light'>
            بدون نیاز به مذاکرات طولانی و قیمت‌های متغیر؛ نوع سایت خود را انتخاب
            کنید تا محدوده سرمایه‌گذاری و تاریخ دقیق تحویل بدون واسطه مشخص گردد.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
          <Card className='craft-card flex flex-col gap-6 rounded-sm bg-paper-light p-6 sm:p-8 lg:col-span-7'>
            <div>
              <span className='mb-3 flex items-center gap-2 text-[16px] font-black text-indigo-ink'>
                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-coral font-mono text-xs text-white'>
                  ۱
                </span>
                <span>نوع وب‌سایت یا پروژه مورد نیاز:</span>
              </span>
              <RadioGroup
                value={projectType}
                onValueChange={(value) => setProjectType(value as ProjectType)}
                className='grid grid-cols-1 gap-3 sm:grid-cols-2'
              >
                {PROJECT_TYPES.map((type) => {
                  const checked = projectType === type.value;
                  return (
                    <label
                      key={type.value}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-sm border-[2px] p-3.5 transition-colors",
                        checked
                          ? "border-coral bg-coral/10"
                          : "border-indigo-ink bg-paper hover:bg-mustard/20",
                      )}
                    >
                      <div className='flex items-center gap-2.5'>
                        <RadioGroupItem
                          value={type.value}
                          className='shrink-0'
                        />
                        <span className='text-sm font-bold text-indigo-ink'>
                          {type.label}
                        </span>
                      </div>
                      <span className='font-mono text-[12px] font-bold text-coral'>
                        {type.base}
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            <div>
              <span className='mb-3 flex items-center gap-2 text-[16px] font-black text-indigo-ink'>
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
                  const checked = speed === option.value;
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-[2px] p-3 text-center transition-colors",
                        checked
                          ? "border-coral bg-coral/10"
                          : "border-indigo-ink bg-paper hover:bg-mustard/20",
                      )}
                    >
                      <RadioGroupItem
                        value={option.value}
                        className='sr-only'
                      />
                      <div className='text-sm font-bold text-indigo-ink'>
                        {option.title}
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 font-mono text-[11px]",
                          option.noteTone,
                        )}
                      >
                        {option.note}
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            <div>
              <span className='mb-3 flex items-center gap-2 text-[16px] font-black text-indigo-ink'>
                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-coral font-mono text-xs text-white'>
                  ۳
                </span>
                <span>امکانات و ماژول‌های تکمیلی کارگاه:</span>
              </span>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                {ADDONS.map((addon) => {
                  const checked = addons.includes(addon.value);
                  return (
                    <label
                      key={addon.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-sm border-[1.5px] p-3",
                        checked
                          ? "border-coral bg-coral/10"
                          : "border-indigo-ink/40 bg-paper hover:border-indigo-ink",
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleAddon(addon.value)}
                      />
                      <span className='text-xs font-medium text-indigo-ink sm:text-sm'>
                        {addon.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className='craft-card relative flex flex-col justify-between gap-6 rounded-sm bg-paper-light p-6 sm:p-8 lg:col-span-5'>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center justify-between border-b-[2px] border-indigo-ink pb-3'>
                <span className='font-mono text-xs font-bold text-indigo-ink'>
                  INVOICE SUMMARY // پیش‌فاکتور زنده
                </span>
                <span className='riso-stamp text-[10px]'>بدون واسطه</span>
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
                <div className='flex items-center justify-between border-b border-indigo-ink/15 py-1.5'>
                  <span>راه‌اندازی هاست و اتصال دامنه:</span>
                  <span className='font-extrabold text-teal-craft'>
                    ۱۰۰٪ هدیه رایگان
                  </span>
                </div>
              </div>

              <Card className='my-2 flex flex-col gap-1 rounded-sm border-[2px] border-indigo-ink bg-mustard/20 p-4 text-center shadow-craft-inset'>
                <span className='text-xs font-bold text-indigo-ink'>
                  محدوده سرمایه‌گذاری تقریبی
                </span>
                <div className='flex items-baseline justify-center gap-1.5'>
                  <span className='font-display text-[34px] font-black text-coral'>
                    {toPersianDigits(estimate.min)}
                  </span>
                  <span className='text-lg font-black text-indigo-ink'>تا</span>
                  <span className='font-display text-[34px] font-black text-coral'>
                    {toPersianDigits(estimate.max)}
                  </span>
                  <span className='text-sm font-bold text-indigo-ink'>
                    میلیون تومان
                  </span>
                </div>
                <span className='text-[11px] text-indigo-light'>
                  شامل صفر تا صد کدنویسی، رسپانسیو و تحویل نهایی
                </span>
              </Card>
            </div>

            <div className='flex flex-col gap-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleBook}
                className='craft-btn flex h-auto w-full items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink bg-coral py-3.5 text-base font-black text-white'
              >
                <span>تایید برآورد و شروع گفتگو</span>
                <Send className='size-[18px]' />
              </Button>
              <p className='text-center text-[11px] font-medium text-indigo-light'>
                جلسه ۳۰ دقیقه‌ای بدون نیاز به پیش‌پرداخت • بررسی تخصصی
                نیازمندی‌ها
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
