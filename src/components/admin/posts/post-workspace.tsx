"use client";

import Link from "next/link";
import { Save } from "lucide-react";
import {
  BTN_PRIMARY,
  Panel,
  PanelHeading,
} from "@/components/admin/ui";
import type { PostInput, PostIssue, PostStatus } from "@/lib/types";
import { RichTextEditor, type OutlineItem } from "./rich-text-editor";
import { PostSidebar } from "./post-sidebar";

export function PostWorkspace({
  draft,
  patch,
  outline,
  onOutlineChange,
  postId,
  dirty,
  pending,
  onSave,
  published,
  issues,
  onRestore,
  onAuditChange,
  onExport,
}: {
  draft: PostInput;
  patch: (values: Partial<PostInput>) => void;
  outline: OutlineItem[];
  onOutlineChange: (items: OutlineItem[]) => void;
  postId: string | null;
  dirty: boolean;
  pending: boolean;
  onSave: (status: PostStatus) => void;
  published: boolean;
  issues: PostIssue[];
  onRestore: (html: string) => void;
  onAuditChange: (issues: PostIssue[]) => void;
  onExport: (markdown: string) => void;
}) {
  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-12'>
      <div className='flex flex-col gap-3 xl:col-span-8'>
        <Panel>
          <div className='flex flex-col gap-2 p-4 sm:p-5'>
            <label
              htmlFor='post-title'
              className='font-mono text-[10px] font-bold tracking-widest text-coral uppercase'
            >
              Headline / تیتر اصلی
            </label>
            <input
              id='post-title'
              value={draft.title}
              onChange={(event) => patch({ title: event.target.value })}
              placeholder='تیتر اصلی مقاله را اینجا بنویسید…'
              className='w-full border-0 border-b-[2px] border-indigo-ink/25 bg-transparent pb-2 font-display text-xl leading-tight font-black text-indigo-ink outline-none placeholder:text-indigo-ink/30 focus:border-coral sm:text-2xl'
            />
            <span className='font-mono text-[10px] font-bold text-indigo-light'>
              {draft.slug ? `/blog/${draft.slug}` : "نامک هنوز تعیین نشده است"}
            </span>
          </div>
        </Panel>

        <RichTextEditor
          value={draft.contentHtml}
          onChange={(contentHtml) => patch({ contentHtml })}
          onOutlineChange={onOutlineChange}
          onAuditChange={onAuditChange}
          onExport={onExport}
        />

        <Panel>
          <PanelHeading
            eyebrow='SAVE'
            title='ذخیره و انتشار'
            description='ذخیرهٔ دستی همیشه در دسترس است؛ پیش‌نویس‌ها فقط برای شما قابل مشاهده‌اند.'
          />
          <div className='flex flex-wrap items-center gap-2 p-3.5'>
            <button
              type='button'
              onClick={() => onSave(draft.status)}
              disabled={pending || !draft.title.trim()}
              className={BTN_PRIMARY}
            >
              <Save className='size-3.5' />
              {pending ? "در حال ذخیره…" : "ذخیرهٔ تغییرات"}
            </button>
            <Link
              href='/admin/posts'
              className='text-[11px] font-bold text-indigo-light hover:text-coral'
            >
              بازگشت بدون ذخیره
            </Link>
          </div>
        </Panel>
      </div>

      <div className='xl:col-span-4'>
        <PostSidebar
          draft={draft}
          patch={patch}
          outline={outline}
          exists={Boolean(postId)}
          dirty={dirty}
          pending={pending}
          onSave={() => onSave(draft.status)}
          onTogglePublish={() => onSave(published ? "draft" : "published")}
          postId={postId}
          issues={issues}
          onRestore={onRestore}
        />
      </div>
    </div>
  );
}
