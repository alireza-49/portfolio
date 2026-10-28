"use client";

import { Search } from "lucide-react";
import { FIELD_CLASS } from "@/components/admin/ui";
import { faNumber } from "@/lib/fa";
import {
  PROJECT_STATUSES,
  PROJECT_STATUS_META,
  type ProjectStatus,
} from "@/lib/types";

export type ProjectFilter = "all" | ProjectStatus;

export function ProjectListToolbar({
  total,
  filteredCount,
  counts,
  query,
  onQuery,
  filter,
  onFilter,
}: {
  total: number;
  filteredCount: number;
  counts: Record<ProjectStatus, number>;
  query: string;
  onQuery: (value: string) => void;
  filter: ProjectFilter;
  onFilter: (value: ProjectFilter) => void;
}) {
  return (
    <div className='flex flex-col gap-3 border-b-[2px] border-dashed border-indigo-ink/20 p-3 sm:p-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='relative flex min-w-55 flex-1 items-center'>
          <Search className='pointer-events-none absolute right-3 size-4 text-indigo-light' />
          <input
            type='search'
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder='جستجوی کد، عنوان پروژه یا کارفرما…'
            aria-label='جستجوی پروژه‌ها'
            className={`${FIELD_CLASS} pr-9`}
          />
        </div>
        <span className='font-mono text-[0.625rem] font-bold text-indigo-light'>
          {faNumber(filteredCount)} از {faNumber(total)} پروژه
        </span>
      </div>

      <div className='flex flex-wrap gap-1.5'>
        {(["all", ...PROJECT_STATUSES] as const).map((status) => {
          const active = filter === status;
          const label =
            status === "all" ? "همه" : PROJECT_STATUS_META[status].short;
          const count = status === "all" ? total : counts[status];
          return (
            <button
              key={status}
              type='button'
              aria-pressed={active}
              onClick={() => onFilter(status)}
              className={
                active
                  ? "rounded-sm border-[2px] border-indigo-ink bg-indigo-ink px-2.5 py-1 text-[0.6875rem] font-black text-paper"
                  : "rounded-sm border-[2px] border-indigo-ink/25 bg-paper px-2.5 py-1 text-[0.6875rem] font-bold text-indigo-ink/80 transition-colors hover:border-indigo-ink hover:text-indigo-ink"
              }
            >
              {label}
              <span className='pr-1 font-mono text-[0.625rem] opacity-70'>
                {faNumber(count)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
