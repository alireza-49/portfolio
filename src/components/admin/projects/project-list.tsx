"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gauge, Plus } from "lucide-react";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  EmptyState,
  MetricCard,
  PageHeader,
  Panel,
} from "@/components/admin/ui";
import { faNumber } from "@/lib/fa";
import {
  PROJECT_STATUSES,
  type Project,
  type ProjectStatus,
} from "@/lib/types";
import {
  deleteProjectAction,
  setProjectPublishedAction,
} from "@/app/admin/(console)/projects/actions";
import {
  ProjectListToolbar,
  type ProjectFilter,
} from "./project-list-toolbar";
import { ProjectRow } from "./project-row";

export function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const [, startTransition] = useTransition();

  const counts = useMemo(() => {
    const base = Object.fromEntries(
      PROJECT_STATUSES.map((status) => [status, 0]),
    ) as Record<ProjectStatus, number>;
    for (const project of projects) base[project.status] += 1;
    return base;
  }, [projects]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      if (filter !== "all" && project.status !== filter) return false;
      if (!needle) return true;
      return [project.code, project.title, project.clientName, project.clientOrg]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [projects, filter, query]);

  const togglePublish = (project: Project, next: boolean) => {
    setPendingId(project.id);
    setNotice(null);
    startTransition(async () => {
      const result = await setProjectPublishedAction(project.id, next);
      setNotice({ ok: result.ok, message: result.message });
      setPendingId(null);
      if (result.ok) router.refresh();
    });
  };

  const remove = (project: Project) => {
    setPendingId(project.id);
    setNotice(null);
    startTransition(async () => {
      const result = await deleteProjectAction(project.id);
      setNotice({ ok: result.ok, message: result.message });
      setPendingId(null);
      if (result.ok) router.refresh();
    });
  };

  return (
    <div className='flex flex-col gap-5'>
      <PageHeader
        eyebrow='PROJECT LEDGER // WORKSHOP ORDERS'
        title='مدیریت پروژه‌ها و سفارش‌ها'
        description='هر پروژه یک صفحهٔ رهگیری عمومی دارد که با شناسهٔ پروژه باز می‌شود؛ گام‌ها، لاگ مهندسی و وضعیت مالی را از ویرایشگر پیشرفت به‌روز کنید.'
        actions={
          <>
            <Link href='/admin/progress' className={BTN_SECONDARY}>
              <Gauge className='size-3.5' />
              <span>تابلوی پیشرفت</span>
            </Link>
            <Link href='/admin/projects/new' className={BTN_PRIMARY}>
              <Plus className='size-3.5' />
              <span>پروژهٔ تازه</span>
            </Link>
          </>
        }
      />

      <div className='grid grid-cols-2 gap-3 xl:grid-cols-4'>
        <MetricCard
          label='کل پروژه‌ها'
          value={faNumber(projects.length)}
          tone='ink'
          hint={`${faNumber(counts.active)} پروژه فعال`}
        />
        <MetricCard
          label='منتشرشده در رهگیری'
          value={faNumber(
            projects.filter((project) => project.published).length,
          )}
          tone='teal'
          hint='قابل مشاهده برای کارفرما'
        />
        <MetricCard
          label='تحویل‌شده'
          value={faNumber(counts.delivered)}
          tone='mustard'
          hint='آرشیو کارهای تمام‌شده'
        />
        <MetricCard
          label='بایگانی / متوقف'
          value={faNumber(counts.archived + counts.paused)}
          tone='muted'
          hint='خارج از جریان کاری'
        />
      </div>

      {notice ? (
        <p
          role='status'
          aria-live='polite'
          className={
            notice.ok
              ? "rounded-sm border-[1.5px] border-teal-craft bg-teal-craft/10 px-3 py-2 text-xs font-bold text-teal-craft"
              : "rounded-sm border-[1.5px] border-coral bg-coral/10 px-3 py-2 text-xs font-bold text-coral-dark"
          }
        >
          {notice.message}
        </p>
      ) : null}

      <Panel className='overflow-hidden'>
        <ProjectListToolbar
          total={projects.length}
          filteredCount={filtered.length}
          counts={counts}
          query={query}
          onQuery={setQuery}
          filter={filter}
          onFilter={setFilter}
        />

        {filtered.length === 0 ? (
          <div className='p-4 sm:p-5'>
            <EmptyState
              title={
                projects.length === 0
                  ? "هنوز پروژه‌ای ثبت نشده است"
                  : "پروژه‌ای با این فیلتر پیدا نشد"
              }
              description={
                projects.length === 0
                  ? "با «پروژهٔ تازه» اولین سفارش کارگاه را ثبت کنید."
                  : "عبارت جستجو را کوتاه‌تر کنید یا فیلتر وضعیت را آزاد کنید."
              }
              action={
                projects.length === 0 ? (
                  <Link href='/admin/projects/new' className={BTN_PRIMARY}>
                    <Plus className='size-3.5' />
                    ثبت پروژه
                  </Link>
                ) : null
              }
            />
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[980px] border-collapse text-right'>
              <thead>
                <tr className='border-b-[2px] border-indigo-ink bg-paper-dim text-[11px] font-black text-indigo-ink'>
                  <th scope='col' className='px-3 py-2'>پروژه</th>
                  <th scope='col' className='px-3 py-2'>وضعیت</th>
                  <th scope='col' className='px-3 py-2'>پیشرفت</th>
                  <th scope='col' className='px-3 py-2'>زمان‌بندی</th>
                  <th scope='col' className='px-3 py-2'>انتشار</th>
                  <th scope='col' className='px-3 py-2 text-left'>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    pending={pendingId === project.id}
                    onTogglePublish={(next) => togglePublish(project, next)}
                    onDelete={() => remove(project)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
