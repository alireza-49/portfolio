"use client";

import Logo from "@/assests/logo";
import { Card } from "@/components/ui/card";
import { cn } from "cn";

/* ---------------------------------------------------------------------------
   برگهٔ مشخصات — the hero's spec sheet.

   A printed data sheet, not a second hero. It reads as one object pinned to
   the hero's paper: a coral quality stamp, a ruled identity strip, one big
   figure (the Lighthouse seal) and a delivery plan. Density comes from four
   quiet zones and one figure — never from nested cards or six-pixel type.
   Every figure is either measured (vitals, scores) or a promise the hero copy
   already makes (delivery window, free consult, own code) — no invented
   document metadata.
   --------------------------------------------------------------------------- */

const SHEET = { score: 100, seo: 100 } as const;

/** What the client actually gets — every line is a promise the hero makes too. */
const FACTS = [
  { term: "زمان تحویل", detail: "۳ تا ۵ روز" },
  { term: "مشاورهٔ رایگان", detail: "۳۰ دقیقه" },
  { term: "کد", detail: "۱۰۰٪ اختصاصی" },
] as const;

const VITALS = [
  { code: "FCP", label: "اولین رنگ", value: "۰٫۷", unit: "s" },
  { code: "LCP", label: "بزرگ‌ترین رنگ", value: "۱٫۲", unit: "s" },
  { code: "TBT", label: "زمان مسدودی", value: "۲۰", unit: "ms" },
  { code: "CLS", label: "جهش چیدمان", value: "۰٫۰۱", unit: "" },
] as const;

const PLAN = [
  { label: "کشف و نیازسنجی", start: 0, span: 1, tone: "bg-coral" },
  { label: "طراحی چیدمان", start: 1, span: 1, tone: "bg-mustard-deep" },
  { label: "کدنویسی", start: 2, span: 2, tone: "bg-indigo-ink" },
  { label: "تست و بهینه‌سازی", start: 3, span: 1, tone: "bg-teal-craft" },
  { label: "تحویل و آموزش", start: 4, span: 1, tone: "bg-coral" },
] as const;
const PLAN_DAYS = ["۱", "۲", "۳", "۴", "۵"] as const;

const STACK = [
  { name: "Next.js", version: "16.4" },
  { name: "React", version: "19.3" },
  { name: "TypeScript", version: "5" },
  { name: "Tailwind", version: "4" },
  { name: "Motion", version: "14.6" },
] as const;

const BARCODE = [
  3, 1, 1, 2, 1, 3, 1, 1, 2, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 1, 2, 1, 3, 1,
] as const;

const PERSIAN_DIGITS = [
  "۰",
  "۱",
  "۲",
  "۳",
  "۴",
  "۵",
  "۶",
  "۷",
  "۸",
  "۹",
] as const;

/** Persian digits for printed figures; Latin strings stay machine-readable. */
function fa(value: number | string) {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/* ------------------------------------------------------------------ pieces */

/** Coral quality stamp — the sheet's only rotation, straightened on hover. */
function SheetStamp() {
  return (
    <span
      aria-hidden
      className='mt-0.5 flex size-14 shrink-0 -rotate-[8deg] flex-col items-center justify-center rounded-full border-[1.5px] border-dashed border-coral bg-coral/[0.07] shadow-craft-coral transition-transform duration-300 group-hover:rotate-0'
    >
      <span className='text-[7.5px] leading-none font-black text-coral'>
        سئو
      </span>
      <span className='mt-1 text-[13px] leading-none font-black text-coral-dark'>
        {fa(SHEET.seo)}
      </span>
    </span>
  );
}

/** 270° gauge: hairline track, teal arc and the score printed in the well. */
function SheetGauge({ score }: { score: number }) {
  return (
    <div className='relative size-[88px] shrink-0'>
      <svg viewBox='0 0 100 100' className='size-full' aria-hidden>
        <path
          d='M21.72 78.28A40 40 0 1 1 78.28 78.28'
          fill='none'
          stroke='var(--color-indigo-ink)'
          strokeOpacity={0.12}
          strokeWidth={5}
        />
        <path
          d='M21.72 78.28A40 40 0 1 1 78.28 78.28'
          fill='none'
          pathLength={100}
          stroke='var(--color-teal-craft)'
          strokeWidth={5}
          strokeLinecap='round'
          strokeDasharray={`${score} ${100 - score}`}
        />
      </svg>
      <div className='absolute inset-0 flex flex-col items-center justify-center pt-1.5'>
        <span className='text-[27px] leading-none font-black text-indigo-ink tabular-nums'>
          {fa(score)}
        </span>
        <span className='mt-1 text-[8px] leading-none font-bold text-indigo-light'>
          از ۱۰۰
        </span>
      </div>
    </div>
  );
}

/** One Core Web Vital: a pass tick, the mono key, its Persian name, the number. */
function Vital({ code, label, value, unit }: (typeof VITALS)[number]) {
  return (
    <div className='min-w-0'>
      <dt className='flex items-center gap-1 text-[9.5px] leading-none font-bold text-indigo-light'>
        <span
          aria-hidden
          className='size-[5px] shrink-0 rounded-[1px] bg-teal-craft'
        />
        <span
          dir='ltr'
          className='shrink-0 font-mono text-[7.5px] font-bold tracking-[0.08em] text-indigo-light/80'
        >
          {code}
        </span>
        <span className='truncate'>{label}</span>
      </dt>
      <dd className='mt-1.5 text-[15px] leading-none font-black text-indigo-ink tabular-nums'>
        {value}
        {unit ? (
          <span
            dir='ltr'
            className='ms-0.5 font-mono text-[8.5px] font-semibold text-indigo-light'
          >
            {unit}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

/** Printed signature squiggle with its dotted baseline. */
function Signature() {
  return (
    <svg
      viewBox='0 0 58 16'
      className='h-3 w-12 text-indigo-ink'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.1}
      strokeLinecap='round'
      aria-hidden
    >
      <path d='M2 11.5c4-7.5 5.5 2 8.5-3s3 4.5 6 1 4 2 6.5-1.5 3 4.5 7 1.5 4.5-3.5 7.5-.5 4 2.5 7 1' />
      <path
        d='M3 14.5h30'
        strokeWidth={0.8}
        strokeDasharray='1.5 2'
        opacity={0.5}
      />
    </svg>
  );
}

/** 26 printed bars — the sheet's printed edge, decoration only. */
function Barcode() {
  return (
    <span aria-hidden dir='ltr' className='flex h-[13px] items-end gap-[1.5px]'>
      {BARCODE.map((width, index) => (
        <span
          key={`${index}-${width}`}
          className='block h-full bg-indigo-ink'
          style={{ width }}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------- sheet */

export function HeroSpecSheet() {
  return (
    <Card className='group relative flex w-full max-w-sm flex-col gap-0 rounded-sm border-[2.5px] border-indigo-ink bg-paper-light py-0 shadow-[6px_6px_0_0_var(--color-mustard)] sm:max-w-md lg:max-w-[29rem]'>
      {/* crop marks — the sheet reads as printed on a bigger bed */}
      <span
        aria-hidden
        className='pointer-events-none absolute -top-[6px] -left-[6px] size-1.5 border-t border-l border-indigo-ink/35'
      />
      <span
        aria-hidden
        className='pointer-events-none absolute -top-[6px] -right-[6px] size-1.5 border-t border-r border-indigo-ink/35'
      />

      {/* A — letterhead: who printed it, what it is, and the stamp */}
      <header className='flex items-start justify-between gap-3 px-5 pt-5 sm:px-6'>
        <div className='flex min-w-0 items-center gap-3'>
          <span
            aria-hidden
            className='flex size-11 shrink-0 items-center justify-center rounded-sm border-[1.5px] border-indigo-ink bg-mustard/30 p-[2px] shadow-craft-sm'
          >
            <Logo className='size-full' />
          </span>
          <div className='flex min-w-0 flex-col gap-[5px]'>
            <span
              dir='ltr'
              className='truncate font-mono text-[7px] font-bold tracking-[0.22em] text-indigo-light/70'
            >
              PHILL WEB DESIGN · CORE WEB VITALS
            </span>
            <h2 className='text-[15px] leading-none font-black text-indigo-ink'>
              شناسنامهٔ فنی
            </h2>
            <span className='truncate text-[10px] leading-none font-medium text-indigo-light'>
              سرعت، سئو و تجربهٔ کاربری
            </span>
          </div>
        </div>
        <SheetStamp />
      </header>

      {/* B — what a buyer checks first: time, entry cost, who owns the code */}
      <dl className='mt-4 grid grid-cols-3 border-y border-indigo-ink/15 bg-paper-dim/60 px-5 sm:px-6'>
        {FACTS.map((fact) => (
          <div
            key={fact.term}
            className='min-w-0 border-s border-indigo-ink/15 py-2 ps-3 first:border-s-0 first:ps-0'
          >
            <dt className='truncate text-[7.5px] font-bold text-indigo-light/80'>
              {fact.term}
            </dt>
            <dd className='mt-1 truncate text-[11px] leading-none font-black text-indigo-ink'>
              {fact.detail}
            </dd>
          </div>
        ))}
      </dl>

      {/* C — the sheet's own claim, one line */}
      <h3 className='font-display px-5 pt-3.5 text-[16px] leading-[1.7] font-black whitespace-nowrap text-indigo-ink sm:px-6 sm:text-[20px]'>
        کد سبک، سرعت بالا،{" "}
        <span className='relative inline-block'>
          <span
            aria-hidden
            className='absolute inset-x-[-3px] bottom-[0.14em] z-0 h-[42%] -rotate-[1deg] rounded-[1px] bg-mustard/45'
          />
          <span className='relative z-10'>فروش حداکثری</span>
        </span>
      </h3>

      {/* D — the figure: score seal + the four vitals on one plate */}
      <div className='mt-3 px-5 sm:px-6'>
        <div className='flex flex-col items-center gap-3.5 rounded-sm border-[1.5px] border-indigo-ink/20 bg-paper-dim/60 p-3.5 sm:flex-row sm:gap-4'>
          <div className='flex w-[88px] shrink-0 flex-col items-center'>
            <SheetGauge score={SHEET.score} />
            <span className='mt-1 text-[8px] font-bold text-indigo-light/80'>
              امتیاز سرعت
            </span>
          </div>
          <dl className='grid w-full min-w-0 grid-cols-2 gap-x-4 gap-y-3 border-t border-indigo-ink/15 pt-3.5 sm:w-auto sm:flex-1 sm:border-t-0 sm:border-s sm:pt-0 sm:ps-4'>
            {VITALS.map((vital) => (
              <Vital key={vital.code} {...vital} />
            ))}
          </dl>
        </div>
        <p className='mt-2 text-[9.5px] font-bold text-indigo-light'>
          هر چهار شاخص در محدودهٔ سبز
        </p>
      </div>

      {/* E — delivery plan: the one chart, on a readable scale */}
      <div className='mt-3.5 border-t border-indigo-ink/15 px-5 pt-3 sm:px-6'>
        <div className='flex items-center justify-between gap-3'>
          <h4 className='text-[11px] font-black text-indigo-ink'>
            برنامهٔ تحویل
          </h4>
          <span className='rounded-[2px] border-[1.5px] border-indigo-ink/25 bg-mustard/35 px-2 py-[2px] text-[8.5px] font-black text-indigo-ink'>
            ۵ روز کاری
          </span>
        </div>
        <div className='mt-2 grid grid-cols-[96px_1fr] gap-2'>
          <span aria-hidden />
          <div aria-hidden className='grid grid-cols-5'>
            {PLAN_DAYS.map((day) => (
              <span
                key={day}
                className='text-center font-mono text-[7.5px] font-bold text-indigo-light/70'
              >
                {day}
              </span>
            ))}
          </div>
        </div>
        <div role='list' className='mt-1 flex flex-col gap-[5px]'>
          {PLAN.map((phase) => (
            <div
              key={phase.label}
              role='listitem'
              className='grid grid-cols-[96px_1fr] items-center gap-2'
            >
              <span className='truncate text-[10px] font-medium text-indigo-ink'>
                {phase.label}
                <span className='sr-only'>
                  ، روز {fa(phase.start + 1)} تا {fa(phase.start + phase.span)}
                </span>
              </span>
              <span className='relative block h-[8px] rounded-[2px] bg-indigo-ink/[0.06]'>
                <span
                  aria-hidden
                  className={cn("absolute inset-y-0 rounded-[2px]", phase.tone)}
                  style={{
                    insetInlineStart: `${phase.start * 20}%`,
                    width: `calc(${phase.span * 20}% - 2px)`,
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* F — the stack, one quiet line */}
      <div
        role='list'
        className='mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-dashed border-indigo-ink/20 px-5 py-2.5 sm:px-6'
      >
        <div role='listitem' className='text-[9.5px] font-black text-indigo-ink'>
          پشتهٔ فنی
        </div>
        {STACK.map((item, index) => (
          <div key={item.name} role='listitem' className='flex items-baseline gap-1'>
            <span aria-hidden className='text-[8px] text-indigo-ink/30'>
              {index === 0 ? "" : "·"}
            </span>
            <span
              dir='ltr'
              className='font-mono text-[8.5px] font-bold text-indigo-ink/80'
            >
              {item.name}
            </span>
            <span
              dir='ltr'
              className='font-mono text-[8.5px] font-black text-coral/90'
            >
              {item.version}
            </span>
          </div>
        ))}
      </div>

      {/* G — title block: barcode and signature, the printed edge */}
      <footer className='dot-grid mt-auto flex items-end justify-between gap-3 border-t-[2.5px] border-indigo-ink bg-paper-dim px-5 py-2.5 sm:px-6'>
        <Barcode />
        <span className='flex items-end gap-2'>
          <span className='text-[8.5px] font-medium text-indigo-light'>امضا</span>
          <Signature />
        </span>
      </footer>
    </Card>
  );
}
