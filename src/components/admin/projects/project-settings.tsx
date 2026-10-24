"use client";

import { cn } from "cn";
import {
  FIELD_CLASS,
  LABEL_CLASS,
} from "@/components/admin/ui";
import { faMoney, faNumber } from "@/lib/fa";
import type { ProjectInput } from "@/lib/types";
import { DraftField } from "./project-basics";

/**
 * Finance + links. Financials only reach the public page when the visitor-facing
 * switch is on, so an internal contract amount never leaks by accident.
 */
export function ProjectSettings({
  draft,
  patch,
}: {
  draft: ProjectInput;
  patch: (values: Partial<ProjectInput>) => void;
}) {
  const remaining = Math.max(0, draft.amount - draft.paid);
  const paidRatio =
    draft.amount > 0 ? Math.min(100, Math.round((draft.paid / draft.amount) * 100)) : 0;

  return (
    <div className='flex flex-col gap-3 p-4 sm:p-5'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <DraftField label='مبلغ کل قرارداد (تومان)'>
          <input
            type='number'
            min={0}
            step={100000}
            value={draft.amount}
            onChange={(event) =>
              patch({ amount: Math.max(0, Number(event.target.value) || 0) })
            }
            className={cn(FIELD_CLASS, "font-mono")}
          />
        </DraftField>
        <DraftField label='مبلغ تسویه‌شده (تومان)'>
          <input
            type='number'
            min={0}
            step={100000}
            value={draft.paid}
            onChange={(event) =>
              patch({ paid: Math.max(0, Number(event.target.value) || 0) })
            }
            className={cn(FIELD_CLASS, "font-mono")}
          />
        </DraftField>
      </div>

      <div className='flex flex-col gap-2 rounded-sm border border-indigo-ink/20 bg-paper p-3'>
        <div className='flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-indigo-light'>
          <span>مانده: {faMoney(remaining)}</span>
          <span className='font-mono'>{faNumber(paidRatio)}٪ تسویه</span>
        </div>
        <div className='h-1.5 overflow-hidden rounded-full bg-paper-shade'>
          <div
            className='h-full rounded-full bg-teal-craft'
            style={{ width: `${paidRatio}%` }}
          />
        </div>
        <label className='mt-1 flex cursor-pointer items-center gap-2 text-[11px] font-bold text-indigo-ink'>
          <input
            type='checkbox'
            checked={draft.showFinancials}
            onChange={(event) =>
              patch({ showFinancials: event.target.checked })
            }
            className='size-4 accent-coral'
          />
          نمایش وضعیت مالی در صفحهٔ رهگیری عمومی
        </label>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <DraftField
          label='نشانی پیش‌نمایش استیجینگ'
          hint='در صورت خالی بودن، دکمهٔ پیش‌نمایش در صفحهٔ عمومی نمایش داده نمی‌شود.'
        >
          <input
            dir='ltr'
            value={draft.stagingUrl}
            onChange={(event) => patch({ stagingUrl: event.target.value })}
            placeholder='https://staging.example.com'
            className={cn(FIELD_CLASS, "font-mono text-left")}
          />
        </DraftField>
        <DraftField
          label='نشانی مخزن کد'
          hint='اختیاری؛ در صفحهٔ عمومی لینک می‌شود.'
        >
          <input
            dir='ltr'
            value={draft.repoUrl}
            onChange={(event) => patch({ repoUrl: event.target.value })}
            placeholder='https://github.com/…'
            className={cn(FIELD_CLASS, "font-mono text-left")}
          />
        </DraftField>
      </div>

      <p className={cn(LABEL_CLASS, "font-medium text-indigo-light")}>
        مبالغ و لینک‌ها فقط پس از ذخیرهٔ پروژه در صفحهٔ رهگیری دیده می‌شوند.
      </p>
    </div>
  );
}
