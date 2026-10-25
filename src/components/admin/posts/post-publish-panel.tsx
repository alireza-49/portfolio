"use client";

import Link from "next/link";
import { ExternalLink, LoaderCircle, Save, Send, Undo2 } from "lucide-react";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  FIELD_CLASS,
  LABEL_CLASS,
  Panel,
  PanelHeading,
  StatusPill,
  TEXTAREA_CLASS,
} from "@/components/admin/ui";
import { faDate, faNumber } from "@/lib/fa";
import { slugify } from "@/lib/slugs";
import type { PostInput } from "@/lib/types";

export function PostPublishPanel({
  draft,
  patch,
  exists,
  dirty,
  pending,
  onSave,
  onTogglePublish,
}: {
  draft: PostInput;
  patch: (values: Partial<PostInput>) => void;
  exists: boolean;
  dirty: boolean;
  pending: boolean;
  onSave: () => void;
  onTogglePublish: () => void;
}) {
  const published = draft.status === "published";

  return (
    <>
      <Panel>
        <PanelHeading eyebrow='01 / PUBLISH' title='انتشار و وضعیت' />
        <div className='flex flex-col gap-2.5 p-3.5'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <StatusPill tone={published ? "teal" : "mustard"}>
              {published ? "منتشرشده" : "پیش‌نویس"}
            </StatusPill>
            <span className='font-mono text-[10px] font-bold text-indigo-light'>
              {published
                ? `انتشار: ${faDate(draft.publishedAt)}`
                : "در دسترس عموم نیست"}
            </span>
          </div>

          <button
            type='button'
            onClick={onSave}
            disabled={pending || (!exists && !draft.title.trim())}
            className={`${BTN_PRIMARY} w-full justify-center`}
          >
            {pending ? (
              <LoaderCircle className='size-3.5 animate-spin' />
            ) : (
              <Save className='size-3.5' />
            )}
            {exists
              ? dirty
                ? "ذخیرهٔ تغییرات"
                : "همه‌چیز ذخیره شده"
              : "ذخیرهٔ پیش‌نویس"}
          </button>

          <button
            type='button'
            onClick={onTogglePublish}
            disabled={pending || !draft.title.trim()}
            className={
              published
                ? `${BTN_SECONDARY} w-full justify-center`
                : "craft-btn inline-flex w-full items-center justify-center gap-1.5 rounded-sm border-[2.5px] border-indigo-ink bg-teal-craft px-3 py-2 text-xs font-black text-white disabled:opacity-60"
            }
          >
            {published ? (
              <>
                <Undo2 className='size-3.5' />
                خروج از انتشار
              </>
            ) : (
              <>
                <Send className='size-3.5' />
                انتشار یادداشت
              </>
            )}
          </button>

          {exists && published ? (
            <Link
              href={`/blog/${draft.slug}`}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-coral hover:text-coral-dark'
            >
              <ExternalLink className='size-3.5' />
              مشاهده در وبلاگ
            </Link>
          ) : null}

          {exists && dirty ? (
            <p className='text-[10px] leading-relaxed font-medium text-indigo-light'>
              تغییرات ذخیره‌نشده هر ۲۰ ثانیه به‌صورت خودکار در پیش‌نویس ذخیره
              می‌شوند.
            </p>
          ) : null}
        </div>
      </Panel>

      <Panel>
        <PanelHeading eyebrow='01 / METADATA' title='نامک، خلاصه و سئو' />
        <div className='flex flex-col gap-3 p-3.5'>
          <label className='flex flex-col gap-1.5'>
            <span className={LABEL_CLASS}>نامک نشانی مقاله (slug)</span>
            <input
              dir='ltr'
              value={draft.slug}
              onChange={(event) => patch({ slug: event.target.value })}
              placeholder='riso-ink-and-modern-code'
              className={`${FIELD_CLASS} text-left font-mono text-xs`}
            />
            <button
              type='button'
              onClick={() => patch({ slug: slugify(draft.title) })}
              className='w-fit text-[10px] font-black text-coral hover:text-coral-dark'
            >
              ساخت نامک از عنوان
            </button>
          </label>

          <label className='flex flex-col gap-1.5'>
            <span className='flex items-center justify-between'>
              <span className={LABEL_CLASS}>خلاصه / توضیح متا</span>
              <span className='font-mono text-[10px] font-bold text-indigo-light'>
                {faNumber(draft.excerpt.length)} / ۴۰۰
              </span>
            </span>
            <textarea
              value={draft.excerpt}
              onChange={(event) => patch({ excerpt: event.target.value })}
              rows={4}
              maxLength={400}
              className={TEXTAREA_CLASS}
            />
          </label>
        </div>
      </Panel>
    </>
  );
}
