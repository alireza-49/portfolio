"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, MessageSquare, Trash2 } from "lucide-react";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  EmptyState,
  PageHeader,
  Panel,
} from "@/components/admin/ui";
import { deleteCommentsAction } from "@/app/admin/(console)/comments/actions";
import { faDateTime, faNumber } from "@/lib/fa";
import type { PostComment } from "@/lib/types";

export function CommentsPanel({ comments }: { comments: PostComment[] }) {
  const [rows, setRows] = useState(comments);
  const [selected, setSelected] = useState<string[]>([]);
  const [armKey, setArmKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<
    { ok: boolean; message: string } | null
  >(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const allSelected = rows.length > 0 && selected.length === rows.length;

  const toggle = (id: string) => {
    setArmKey(null);
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  };

  const toggleAll = () => {
    setArmKey(null);
    setSelected(allSelected ? [] : rows.map((row) => row.id));
  };

  const remove = (ids: string[]) => {
    startTransition(async () => {
      const result = await deleteCommentsAction(ids);
      setNotice({ ok: result.ok, message: result.message });
      if (result.ok) {
        const gone = new Set(ids);
        setRows((current) => current.filter((row) => !gone.has(row.id)));
        setSelected((current) => current.filter((id) => !gone.has(id)));
        router.refresh();
      }
    });
  };

  const armedBulk = armKey === `bulk:${selected.length}`;

  return (
    <div className='flex flex-col gap-5'>
      <PageHeader
        eyebrow='COMMENTS'
        title='نظرات یادداشت‌ها'
        description='نظرهای خوانندگان؛ هر نظر بی‌درنگ منتشر می‌شود و از همین‌جا حذف می‌شود.'
        actions={
          <span className='rounded-sm border border-indigo-ink/25 bg-paper-dim px-2.5 py-1 font-mono text-[11px] font-bold text-indigo-light'>
            {faNumber(rows.length)} نظر
          </span>
        }
      />

      {notice ? (
        <p
          role={notice.ok ? "status" : "alert"}
          className={
            notice.ok
              ? "rounded-sm border border-teal-craft/40 bg-teal-craft/10 px-3 py-2 text-[11px] font-bold text-teal-craft"
              : "rounded-sm border border-coral/40 bg-coral/10 px-3 py-2 text-[11px] font-bold text-coral"
          }
        >
          {notice.message}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className='size-6' />}
          title='هنوز نظری ثبت نشده است.'
          description='وقتی خواننده‌ای بنویسد، همین‌جا دیده می‌شود.'
        />
      ) : (
        <Panel className='overflow-hidden'>
          <div className='flex flex-wrap items-center justify-between gap-2 border-b-[2px] border-dashed border-indigo-ink/20 p-3 sm:p-4'>
            <label className='inline-flex items-center gap-2 text-[11px] font-bold text-indigo-ink'>
              <input
                type='checkbox'
                checked={allSelected}
                onChange={toggleAll}
                className='size-3.5 accent-coral'
              />
              انتخاب همه
            </label>

            {selected.length > 0 ? (
              <div className='flex flex-wrap items-center gap-2'>
                <span className='text-[11px] font-black text-indigo-ink'>
                  {faNumber(selected.length)} نظر انتخاب شده
                </span>
                <button
                  type='button'
                  disabled={pending}
                  onClick={() => {
                    if (!armedBulk) {
                      setArmKey(`bulk:${selected.length}`);
                      return;
                    }
                    setArmKey(null);
                    remove(selected);
                  }}
                  className={
                    armedBulk
                      ? `${BTN_PRIMARY} border-coral bg-coral`
                      : `${BTN_SECONDARY} border-coral text-coral`
                  }
                >
                  <Trash2 className='size-3.5' />
                  {armedBulk
                    ? "برای حذف قطعی دوباره بزنید"
                    : "حذف انتخاب‌شده‌ها"}
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setArmKey(null);
                    setSelected([]);
                  }}
                  className='text-[11px] font-bold text-indigo-ink/70 hover:text-coral'
                >
                  لغو انتخاب
                </button>
              </div>
            ) : null}
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full min-w-[1040px] border-collapse text-right'>
              <thead>
                <tr className='border-b-[2px] border-indigo-ink bg-paper-dim/60 text-[10px] font-black tracking-wide text-indigo-ink'>
                  <th className='w-10 px-3 py-2'>
                    <span className='sr-only'>انتخاب</span>
                  </th>
                  <th className='px-3 py-2'>نویسنده</th>
                  <th className='px-3 py-2'>متن نظر</th>
                  <th className='px-3 py-2'>یادداشت</th>
                  <th className='px-3 py-2'>تاریخ</th>
                  <th className='px-3 py-2'>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((comment) => {
                  const armed = armKey === comment.id;
                  return (
                    <tr
                      key={comment.id}
                      className='border-b border-indigo-ink/10 align-top hover:bg-mustard/10'
                    >
                      <td className='px-3 py-2.5'>
                        <input
                          type='checkbox'
                          checked={selected.includes(comment.id)}
                          onChange={() => toggle(comment.id)}
                          aria-label={`انتخاب نظر ${comment.name}`}
                          className='size-3.5 accent-coral'
                        />
                      </td>
                      <td className='px-3 py-2.5'>
                        <span className='block text-[12px] font-black text-indigo-ink'>
                          {comment.name}
                        </span>
                        <a
                          href={`mailto:${comment.email}`}
                          dir='ltr'
                          className='block text-left font-mono text-[10px] font-bold text-indigo-light hover:text-coral'
                        >
                          {comment.email}
                        </a>
                      </td>
                      <td className='max-w-[380px] px-3 py-2.5'>
                        <p
                          title={comment.body}
                          className='line-clamp-2 text-[12px] leading-relaxed font-medium break-words text-indigo-ink/90'
                        >
                          {comment.body}
                        </p>
                      </td>
                      <td className='px-3 py-2.5'>
                        <a
                          href={`/blog/${comment.postSlug}`}
                          target='_blank'
                          rel='noreferrer'
                          className='inline-flex items-center gap-1 text-[11px] font-bold text-indigo-ink underline decoration-indigo-ink/30 underline-offset-2 hover:text-coral'
                        >
                          {comment.postTitle}
                          <ExternalLink className='size-3' />
                        </a>
                      </td>
                      <td className='px-3 py-2.5 font-mono text-[10px] font-bold whitespace-nowrap text-indigo-light'>
                        {faDateTime(comment.createdAt)}
                      </td>
                      <td className='px-3 py-2.5'>
                        <button
                          type='button'
                          disabled={pending}
                          onClick={() => {
                            if (!armed) {
                              setArmKey(comment.id);
                              return;
                            }
                            setArmKey(null);
                            remove([comment.id]);
                          }}
                          className={
                            armed
                              ? "inline-flex items-center gap-1 rounded-sm border-[1.5px] border-coral bg-coral px-2 py-1 text-[10px] font-black text-white disabled:opacity-60"
                              : "inline-flex items-center gap-1 rounded-sm border-[1.5px] border-coral bg-paper px-2 py-1 text-[10px] font-black text-coral transition-colors hover:bg-coral hover:text-white disabled:opacity-60"
                          }
                        >
                          <Trash2 className='size-3' />
                          {armed ? "برای حذف دوباره بزنید" : "حذف"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}
