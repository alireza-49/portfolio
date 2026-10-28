"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, LoaderCircle, Pencil, Save } from "lucide-react";
import { cn } from "cn";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  FIELD_CLASS,
  StatusPill,
} from "@/components/admin/ui";
import { faDate, faNumber } from "@/lib/fa";
import {
  PROJECT_STATUSES,
  PROJECT_STATUS_META,
  type Project,
} from "@/lib/types";
import { patchProgressAction } from "@/app/admin/(console)/projects/actions";

export function ProgressCard({ project }: { project: Project }) {
  const router = useRouter();
  const [progress, setProgress] = useState(project.progress);
  const [phase, setPhase] = useState(project.currentPhase);
  const [status, setStatus] = useState(project.status);
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const dirty =
    progress !== project.progress ||
    phase !== project.currentPhase ||
    status !== project.status;

  const save = () => {
    startTransition(async () => {
      const result = await patchProgressAction(project.id, {
        progress,
        currentPhase: phase,
        status,
      });
      setNotice({ ok: result.ok, message: result.message });
      if (result.ok) router.refresh();
    });
  };

  const doneSteps = project.steps.filter(
    (step) => step.status === "done",
  ).length;

  return (
    <div className='flex flex-col gap-3 rounded-md border-[2px] border-indigo-ink bg-paper-light p-4 shadow-craft'>
      <div className='flex flex-wrap items-start justify-between gap-2'>
        <div className='flex min-w-0 flex-col gap-1'>
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='rounded-sm border border-indigo-ink/30 bg-paper-dim px-1.5 py-0.5 font-mono text-[0.625rem] font-black text-indigo-ink'>
              {project.code}
            </span>
            <span className='text-[0.8125rem] font-black text-indigo-ink'>
              {project.title}
            </span>
            <StatusPill tone={PROJECT_STATUS_META[status].tone}>
              {PROJECT_STATUS_META[status].short}
            </StatusPill>
          </div>
          <span className='text-[0.6875rem] font-medium text-indigo-light'>
            {project.clientName || "بدون کارفرما"}
            {project.clientOrg ? ` • ${project.clientOrg}` : ""}
          </span>
        </div>
        <div className='flex items-center gap-1'>
          {project.published ? (
            <Link
              href={`/track/${project.code}`}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`صفحهٔ رهگیری ${project.code}`}
              className='inline-flex size-7 items-center justify-center rounded-sm border border-indigo-ink/30 bg-paper text-indigo-ink transition-colors hover:bg-mustard/30'
            >
              <ExternalLink className='size-3.5' />
            </Link>
          ) : null}
          <Link href={`/admin/projects/${project.id}`} className={BTN_SECONDARY}>
            <Pencil className='size-3.5' />
            ویرایش کامل
          </Link>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]'>
        <div className='flex flex-col gap-2'>
          <label className='flex items-center gap-2 text-[0.6875rem] font-bold text-indigo-ink'>
            پیشرفت
            <input
              type='range'
              min={0}
              max={100}
              value={progress}
              onChange={(event) => setProgress(Number(event.target.value))}
              aria-label={`درصد پیشرفت ${project.title}`}
              className='h-1.5 flex-1 cursor-pointer accent-coral'
            />
            <input
              type='number'
              min={0}
              max={100}
              value={progress}
              onChange={(event) =>
                setProgress(
                  Math.max(0, Math.min(100, Number(event.target.value) || 0)),
                )
              }
              aria-label={`درصد عددی پیشرفت ${project.title}`}
              className={cn(FIELD_CLASS, "w-20 font-mono")}
            />
            <span className='font-mono text-indigo-light'>٪</span>
          </label>

          <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
            <label className='flex flex-col gap-1'>
              <span className='text-[0.625rem] font-bold text-indigo-light'>
                فاز فعال
              </span>
              <input
                value={phase}
                onChange={(event) => setPhase(event.target.value)}
                className={cn(FIELD_CLASS, "py-1.5")}
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-[0.625rem] font-bold text-indigo-light'>
                وضعیت
              </span>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as Project["status"])
                }
                className={cn(FIELD_CLASS, "py-1.5")}
              >
                {PROJECT_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {PROJECT_STATUS_META[value].label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className='flex flex-col justify-between gap-2 rounded-sm border border-indigo-ink/15 bg-paper p-2.5 sm:min-w-44'>
          <div className='flex flex-col gap-1 text-[0.625rem] font-bold text-indigo-light'>
            <span>
              گام‌ها: {faNumber(doneSteps)} از {faNumber(project.steps.length)}{" "}
              تکمیل
            </span>
            <span>موعد: {faDate(project.dueDate)}</span>
            <span className='font-mono'>
              آخرین ویرایش: {faDate(project.updatedAt)}
            </span>
          </div>
          <button
            type='button'
            onClick={save}
            disabled={pending || !dirty}
            className={cn(BTN_PRIMARY, "justify-center")}
          >
            {pending ? (
              <LoaderCircle className='size-3.5 animate-spin' />
            ) : (
              <Save className='size-3.5' />
            )}
            {dirty ? "ثبت پیشرفت" : "به‌روز است"}
          </button>
        </div>
      </div>

      {notice ? (
        <p
          role='status'
          aria-live='polite'
          className={cn(
            "rounded-sm border px-2 py-1 text-[0.6875rem] font-bold",
            notice.ok
              ? "border-teal-craft/40 bg-teal-craft/10 text-teal-craft"
              : "border-coral/40 bg-coral/10 text-coral-dark",
          )}
        >
          {notice.message}
        </p>
      ) : null}
    </div>
  );
}
