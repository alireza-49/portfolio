"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { cn } from "cn";
import { StatusPill } from "@/components/admin/ui";
import { faDate, faNumber } from "@/lib/fa";
import {
  PROJECT_STATUS_META,
  type Project,
} from "@/lib/types";

export function ProjectRow({
  project,
  pending,
  onTogglePublish,
  onDelete,
}: {
  project: Project;
  pending: boolean;
  onTogglePublish: (next: boolean) => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const meta = PROJECT_STATUS_META[project.status];

  return (
    <tr className='border-b border-indigo-ink/10 bg-paper-light align-top transition-colors hover:bg-mustard/10'>
      <td className='px-3 py-3'>
        <div className='flex flex-col gap-1'>
          <span className='flex flex-wrap items-center gap-1.5'>
            <span className='rounded-sm border border-indigo-ink/30 bg-paper-dim px-1.5 py-0.5 font-mono text-[0.625rem] font-black text-indigo-ink'>
              {project.code}
            </span>
            <span className='text-[0.8125rem] font-black text-indigo-ink'>
              {project.title}
            </span>
          </span>
          <span className='text-[0.6875rem] font-medium text-indigo-light'>
            {project.clientName || "بدون کارفرما"}
            {project.clientOrg ? ` • ${project.clientOrg}` : ""}
          </span>
        </div>
      </td>
      <td className='px-3 py-3'>
        <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
      </td>
      <td className='px-3 py-3'>
        <div className='flex min-w-32 flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-paper-shade'>
              <div
                className={cn(
                  "h-full rounded-full",
                  project.progress >= 100 ? "bg-teal-craft" : "bg-coral",
                )}
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className='font-mono text-[0.625rem] font-bold text-indigo-light'>
              {faNumber(project.progress)}٪
            </span>
          </div>
          <span className='truncate text-[0.625rem] font-medium text-indigo-light'>
            {project.currentPhase || "بدون فاز فعال"}
          </span>
        </div>
      </td>
      <td className='px-3 py-3'>
        <div className='flex flex-col gap-0.5 text-[0.6875rem] font-medium text-indigo-light'>
          <span>موعد: {faDate(project.dueDate)}</span>
          <span className='font-mono'>آخرین ویرایش: {faDate(project.updatedAt)}</span>
        </div>
      </td>
      <td className='px-3 py-3'>
        <button
          type='button'
          onClick={() => onTogglePublish(!project.published)}
          disabled={pending}
          className={
            project.published
              ? "rounded-sm border-[1.5px] border-teal-craft bg-teal-craft/10 px-2 py-1 text-[0.625rem] font-black text-teal-craft disabled:opacity-60"
              : "rounded-sm border-[1.5px] border-indigo-ink/30 bg-paper px-2 py-1 text-[0.625rem] font-black text-indigo-ink/70 disabled:opacity-60"
          }
        >
          {project.published ? "منتشر شده" : "منتشر نشده"}
        </button>
      </td>
      <td className='px-3 py-3'>
        <div className='flex items-center justify-end gap-1'>
          <Link
            href={`/admin/projects/${project.id}`}
            className='inline-flex items-center gap-1 rounded-sm border border-indigo-ink/30 bg-paper px-2 py-1 text-[0.6875rem] font-black text-indigo-ink transition-colors hover:bg-indigo-ink hover:text-paper'
          >
            <Pencil className='size-3.5' />
            پیشرفت
          </Link>
          {project.published ? (
            <Link
              href={`/track/${project.code}`}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`مشاهدهٔ صفحهٔ رهگیری ${project.code}`}
              className='inline-flex size-7 items-center justify-center rounded-sm border border-indigo-ink/30 bg-paper text-indigo-ink transition-colors hover:bg-mustard/30'
            >
              <ExternalLink className='size-3.5' />
            </Link>
          ) : null}
          <button
            type='button'
            onClick={() => {
              if (!confirmDelete) {
                setConfirmDelete(true);
                return;
              }
              onDelete();
            }}
            disabled={pending}
            aria-label={`حذف پروژهٔ ${project.title}`}
            className={cn(
              "inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-[0.625rem] font-black transition-colors disabled:opacity-60",
              confirmDelete
                ? "border-coral bg-coral text-white"
                : "border-coral/40 bg-coral/10 text-coral hover:bg-coral/20",
            )}
          >
            <Trash2 className='size-3.5' />
            {confirmDelete ? "تأیید حذف" : ""}
          </button>
        </div>
      </td>
    </tr>
  );
}
