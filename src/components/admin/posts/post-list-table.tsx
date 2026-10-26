"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";
import {
  BTN_PRIMARY,
  EmptyState,
  FIELD_CLASS,
  Panel,
} from "@/components/admin/ui";
import { faNumber } from "@/lib/fa";
import type { Post } from "@/lib/types";
import { PostRow } from "./post-row";

export type PostFilter = "all" | "published" | "draft";

const FILTERS: { id: PostFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "published", label: "منتشرشده" },
  { id: "draft", label: "پیش‌نویس" },
];

export function PostListTable({
  posts,
  filtered,
  counts,
  query,
  onQuery,
  filter,
  onFilter,
  pendingId,
  onTogglePublish,
  onDuplicate,
  onDelete,
}: {
  posts: Post[];
  filtered: Post[];
  counts: Record<PostFilter, number>;
  query: string;
  onQuery: (value: string) => void;
  filter: PostFilter;
  onFilter: (value: PostFilter) => void;
  pendingId: string | null;
  onTogglePublish: (post: Post) => void;
  onDuplicate: (post: Post) => void;
  onDelete: (post: Post) => void;
}) {
  return (
    <Panel className='overflow-hidden'>
      <div className='flex flex-col gap-3 border-b-[2px] border-dashed border-indigo-ink/20 p-3 sm:p-4'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='relative flex min-w-55 flex-1 items-center'>
            <Search className='pointer-events-none absolute right-3 size-4 text-indigo-light' />
            <input
              type='search'
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              placeholder='جستجوی تیتر، نامک یا برچسب…'
              aria-label='جستجوی یادداشت‌ها'
              className={`${FIELD_CLASS} pr-9`}
            />
          </div>
          <div className='flex gap-1.5'>
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type='button'
                aria-pressed={filter === item.id}
                onClick={() => onFilter(item.id)}
                className={
                  filter === item.id
                    ? "rounded-sm border-[2px] border-indigo-ink bg-indigo-ink px-2.5 py-1 text-[11px] font-black text-paper"
                    : "rounded-sm border-[2px] border-indigo-ink/25 bg-paper px-2.5 py-1 text-[11px] font-bold text-indigo-ink/80 hover:border-indigo-ink hover:text-indigo-ink"
                }
              >
                {item.label}
                <span className='pr-1 font-mono text-[10px] opacity-70'>
                  {faNumber(counts[item.id])}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className='p-4 sm:p-5'>
          <EmptyState
            title={
              posts.length === 0
                ? "هنوز یادداشتی نوشته نشده است"
                : "یادداشتی با این فیلتر پیدا نشد"
            }
            description={
              posts.length === 0
                ? "با «یادداشت تازه» اولین مقالهٔ کارگاه را بنویسید."
                : "عبارت جستجو را کوتاه‌تر کنید یا فیلتر را آزاد کنید."
            }
            action={
              <Link href='/admin/posts/new' className={BTN_PRIMARY}>
                <Plus className='size-3.5' />
                یادداشت تازه
              </Link>
            }
          />
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[1080px] border-collapse text-right'>
            <thead>
              <tr className='border-b-[2px] border-indigo-ink bg-paper-dim text-[11px] font-black text-indigo-ink'>
                <th scope='col' className='px-3 py-2'>یادداشت</th>
                <th scope='col' className='px-3 py-2'>وضعیت</th>
                <th scope='col' className='px-3 py-2'>برچسب‌ها</th>
                <th scope='col' className='px-3 py-2'>زمان</th>
                <th scope='col' className='px-3 py-2'>آمار</th>
                <th scope='col' className='px-3 py-2 text-left'>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  pending={pendingId === post.id}
                  onTogglePublish={() => onTogglePublish(post)}
                  onDuplicate={() => onDuplicate(post)}
                  onDelete={() => onDelete(post)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
