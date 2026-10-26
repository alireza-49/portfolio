"use client";

import { useState } from "react";
import { Check, Link2, Pencil, Trash2 } from "lucide-react";
import { cn } from "cn";
import { faDate, faTimeRange } from "@/lib/fa";
import { faDuration } from "@/lib/schedule";
import { PROJECT_TASK_SYNC_META, type ProjectTask } from "@/lib/types";
import { StatusPill } from "@/components/admin/ui";

export function TaskRow({
  task,
  projectTitle,
  busy,
  onEdit,
  onDone,
  onPush,
  onDelete,
}: {
  task: ProjectTask;
  projectTitle: string;
  busy: boolean;
  onEdit: () => void;
  onDone: (done: boolean) => void;
  onPush: () => void;
  onDelete: () => void;
}) {
  const [armed, setArmed] = useState(false);
  const meta = PROJECT_TASK_SYNC_META[task.googleSyncState];
  const minutes = Math.max(
    0,
    (Date.parse(task.endsAt) - Date.parse(task.startsAt)) / 60_000,
  );

  return (
    <tr className={cn("border-b border-indigo-ink/10", task.done && "opacity-70")}>
      <td className='px-3 py-2'>
        <div className='flex min-w-0 flex-col'>
          <span
            className={cn(
              "truncate text-[12px] font-black text-indigo-ink",
              task.done && "line-through",
            )}
          >
            {task.title}
          </span>
          {task.note ? (
            <span className='max-w-72 truncate text-[10px] font-medium text-indigo-light'>
              {task.note}
            </span>
          ) : null}
        </div>
      </td>

      <td className='px-3 py-2'>
        <span className='whitespace-nowrap text-[11px] font-bold text-indigo-ink/80'>
          {projectTitle}
        </span>
      </td>

      <td className='px-3 py-2'>
        <span className='whitespace-nowrap font-mono text-[11px] font-bold text-indigo-ink'>
          {faDate(task.startsAt)}
        </span>
      </td>

      <td className='px-3 py-2'>
        <span className='whitespace-nowrap font-mono text-[11px] font-bold text-indigo-light'>
          {faTimeRange(task.startsAt, task.endsAt)}
        </span>
      </td>

      <td className='px-3 py-2'>
        <span className='whitespace-nowrap text-[10px] font-bold text-indigo-light'>
          {faDuration(minutes)}
        </span>
      </td>

      <td className='px-3 py-2'>
        <div className='flex flex-col items-start gap-1'>
          <StatusPill tone={meta.tone} dot={false}>
            {meta.label}
          </StatusPill>
          {task.googleError && task.googleSyncState === "error" ? (
            <span
              className='max-w-48 truncate text-[9px] font-medium text-coral-dark'
              title={task.googleError}
            >
              {task.googleError}
            </span>
          ) : null}
        </div>
      </td>

      <td className='px-3 py-2'>
        <div className='flex items-center justify-end gap-1'>
          {task.googleHtmlLink ? (
            <a
              href={task.googleHtmlLink}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='باز کردن رویداد در گوگل'
              className='rounded-sm border border-transparent p-1 text-indigo-light hover:bg-mustard/25 hover:text-indigo-ink'
            >
              <Link2 className='size-3.5' />
            </a>
          ) : null}

          <button
            type='button'
            onClick={() => onDone(!task.done)}
            disabled={busy}
            aria-pressed={task.done}
            aria-label={task.done ? "برداشتن علامت انجام‌شدن" : "علامت انجام‌شدن"}
            className={cn(
              "rounded-sm border p-1 disabled:opacity-40",
              task.done
                ? "border-teal-craft bg-teal-craft/15 text-teal-craft"
                : "border-transparent text-indigo-light hover:bg-mustard/25 hover:text-indigo-ink",
            )}
          >
            <Check className='size-3.5' />
          </button>

          <Link2Button onClick={onPush} disabled={busy} />

          <button
            type='button'
            onClick={onEdit}
            aria-label='ویرایش کار'
            className='rounded-sm border border-transparent p-1 text-indigo-light hover:bg-mustard/25 hover:text-indigo-ink'
          >
            <Pencil className='size-3.5' />
          </button>

          <button
            type='button'
            onClick={() => {
              if (!armed) {
                setArmed(true);
                return;
              }
              setArmed(false);
              onDelete();
            }}
            onBlur={() => setArmed(false)}
            disabled={busy}
            aria-label={armed ? 'تأیید حذف کار' : 'حذف کار'}
            className={cn(
              "rounded-sm border p-1 disabled:opacity-40",
              armed
                ? "border-coral bg-coral text-white"
                : "border-transparent text-indigo-light hover:bg-coral/15 hover:text-coral",
            )}
          >
            <Trash2 className='size-3.5' />
          </button>
        </div>
      </td>
    </tr>
  );
}

function Link2Button({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label='ارسال دوباره به تقویم'
      className='rounded-sm border border-transparent p-1 text-indigo-light hover:bg-mustard/25 hover:text-indigo-ink disabled:opacity-40'
    >
      <Link2 className='size-3.5' />
    </button>
  );
}
