"use client";

import { ExternalLink, Plus } from "lucide-react";
import { cn } from "cn";
import { faDate, faDigits, faTimeRange } from "@/lib/fa";
import { toPersianDigits } from "@/lib/jalali";
import {
  dayEndInstant,
  dayStartInstant,
  faDuration,
  monthGrid,
  windowPosition,
  type JalaliMonth,
} from "@/lib/schedule";
import {
  PROJECT_TASK_SYNC_META,
  type ImportedCalendarEvent,
  type Project,
  type ProjectTask,
  type ProjectTaskSyncState,
} from "@/lib/types";
import { EmptyState, StatusPill } from "@/components/admin/ui";

const BAR_TONE: Record<ProjectTaskSyncState, string> = {
  synced: "border-indigo-ink bg-teal-craft/70",
  pending: "border-indigo-ink bg-mustard/80",
  error: "border-coral bg-coral/30",
  skipped: "border-indigo-ink/50 bg-indigo-light/25",
};

type Lane = { event: ImportedCalendarEvent; lane: number };

/** Greedy lane packing so overlapping imported events stay readable. */
function packLanes(events: ImportedCalendarEvent[]): Lane[] {
  const ends: number[] = [];
  return events.map((event) => {
    const start = Date.parse(event.startsAt);
    const end = Date.parse(event.endsAt);
    let lane = ends.findIndex((laneEnd) => laneEnd <= start);
    if (lane === -1) {
      lane = ends.length;
      ends.push(end);
    } else {
      ends[lane] = end;
    }
    return { event, lane };
  });
}

/**
 * One lane per project for the visible Jalali month.
 *
 * Bars are placed with logical properties (`insetInlineStart`), so the axis
 * flows right→left in RTL without a `dir="ltr"` wrapper — the same direction the
 * console's income chart already uses.
 */
export function TaskTimeline({
  projects,
  tasks,
  imported,
  month,
  today,
  highlightedProjectId,
  showImported,
  onSelectTask,
  onAddTask,
}: {
  projects: Project[];
  tasks: ProjectTask[];
  imported: ImportedCalendarEvent[];
  month: JalaliMonth;
  today: string;
  highlightedProjectId: string | null;
  showImported: boolean;
  onSelectTask: (task: ProjectTask) => void;
  onAddTask: (projectId: string) => void;
}) {
  const days = monthGrid(month).filter((cell) => cell.inMonth);
  const fromIso = dayStartInstant(days[0].day);
  const toIso = dayEndInstant(days[days.length - 1].day);

  const ordered = [...projects].sort((left, right) => {
    if (left.startDate && right.startDate) {
      return left.startDate.localeCompare(right.startDate);
    }
    if (left.startDate) return -1;
    if (right.startDate) return 1;
    return left.title.localeCompare(right.title, "fa");
  });

  const visibleImported = showImported
    ? imported
        .filter(
          (event) => event.endsAt > fromIso && event.startsAt < toIso,
        )
        .sort((left, right) => left.startsAt.localeCompare(right.startsAt))
    : [];

  const lanes = packLanes(visibleImported);
  const laneCount = lanes.reduce(
    (max, item) => Math.max(max, item.lane + 1),
    0,
  );

  if (ordered.length === 0) {
    return (
      <div className='p-4'>
        <EmptyState
          title='هنوز پروژه‌ای برای زمان‌بندی نیست'
          description='پس از ثبت نخستین پروژه، تایم‌لاین سه‌ماهه همین‌جا ساخته می‌شود.'
        />
      </div>
    );
  }

  return (
    <div className='flex flex-col'>
      <div className='overflow-x-auto'>
        <div className='min-w-[45rem]'>
          <div className='flex items-center border-b-[2px] border-indigo-ink/20 bg-paper-dim'>
            <div className='sticky start-0 z-20 w-36 shrink-0 border-e border-indigo-ink/20 bg-paper-dim px-2 py-1.5'>
              <span className='text-[0.625rem] font-black text-indigo-light'>
                پروژه / روز
              </span>
            </div>
            <div className='flex flex-1 items-stretch'>
              {days.map((day) => (
                <div
                  key={day.day}
                  className={cn(
                    "flex-1 border-s border-indigo-ink/5 py-1 text-center font-mono text-[0.5625rem] font-bold",
                    day.day === today
                      ? "bg-coral/15 text-coral-dark"
                      : "text-indigo-light",
                  )}
                >
                  {toPersianDigits(day.jd)}
                </div>
              ))}
            </div>
          </div>

          <div className='max-h-[26.25rem] overflow-y-auto'>
            {ordered.map((project) => {
              const projectTasks = tasks
                .filter(
                  (task) =>
                    task.projectId === project.id &&
                    task.endsAt > fromIso &&
                    task.startsAt < toIso,
                )
                .sort((left, right) => left.startsAt.localeCompare(right.startsAt));

              const dimmed =
                highlightedProjectId !== null &&
                highlightedProjectId !== project.id;

              return (
                <div
                  key={project.id}
                  className={cn(
                    "flex items-stretch border-b border-indigo-ink/10",
                    dimmed && "opacity-40",
                  )}
                >
                  <div className='sticky start-0 z-20 flex w-36 shrink-0 items-center gap-1 border-e border-indigo-ink/20 bg-paper-light px-2 py-1.5'>
                    <div className='flex min-w-0 flex-col'>
                      <span
                        className='truncate text-[0.6875rem] font-black text-indigo-ink'
                        title={project.title}
                      >
                        {project.title}
                      </span>
                      <span className='font-mono text-[0.5625rem] font-bold text-indigo-light'>
                        {project.code}
                      </span>
                    </div>
                    <button
                      type='button'
                      onClick={() => onAddTask(project.id)}
                      aria-label={`افزودن کار به ${project.title}`}
                      className='ms-auto rounded-sm border border-indigo-ink/25 p-0.5 text-indigo-ink/70 hover:border-coral hover:text-coral'
                    >
                      <Plus className='size-3' />
                    </button>
                  </div>

                  <div className='relative h-11 flex-1'>
                    <div className='absolute inset-0 flex'>
                      {days.map((day) => (
                        <div
                          key={day.day}
                          className={cn(
                            "flex-1 border-s border-indigo-ink/5",
                            day.day === today && "bg-coral/5",
                          )}
                        />
                      ))}
                    </div>

                    <div className='pointer-events-none absolute inset-0'>
                      {projectTasks.map((task) => {
                        const position = windowPosition(
                          task.startsAt,
                          task.endsAt,
                          fromIso,
                          toIso,
                          2,
                        );
                        return (
                          <button
                            key={task.id}
                            type='button'
                            onClick={() => onSelectTask(task)}
                            title={`${task.title} • ${faDate(task.startsAt)} • ${faTimeRange(task.startsAt, task.endsAt)}`}
                            style={{
                              insetInlineStart: `${position.startPct}%`,
                              width: `${position.widthPct}%`,
                            }}
                            className={cn(
                              "pointer-events-auto absolute top-1.5 flex h-8 items-center overflow-hidden rounded-sm border-[1.5px] px-1 transition-transform hover:z-10 hover:-translate-y-0.5",
                              BAR_TONE[task.googleSyncState],
                              task.done && "border-dashed opacity-60",
                            )}
                          >
                            <span className='truncate text-[0.625rem] font-black text-indigo-ink'>
                              {task.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {laneCount > 0 ? (
              <div className='flex items-stretch border-b border-indigo-ink/10 bg-paper-dim/60'>
                <div className='sticky start-0 z-20 flex w-36 shrink-0 flex-col justify-center border-e border-indigo-ink/20 bg-paper-dim px-2 py-1.5'>
                  <span className='text-[0.625rem] font-black text-indigo-light'>
                    تقویم گوگل
                  </span>
                  <span className='text-[0.5625rem] font-bold text-indigo-light/80'>
                    فقط خواندنی
                  </span>
                </div>
                <div
                  className='relative flex-1'
                  style={{ height: Math.max(1, laneCount) * 12 + 8 }}
                >
                  <div className='absolute inset-0 flex'>
                    {days.map((day) => (
                      <div
                        key={day.day}
                        className={cn(
                          "flex-1 border-s border-indigo-ink/5",
                          day.day === today && "bg-coral/5",
                        )}
                      />
                    ))}
                  </div>
                  <div className='pointer-events-none absolute inset-0'>
                    {lanes.map(({ event, lane }) => {
                      const position = windowPosition(
                        event.startsAt,
                        event.endsAt,
                        fromIso,
                        toIso,
                        2,
                      );
                      const style = {
                        insetInlineStart: `${position.startPct}%`,
                        width: `${position.widthPct}%`,
                        top: lane * 12 + 4,
                      };
                      const className =
                        "pointer-events-auto absolute h-2.5 rounded-full border border-dashed border-indigo-ink/40 bg-indigo-light/30 hover:bg-coral/30";
                      const title = `${event.summary || "رویداد گوگل"} • ${faDate(event.startsAt)} • ${faTimeRange(event.startsAt, event.endsAt)}`;

                      return event.htmlLink ? (
                        <a
                          key={event.id}
                          href={event.htmlLink}
                          target='_blank'
                          rel='noopener noreferrer'
                          title={title}
                          aria-label={event.summary || "رویداد گوگل"}
                          style={style}
                          className={className}
                        />
                      ) : (
                        <span
                          key={event.id}
                          title={title}
                          style={style}
                          className={className}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-3 border-t-[2px] border-dashed border-indigo-ink/20 px-4 py-2'>
        <span className='text-[0.625rem] font-black text-indigo-light'>
          راهنما:
        </span>
        {(["synced", "pending", "error", "skipped"] as ProjectTaskSyncState[]).map(
          (state) => (
            <StatusPill key={state} tone={PROJECT_TASK_SYNC_META[state].tone} dot>
              {PROJECT_TASK_SYNC_META[state].label}
            </StatusPill>
          ),
        )}
        <span className='ms-auto flex items-center gap-1 text-[0.625rem] font-bold text-indigo-light'>
          <ExternalLink className='size-3' />
          {faDigits(lanes.length)} رویداد واردشده •{" "}
          {faDuration(
            Math.round(
              projectMinutes(ordered, tasks, fromIso, toIso),
            ),
          )}
        </span>
      </div>
    </div>
  );
}

function projectMinutes(
  projects: Project[],
  tasks: ProjectTask[],
  fromIso: string,
  toIso: string,
): number {
  const ids = new Set(projects.map((project) => project.id));
  return tasks
    .filter(
      (task) =>
        ids.has(task.projectId) &&
        task.endsAt > fromIso &&
        task.startsAt < toIso,
    )
    .reduce(
      (total, task) =>
        total + Math.max(0, Date.parse(task.endsAt) - Date.parse(task.startsAt)) / 60_000,
      0,
    );
}
