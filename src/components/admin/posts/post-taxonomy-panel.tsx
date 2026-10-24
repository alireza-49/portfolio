"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  FIELD_CLASS,
  LABEL_CLASS,
  Panel,
  PanelHeading,
} from "@/components/admin/ui";
import type { PostInput } from "@/lib/types";

export function PostTaxonomyPanel({
  draft,
  patch,
}: {
  draft: PostInput;
  patch: (values: Partial<PostInput>) => void;
}) {
  const [tag, setTag] = useState("");

  const addTag = () => {
    const value = tag.trim().slice(0, 30);
    if (!value) return;
    if (draft.tags.includes(value) || draft.tags.length >= 8) {
      setTag("");
      return;
    }
    patch({ tags: [...draft.tags, value] });
    setTag("");
  };

  return (
    <Panel>
      <PanelHeading eyebrow='02 / TAXONOMY' title='برچسب‌ها، کاور و نویسنده' />
      <div className='flex flex-col gap-3 p-3.5'>
        <div className='flex flex-col gap-1.5'>
          <span className={LABEL_CLASS}>برچسب‌ها (حداکثر ۸)</span>
          <div className='flex flex-wrap gap-1.5'>
            {draft.tags.map((item) => (
              <span
                key={item}
                className='inline-flex items-center gap-1 rounded-sm border border-indigo-ink/25 bg-paper-dim px-1.5 py-0.5 text-[10px] font-bold text-indigo-ink'
              >
                {item}
                <button
                  type='button'
                  aria-label={`حذف برچسب ${item}`}
                  onClick={() =>
                    patch({ tags: draft.tags.filter((tagItem) => tagItem !== item) })
                  }
                  className='text-indigo-light transition-colors hover:text-coral'
                >
                  <X className='size-3' />
                </button>
              </span>
            ))}
            {draft.tags.length === 0 ? (
              <span className='text-[10px] font-medium text-indigo-light'>
                هنوز برچسبی اضافه نشده است.
              </span>
            ) : null}
          </div>
          <div className='flex gap-1.5'>
            <input
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  addTag();
                }
              }}
              placeholder='مثلاً تایپوگرافی'
              className={FIELD_CLASS}
            />
            <button
              type='button'
              onClick={addTag}
              className='flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-[1.5px] border-indigo-ink bg-paper text-indigo-ink hover:bg-mustard/30'
              aria-label='افزودن برچسب'
            >
              <Plus className='size-4' />
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <span className={LABEL_CLASS}>نشانی تصویر کاور</span>
          <input
            dir='ltr'
            value={draft.coverUrl}
            onChange={(event) => patch({ coverUrl: event.target.value })}
            placeholder='https://…/cover.jpg یا /images/blog/cover.svg'
            className={`${FIELD_CLASS} text-left font-mono text-xs`}
          />
          {draft.coverUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={draft.coverUrl}
              alt='پیش‌نمایش کاور یادداشت'
              className='h-28 w-full rounded-sm border-[1.5px] border-indigo-ink/30 bg-paper object-cover'
            />
          ) : (
            <p className='text-[10px] font-medium text-indigo-light'>
              بدون کاور، کارت مقاله با بافت چاپی پیش‌فرض نمایش داده می‌شود.
            </p>
          )}
        </div>

        <label className='flex flex-col gap-1.5'>
          <span className={LABEL_CLASS}>نویسنده</span>
          <input
            value={draft.author}
            onChange={(event) => patch({ author: event.target.value })}
            className={FIELD_CLASS}
          />
        </label>
      </div>
    </Panel>
  );
}
