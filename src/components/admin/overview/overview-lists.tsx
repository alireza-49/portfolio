import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  PROJECT_STATUS_META,
  SUBMISSION_STATUS_META,
  type Project,
  type Submission,
} from "@/lib/types";
import { faNumber, faRelative } from "@/lib/fa";
import {
  BTN_SECONDARY,
  EmptyState,
  Panel,
  PanelHeading,
  StatusPill,
} from "@/components/admin/ui";

export function RecentSubmissionsPanel({
  submissions,
}: {
  submissions: Submission[];
}) {
  return (
    <Panel>
      <PanelHeading
        eyebrow='LATEST INBOUND'
        title='تازه‌ترین درخواست‌ها'
        actions={
          <Link
            href='/admin/inbox'
            className='inline-flex items-center gap-1 text-[11px] font-black text-coral hover:text-indigo-ink'
          >
            همهٔ درخواست‌ها
            <ArrowLeft className='size-3' />
          </Link>
        }
      />
      <div className='flex flex-col divide-y divide-dashed divide-indigo-ink/15'>
        {submissions.length === 0 ? (
          <div className='p-4'>
            <EmptyState
              title='هنوز درخواستی ثبت نشده است'
              description='فرم تماس سایت هر پیام تازه را همین‌جا نشان می‌دهد.'
            />
          </div>
        ) : (
          submissions.map((submission) => {
            const meta = SUBMISSION_STATUS_META[submission.status];
            return (
              <Link
                key={submission.id}
                href={`/admin/inbox?open=${submission.id}`}
                className='flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-mustard/15 sm:px-5'
              >
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <span className='text-[13px] font-black text-indigo-ink'>
                    {submission.name}
                  </span>
                  <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
                </div>
                <div className='flex flex-wrap items-center justify-between gap-2 text-[11px] font-medium text-indigo-light'>
                  <span>
                    {submission.business || "بدون مجموعه"}
                    {submission.projectType
                      ? ` • ${submission.projectType}`
                      : ""}
                  </span>
                  <span className='font-mono'>
                    {faRelative(submission.createdAt)}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </Panel>
  );
}

export function ActiveProjectsPanel({ projects }: { projects: Project[] }) {
  return (
    <Panel>
      <PanelHeading
        eyebrow='ACTIVE WORKSHOP'
        title='پروژه‌های در جریان'
        actions={
          <Link
            href='/admin/progress'
            className='inline-flex items-center gap-1 text-[11px] font-black text-coral hover:text-indigo-ink'
          >
            تابلوی پیشرفت
            <ArrowLeft className='size-3' />
          </Link>
        }
      />
      <div className='flex flex-col divide-y divide-dashed divide-indigo-ink/15'>
        {projects.length === 0 ? (
          <div className='p-4'>
            <EmptyState
              title='پروژهٔ در جریانی وجود ندارد'
              description='از بخش مدیریت پروژه‌ها یک سفارش تازه ثبت کنید.'
              action={
                <Link href='/admin/projects' className={BTN_SECONDARY}>
                  مدیریت پروژه‌ها
                </Link>
              }
            />
          </div>
        ) : (
          projects.map((project) => {
            const meta = PROJECT_STATUS_META[project.status];
            return (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className='flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-mustard/15 sm:px-5'
              >
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <span className='flex items-center gap-2 text-[13px] font-black text-indigo-ink'>
                    <span className='rounded-sm border border-indigo-ink/30 bg-paper-dim px-1.5 py-0.5 font-mono text-[10px]'>
                      {project.code}
                    </span>
                    {project.title}
                  </span>
                  <StatusPill tone={meta.tone}>{meta.short}</StatusPill>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-paper-shade'>
                    <div
                      className='h-full rounded-full bg-teal-craft'
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className='font-mono text-[10px] font-bold text-indigo-light'>
                    {faNumber(project.progress)}٪
                  </span>
                </div>
                <span className='text-[11px] font-medium text-indigo-light'>
                  {project.currentPhase || "بدون فاز فعال"}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </Panel>
  );
}
