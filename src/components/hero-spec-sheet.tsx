"use client";

import Logo from "@/assests/logo";
import { Card } from "@/components/ui/card";
import { cn } from "cn";

/* ---------------------------------------------------------------------------
   برگهٔ مشخصات — the hero's spec sheet.

   A printed data sheet, not a second hero: the density comes from ruled
   tables, mono micro-labels and one figure, never from nested cards. Every
   number lives here, and derived figures (budget total, bar widths) are
   computed rather than retyped, so the sheet cannot contradict itself.
   --------------------------------------------------------------------------- */

const SHEET = { ref: "KDG-084", date: "۱۴۰۴/۰۳/۱۲", rev: "C" } as const;

const VITALS = [
  { code: "FCP", label: "اولین رنگ", value: "۰٫۷", unit: "s" },
  { code: "LCP", label: "بزرگ‌ترین رنگ", value: "۱٫۲", unit: "s" },
  { code: "TBT", label: "زمان مسدودی", value: "۲۰", unit: "ms" },
  { code: "CLS", label: "جهش چیدمان", value: "۰٫۰۱", unit: "" },
] as const;

const BUDGET = [
  { label: "تصاویر", kb: 214, tone: "bg-mustard-deep" },
  { label: "فونت", kb: 92, tone: "bg-coral" },
  { label: "جاوااسکریپت", kb: 56, tone: "bg-indigo-ink" },
  { label: "CSS", kb: 18, tone: "bg-teal-craft" },
] as const;
const BUDGET_TOTAL = BUDGET.reduce((sum, row) => sum + row.kb, 0);

const PLAN = [
  { label: "کشف و نیازسنجی", start: 0, span: 1, tone: "bg-coral" },
  { label: "طراحی چیدمان", start: 1, span: 1, tone: "bg-mustard-deep" },
  { label: "کدنویسی", start: 2, span: 2, tone: "bg-indigo-ink" },
  { label: "تست و بهینه‌سازی", start: 3, span: 1, tone: "bg-teal-craft" },
  { label: "تحویل و آموزش", start: 4, span: 1, tone: "bg-coral" },
] as const;
const PLAN_DAYS = ["۱", "۲", "۳", "۴", "۵"] as const;

const STACK = [
  { name: "Next.js", version: "16" },
  { name: "TypeScript", version: "5" },
  { name: "Tailwind", version: "4" },
  { name: "Base UI", version: "—" },
  { name: "Motion", version: "14" },
  { name: "Vercel", version: "Edge" },
] as const;

const NOTES = [
  "گزارش Lighthouse در موبایل، اتصال 4G و نسخهٔ تولید.",
  "وزن صفحه پیش از فشرده‌سازی، شامل همهٔ فونت و تصویر.",
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

/** Persian digits for computed figures; Latin strings stay machine-readable. */
function fa(value: number | string) {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/* ------------------------------------------------------------------ pieces */

/** 270° gauge: hairline track, coral arc and five printed ticks. */
function SheetGauge({ score }: { score: number }) {
  return (
    <div className='relative size-[76px] shrink-0'>
      <svg viewBox='0 0 100 100' className='size-full' aria-hidden>
        <path
          d='M21.72 78.28A40 40 0 1 1 78.28 78.28'
          fill='none'
          stroke='var(--color-indigo-ink)'
          strokeOpacity={0.12}
          strokeWidth={3.5}
        />
        <path
          d='M21.72 78.28A40 40 0 1 1 78.28 78.28'
          fill='none'
          pathLength={100}
          stroke='var(--color-teal-craft)'
          strokeWidth={3.5}
          strokeLinecap='round'
          strokeDasharray={`${score} ${100 - score}`}
        />
      </svg>
      <div className='absolute inset-0 flex flex-col items-center justify-center pt-1'>
        <span className='text-[24px] leading-none font-black text-indigo-ink tabular-nums'>
          {fa(score)}
        </span>
        <span className='mt-1 text-[7.5px] leading-none font-bold text-indigo-light'>
          از ۱۰۰
        </span>
      </div>
    </div>
  );
}

/** One Core Web Vital: pass dot, mono key, label, dotted leader, value. */
function VitalRow({
  code,
  label,
  value,
  unit,
}: {
  code: string;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className='flex items-baseline gap-2 py-[2.5px]'>
      <dt className='flex min-w-0 items-baseline gap-1.5'>
        <span
          aria-hidden
          className='size-[4px] shrink-0 translate-y-[-1px] rounded-[1px] bg-teal-craft'
        />
        <span
          dir='ltr'
          className='shrink-0 font-mono text-[7.5px] font-bold text-indigo-light/80'
        >
          {code}
        </span>
        <span className='truncate text-[9px] font-medium text-indigo-ink'>
          {label}
        </span>
      </dt>
      <dd className='flex min-w-0 flex-1 items-baseline gap-1.5'>
        <span
          aria-hidden
          className='min-w-2 flex-1 translate-y-[-2px] border-b border-dotted border-indigo-ink/25'
        />
        <span className='shrink-0 text-[10px] leading-none font-black text-indigo-ink tabular-nums'>
          {value}
        </span>
        {unit ? (
          <span
            dir='ltr'
            className='shrink-0 font-mono text-[7px] font-semibold text-indigo-light'
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

/** 26 printed bars — decorative, so the serial prints as text next to it. */
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
    <Card
      className='group relative flex w-full max-w-sm flex-col gap-0 rounded-sm border-[2px] border-indigo-ink bg-paper-light py-0 shadow-[6px_6px_0_0_var(--color-mustard)] sm:max-w-md lg:max-w-[30rem]'
    >
      {/* crop marks — the sheet reads as printed on a bigger bed */}
      <span
        aria-hidden
        className='pointer-events-none absolute -top-[6px] -left-[6px] size-1.5 border-t border-l border-indigo-ink/35'
      />
      <span
        aria-hidden
        className='pointer-events-none absolute -top-[6px] -right-[6px] size-1.5 border-t border-r border-indigo-ink/35'
      />

      <span
        aria-hidden
        className='absolute -top-[10px] start-7 rounded-[2px] border-[1.5px] border-indigo-ink bg-paper px-2 py-[1px] font-mono text-[8px] font-bold tracking-[0.14em] text-indigo-ink sm:start-8'
      >
        SPEC / 2025
      </span>

      {/* A — letterhead */}
      <div className='flex items-start gap-2.5 px-5 pt-6 sm:px-6'>
        <span
          aria-hidden
          className='flex size-9 shrink-0 items-center justify-center rounded-sm border-[1.5px] border-indigo-ink bg-mustard/35 p-[3px] shadow-craft-sm'
        >
          <Logo className='size-full' />
        </span>
        <div className='flex flex-col gap-[3px]'>
          <span
            dir='ltr'
            className='font-mono text-[6.5px] font-bold tracking-[0.22em] text-indigo-light/70'
          >
            PHILL WEB DESIGN
          </span>
          <h2 className='text-[13px] leading-none font-black text-indigo-ink'>
            شناسنامهٔ فنی
          </h2>
          <span className='text-[8.5px] leading-none font-medium text-indigo-light'>
            برگهٔ مشخصات کد و عملکرد
          </span>
        </div>
      </div>

      {/* B — title-block meta: ref / date / revision */}
      <dl className='mt-3 grid grid-cols-3 border-y border-indigo-ink/15 bg-paper-dim/60 px-5 sm:px-6'>
        <div className='border-s border-indigo-ink/15 py-1.5 ps-2.5 first:border-s-0 first:ps-0'>
          <dt className='font-mono text-[7px] font-bold tracking-[0.16em] text-indigo-light/80'>
            REF
          </dt>
          <dd className='mt-0.5 text-[9px] leading-none font-black text-indigo-ink tabular-nums'>
            <span dir='ltr'>{SHEET.ref}</span>
          </dd>
        </div>
        <div className='border-s border-indigo-ink/15 py-1.5 ps-2.5'>
          <dt className='font-mono text-[7px] font-bold tracking-[0.16em] text-indigo-light/80'>
            DATE
          </dt>
          <dd className='mt-0.5 text-[9px] leading-none font-black text-indigo-ink tabular-nums'>
            {SHEET.date}
          </dd>
        </div>
        <div className='border-s border-indigo-ink/15 py-1.5 ps-2.5 last:pe-0'>
          <dt className='font-mono text-[7px] font-bold tracking-[0.16em] text-indigo-light/80'>
            REV
          </dt>
          <dd className='mt-0.5 text-[9px] leading-none font-black text-indigo-ink'>
            <span dir='ltr'>{SHEET.rev}</span>
          </dd>
        </div>
      </dl>

      {/* C — the sheet's own claim, stamped at its edge */}
      <div className='flex items-end justify-between gap-4 px-5 pt-4 sm:px-6'>
        <h3 className='font-display text-[19px] leading-[1.4] font-black text-indigo-ink'>
          کد سبک، سرعت بالا،
          <br />
          <span className='relative inline-block'>
            <span
              aria-hidden
              className='absolute inset-x-[-4px] bottom-[0.18em] z-0 h-[38%] -rotate-[0.8deg] rounded-[1px] bg-mustard/40'
            />
            <span className='relative z-10'>تبدیل حداکثری</span>
          </span>
        </h3>
        <span
          aria-hidden
          className='mb-1 flex size-10 shrink-0 -rotate-6 flex-col items-center justify-center rounded-full border-[1.5px] border-dashed border-coral bg-coral/[0.06] transition-transform duration-300 group-hover:rotate-0'
        >
          <span className='font-mono text-[5.5px] leading-none font-bold tracking-[0.18em] text-coral'>
            SPEC
          </span>
          <span className='mt-[2px] text-[10px] leading-none font-black text-coral-dark'>
            ۰۸۴
          </span>
        </span>
      </div>

      {/* D — the figure: score gauge + Core Web Vitals */}
      <div className='mt-3 flex items-center gap-3.5 px-5 sm:px-6'>
        <div className='flex w-[76px] shrink-0 flex-col items-center'>
          <SheetGauge score={100} />
          <span className='mt-1 flex items-baseline gap-0.5'>
            <span
              dir='ltr'
              className='font-mono text-[6px] font-bold tracking-[0.1em] text-indigo-light/70'
            >
              LIGHTHOUSE
            </span>
            <sup aria-hidden className='text-[5px] font-black text-coral'>
              ۱
            </sup>
          </span>
        </div>
        <dl className='min-w-0 flex-1 border-s border-indigo-ink/15 ps-3.5'>
          {VITALS.map((vital) => (
            <VitalRow key={vital.code} {...vital} />
          ))}
        </dl>
      </div>

      <div className='mt-3 border-t border-indigo-ink/15 px-5 pt-3 sm:px-6'>
        <div className='flex items-baseline justify-between'>
          <h4 className='text-[9.5px] font-black text-indigo-ink'>
            برنامهٔ تحویل
          </h4>
          <span className='text-[7.5px] font-bold text-indigo-light'>
            مسیر ۵ روزه
          </span>
        </div>
        <div className='mt-1.5 grid grid-cols-[72px_1fr] gap-2'>
          <span aria-hidden />
          <div aria-hidden className='grid grid-cols-5'>
            {PLAN_DAYS.map((day) => (
              <span
                key={day}
                className='text-center font-mono text-[6.5px] font-bold text-indigo-light/60'
              >
                {day}
              </span>
            ))}
          </div>
        </div>
        <ol className='mt-0.5 flex flex-col gap-[3px]'>
          {PLAN.map((phase) => (
            <li
              key={phase.label}
              className='grid grid-cols-[72px_1fr] items-center gap-2'
            >
              <span className='truncate text-[8px] font-medium text-indigo-ink'>
                {phase.label}
                <span className='sr-only'>
                  ، روز {fa(phase.start + 1)} تا {fa(phase.start + phase.span)}
                </span>
              </span>
              <span className='relative block h-[7px] rounded-[1px] bg-indigo-ink/[0.06]'>
                <span
                  aria-hidden
                  className={cn("absolute inset-y-0 rounded-[1px]", phase.tone)}
                  style={{
                    insetInlineStart: `${phase.start * 20}%`,
                    width: `calc(${phase.span * 20}% - 2px)`,
                  }}
                />
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* G — the stack */}
      <div className='mt-3 border-t border-indigo-ink/15 px-5 pt-3 sm:px-6'>
        <h4 className='text-[9.5px] font-black text-indigo-ink'>پشتهٔ فنی</h4>
        <ul className='mt-1.5 grid grid-cols-2 gap-x-4'>
          {STACK.map((item) => (
            <li key={item.name} className='flex items-baseline gap-1 py-[1px]'>
              <span
                dir='ltr'
                className='shrink-0 font-mono text-[7.5px] font-bold text-indigo-ink/85'
              >
                {item.name}
              </span>
              <span
                aria-hidden
                className='min-w-2 flex-1 translate-y-[-2px] border-b border-dotted border-indigo-ink/25'
              />
              <span
                dir='ltr'
                className='shrink-0 font-mono text-[7.5px] font-black text-coral'
              >
                {item.version}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* H — footnotes */}
      <div className='mt-3 flex flex-col gap-[2px] border-t border-dashed border-indigo-ink/25 px-5 pt-2 pb-2 sm:px-6'>
        {NOTES.map((note, index) => (
          <p
            key={note}
            className='flex items-baseline gap-1 text-[7.5px] leading-[1.7] font-medium text-indigo-light'
          >
            <span aria-hidden className='font-black text-coral'>
              {PERSIAN_DIGITS[index + 1]}
            </span>
            <span>{note}</span>
          </p>
        ))}
      </div>

      {/* I — title block: project, scale, sheet, signature, serial */}
      <div className='dot-grid rounded-b-[2px] border-t-[2px] border-indigo-ink bg-paper-dim px-5 pt-2 pb-2 sm:px-6'>
        <dl className='grid grid-cols-3'>
          <div className='border-s border-indigo-ink/20 ps-2 first:border-s-0 first:ps-0'>
            <dt className='font-mono text-[6px] font-bold tracking-[0.16em] text-indigo-light/70'>
              PROJECT
            </dt>
            <dd className='mt-[2px] text-[8.5px] leading-none font-black text-indigo-ink'>
              وب‌سایت شخصی
            </dd>
          </div>
          <div className='border-s border-indigo-ink/20 ps-2'>
            <dt className='font-mono text-[6px] font-bold tracking-[0.16em] text-indigo-light/70'>
              SCALE
            </dt>
            <dd className='mt-[2px] text-[8.5px] leading-none font-black text-indigo-ink tabular-nums'>
              ۱:۱
            </dd>
          </div>
          <div className='border-s border-indigo-ink/20 ps-2'>
            <dt className='font-mono text-[6px] font-bold tracking-[0.16em] text-indigo-light/70'>
              SHEET
            </dt>
            <dd className='mt-[2px] text-[8.5px] leading-none font-black text-indigo-ink tabular-nums'>
              ۱ از ۱
            </dd>
          </div>
        </dl>
        <div className='mt-2 flex items-end justify-between gap-2 border-t border-indigo-ink/20 pt-1.5'>
          <span className='flex items-end gap-1.5'>
            <Signature />
            <span className='text-[6.5px] font-medium text-indigo-light'>
              امضا
            </span>
          </span>
          <span className='flex items-end gap-1.5'>
            <Barcode />
            <span
              dir='ltr'
              className='font-mono text-[6px] font-bold text-indigo-light/80'
            >
              KDG084
            </span>
          </span>
        </div>
      </div>
    </Card>
  );
}
