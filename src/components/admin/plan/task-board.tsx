"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw } from "lucide-react";
import { cn } from "cn";
import { faDigits } from "@/lib/fa";
import { sortTasks, type TaskSort } from "@/lib/schedule";
import type { Project, ProjectTask } from "@/lib/types";
import {
  BTN_PRIMARY,
  FIELD_CLASS,
  EmptyState,
  LABEL_CLASS,
} from "@/components/admin/ui";
import {
  deleteTaskAction,
  pushTaskAction,
  setTaskDoneAction,
} from "@/app/admin/(console)/plan/actions";
import { TaskRow } from "./task-row";

const SORT_LABELS: Record<TaskSort, string> = {
  start: "زمان شروع",
  end: "زمان پایان",
  title: "عنوان",
  done: "انجام‌نشده‌ها اول",
  project: "پروژه",
};

export function TaskBoard({
  projects,
  tasks,
  sort,
  onSortChange,
  projectFilter,
  onProjectFilterChange,
  showDone,
  onShowDoneChange,
  onCreate,
  onEdit,
}: {
  projects: Project[];
  tasks: ProjectTask[];
  sort: TaskSort;
  onSortChange: (sort: TaskSort) => void;
  projectFilter: string;
  onProjectFilterChange: (projectId: string) => void;
  showDone: boolean;
  onShowDoneChange: (showDone: boolean) => void;
  onCreate: () => void;
  onEdit: (task: ProjectTask) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  const projectTitles = useMemo(
    () => new Map(projects.map((project) => [project.id, project.title])),
    [projects],
  );

  const rows = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (projectFilter !== "all" && task.projectId !== projectFilter) {
        return false;
      }
      return showDone || !task.done;
    });

    return sortTasks(filtered, sort, (projectId) =>
      projectTitles.get(projectId) ?? "",
    );
  }, [tasks, projectFilter, showDone, sort, projectTitles]);

  const run = (task: ProjectTask, work: () => Promise<{ ok: boolean; message: string }>) => {
    setPendingId(task.id);
    startTransition(async () => {
      try {
        const result = await work();
        setNotice({ ok: result.ok, message: result.message });
        if (result.ok) router.refresh();
      } catch {
        setNotice({ ok: false, message: "درخواست ناموفق بود." });
      } finally {
        setPendingId(null);
      }
    });
  };

  return (
    <div className='flex flex-col'>
      <div className='flex flex-wrap items-end gap-2 border-b-[2px] border-dashed border-indigo-ink/20 px-4 py-3'>
        <div className='flex flex-col gap-1'>
          <label htmlFor='plan-project-filter' className={LABEL_CLASS}>
            پروژه
          </label>
          <select
            id='plan-project-filter'
            value={projectFilter}
            onChange={(event) => onProjectFilterChange(event.target.value)}
            className={cn(FIELD_CLASS, "h-9 py-1")}
          >
            <option value='all'>همهٔ پروژه‌ها</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='plan-sort' className={LABEL_CLASS}>
            ترتیب
          </label>
          <select
            id='plan-sort'
            value={sort}
            onChange={(event) => onSortChange(event.target.value as TaskSort)}
            className={cn(FIELD_CLASS, "h-9 py-1")}
          >
            {(Object.keys(SORT_LABELS) as TaskSort[]).map((value) => (
              <option key={value} value={value}>
                {SORT_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <label className='flex h-9 items-center gap-1.5 rounded-sm border-[1.5px] border-indigo-ink/30 bg-paper px-2 text-[11px] font-bold text-indigo-ink'>
          <input
            type='checkbox'
            checked={showDone}
            onChange={(event) => onShowDoneChange(event.target.checked)}
            className='size-3.5 accent-coral'
          />
          نمایش کارهای انجام‌شده
        </label>

        <span className='ms-auto flex items-center gap-3'>
          <span className='font-mono text-[10px] font-bold text-indigo-light'>
            {faDigits(rows.length)} کار
          </span>
          <button type='button' onClick={onCreate} className={BTN_PRIMARY}>
            <Plus className='size-3.5' />
            <span>کار تازه</span>
          </button>
        </span>
      </div>

      {notice ? (
        <p
          role='status'
          aria-live='polite'
          className={cn(
            "mx-4 mt-3 rounded-sm border-[1.5px] px-3 py-2 text-xs font-bold",
            notice.ok
              ? "border-teal-craft bg-teal-craft/10 text-teal-craft"
              : "border-coral bg-coral/10 text-coral-dark",
          )}
        >
          {notice.message}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <div className='p-4'>
          <EmptyState
            title='کاری در این نما نیست'
            description='فیلتر پروژه را بردارید یا نخستین کار را برای یک پروژه ثبت کنید.'
            action={
              <button type='button' onClick={onCreate} className={BTN_PRIMARY}>
                <Plus className='size-3.5' />
                <span>ثبت کار</span>
              </button>
            }
          />
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[860px] border-collapse text-start'>
            <thead>
              <tr className='border-b-[2px] border-indigo-ink/20 bg-paper-dim text-[10px] font-black text-indigo-light'>
                <th className='px-3 py-2 text-start'>کار</th>
                <th className='px-3 py-2 text-start'>پروژه</th>
                <th className='px-3 py-2 text-start'>روز</th>
                <th className='px-3 py-2 text-start'>بازه</th>
                <th className='px-3 py-2 text-start'>مدت</th>
                <th className='px-3 py-2 text-start'>تقویم</th>
                <th className='px-3 py-2 text-end'>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  projectTitle={projectTitles.get(task.projectId) ?? "—"}
                  busy={pending && pendingId === task.id}
                  onEdit={() => onEdit(task)}
                  onDone={(done) =>
                    run(task, () => setTaskDoneAction(task.id, done))
                  }
                  onPush={() => run(task, () => pushTaskAction(task.id))}
                  onDelete={() => run(task, () => deleteTaskAction(task.id))}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pending ? (
        <p className='flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold text-indigo-light'>
          <RefreshCw className='size-3 animate-spin' />
          در حال همگام‌سازی با تقویم…
        </p>
      ) : null}
    </div>
  );
}
