"use client";

import { useState } from "react";
import { Search, Trash2, X } from "lucide-react";
import { FIELD_CLASS } from "@/components/admin/ui";
import { faNumber } from "@/lib/fa";
import {
  SUBMISSION_STATUSES,
  SUBMISSION_STATUS_META,
  type SubmissionStatus,
} from "@/lib/types";

export type InboxFilter = "all" | SubmissionStatus;

export const INBOX_FILTERS: { id: InboxFilter; label: string }[] = [
  { id: "all", label: "همهٔ درخواست‌ها" },
  ...SUBMISSION_STATUSES.map((status) => ({
    id: status as InboxFilter,
    label: SUBMISSION_STATUS_META[status].label,
  })),
];

export function InquiryToolbar({
  total,
  filteredCount,
  counts,
  query,
  onQuery,
  filter,
  onFilter,
  selectedCount,
  bulkStatus,
  onBulkStatus,
  onApplyBulk,
  onDeleteSelected,
  onClearSelection,
  pending,
  notice,
}: {
  total: number;
  filteredCount: number;
  counts: Record<SubmissionStatus, number>;
  query: string;
  onQuery: (value: string) => void;
  filter: InboxFilter;
  onFilter: (value: InboxFilter) => void;
  selectedCount: number;
  bulkStatus: SubmissionStatus;
  onBulkStatus: (value: SubmissionStatus) => void;
  onApplyBulk: () => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
  pending: boolean;
  notice: string | null;
}) {
  // The arm only survives while the same number of rows stays selected.
  const [armCount, setArmCount] = useState<number | null>(null);
  const armed = armCount === selectedCount;
  return (
    <div className='flex flex-col gap-3 border-b-[2px] border-dashed border-indigo-ink/20 p-3 sm:p-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='relative flex min-w-55 flex-1 items-center'>
          <Search className='pointer-events-none absolute right-3 size-4 text-indigo-light' />
          <input
            type='search'
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder='جستجوی نام، مجموعه، ایمیل یا متن پیام…'
            aria-label='جستجوی درخواست‌ها'
            className={`${FIELD_CLASS} pr-9`}
          />
        </div>
        <span className='font-mono text-[10px] font-bold text-indigo-light'>
          {faNumber(filteredCount)} از {faNumber(total)} درخواست
        </span>
      </div>

      <div className='flex flex-wrap gap-1.5'>
        {INBOX_FILTERS.map((item) => {
          const active = filter === item.id;
          const count = item.id === "all" ? total : counts[item.id];
          return (
            <button
              key={item.id}
              type='button'
              aria-pressed={active}
              onClick={() => onFilter(item.id)}
              className={
                active
                  ? "rounded-sm border-[2px] border-indigo-ink bg-indigo-ink px-2.5 py-1 text-[11px] font-black text-paper"
                  : "rounded-sm border-[2px] border-indigo-ink/25 bg-paper px-2.5 py-1 text-[11px] font-bold text-indigo-ink/80 transition-colors hover:border-indigo-ink hover:text-indigo-ink"
              }
            >
              {item.label}
              <span className='pr-1 font-mono text-[10px] opacity-70'>
                {faNumber(count)}
              </span>
            </button>
          );
        })}
      </div>

      {selectedCount > 0 ? (
        <div className='flex flex-wrap items-center gap-2 rounded-sm border-[1.5px] border-mustard-deep bg-mustard/20 px-2.5 py-2'>
          <span className='text-[11px] font-black text-indigo-ink'>
            {faNumber(selectedCount)} درخواست انتخاب شده
          </span>
          <select
            value={bulkStatus}
            onChange={(event) =>
              onBulkStatus(event.target.value as SubmissionStatus)
            }
            aria-label='وضعیت گروهی'
            className='rounded-sm border-[1.5px] border-indigo-ink bg-paper px-2 py-1 text-[11px] font-bold text-indigo-ink'
          >
            {SUBMISSION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {SUBMISSION_STATUS_META[status].label}
              </option>
            ))}
          </select>
          <button
            type='button'
            onClick={onApplyBulk}
            disabled={pending}
            className='rounded-sm border-[1.5px] border-indigo-ink bg-coral px-2.5 py-1 text-[11px] font-black text-white disabled:opacity-60'
          >
            اعمال وضعیت
          </button>
          <button
            type='button'
            disabled={pending}
            onClick={() => {
              if (!armed) {
                setArmCount(selectedCount);
                return;
              }
              setArmCount(null);
              onDeleteSelected();
            }}
            className={
              armed
                ? "inline-flex items-center gap-1 rounded-sm border-[1.5px] border-coral bg-coral px-2.5 py-1 text-[11px] font-black text-white transition-colors disabled:opacity-60"
                : "inline-flex items-center gap-1 rounded-sm border-[1.5px] border-coral bg-paper px-2.5 py-1 text-[11px] font-black text-coral transition-colors hover:bg-coral hover:text-white disabled:opacity-60"
            }
          >
            <Trash2 className='size-3' />
            {armed ? "برای حذف دوباره بزنید" : "حذف انتخاب‌شده‌ها"}
          </button>
          <button
            type='button'
            onClick={() => {
              setArmCount(null);
              onClearSelection();
            }}
            className='inline-flex items-center gap-1 text-[11px] font-bold text-indigo-ink/70 hover:text-coral'
          >
            <X className='size-3' />
            لغو انتخاب
          </button>
        </div>
      ) : null}

      {notice ? (
        <p
          role='status'
          aria-live='polite'
          className='rounded-sm border border-teal-craft/40 bg-teal-craft/10 px-2.5 py-1.5 text-[11px] font-bold text-teal-craft'
        >
          {notice}
        </p>
      ) : null}
    </div>
  );
}
