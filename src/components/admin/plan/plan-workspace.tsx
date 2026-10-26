"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarPlus, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "cn";
import { faDate, faDigits, faNumber } from "@/lib/fa";
import { JALALI_MONTHS, toPersianDigits } from "@/lib/jalali";
import {
  dayEndInstant,
  dayStartInstant,
  faDuration,
  monthGrid,
  sumMinutes,
  type JalaliMonth,
  type TaskSort,
} from "@/lib/schedule";
import type {
  GoogleConnectionState,
  ImportedCalendarEvent,
  Project,
  ProjectTask,
} from "@/lib/types";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  MetricCard,
  PageHeader,
  Panel,
  PanelHeading,
} from "@/components/admin/ui";
import { pullCalendarAction } from "@/app/admin/(console)/plan/actions";
import { DayAgenda } from "./day-agenda";
import { GoogleConnectionCard } from "./google-connection-card";
import { PlanCalendar } from "./plan-calendar";
import { TaskBoard } from "./task-board";
import { TaskForm } from "./task-form";
import { TaskTimeline } from "./task-timeline";

/**
 * Client root of the planner. The server settles the visible month's worth of
 * Google events; everything else (month, day, filters, the open form) is local
 * state so a click never needs a round trip.
 */
export function PlanWorkspace({
  projects,
  tasks,
  imported,
  connection,
  today,
  initialMonth,
  initialProjectId,
  notice,
}: {
  projects: Project[];
  tasks: ProjectTask[];
  imported: ImportedCalendarEvent[];
  connection: GoogleConnectionState;
  today: string;
  initialMonth: JalaliMonth;
  initialProjectId: string | null;
  notice: string | null;
}) {
  const [month, setMonth] = useState<JalaliMonth>(initialMonth);
  const [selectedDay, setSelectedDay] = useState<string | null>(today);
  const [projectFilter, setProjectFilter] = useState<string>(
    initialProjectId ?? "all",
  );
  const [sort, setSort] = useState<TaskSort>("start");
  const [showDone, setShowDone] = useState(true);
  const [showImported, setShowImported] = useState(true);
  const [form, setForm] = useState<{
    task: ProjectTask | null;
    defaultDay: string | null;
    projectId: string | null;
  } | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(
    notice ? { ok: true, message: notice } : null,
  );
  const [pulling, setPulling] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!form) return;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [form]);

  const projectTitles = useMemo(
    () => new Map(projects.map((project) => [project.id, project.title])),
    [projects],
  );

  const days = monthGrid(month).filter((cell) => cell.inMonth);
  const fromIso = dayStartInstant(days[0].day);
  const toIso = dayEndInstant(days[days.length - 1].day);

  const monthTasks = tasks.filter(
    (task) => task.endsAt > fromIso && task.startsAt < toIso,
  );

  const stats = {
    total: monthTasks.length,
    done: monthTasks.filter((task) => task.done).length,
    synced: monthTasks.filter((task) => task.googleSyncState === "synced").length,
    pending: monthTasks.filter(
      (task) =>
        task.googleSyncState === "pending" || task.googleSyncState === "error",
    ).length,
    unsynced: monthTasks.filter((task) => task.googleSyncState !== "synced").length,
    minutes: sumMinutes(monthTasks),
  };

  const pull = () => {
    setPulling(true);
    void pullCalendarAction()
      .then((result) => setFeedback({ ok: result.ok, message: result.message }))
      .catch(() =>
        setFeedback({ ok: false, message: "دریافت تغییرات تقویم ناموفق بود." }),
      )
      .finally(() => setPulling(false));
  };

  const openCreate = (projectId: string | null, day: string | null) =>
    setForm({ task: null, defaultDay: day, projectId });

  const openEdit = (task: ProjectTask) =>
    setForm({ task, defaultDay: null, projectId: task.projectId });

  return (
    <div className='flex flex-col gap-5'>
      <PageHeader
        eyebrow='PLANNER // GOOGLE CALENDAR'
        title='برنامه‌ریزی پروژه‌ها و تقویم'
        description='برای هر پروژه کار تعریف کنید، شروع و پایان را روی تقویم شمسی بگذارید و همان بازه به‌صورت رویداد زمان‌دار در تقویم گوگل ساخته شود.'
        actions={
          <>
            <button
              type='button'
              onClick={pull}
              disabled={pulling || !connection.connected}
              className={BTN_SECONDARY}
              title={
                connection.connected
                  ? "دریافت تغییرات از گوگل"
                  : "ابتدا حساب گوگل را وصل کنید"
              }
            >
              <RefreshCw className={cn("size-3.5", pulling && "animate-spin")} />
              <span>به‌روزرسانی تقویم</span>
            </button>
            <button
              type='button'
              onClick={() => openCreate(null, selectedDay ?? today)}
              className={BTN_PRIMARY}
            >
              <CalendarPlus className='size-3.5' />
              <span>کار تازه</span>
            </button>
          </>
        }
      />

      <div className='flex flex-wrap items-center gap-2 rounded-sm border-[2px] border-indigo-ink bg-paper-dim px-3 py-2'>
        <span className='rounded-sm border border-indigo-ink/30 bg-paper px-2 py-0.5 font-mono text-[11px] font-black text-indigo-ink'>
          {JALALI_MONTHS[month.jm - 1]} {toPersianDigits(month.jy)}
        </span>
        <span className='font-mono text-[11px] font-bold text-indigo-light'>
          امروز: {faDate(today, { withYear: true })}
        </span>
        <span className='ms-auto font-mono text-[11px] font-bold text-indigo-light'>
          {faDigits(monthTasks.length)} کار در این ماه
        </span>
      </div>

      {feedback ? (
        <p
          role='status'
          aria-live='polite'
          className={cn(
            "rounded-sm border-[1.5px] px-3 py-2 text-xs font-bold",
            feedback.ok
              ? "border-teal-craft bg-teal-craft/10 text-teal-craft"
              : "border-coral bg-coral/10 text-coral-dark",
          )}
        >
          {feedback.message}
        </p>
      ) : null}

      <GoogleConnectionCard connection={connection} notice={null} />

      <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        <MetricCard
          label='کارهای این ماه'
          value={faNumber(stats.total)}
          unit='کار'
          hint={`${faNumber(stats.done)} انجام‌شده`}
          tone='coral'
          progress={stats.total ? (stats.done / stats.total) * 100 : 0}
        />
        <MetricCard
          label='همگام با گوگل'
          value={faNumber(stats.synced)}
          unit='رویداد'
          hint={
            stats.total === 0
              ? "هنوز کاری ثبت نشده است"
              : stats.pending > 0
                ? `${faNumber(stats.pending)} در انتظار ارسال یا خطادار`
                : stats.unsynced > 0
                  ? `${faNumber(stats.unsynced)} کار بدون رویداد گوگل`
                  : "همهٔ کارهای این ماه رویداد دارند"
          }
          tone='teal'
          progress={stats.total ? (stats.synced / stats.total) * 100 : 0}
        />
        <MetricCard
          label='زمان برنامه‌ریزی‌شده'
          value={faDuration(stats.minutes)}
          hint='مجموع بازهٔ کارهای این ماه'
          tone='mustard'
        />
        <MetricCard
          label='رویدادهای گوگل'
          value={faNumber(imported.length)}
          unit='رویداد'
          hint='فقط خواندنی، واردشده از تقویم شما'
          tone='ink'
        />
      </div>

      <div ref={formRef}>
        {form ? (
          <TaskForm
            key={form.task?.id ?? `new-${form.defaultDay ?? "today"}`}
            projects={projects}
            task={form.task}
            defaultProjectId={form.projectId}
            defaultDay={form.defaultDay}
            peers={tasks}
            onClose={() => setForm(null)}
            onSaved={(message) => setFeedback({ ok: true, message })}
          />
        ) : null}
      </div>

      <Panel>
        <PanelHeading
          eyebrow='TIMELINE'
          title='تایم‌لاین پروژه‌ها در این ماه'
          description='هر ردیف یک پروژه است؛ نوارها بازهٔ کارها و رویدادهای گوگل را روی روزهای ماه نشان می‌دهند. برای افزودن کار، + کنار نام پروژه را بزنید.'
          actions={
            <>
              <label className='flex items-center gap-1.5 rounded-sm border border-indigo-ink/30 bg-paper px-2 py-1 text-[10px] font-bold text-indigo-ink'>
                <input
                  type='checkbox'
                  checked={showImported}
                  onChange={(event) => setShowImported(event.target.checked)}
                  className='size-3.5 accent-coral'
                />
                رویدادهای گوگل
              </label>
              <button
                type='button'
                onClick={() => openCreate(null, selectedDay ?? today)}
                className={BTN_SECONDARY}
              >
                <Sparkles className='size-3.5' />
                <span>کار تازه</span>
              </button>
            </>
          }
        />
        <TaskTimeline
          projects={projects}
          tasks={tasks}
          imported={imported}
          month={month}
          today={today}
          highlightedProjectId={
            projectFilter === "all" ? null : projectFilter
          }
          showImported={showImported}
          onSelectTask={openEdit}
          onAddTask={(projectId) =>
            openCreate(projectId, selectedDay ?? today)
          }
        />
      </Panel>

      <div className='grid gap-3 lg:grid-cols-[minmax(0,1fr)_340px]'>
        <Panel>
          <PanelHeading
            eyebrow='MONTH'
            title='تقویم ماه'
            description='روزها به تقویم شمسی؛ نقطهٔ کوچک یعنی کاری برای آن روز برنامه‌ریزی شده است.'
          />
          <PlanCalendar
            month={month}
            today={today}
            selectedDay={selectedDay}
            tasks={tasks}
            imported={imported}
            canPrev
            canNext
            onMonthChange={setMonth}
            onSelectDay={setSelectedDay}
          />
        </Panel>

        <Panel>
          <PanelHeading
            eyebrow='DAY'
            title='برنامهٔ روز'
            description='کارهای همان روز به ترتیب ساعت شروع.'
          />
          <DayAgenda
            day={selectedDay}
            tasks={tasks}
            imported={imported}
            projectTitles={projectTitles}
            onSelectTask={openEdit}
            onAddTask={(day) =>
              openCreate(
                projectFilter === "all" ? null : projectFilter,
                day,
              )
            }
          />
        </Panel>
      </div>

      <Panel>
        <PanelHeading
          eyebrow='BOARD'
          title='همهٔ کارها'
          description='فهرست کامل کارها با امکان مرتب‌سازی، ویرایش، علامت انجام‌شدن و ارسال دوباره به تقویم.'
        />
        <TaskBoard
          projects={projects}
          tasks={tasks}
          sort={sort}
          onSortChange={setSort}
          projectFilter={projectFilter}
          onProjectFilterChange={setProjectFilter}
          showDone={showDone}
          onShowDoneChange={setShowDone}
          onCreate={() => openCreate(
            projectFilter === "all" ? null : projectFilter,
            selectedDay ?? today,
          )}
          onEdit={openEdit}
        />
      </Panel>
    </div>
  );
}
