"use client";

import { Search } from "lucide-react";
import { cn } from "cn";
import { FIELD_CLASS } from "@/components/admin/ui";
import { faNumber } from "@/lib/fa";

export function BlogMasthead({
  postsCount,
  tags,
  query,
  onQuery,
  tag,
  onTag,
}: {
  postsCount: number;
  tags: string[];
  query: string;
  onQuery: (value: string) => void;
  tag: string | null;
  onTag: (value: string | null) => void;
}) {
  return (
    <section className='border-b-[2.5px] border-indigo-ink bg-paper'>
      <div className='mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-8 lg:px-12'>
        <div className='flex flex-wrap items-center justify-between gap-2 border-b border-indigo-ink/25 pb-2 text-[10px] font-bold text-indigo-light'>
          <span className='flex items-center gap-1.5'>
            <span className='size-2 rounded-full bg-coral' />
            آرشیو رسمی یادداشت‌های کارگاه
          </span>
          <span className='font-mono'>
            ISSUE {faNumber(postsCount)} — PHILL PRESS
          </span>
          <span className='hidden font-mono sm:inline'>چاپ دیجیتال دو رنگ</span>
        </div>

        <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
          <div className='flex flex-col gap-2'>
            <span className='riso-stamp w-fit text-[10px]'>
              بیانیهٔ چاپ و کد
            </span>
            <h1 className='font-display text-3xl leading-tight font-black text-indigo-ink sm:text-4xl'>
              روزنامهٔ کارگاه فیل وب
            </h1>
            <p className='max-w-2xl text-sm leading-relaxed font-medium text-indigo-light'>
              یادداشت‌های مهندسی، تایپوگرافی، وب پایدار و فلسفهٔ فرم؛ نوشته‌شده
              در آتلیه و چاپ‌شده با دو جوهر.
            </p>
          </div>
          <span className='rounded-sm border-[1.5px] border-indigo-ink bg-paper-dim px-3 py-1.5 text-[11px] font-black text-indigo-ink'>
            {faNumber(postsCount)} یادداشت منتشرشده
          </span>
        </div>

        <div className='flex flex-col gap-2'>
          <div className='relative flex items-center'>
            <Search className='pointer-events-none absolute right-3 size-4 text-indigo-light' />
            <input
              type='search'
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              placeholder='جستجوی عنوان، نویسنده یا کلیدواژه…'
              aria-label='جستجو در آرشیو یادداشت‌ها'
              className={`${FIELD_CLASS} pr-9`}
            />
          </div>

          {tags.length > 0 ? (
            <div className='flex flex-wrap gap-1.5'>
              <button
                type='button'
                onClick={() => onTag(null)}
                aria-pressed={tag === null}
                className={cn(
                  "rounded-sm border-[1.5px] px-2 py-0.5 text-[10px] font-bold transition-colors",
                  tag === null
                    ? "border-indigo-ink bg-indigo-ink text-paper"
                    : "border-indigo-ink/25 bg-paper text-indigo-ink/80 hover:border-indigo-ink",
                )}
              >
                همهٔ موضوعات
              </button>
              {tags.map((item) => (
                <button
                  key={item}
                  type='button'
                  onClick={() => onTag(tag === item ? null : item)}
                  aria-pressed={tag === item}
                  className={cn(
                    "rounded-sm border-[1.5px] px-2 py-0.5 text-[10px] font-bold transition-colors",
                    tag === item
                      ? "border-coral bg-coral text-white"
                      : "border-indigo-ink/25 bg-paper text-indigo-ink/80 hover:border-indigo-ink",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
