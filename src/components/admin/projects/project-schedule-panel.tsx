"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, ExternalLink, LoaderCircle, Plus } from "lucide-react";
import { cn } from "cn";
import { faDate, faDigits, faTimeRange } from "@/lib/fa";
import {
  addDays,
  faDuration,
  shiftInstant,
  tehranInstant,
  tehranWall,
} from "@/lib/schedule";
import {
  PROJECT_TASK_SYNC_META,
  type ProjectTask,
  type ProjectTaskSyncState,
} from "@/lib/types";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  FIELD_CLASS,
  LABEL_CLASS,
  StatusPill,
} from "@/components/admin/ui";
import { createTaskAction } from "@/app/admin/(console)/plan/actions";
import { JalaliDateTimeField } from "@/components/admin/plan/jalali-date-time-field";

const DURATIONS = [30, 60, 90, 120] as const;

/** First full hour after the server's clock, anchored on Tehran wall time. */
function nextHourInstant(now: string): string {
  const wall = tehranWall(now);
  const hour = Number(wall.time.slice(0, 2));
  const nextHour = (hour + 1) % 24;
  const day = nextHour === 0 ? addDays(wall.date, 1) : wall.date;
  return tehranInstant(day, `${String(nextHour).padStart(2, "0")}:00`);
}

/**
 * Panel 05 of the project editor: the schedule side of one project. The full
 * planner stays the place to plan across projects; this panel is the shortcut
 * that lives where the project is edited.
 */
export function ProjectSchedulePanel({
  projectId,
  tasks,
  startDate,
  dueDate,
  now,
}: {
  projectId: string;
  tasks: ProjectTask[];
  startDate: string | null;
  dueDate: string | null;
  now: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<number>(60);
  const [startsAt, setStartsAt] = useState(() => nextHourInstant(now));
  const [notice, setNotice] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  const ordered = useMemo(
    () => [...tasks].sort((left, right) => left.startsAt.localeCompare(right.startsAt)),
    [tasks],
  );

  const upcoming = ordered.find((task) => !task.done);

  const rollup = ordered.reduce<Record<ProjectTaskSyncState, number>>(
    (counts, task) => {
      counts[task.googleSyncState] += 1;
      return counts;
    },
    { pending: 0, synced: 0, error: 0, skipped: 0 },
  );

  const add = () => {
    setNotice(null);

    if (title.trim().length < 2) {
      setNotice({ ok: false, message: "عنوان کار باید حداقل ۲ کاراکتر باشد." });
      return;
    }

    startTransition(async () => {
      const result = await createTaskAction({
        projectId,
        title: title.trim(),
        note: "",
        startsAt,
        endsAt: shiftInstant(startsAt, duration),
        done: false,
      });

      setNotice({ ok: result.ok, message: result.message });
      if (result.ok) {
        setTitle("");
        router.refresh();
      }
    });
  };

  const syncedTotal = rollup.synced + rollup.pending + rollup.error + rollup.skipped;

  return (
    <div className='flex flex-col gap-3 px-4 py-4'>
      <div className='flex flex-wrap items-center gap-2 rounded-sm border border-indigo-ink/20 bg-paper-dim px-3 py-2'>
        <span className='text-[11px] font-black text-indigo-ink'>
          بازهٔ پروژه:
        </span>
        <span className='font-mono text-[11px] font-bold text-indigo-light'>
          {faDate(startDate, { withYear: true })} → {faDate(dueDate, { withYear: true })}
        </span>
        <span className='ms-auto font-mono text-[11px] font-bold text-indigo-light'>
          {faDigits(ordered.length)} کار
        </span>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        {(
          ["synced", "pending", "error", "skipped"] as ProjectTaskSyncState[]
        ).map((state) =>
          rollup[state] > 0 ? (
            <StatusPill key={state} tone={PROJECT_TASK_SYNC_META[state].tone}>
              {PROJECT_TASK_SYNC_META[state].label} •{" "}
              {faDigits(rollup[state])}
            </StatusPill>
          ) : null,
        )}
        {syncedTotal === 0 ? (
          <span className='text-[11px] font-bold text-indigo-light'>
            هنوز کاری برای این پروژه زمان‌بندی نشده است.
          </span>
        ) : null}
        <Link
          href={`/admin/plan?project=${projectId}`}
          className={cn(BTN_SECONDARY, "ms-auto")}
        >
          <CalendarClock className='size-3.5' />
          <span>باز کردن در برنامه‌ریز</span>
        </Link>
      </div>

      {upcoming ? (
        <div className='flex flex-wrap items-center gap-2 rounded-sm border-[1.5px] border-teal-craft bg-teal-craft/10 px-3 py-2'>
          <span className='text-[10px] font-black text-teal-craft'>
            کار بعدی
          </span>
          <span className='text-[11px] font-black text-indigo-ink'>
            {upcoming.title}
          </span>
          <span className='font-mono text-[10px] font-bold text-indigo-light'>
            {faDate(upcoming.startsAt, { withYear: true })} •{" "}
            {faTimeRange(upcoming.startsAt, upcoming.endsAt)}
          </span>
          {upcoming.googleHtmlLink ? (
            <a
              href={upcoming.googleHtmlLink}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='باز کردن رویداد در گوگل'
              className='ms-auto text-teal-craft hover:text-coral'
            >
              <ExternalLink className='size-3.5' />
            </a>
          ) : null}
        </div>
      ) : null}

      {ordered.length > 0 ? (
        <ul className='flex flex-col divide-y divide-indigo-ink/10 rounded-sm border border-indigo-ink/15'>
          {ordered.slice(0, 6).map((task) => {
            const meta = PROJECT_TASK_SYNC_META[task.googleSyncState];
            return (
              <li
                key={task.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5",
                  task.done && "opacity-70",
                )}
              >
                <span className='shrink-0 font-mono text-[10px] font-bold text-indigo-light'>
                  {faDate(task.startsAt)}
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-[11px] font-black text-indigo-ink",
                    task.done && "line-through",
                  )}
                >
                  {task.title}
                </span>
                <span className='shrink-0 font-mono text-[10px] font-bold text-indigo-light'>
                  {faTimeRange(task.startsAt, task.endsAt)}
                </span>
                <StatusPill tone={meta.tone} dot={false} className='shrink-0'>
                  {meta.label}
                </StatusPill>
              </li>
            );
          })}
        </ul>
      ) : null}

      {ordered.length > 6 ? (
        <Link
          href={`/admin/plan?project=${projectId}`}
          className='w-fit text-[11px] font-bold text-coral hover:underline'
        >
          {faDigits(ordered.length - 6)} کار دیگر در برنامه‌ریز
        </Link>
      ) : null}

      <div className='flex flex-col gap-2 rounded-sm border-[1.5px] border-dashed border-indigo-ink/30 bg-paper px-3 py-3'>
        <span className='text-[11px] font-black text-indigo-ink'>
          افزودن سریع کار
        </span>

        <div className='grid gap-2 sm:grid-cols-2'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='schedule-title' className={LABEL_CLASS}>
              عنوان
            </label>
            <input
              id='schedule-title'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={160}
              placeholder='مثلاً بازبینی نسخهٔ اول'
              className={FIELD_CLASS}
            />
          </div>

          <JalaliDateTimeField
            label='شروع'
            value={startsAt}
            onChange={setStartsAt}
            hint={`مدت: ${faDuration(duration)}`}
          />
        </div>

        <div className='flex flex-wrap items-end gap-2'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='schedule-duration' className={LABEL_CLASS}>
              مدت
            </label>
            <select
              id='schedule-duration'
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
              className={cn(FIELD_CLASS, "h-9 py-1")}
            >
              {DURATIONS.map((minutes) => (
                <option key={minutes} value={minutes}>
                  {faDuration(minutes)}
                </option>
              ))}
            </select>
          </div>

          <button
            type='button'
            onClick={add}
            disabled={pending}
            className={BTN_PRIMARY}
          >
            {pending ? (
              <LoaderCircle className='size-3.5 animate-spin' />
            ) : (
              <Plus className='size-3.5' />
            )}
            <span>{pending ? "در حال ثبت…" : "افزودن و ارسال به تقویم"}</span>
          </button>
        </div>

        {notice ? (
          <p
            role='status'
            aria-live='polite'
            className={cn(
              "rounded-sm border-[1.5px] px-3 py-2 text-[11px] font-bold",
              notice.ok
                ? "border-teal-craft bg-teal-craft/10 text-teal-craft"
                : "border-coral bg-coral/10 text-coral-dark",
            )}
          >
            {notice.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
