"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { borderChrome, labelType, monoType, motion } from "./styles";
import {
  JALALI_MONTHS,
  PERSIAN_WEEKDAYS,
  isoToJalali,
  jalaliMonthLength,
  parseIso,
  toGregorian,
  toIso,
  toPersianDigits,
} from "./jalali";

export type CalendarProps = {
  /** Selected ISO date (`yyyy-mm-dd`). */
  value?: string;
  onValueChange?: (iso: string) => void;
  /** Anchor "today" so SSR and client agree. */
  today: string;
  /** Slots left per ISO date; days without an entry are unavailable. */
  availability?: Record<string, number>;
  className?: string;
};

/**
 * Persian (Jalali) month calendar with availability dots.
 *
 * Kept fully controlled and clock-free: `today` is injected by the caller so
 * the grid renders identically on the server.
 */
export function Calendar({
  value,
  onValueChange,
  today,
  availability = {},
  className,
}: CalendarProps) {
  const initial = isoToJalali(value ?? today);
  const [cursor, setCursor] = useState({ jy: initial.jy, jm: initial.jm });

  const length = jalaliMonthLength(cursor.jy, cursor.jm);
  const firstGregorian = toGregorian(cursor.jy, cursor.jm, 1);
  const firstIso = toIso(
    firstGregorian.gy,
    firstGregorian.gm,
    firstGregorian.gd,
  );
  const { gy, gm, gd } = parseIso(firstIso);
  const leading = (new Date(Date.UTC(gy, gm - 1, gd)).getUTCDay() + 1) % 7;

  const todayJalali = isoToJalali(today);
  const canGoBack =
    cursor.jy > todayJalali.jy ||
    (cursor.jy === todayJalali.jy && cursor.jm > todayJalali.jm);

  const days = Array.from({ length }, (_, index) => {
    const day = index + 1;
    const gregorian = toGregorian(cursor.jy, cursor.jm, day);
    const iso = toIso(gregorian.gy, gregorian.gm, gregorian.gd);
    return {
      day,
      iso,
      slots: availability[iso] ?? 0,
      isPast: iso < today,
      isToday: iso === today,
    };
  });

  const move = (direction: -1 | 1) => {
    setCursor((previous) => {
      let jm = previous.jm + direction;
      let jy = previous.jy;
      if (jm < 1) {
        jm = 12;
        jy -= 1;
      }
      if (jm > 12) {
        jm = 1;
        jy += 1;
      }
      return { jy, jm };
    });
  };

  return (
    <div
      data-cc-calendar=''
      className={cn(
        "flex w-full max-w-[17.5rem] flex-col gap-2 bg-[var(--cc-surface)] p-2",
        "rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
        borderChrome,
        className,
      )}
    >
      <div className='flex items-center justify-between gap-2'>
        <button
          type='button'
          onClick={() => move(-1)}
          disabled={!canGoBack}
          aria-label='ماه قبل'
          className={cn(
            "flex size-7 items-center justify-center rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] text-[color:var(--cc-surface-foreground)]",
            motion,
            "hover:bg-[var(--cc-muted)] disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          <svg viewBox='0 0 16 16' className='size-3.5' aria-hidden='true'>
            <path
              d='M6 3l4 5-4 5'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.8'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        <span
          className={cn(
            "text-xs text-[color:var(--cc-surface-foreground)]",
            labelType,
          )}
        >
          {JALALI_MONTHS[cursor.jm - 1]} {toPersianDigits(cursor.jy)}
        </span>

        <button
          type='button'
          onClick={() => move(1)}
          aria-label='ماه بعد'
          className={cn(
            "flex size-7 items-center justify-center rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] text-[color:var(--cc-surface-foreground)]",
            motion,
            "hover:bg-[var(--cc-muted)]",
          )}
        >
          <svg viewBox='0 0 16 16' className='size-3.5' aria-hidden='true'>
            <path
              d='M10 3l-4 5 4 5'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.8'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>

      <div className='grid grid-cols-7 gap-1'>
        {PERSIAN_WEEKDAYS.map((weekday) => (
          <span
            key={weekday}
            className={`text-center ${monoType} text-[length:calc(var(--cc-font-size)*0.6)] text-[color:var(--cc-muted-foreground)]`}
          >
            {weekday}
          </span>
        ))}

        {Array.from({ length: leading }).map((_, index) => (
          <span key={`blank-${index}`} aria-hidden='true' />
        ))}

        {days.map((day) => {
          const selected = value === day.iso;
          const unavailable = day.isPast || day.slots <= 0;
          return (
            <button
              key={day.iso}
              type='button'
              data-cc-calendar-day={day.iso}
              aria-pressed={selected}
              aria-label={`${toPersianDigits(day.day)} — ${
                day.slots > 0
                  ? `${toPersianDigits(day.slots)} نوبت`
                  : "بدون نوبت"
              }`}
              disabled={unavailable}
              onClick={() => onValueChange?.(day.iso)}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] text-[length:calc(var(--cc-font-size)*0.72)]",
                monoType,
                motion,
                selected
                  ? "border-[color:var(--cc-primary)] bg-[var(--cc-primary)] font-bold text-[color:var(--cc-primary-foreground)] [box-shadow:var(--cc-shadow)]"
                  : "border-transparent text-[color:var(--cc-surface-foreground)] hover:border-[color:var(--cc-border)] hover:bg-[var(--cc-muted)]",
                day.isToday && !selected && "border-[color:var(--cc-primary)]",
                unavailable &&
                  "cursor-not-allowed opacity-35 hover:bg-transparent",
              )}
            >
              {toPersianDigits(day.day)}
              {day.slots > 0 ? (
                <span
                  aria-hidden='true'
                  className={cn(
                    "size-1 rounded-full",
                    selected
                      ? "bg-[var(--cc-primary-foreground)]"
                      : day.slots <= 2
                        ? "bg-[var(--cc-danger)]"
                        : "bg-[var(--cc-success)]",
                  )}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className='flex items-center justify-center gap-3 pt-0.5 text-[length:calc(var(--cc-font-size)*0.6)] text-[color:var(--cc-muted-foreground)]'>
        <span className='flex items-center gap-1'>
          <span className='size-1.5 rounded-full bg-[var(--cc-success)]' />
          نوبت آزاد
        </span>
        <span className='flex items-center gap-1'>
          <span className='size-1.5 rounded-full bg-[var(--cc-danger)]' />
          ظرفیت کم
        </span>
      </div>
    </div>
  );
}

