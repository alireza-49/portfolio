"use client";

import { useState } from "react";
import { Check, Eye, Inbox, Trash2 } from "lucide-react";
import { cn } from "cn";
import { EmptyState, StatusPill } from "@/components/admin/ui";
import { faDateTime } from "@/lib/fa";
import { SUBMISSION_STATUS_META, type Submission } from "@/lib/types";

const AVATAR_TONES = [
  "bg-coral/15 text-coral",
  "bg-mustard/30 text-indigo-ink",
  "bg-teal-craft/15 text-teal-craft",
];

export function InquiryTable({
  rows,
  selected,
  pending,
  onToggle,
  onToggleAll,
  onOpen,
  onDelete,
}: {
  rows: Submission[];
  selected: string[];
  pending: boolean;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [armedId, setArmedId] = useState<string | null>(null);
  const allSelected =
    rows.length > 0 && rows.every((row) => selected.includes(row.id));

  if (rows.length === 0) {
    return (
      <div className='p-4 sm:p-5'>
        <EmptyState
          icon={<Inbox className='size-5' />}
          title='درخواستی با این فیلتر پیدا نشد'
          description='عبارت جست‌وجو را کوتاه‌تر کنید یا فیلتر وضعیت را روی «همه» بگذارید.'
        />
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-[52.5rem] border-collapse text-right'>
        <thead>
          <tr className='border-b-[2px] border-indigo-ink bg-paper-dim text-[0.6875rem] font-black text-indigo-ink'>
            <th scope='col' className='w-10 px-3 py-2 text-center'>
              <input
                type='checkbox'
                checked={allSelected}
                onChange={onToggleAll}
                aria-label='انتخاب همهٔ درخواست‌های این فهرست'
                className='size-4 cursor-pointer accent-coral'
              />
            </th>
            <th scope='col' className='px-2.5 py-2'>متقاضی</th>
            <th scope='col' className='px-2.5 py-2'>پروژه و بودجه</th>
            <th scope='col' className='px-2.5 py-2'>راه ارتباط</th>
            <th scope='col' className='px-2.5 py-2'>زمان ثبت</th>
            <th scope='col' className='px-2.5 py-2'>وضعیت</th>
            <th scope='col' className='px-3 py-2 text-left'>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((submission, index) => {
            const meta = SUBMISSION_STATUS_META[submission.status];
            const checked = selected.includes(submission.id);
            const armed = armedId === submission.id;
            const estimate = submission.estimate;
            const projectLine =
              submission.projectType ||
              (estimate ? String(estimate.typeTitle ?? "") : "") ||
              "بدون نوع مشخص";
            const budget =
              submission.budget ||
              (estimate && estimate.min && estimate.max
                ? `${String(estimate.min)} تا ${String(estimate.max)} م.ت`
                : "—");

            return (
              <tr
                key={submission.id}
                onClick={() => onOpen(submission.id)}
                className={cn(
                  "cursor-pointer border-b border-indigo-ink/10 transition-colors hover:bg-mustard/10",
                  checked ? "bg-mustard/15" : "bg-paper-light",
                )}
              >
                <td
                  className='px-3 py-3 text-center'
                  onClick={(event) => event.stopPropagation()}
                >
                  <input
                    type='checkbox'
                    checked={checked}
                    onChange={() => onToggle(submission.id)}
                    aria-label={`انتخاب درخواست ${submission.name}`}
                    className='size-4 cursor-pointer accent-coral'
                  />
                </td>
                <td className='px-2.5 py-3'>
                  <div className='flex items-center gap-2'>
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-sm border border-indigo-ink/20 font-mono text-sm font-black",
                        AVATAR_TONES[index % AVATAR_TONES.length],
                      )}
                    >
                      {submission.name.trim().charAt(0) || "؟"}
                    </span>
                    <div className='flex min-w-0 flex-col'>
                      <span className='truncate text-[0.8125rem] font-black text-indigo-ink'>
                        {submission.name}
                      </span>
                      <span className='truncate text-[0.6875rem] font-medium text-indigo-light'>
                        {submission.business || "بدون مجموعه"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className='px-2.5 py-3'>
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-[0.75rem] font-bold text-indigo-ink'>
                      {projectLine}
                    </span>
                    <span className='font-mono text-[0.6875rem] font-bold text-coral'>
                      {budget}
                    </span>
                  </div>
                </td>
                <td className='px-2.5 py-3'>
                  <span
                    dir='ltr'
                    className='block max-w-[11rem] truncate text-right font-mono text-[0.6875rem] font-bold text-indigo-ink'
                  >
                    {submission.contact}
                  </span>
                </td>
                <td className='px-2.5 py-3'>
                  <span className='text-[0.6875rem] font-medium text-indigo-light'>
                    {faDateTime(submission.createdAt)}
                  </span>
                </td>
                <td className='px-2.5 py-3'>
                  <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
                </td>
                <td
                  className='px-2 py-3 text-left'
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className='flex items-center justify-end gap-1.5'>
                    <button
                      type='button'
                      onClick={() => onOpen(submission.id)}
                      className='inline-flex items-center gap-1 rounded-sm border border-indigo-ink/30 bg-paper px-2 py-1 text-[0.6875rem] font-black whitespace-nowrap text-indigo-ink transition-colors hover:bg-indigo-ink hover:text-paper'
                    >
                      <Eye className='size-3.5' />
                      مشاهده
                    </button>
                    <button
                      type='button'
                      disabled={pending}
                      title={
                        armed
                          ? "برای حذف قطعی دوباره بزنید"
                          : "حذف این درخواست"
                      }
                      aria-label={
                        armed
                          ? `تأیید حذف درخواست ${submission.name}`
                          : `حذف درخواست ${submission.name}`
                      }
                      onClick={() => {
                        if (armed) {
                          setArmedId(null);
                          onDelete(submission.id);
                          return;
                        }
                        setArmedId(submission.id);
                      }}
                      onBlur={() => setArmedId(null)}
                      className={cn(
                        "inline-flex size-7 shrink-0 items-center justify-center rounded-sm border transition-colors disabled:opacity-50",
                        armed
                          ? "border-coral bg-coral text-white ring-2 ring-coral/25"
                          : "border-coral/50 bg-coral/10 text-coral hover:bg-coral hover:text-white",
                      )}
                    >
                      {armed ? (
                        <Check className='size-3.5' />
                      ) : (
                        <Trash2 className='size-3.5' />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
