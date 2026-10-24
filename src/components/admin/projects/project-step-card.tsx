"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { cn } from "cn";
import {
  BTN_GHOST,
  FIELD_CLASS,
  TEXTAREA_CLASS,
} from "@/components/admin/ui";
import { faNumber } from "@/lib/fa";
import {
  PHASE_STATUSES,
  PHASE_STATUS_META,
  type ProjectStep,
} from "@/lib/types";

export function ProjectStepCard({
  step,
  index,
  total,
  onUpdate,
  onMove,
  onRemove,
}: {
  step: ProjectStep;
  index: number;
  total: number;
  onUpdate: (values: Partial<ProjectStep>) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-2.5 overflow-hidden rounded-sm border-[2px] p-3",
        step.status === "active"
          ? "border-coral bg-coral/5"
          : "border-indigo-ink/20 bg-paper",
      )}
    >
      <div className='flex flex-wrap items-center gap-2'>
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-black",
            step.status === "active"
              ? "bg-coral text-white"
              : step.status === "done"
                ? "bg-teal-craft text-white"
                : "bg-paper-shade text-indigo-ink",
          )}
        >
          {faNumber(index + 1)}
        </span>
        <input
          value={step.title}
          onChange={(event) => onUpdate({ title: event.target.value })}
          aria-label={`عنوان گام ${index + 1}`}
          className={cn(
            FIELD_CLASS,
            "min-w-40 flex-1 border-transparent bg-transparent px-1 font-bold",
          )}
        />
        <select
          value={step.status}
          onChange={(event) =>
            onUpdate({ status: event.target.value as ProjectStep["status"] })
          }
          aria-label={`وضعیت گام ${index + 1}`}
          className={cn(FIELD_CLASS, "w-auto font-bold")}
        >
          {PHASE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {PHASE_STATUS_META[status].label}
            </option>
          ))}
        </select>
        <div className='flex items-center gap-1'>
          <button
            type='button'
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label='جابه‌جایی گام به بالا'
            className={BTN_GHOST}
          >
            <ArrowUp className='size-3.5' />
          </button>
          <button
            type='button'
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label='جابه‌جایی گام به پایین'
            className={BTN_GHOST}
          >
            <ArrowDown className='size-3.5' />
          </button>
          <button
            type='button'
            onClick={onRemove}
            aria-label={`حذف گام ${index + 1}`}
            className={cn(BTN_GHOST, "text-coral hover:bg-coral/10")}
          >
            <Trash2 className='size-3.5' />
          </button>
        </div>
      </div>

      <textarea
        value={step.description}
        onChange={(event) => onUpdate({ description: event.target.value })}
        rows={2}
        placeholder='توضیح کوتاه این گام برای کارفرما…'
        aria-label={`توضیح گام ${index + 1}`}
        className={TEXTAREA_CLASS}
      />

      <div className='flex flex-wrap items-center gap-3'>
        <label className='flex items-center gap-2 text-[11px] font-bold text-indigo-ink'>
          پیشرفت
          <input
            type='number'
            min={0}
            max={100}
            value={step.progress}
            onChange={(event) =>
              onUpdate({
                progress: Math.max(
                  0,
                  Math.min(100, Number(event.target.value) || 0),
                ),
              })
            }
            aria-label={`درصد پیشرفت گام ${index + 1}`}
            className={cn(FIELD_CLASS, "w-20 font-mono")}
          />
          <span className='font-mono text-indigo-light'>٪</span>
        </label>
        <label className='flex items-center gap-2 text-[11px] font-bold text-indigo-ink'>
          موعد
          <input
            type='date'
            dir='ltr'
            value={step.dueDate ?? ""}
            onChange={(event) =>
              onUpdate({ dueDate: event.target.value || null })
            }
            aria-label={`موعد گام ${index + 1}`}
            className={cn(FIELD_CLASS, "w-auto font-mono")}
          />
        </label>
        <div className='ms-auto flex min-w-32 items-center gap-2'>
          <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-paper-shade'>
            <div
              className={cn(
                "h-full rounded-full",
                step.status === "done" ? "bg-teal-craft" : "bg-coral",
              )}
              style={{ width: `${step.progress}%` }}
            />
          </div>
          <span className='font-mono text-[10px] font-bold text-indigo-light'>
            {faNumber(step.progress)}٪
          </span>
        </div>
      </div>
    </div>
  );
}
