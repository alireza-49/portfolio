"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Copy,
  ExternalLink,
  Eye,
  Heart,
  MessageSquare,
  Pencil,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";
import { cn } from "cn";
import { StatusPill } from "@/components/admin/ui";
import { faDate, faNumber } from "@/lib/fa";
import type { Post } from "@/lib/types";

export function PostRow({
  post,
  pending,
  onTogglePublish,
  onDuplicate,
  onDelete,
}: {
  post: Post;
  pending: boolean;
  onTogglePublish: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const published = post.status === "published";

  return (
    <tr className='border-b border-indigo-ink/10 bg-paper-light align-top transition-colors hover:bg-mustard/10'>
      <td className='px-3 py-3'>
        <div className='flex flex-col gap-1'>
          <span className='text-[13px] font-black text-indigo-ink'>
            {post.title}
          </span>
          <span
            dir='ltr'
            className='truncate text-right font-mono text-[10px] font-bold text-indigo-light'
          >
            /blog/{post.slug}
          </span>
        </div>
      </td>
      <td className='px-3 py-3'>
        <StatusPill tone={published ? "teal" : "mustard"}>
          {published ? "منتشرشده" : "پیش‌نویس"}
        </StatusPill>
      </td>
      <td className='px-3 py-3'>
        <div className='flex max-w-56 flex-wrap gap-1'>
          {post.tags.length === 0 ? (
            <span className='text-[10px] font-medium text-indigo-light'>—</span>
          ) : (
            post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className='rounded-sm border border-indigo-ink/20 bg-paper-dim px-1.5 py-0.5 text-[9px] font-bold text-indigo-ink'
              >
                {tag}
              </span>
            ))
          )}
        </div>
      </td>
      <td className='px-3 py-3'>
        <div className='flex flex-col gap-0.5 text-[11px] font-medium text-indigo-light'>
          <span className='font-mono'>{faNumber(post.readingMinutes)} دقیقه</span>
          <span>ویرایش: {faDate(post.updatedAt)}</span>
          {published ? (
            <span>انتشار: {faDate(post.publishedAt)}</span>
          ) : null}
        </div>
      </td>
      <td className='px-3 py-3'>
        <div className='flex flex-col gap-0.5 text-[10px] font-bold text-indigo-light'>
          <span className='inline-flex items-center gap-1'>
            <Eye className='size-3' />
            {faNumber(post.views)}
          </span>
          <span className='inline-flex items-center gap-1'>
            <Heart className='size-3' />
            {faNumber(post.likes)}
          </span>
          <span className='inline-flex items-center gap-1'>
            <MessageSquare className='size-3' />
            {faNumber(post.commentCount)}
          </span>
        </div>
      </td>
      <td className='px-3 py-3'>
        <div className='flex items-center justify-end gap-1'>
          <Link
            href={`/admin/posts/${post.id}`}
            className='inline-flex items-center gap-1 rounded-sm border border-indigo-ink/30 bg-paper px-2 py-1 text-[11px] font-black text-indigo-ink transition-colors hover:bg-indigo-ink hover:text-paper'
          >
            <Pencil className='size-3.5' />
            ویرایش
          </Link>
          {published ? (
            <Link
              href={`/blog/${post.slug}`}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`مشاهدهٔ ${post.title} در وبلاگ`}
              className='inline-flex size-7 items-center justify-center rounded-sm border border-indigo-ink/30 bg-paper text-indigo-ink transition-colors hover:bg-mustard/30'
            >
              <ExternalLink className='size-3.5' />
            </Link>
          ) : null}
          <button
            type='button'
            onClick={onTogglePublish}
            disabled={pending}
            aria-label={published ? "لغو انتشار" : "انتشار یادداشت"}
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-sm border transition-colors disabled:opacity-60",
              published
                ? "border-indigo-ink/30 bg-paper text-indigo-ink hover:bg-mustard/30"
                : "border-teal-craft bg-teal-craft/10 text-teal-craft hover:bg-teal-craft/20",
            )}
          >
            {published ? (
              <Undo2 className='size-3.5' />
            ) : (
              <Send className='size-3.5' />
            )}
          </button>
          <button
            type='button'
            onClick={onDuplicate}
            disabled={pending}
            aria-label='ساخت کپی پیش‌نویس'
            className='inline-flex size-7 items-center justify-center rounded-sm border border-indigo-ink/30 bg-paper text-indigo-ink transition-colors hover:bg-mustard/30 disabled:opacity-60'
          >
            <Copy className='size-3.5' />
          </button>
          <button
            type='button'
            onClick={() => {
              if (!confirmDelete) {
                setConfirmDelete(true);
                return;
              }
              onDelete();
            }}
            disabled={pending}
            aria-label={`حذف ${post.title}`}
            className={cn(
              "inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-[10px] font-black transition-colors disabled:opacity-60",
              confirmDelete
                ? "border-coral bg-coral text-white"
                : "border-coral/40 bg-coral/10 text-coral hover:bg-coral/20",
            )}
          >
            <Trash2 className='size-3.5' />
            {confirmDelete ? "تأیید حذف" : ""}
          </button>
        </div>
      </td>
    </tr>
  );
}
