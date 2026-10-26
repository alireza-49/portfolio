"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";
import { faDate, faTime } from "@/lib/fa";
import { JALALI_MONTHS, PERSIAN_WEEKDAYS, toPersianDigits } from "@/lib/jalali";
import {
  addJalaliMonths,
  jalaliMonthOf,
  monthGrid,
  tehranInstant,
  tehranWall,
  type JalaliMonth,
} from "@/lib/schedule";
import { LABEL_CLASS } from "@/components/admin/ui";

const HOURS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0"),
);

const MINUTES = Array.from({ length: 12 }, (_, index) =>
  String(index * 5).padStart(2, "0"),
);

/**
 * Jalali date + Tehran time picker for one UTC instant.
 *
 * The stored value stays an ISO instant — this field only translates it into a
 * wall clock on the way in and out, so a formatted Persian date never has to be
 * parsed back into a Date.
 */
export function JalaliDateTimeField({
  label,
  value,
  onChange,
  hint,
  invalid,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (iso: string) => void;
  hint?: string;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const wall = tehranWall(value);
  const [viewMonth, setViewMonth] = useState<JalaliMonth>(() =>
    jalaliMonthOf(wall.date),
  );

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const minutes = MINUTES.includes(wall.time.slice(3))
    ? MINUTES
    : [...MINUTES, wall.time.slice(3)].sort();

  const cells = monthGrid(viewMonth);

  return (
    <div className='flex flex-col gap-1'>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>

      <div ref={wrap} className='relative'>
        <button
          type='button'
          id={id}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-haspopup='dialog'
          className={cn(
            "flex w-full items-center gap-2 rounded-sm border-[2px] bg-paper px-3 py-2 text-sm font-medium text-indigo-ink disabled:cursor-not-allowed disabled:opacity-60",
            invalid ? "border-coral" : "border-indigo-ink",
            "focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/25",
          )}
        >
          <CalendarDays className='size-4 shrink-0 text-indigo-light' />
          <span>{faDate(wall.date, { withYear: true })}</span>
          <span className='ms-auto font-mono text-xs font-bold text-teal-craft'>
            {faTime(value)}
          </span>
        </button>

        {open ? (
          <div
            role='dialog'
            aria-label={`انتخاب ${label}`}
            className='absolute inset-x-0 top-full z-30 mt-1 flex flex-col gap-2 rounded-sm border-[2px] border-indigo-ink bg-paper-light p-2 shadow-craft-lg'
          >
            <div className='flex items-center justify-between gap-2'>
              <button
                type='button'
                onClick={() => setViewMonth((m) => addJalaliMonths(m, -1))}
                aria-label='ماه قبل'
                className='rounded-sm border border-indigo-ink/30 bg-paper p-1 text-indigo-ink hover:bg-mustard/30'
              >
                <ChevronRight className='size-3.5' />
              </button>
              <span className='text-xs font-black text-indigo-ink'>
                {JALALI_MONTHS[viewMonth.jm - 1]} {toPersianDigits(viewMonth.jy)}
              </span>
              <button
                type='button'
                onClick={() => setViewMonth((m) => addJalaliMonths(m, 1))}
                aria-label='ماه بعد'
                className='rounded-sm border border-indigo-ink/30 bg-paper p-1 text-indigo-ink hover:bg-mustard/30'
              >
                <ChevronLeft className='size-3.5' />
              </button>
            </div>

            <div className='grid grid-cols-7 gap-1 text-center'>
              {PERSIAN_WEEKDAYS.map((weekday) => (
                <span
                  key={weekday}
                  className='font-mono text-[9px] font-bold text-indigo-light'
                >
                  {weekday}
                </span>
              ))}
              {cells.map((cell) => (
                <button
                  key={cell.day}
                  type='button'
                  onClick={() => onChange(tehranInstant(cell.day, wall.time))}
                  aria-current={cell.day === wall.date ? "date" : undefined}
                  className={cn(
                    "rounded-sm border py-1 font-mono text-[11px] font-bold transition-colors",
                    cell.inMonth
                      ? "border-transparent text-indigo-ink hover:bg-mustard/30"
                      : "border-transparent text-indigo-light/50 hover:bg-mustard/20",
                    cell.day === wall.date &&
                      "border-indigo-ink bg-coral text-white hover:bg-coral",
                  )}
                >
                  {toPersianDigits(cell.jd)}
                </button>
              ))}
            </div>

            <div className='flex items-center gap-2 border-t border-dashed border-indigo-ink/20 pt-2'>
              <ClockIcon />
              <select
                aria-label='ساعت'
                value={wall.time.slice(0, 2)}
                onChange={(event) =>
                  onChange(
                    tehranInstant(
                      wall.date,
                      `${event.target.value}:${wall.time.slice(3)}`,
                    ),
                  )
                }
                className='rounded-sm border-[1.5px] border-indigo-ink bg-paper px-2 py-1 font-mono text-xs font-bold'
              >
                {HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {toPersianDigits(hour)}
                  </option>
                ))}
              </select>
              <span className='font-mono text-xs font-black text-indigo-light'>
                :
              </span>
              <select
                aria-label='دقیقه'
                value={wall.time.slice(3)}
                onChange={(event) =>
                  onChange(
                    tehranInstant(
                      wall.date,
                      `${wall.time.slice(0, 2)}:${event.target.value}`,
                    ),
                  )
                }
                className='rounded-sm border-[1.5px] border-indigo-ink bg-paper px-2 py-1 font-mono text-xs font-bold'
              >
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {toPersianDigits(minute)}
                  </option>
                ))}
              </select>
              <span className='ms-auto text-[10px] font-bold text-indigo-light'>
                {faTime(value)} به وقت تهران
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {hint ? (
        <p className='text-[10px] font-medium text-indigo-light'>{hint}</p>
      ) : null}
    </div>
  );
}

function ClockIcon() {
  return (
    <span
      aria-hidden
      className='font-mono text-[10px] font-black text-indigo-light'
    >
      HH:MM
    </span>
  );
}
