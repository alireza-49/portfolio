"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";
import { toPersianDigits, JALALI_MONTHS, PERSIAN_WEEKDAYS } from "@/lib/jalali";
import {
  addJalaliMonths,
  monthGrid,
  tehranWall,
  type JalaliMonth,
} from "@/lib/schedule";
import type { ImportedCalendarEvent, ProjectTask } from "@/lib/types";

/**
 * Month grid for the planner. Jalali has no `Date` equivalent, so the grid comes
 * from `monthGrid()` and day keys stay `YYYY-MM-DD` strings end to end.
 */
export function PlanCalendar({
  month,
  today,
  selectedDay,
  tasks,
  imported,
  canPrev,
  canNext,
  onMonthChange,
  onSelectDay,
}: {
  month: JalaliMonth;
  today: string;
  selectedDay: string | null;
  tasks: ProjectTask[];
  imported: ImportedCalendarEvent[];
  canPrev: boolean;
  canNext: boolean;
  onMonthChange: (month: JalaliMonth) => void;
  onSelectDay: (day: string) => void;
}) {
  const counts = new Map<string, { open: number; done: number; events: number }>();

  const bump = (day: string, key: "open" | "done" | "events") => {
    const current = counts.get(day) ?? { open: 0, done: 0, events: 0 };
    current[key] += 1;
    counts.set(day, current);
  };

  for (const task of tasks) {
    bump(tehranWall(task.startsAt).date, task.done ? "done" : "open");
  }
  for (const event of imported) {
    bump(tehranWall(event.startsAt).date, "events");
  }

  const cells = monthGrid(month);

  return (
    <div className='flex flex-col gap-2 p-4'>
      <div className='flex items-center justify-between gap-2'>
        <button
          type='button'
          disabled={!canPrev}
          onClick={() => onMonthChange(addJalaliMonths(month, -1))}
          aria-label='ماه قبل'
          className='rounded-sm border-[1.5px] border-indigo-ink bg-paper p-1 text-indigo-ink hover:bg-mustard/30 disabled:cursor-not-allowed disabled:opacity-40'
        >
          <ChevronRight className='size-3.5' />
        </button>
        <span className='text-sm font-black text-indigo-ink'>
          {JALALI_MONTHS[month.jm - 1]} {toPersianDigits(month.jy)}
        </span>
        <button
          type='button'
          disabled={!canNext}
          onClick={() => onMonthChange(addJalaliMonths(month, 1))}
          aria-label='ماه بعد'
          className='rounded-sm border-[1.5px] border-indigo-ink bg-paper p-1 text-indigo-ink hover:bg-mustard/30 disabled:cursor-not-allowed disabled:opacity-40'
        >
          <ChevronLeft className='size-3.5' />
        </button>
      </div>

      <div className='grid grid-cols-7 gap-1'>
        {PERSIAN_WEEKDAYS.map((weekday) => (
          <span
            key={weekday}
            className='text-center font-mono text-[0.5625rem] font-bold text-indigo-light'
          >
            {weekday}
          </span>
        ))}

        {cells.map((cell) => {
          const count = counts.get(cell.day);
          const isToday = cell.day === today;
          const isSelected = cell.day === selectedDay;

          return (
            <button
              key={cell.day}
              type='button'
              onClick={() => onSelectDay(cell.day)}
              aria-current={isToday ? "date" : undefined}
              aria-pressed={isSelected}
              title={`${toPersianDigits(cell.jd)} ${JALALI_MONTHS[cell.jm - 1]}`}
              className={cn(
                "relative flex h-14 flex-col items-center justify-start gap-1 rounded-sm border-[1.5px] p-1 transition-colors",
                cell.inMonth
                  ? "border-indigo-ink/15 bg-paper hover:border-indigo-ink/40"
                  : "border-transparent bg-paper-dim/40 hover:border-indigo-ink/20",
                isSelected && "border-indigo-ink bg-coral/10",
                isToday && "ring-2 ring-coral/40",
              )}
            >
              <span
                className={cn(
                  "font-mono text-[0.6875rem] font-black",
                  cell.inMonth ? "text-indigo-ink" : "text-indigo-light/60",
                  isToday && "text-coral-dark",
                )}
              >
                {toPersianDigits(cell.jd)}
              </span>

              {count ? (
                <span className='flex flex-wrap items-center justify-center gap-0.5'>
                  {Array.from({ length: Math.min(count.open, 3) }).map(
                    (_, index) => (
                      <span
                        key={`open-${index}`}
                        className='size-1.5 rounded-full bg-coral'
                      />
                    ),
                  )}
                  {Array.from({ length: Math.min(count.done, 2) }).map(
                    (_, index) => (
                      <span
                        key={`done-${index}`}
                        className='size-1.5 rounded-full bg-teal-craft'
                      />
                    ),
                  )}
                  {count.events > 0 ? (
                    <span className='size-1.5 rounded-full border border-dashed border-indigo-ink/50 bg-indigo-light/40' />
                  ) : null}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
