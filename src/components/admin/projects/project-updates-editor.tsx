"use client";

import { Plus, Trash2 } from "lucide-react";
import { cn } from "cn";
import {
  BTN_SECONDARY,
  FIELD_CLASS,
  TEXTAREA_CLASS,
} from "@/components/admin/ui";
import {
  UPDATE_TYPES,
  UPDATE_TYPE_META,
  type ProjectUpdate,
} from "@/lib/types";

function newUpdate(): ProjectUpdate {
  return {
    id: `update-${Date.now().toString(36)}`,
    date: new Date().toISOString().slice(0, 10),
    type: "note",
    title: "",
    body: "",
  };
}

export function ProjectUpdatesEditor({
  updates,
  onChange,
}: {
  updates: ProjectUpdate[];
  onChange: (updates: ProjectUpdate[]) => void;
}) {
  const update = (index: number, values: Partial<ProjectUpdate>) => {
    onChange(
      updates.map((item, position) =>
        position === index ? { ...item, ...values } : item,
      ),
    );
  };

  return (
    <div className='flex flex-col gap-3 p-4 sm:p-5'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p className='max-w-xl text-[11px] leading-relaxed font-medium text-indigo-light'>
          هر ردیف یک به‌روزرسانی کارگاه است و در صفحهٔ رهگیری عمومی زیر
          «لاگ مهندسی» نمایش داده می‌شود.
        </p>
        <button
          type='button'
          onClick={() => onChange([newUpdate(), ...updates])}
          className={BTN_SECONDARY}
        >
          <Plus className='size-3.5' />
          افزودن به‌روزرسانی
        </button>
      </div>

      {updates.length === 0 ? (
        <p className='rounded-sm border-[2px] border-dashed border-indigo-ink/25 bg-paper px-3 py-6 text-center text-xs font-bold text-indigo-light'>
          هنوز به‌روزرسانی‌ای ثبت نشده است.
        </p>
      ) : null}

      <div className='flex flex-col gap-2.5'>
        {updates.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "relative flex flex-col gap-2 rounded-sm border-[2px] bg-paper p-3",
              item.type === "release"
                ? "border-teal-craft/60"
                : "border-indigo-ink/20",
            )}
          >
            <div className='flex flex-wrap items-center gap-2'>
              <input
                type='date'
                dir='ltr'
                value={item.date}
                onChange={(event) => update(index, { date: event.target.value })}
                aria-label={`تاریخ به‌روزرسانی ${index + 1}`}
                className={cn(FIELD_CLASS, "w-auto font-mono")}
              />
              <select
                value={item.type}
                onChange={(event) =>
                  update(index, {
                    type: event.target.value as ProjectUpdate["type"],
                  })
                }
                aria-label={`نوع به‌روزرسانی ${index + 1}`}
                className={cn(FIELD_CLASS, "w-auto font-bold")}
              >
                {UPDATE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {UPDATE_TYPE_META[type].label}
                  </option>
                ))}
              </select>
              <input
                value={item.title}
                onChange={(event) =>
                  update(index, { title: event.target.value })
                }
                placeholder='عنوان کوتاه به‌روزرسانی…'
                aria-label={`عنوان به‌روزرسانی ${index + 1}`}
                className={cn(FIELD_CLASS, "min-w-40 flex-1 font-bold")}
              />
              <button
                type='button'
                onClick={() =>
                  onChange(
                    updates.filter((_, position) => position !== index),
                  )
                }
                aria-label={`حذف به‌روزرسانی ${index + 1}`}
                className='inline-flex size-7 items-center justify-center rounded-sm text-coral transition-colors hover:bg-coral/10'
              >
                <Trash2 className='size-3.5' />
              </button>
            </div>
            <textarea
              value={item.body}
              onChange={(event) => update(index, { body: event.target.value })}
              rows={2}
              placeholder='جزئیات فنی یا یادداشت کارگاه…'
              aria-label={`متن به‌روزرسانی ${index + 1}`}
              className={TEXTAREA_CLASS}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
