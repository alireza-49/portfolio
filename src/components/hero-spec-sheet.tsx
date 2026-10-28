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
      className='mt-0.5 flex size-12 shrink-0 -rotate-[8deg] flex-col items-center justify-center rounded-full border-[1.5px] border-dashed border-coral bg-coral/[0.07] shadow-craft-coral transition-transform duration-300 group-hover:rotate-0 sm:size-14'
    >
      <span className='text-[0.4375rem] leading-none font-black text-coral sm:text-[0.46875rem]'>
        سئو
      </span>
      <span className='mt-1 text-[0.75rem] leading-none font-black text-coral-dark sm:text-[0.8125rem]'>
        {fa(SHEET.seo)}
      </span>
    </span>
  );
}

/** 270° gauge: hairline track, teal arc and the score printed in the well. */
function SheetGauge({ score }: { score: number }) {
  return (
    <div className='relative size-[4.25rem] shrink-0 sm:size-[5.5rem]'>
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
      <div className='absolute inset-0 flex flex-col items-center justify-center pt-1 sm:pt-1.5'>
        <span className='text-[1.25rem] leading-none font-black text-indigo-ink tabular-nums sm:text-[1.6875rem]'>
          {fa(score)}
        </span>
        <span className='mt-1 text-[0.4375rem] leading-none font-bold text-indigo-light sm:text-[0.5rem]'>
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
      <dt className='flex items-center gap-1 text-[0.59375rem] leading-none font-bold text-indigo-light'>
        <span
          aria-hidden
          className='size-[0.3125rem] shrink-0 rounded-[0.0625rem] bg-teal-craft'
        />
        <span
          dir='ltr'
          className='shrink-0 font-mono text-[0.46875rem] font-bold tracking-[0.08em] text-indigo-light/80'
        >
          {code}
        </span>
        <span className='truncate'>{label}</span>
      </dt>
      <dd className='mt-1.5 text-[0.9375rem] leading-none font-black text-indigo-ink tabular-nums'>
        <span dir='ltr' className='inline-block'>
          {value}
          {unit ? (
            <span className='ms-0.5 font-mono text-[0.53125rem] font-semibold text-indigo-light'>
              {unit}
            </span>
          ) : null}
        </span>
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
    <span aria-hidden dir='ltr' className='flex h-[0.8125rem] items-end gap-[0.09375rem]'>
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
      <header className='flex items-start justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-5'>
        <div className='flex min-w-0 items-center gap-3'>
          <span
            aria-hidden
            className='flex size-9 shrink-0 items-center justify-center rounded-sm border-[1.5px] border-indigo-ink bg-mustard/30 p-[0.125rem] shadow-craft-sm sm:size-11'
          >
            <Logo className='size-full' />
          </span>
          <div className='flex min-w-0 flex-col gap-[0.3125rem]'>
            <span
              dir='ltr'
              className='hidden truncate font-mono text-[0.4375rem] font-bold tracking-[0.22em] text-indigo-light/70 sm:block'
            >
              PHILL WEB DESIGN · CORE WEB VITALS
            </span>
            <h2 className='text-[0.875rem] leading-none font-black text-indigo-ink sm:text-[0.9375rem]'>
              شناسنامهٔ فنی
            </h2>
            <span className='truncate text-[0.625rem] leading-none font-medium text-indigo-light'>
              سرعت، سئو و تجربهٔ کاربری
            </span>
          </div>
        </div>
        <SheetStamp />
      </header>

      {/* B — what a buyer checks first: time, entry cost, who owns the code */}
      <dl className='mt-3 grid grid-cols-3 border-y border-indigo-ink/15 bg-paper-dim/60 px-4 sm:mt-4 sm:px-6'>
        {FACTS.map((fact) => (
          <div
            key={fact.term}
            className='min-w-0 border-s border-indigo-ink/15 py-1.5 ps-2 first:border-s-0 first:ps-0 sm:py-2 sm:ps-3'
          >
            <dt className='truncate text-[0.46875rem] font-bold text-indigo-light/80'>
              {fact.term}
            </dt>
            <dd className='mt-1 truncate text-[0.6875rem] leading-none font-black text-indigo-ink'>
              {fact.detail}
            </dd>
          </div>
        ))}
      </dl>

      {/* C — the sheet's own claim, one line */}
      <h3 className='font-display px-4 pt-3 text-[0.9375rem] leading-[1.7] font-black text-indigo-ink sm:px-6 sm:pt-3.5 sm:text-[1.25rem] sm:whitespace-nowrap'>
        کد سبک، سرعت بالا،{" "}
        <span className='relative inline-block'>
          <span
            aria-hidden
            className='absolute inset-x-[-0.1875rem] bottom-[0.14em] z-0 h-[42%] -rotate-[1deg] rounded-[0.0625rem] bg-mustard/45'
          />
          <span className='relative z-10'>فروش حداکثری</span>
        </span>
      </h3>

      {/* D — the figure: score seal + the four vitals. Phones get the seal and
          four mono numbers on one line; the full vitals plate starts at sm. */}
      <div className='mt-3 px-4 sm:px-6'>
        <div className='flex items-center gap-3 rounded-sm border-[1.5px] border-indigo-ink/20 bg-paper-dim/60 p-3 sm:hidden'>
          <SheetGauge score={SHEET.score} />
          <div className='min-w-0 flex-1'>
            <p className='text-[0.625rem] leading-none font-black text-indigo-ink'>
              امتیاز سرعت
            </p>
            <div className='mt-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1'>
              {VITALS.map((vital) => (
                <span key={vital.code} className='flex items-baseline gap-1'>
                  <span
                    dir='ltr'
                    className='font-mono text-[0.46875rem] font-bold tracking-[0.08em] text-indigo-light/80'
                  >
                    {vital.code}
                  </span>
                  <span
                    dir='ltr'
                    className='inline-block text-[0.625rem] leading-none font-black text-indigo-ink tabular-nums'
                  >
                    {vital.value}
                    {vital.unit ? (
                      <span className='ms-0.5 font-mono text-[0.4375rem] font-semibold text-indigo-light'>
                        {vital.unit}
                      </span>
                    ) : null}
                  </span>
                </span>
              ))}
            </div>
            <p className='mt-2 text-[0.5625rem] leading-none font-bold text-indigo-light'>
              هر چهار شاخص در محدودهٔ سبز
            </p>
          </div>
        </div>

        <div className='hidden sm:block'>
          <div className='flex flex-col items-center gap-3.5 rounded-sm border-[1.5px] border-indigo-ink/20 bg-paper-dim/60 p-3.5 sm:flex-row sm:gap-4'>
            <div className='flex w-[5.5rem] shrink-0 flex-col items-center'>
              <SheetGauge score={SHEET.score} />
              <span className='mt-1 text-[0.5rem] font-bold text-indigo-light/80'>
                امتیاز سرعت
              </span>
            </div>
            <dl className='grid w-full min-w-0 grid-cols-2 gap-x-4 gap-y-3 border-t border-indigo-ink/15 pt-3.5 sm:w-auto sm:flex-1 sm:border-t-0 sm:border-s sm:pt-0 sm:ps-4'>
              {VITALS.map((vital) => (
                <Vital key={vital.code} {...vital} />
              ))}
            </dl>
          </div>
          <p className='mt-2 text-[0.59375rem] font-bold text-indigo-light'>
            هر چهار شاخص در محدودهٔ سبز
          </p>
        </div>
      </div>

      {/* E — delivery plan: the one chart, on a readable scale */}
      <div className='mt-3.5 hidden border-t border-indigo-ink/15 px-5 pt-3 sm:block sm:px-6'>
        <div className='flex items-center justify-between gap-3'>
          <h4 className='text-[0.6875rem] font-black text-indigo-ink'>
            برنامهٔ تحویل
          </h4>
          <span className='rounded-[0.125rem] border-[1.5px] border-indigo-ink/25 bg-mustard/35 px-2 py-[0.125rem] text-[0.53125rem] font-black text-indigo-ink'>
            ۵ روز کاری
          </span>
        </div>
        <div className='mt-2 grid grid-cols-[6rem_1fr] gap-2'>
          <span aria-hidden />
          <div aria-hidden className='grid grid-cols-5'>
            {PLAN_DAYS.map((day) => (
              <span
                key={day}
                className='text-center font-mono text-[0.46875rem] font-bold text-indigo-light/70'
              >
                {day}
              </span>
            ))}
          </div>
        </div>
        <div role='list' className='mt-1 flex flex-col gap-[0.3125rem]'>
          {PLAN.map((phase) => (
            <div
              key={phase.label}
              role='listitem'
              className='grid grid-cols-[6rem_1fr] items-center gap-2'
            >
              <span className='truncate text-[0.625rem] font-medium text-indigo-ink'>
                {phase.label}
                <span className='sr-only'>
                  ، روز {fa(phase.start + 1)} تا {fa(phase.start + phase.span)}
                </span>
              </span>
              <span className='relative block h-[0.5rem] rounded-[0.125rem] bg-indigo-ink/[0.06]'>
                <span
                  aria-hidden
                  className={cn("absolute inset-y-0 rounded-[0.125rem]", phase.tone)}
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
        className='mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-dashed border-indigo-ink/20 px-4 py-2.5 sm:px-6'
      >
        <div role='listitem' className='text-[0.59375rem] font-black text-indigo-ink'>
          پشتهٔ فنی
        </div>
        {STACK.map((item, index) => (
          <div key={item.name} role='listitem' className='flex items-baseline gap-1'>
            <span aria-hidden className='text-[0.5rem] text-indigo-ink/30'>
              {index === 0 ? "" : "·"}
            </span>
            <span
              dir='ltr'
              className='font-mono text-[0.53125rem] font-bold text-indigo-ink/80'
            >
              {item.name}
            </span>
            <span
              dir='ltr'
              className='hidden font-mono text-[0.53125rem] font-black text-coral/90 sm:inline'
            >
              {item.version}
            </span>
          </div>
        ))}
      </div>

      {/* G — title block: barcode and signature, the printed edge */}
      <footer className='dot-grid mt-auto hidden items-end justify-between gap-3 border-t-[2.5px] border-indigo-ink bg-paper-dim px-5 py-2.5 sm:flex sm:px-6'>
        <Barcode />
        <span className='flex items-end gap-2'>
          <span className='text-[0.53125rem] font-medium text-indigo-light'>امضا</span>
          <Signature />
        </span>
      </footer>
    </Card>
  );
}
