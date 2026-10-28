"use client";

import { CalendarPlus, ExternalLink } from "lucide-react";
import { cn } from "cn";
import { faDate, faTimeRange } from "@/lib/fa";
import { formatWeekday } from "@/lib/jalali";
import { tehranWall } from "@/lib/schedule";
import {
  PROJECT_TASK_SYNC_META,
  type ImportedCalendarEvent,
  type ProjectTask,
} from "@/lib/types";
import { BTN_SECONDARY, EmptyState, StatusPill } from "@/components/admin/ui";

/** Everything that touches one calendar day: planned tasks, then Google's own events. */
export function DayAgenda({
  day,
  tasks,
  imported,
  projectTitles,
  onSelectTask,
  onAddTask,
}: {
  day: string | null;
  tasks: ProjectTask[];
  imported: ImportedCalendarEvent[];
  projectTitles: Map<string, string>;
  onSelectTask: (task: ProjectTask) => void;
  onAddTask: (day: string) => void;
}) {
  if (!day) {
    return (
      <div className='p-4'>
        <EmptyState
          title='یک روز را از تقویم انتخاب کنید'
          description='کارها و رویدادهای همان روز اینجا فهرست می‌شوند.'
        />
      </div>
    );
  }

  const dayTasks = tasks
    .filter((task) => tehranWall(task.startsAt).date === day)
    .sort((left, right) => left.startsAt.localeCompare(right.startsAt));

  const dayEvents = imported
    .filter((event) => tehranWall(event.startsAt).date === day)
    .sort((left, right) => left.startsAt.localeCompare(right.startsAt));

  const empty = dayTasks.length === 0 && dayEvents.length === 0;

  return (
    <div className='flex flex-col'>
      <div className='flex flex-wrap items-center justify-between gap-2 border-b-[2px] border-dashed border-indigo-ink/20 px-4 py-3'>
        <div className='flex flex-col'>
          <span className='text-[0.6875rem] font-black text-indigo-ink'>
            {formatWeekday(day)}
          </span>
          <span className='font-mono text-[0.625rem] font-bold text-indigo-light'>
            {faDate(day, { withYear: true })}
          </span>
        </div>
        <button
          type='button'
          onClick={() => onAddTask(day)}
          className={BTN_SECONDARY}
        >
          <CalendarPlus className='size-3.5' />
          <span>کار تازه</span>
        </button>
      </div>

      <div className='flex flex-col gap-1.5 px-3 py-3'>
        {empty ? (
          <p className='px-1 py-4 text-center text-[0.6875rem] font-bold text-indigo-light'>
            برای این روز کاری برنامه‌ریزی نشده است.
          </p>
        ) : null}

        {dayTasks.map((task) => {
          const meta = PROJECT_TASK_SYNC_META[task.googleSyncState];
          return (
            <button
              key={task.id}
              type='button'
              onClick={() => onSelectTask(task)}
              className={cn(
                "flex w-full items-start gap-2 rounded-sm border-[1.5px] border-indigo-ink/20 bg-paper px-2 py-1.5 text-start transition-colors hover:border-indigo-ink/50 hover:bg-mustard/20",
                task.done && "opacity-70",
              )}
            >
              <span className='mt-0.5 shrink-0 rounded-sm border border-indigo-ink/20 bg-paper-dim px-1 font-mono text-[0.625rem] font-black text-indigo-ink'>
                {faTimeRange(task.startsAt, task.endsAt)}
              </span>
              <span className='flex min-w-0 flex-col gap-0.5'>
                <span
                  className={cn(
                    "truncate text-[0.6875rem] font-black text-indigo-ink",
                    task.done && "line-through",
                  )}
                >
                  {task.title}
                </span>
                <span className='truncate text-[0.625rem] font-bold text-indigo-light'>
                  {projectTitles.get(task.projectId) ?? "پروژهٔ حذف‌شده"}
                </span>
              </span>
              <StatusPill
                tone={meta.tone}
                className='ms-auto shrink-0'
                dot={false}
              >
                {meta.label}
              </StatusPill>
            </button>
          );
        })}

        {dayEvents.length > 0 ? (
          <div className='mt-2 flex flex-col gap-1 border-t border-dashed border-indigo-ink/20 pt-2'>
            <span className='px-1 text-[0.625rem] font-black text-indigo-light'>
              از تقویم گوگل
            </span>
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className='flex items-center gap-2 rounded-sm border border-dashed border-indigo-ink/30 bg-paper-dim px-2 py-1.5'
              >
                <span className='shrink-0 font-mono text-[0.625rem] font-black text-indigo-light'>
                  {faTimeRange(event.startsAt, event.endsAt)}
                </span>
                <span className='min-w-0 flex-1 truncate text-[0.6875rem] font-bold text-indigo-light'>
                  {event.summary || "رویداد گوگل"}
                </span>
                {event.htmlLink ? (
                  <a
                    href={event.htmlLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='باز کردن رویداد در گوگل'
                    className='shrink-0 text-indigo-light hover:text-coral'
                  >
                    <ExternalLink className='size-3' />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
