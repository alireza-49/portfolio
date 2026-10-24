"use client";

import type { ReactNode } from "react";
import { cn } from "cn";
import {
  FIELD_CLASS,
  LABEL_CLASS,
  TEXTAREA_CLASS,
} from "@/components/admin/ui";
import {
  PROJECT_STATUSES,
  PROJECT_STATUS_META,
  type ProjectInput,
} from "@/lib/types";

export function DraftField({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className={LABEL_CLASS}>{label}</span>
      {children}
      {hint ? (
        <span className='text-[10px] leading-relaxed font-medium text-indigo-light'>
          {hint}
        </span>
      ) : null}
    </label>
  );
}

/**
 * Identity + schedule fields, shared by the create form and the full editor so
 * both screens always ask for exactly the same information.
 */
export function ProjectBasics({
  draft,
  patch,
  idPrefix,
}: {
  draft: ProjectInput;
  patch: (values: Partial<ProjectInput>) => void;
  idPrefix: string;
}) {
  return (
    <div className='grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5'>
      <DraftField label='شناسهٔ پروژه (کد رهگیری عمومی)'>
        <input
          dir='ltr'
          value={draft.code}
          onChange={(event) => patch({ code: event.target.value })}
          placeholder='CDL-9402'
          className={cn(FIELD_CLASS, "text-left font-mono")}
        />
      </DraftField>

      <DraftField label='عنوان پروژه'>
        <input
          value={draft.title}
          onChange={(event) => patch({ title: event.target.value })}
          placeholder='پورتال آنلاین کلینیک آریا'
          className={FIELD_CLASS}
        />
      </DraftField>

      <DraftField label='نام کارفرما'>
        <input
          value={draft.clientName}
          onChange={(event) => patch({ clientName: event.target.value })}
          className={FIELD_CLASS}
        />
      </DraftField>

      <DraftField label='مجموعه / برند'>
        <input
          value={draft.clientOrg}
          onChange={(event) => patch({ clientOrg: event.target.value })}
          className={FIELD_CLASS}
        />
      </DraftField>

      <DraftField label='شمارهٔ همراه'>
        <input
          dir='ltr'
          value={draft.clientMobile}
          onChange={(event) => patch({ clientMobile: event.target.value })}
          placeholder='09123456789'
          className={cn(FIELD_CLASS, "text-left font-mono")}
        />
      </DraftField>

      <DraftField label='ایمیل رسمی'>
        <input
          dir='ltr'
          type='email'
          value={draft.clientEmail}
          onChange={(event) => patch({ clientEmail: event.target.value })}
          placeholder='client@example.com'
          className={cn(FIELD_CLASS, "text-left font-mono")}
        />
      </DraftField>

      <DraftField
        label='خلاصهٔ پروژه'
        hint='این متن در صفحهٔ رهگیری عمومی دیده می‌شود.'
        className='sm:col-span-2'
      >
        <textarea
          value={draft.summary}
          onChange={(event) => patch({ summary: event.target.value })}
          rows={3}
          className={TEXTAREA_CLASS}
        />
      </DraftField>

      <DraftField label='وضعیت پروژه'>
        <select
          value={draft.status}
          onChange={(event) =>
            patch({ status: event.target.value as ProjectInput["status"] })
          }
          className={FIELD_CLASS}
        >
          {PROJECT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {PROJECT_STATUS_META[status].label}
            </option>
          ))}
        </select>
      </DraftField>

      <DraftField label='درصد پیشرفت کلی (۰ تا ۱۰۰)'>
        <input
          type='number'
          min={0}
          max={100}
          value={draft.progress}
          onChange={(event) =>
            patch({ progress: Number(event.target.value) || 0 })
          }
          className={cn(FIELD_CLASS, "font-mono")}
        />
      </DraftField>

      <DraftField label='فاز فعال (متن کوتاه)'>
        <input
          value={draft.currentPhase}
          onChange={(event) => patch({ currentPhase: event.target.value })}
          placeholder='فرانت‌اند اختصاصی و اتصال API'
          className={FIELD_CLASS}
        />
      </DraftField>

      <DraftField
        label='شناسه برای پیگیری عمومی'
        hint={
          draft.published
            ? "منتشر است؛ هر کسی با کد پروژه می‌تواند این تابلو را ببیند."
            : "فعلاً در صفحهٔ رهگیری عمومی نمایش داده نمی‌شود."
        }
      >
        <label className='flex h-10 cursor-pointer items-center gap-2 rounded-sm border-[2px] border-indigo-ink bg-paper px-3 text-xs font-bold text-indigo-ink'>
          <input
            type='checkbox'
            checked={draft.published}
            onChange={(event) => patch({ published: event.target.checked })}
            className='size-4 accent-coral'
          />
          صفحهٔ رهگیری منتشر شود
        </label>
      </DraftField>

      <DraftField
        label='تاریخ شروع'
        hint='تاریخ میلادی ذخیره می‌شود و در سایت شمسی نمایش داده می‌شود.'
      >
        <input
          type='date'
          dir='ltr'
          value={draft.startDate ?? ""}
          onChange={(event) =>
            patch({ startDate: event.target.value || null })
          }
          className={cn(FIELD_CLASS, "font-mono")}
        />
      </DraftField>

      <DraftField label='موعد تحویل'>
        <input
          type='date'
          dir='ltr'
          value={draft.dueDate ?? ""}
          onChange={(event) => patch({ dueDate: event.target.value || null })}
          className={cn(FIELD_CLASS, "font-mono")}
        />
      </DraftField>

      <span
        id={`${idPrefix}-help`}
        className='text-[10px] leading-relaxed font-medium text-indigo-light sm:col-span-2'
      >
        فیلدهای ستاره‌دار در فرم ثبت پروژه الزامی‌اند؛ بقیه را می‌توانید بعداً
        کامل کنید.
      </span>
    </div>
  );
}
