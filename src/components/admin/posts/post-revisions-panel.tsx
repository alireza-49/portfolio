"use client";

import { useCallback, useEffect, useState } from "react";
import { History, LoaderCircle, RotateCcw } from "lucide-react";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  Panel,
  PanelHeading,
} from "@/components/admin/ui";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getPostRevisionAction,
  listPostRevisionsAction,
  restorePostRevisionAction,
} from "@/app/admin/(console)/posts/revision-actions";
import { faDateTime } from "@/lib/fa";
import { formatBytes } from "@/lib/media-url";
import type { PostRevisionDetail, PostRevisionSummary } from "@/lib/types";

const KIND_LABEL: Record<string, string> = {
  save: "ذخیره",
  publish: "انتشار",
  restore: "بازگردانی",
};

export function PostRevisionsPanel({
  postId,
  onRestore,
}: {
  postId: string | null;
  onRestore: (html: string) => void;
}) {
  const [revisions, setRevisions] = useState<PostRevisionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<PostRevisionDetail | null>(null);
  const [reading, setReading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    const result = await listPostRevisionsAction(postId);
    setLoading(false);
    if (result.ok) setRevisions(result.revisions);
    else setMessage(result.message);
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
    queueMicrotask(() => {
      void load();
    });
  }, [postId, load]);

  const open = async (revisionId: string) => {
    if (!postId) return;
    setReading(true);
    const result = await getPostRevisionAction(postId, revisionId);
    setReading(false);
    if (result.ok) setDetail(result.revision);
    else setMessage(result.message);
  };

  const restore = async () => {
    if (!postId || !detail) return;
    setRestoring(true);
    const result = await restorePostRevisionAction(postId, detail.id);
    setRestoring(false);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMessage(result.message);
    setDetail(null);
    onRestore(result.contentHtml);
    await load();
  };

  return (
    <Panel>
      <PanelHeading
        eyebrow='04 / HISTORY'
        title='تاریخچهٔ نسخه‌ها'
        description='هر ذخیرهٔ دستی، انتشار یا بازگردانی یک نسخه می‌سازد.'
      />
      <div className='flex flex-col gap-2 p-3.5'>
        {message ? (
          <p className='rounded-sm border border-coral/30 bg-coral/10 px-2 py-1 text-[10px] font-bold text-coral-dark'>
            {message}
          </p>
        ) : null}
        {!postId ? (
          <p className='rounded-sm border border-dashed border-indigo-ink/25 px-2 py-3 text-[10px] leading-relaxed font-medium text-indigo-light'>
            برای دیدن تاریخچه، ابتدا پیش‌نویس را ذخیره کنید.
          </p>
        ) : loading ? (
          <p className='flex items-center gap-1.5 text-[10px] font-bold text-indigo-light'>
            <LoaderCircle className='size-3 animate-spin' />
            خواندن تاریخچه…
          </p>
        ) : revisions.length === 0 ? (
          <p className='text-[10px] font-medium text-indigo-light'>هنوز نسخه‌ای ذخیره نشده است.</p>
        ) : (
          <ol className='flex max-h-64 flex-col gap-1 overflow-y-auto pe-1'>
            {revisions.map((revision) => (
              <li key={revision.id}>
                <button
                  type='button'
                  onClick={() => void open(revision.id)}
                  disabled={reading}
                  className='flex w-full items-center gap-2 rounded-sm border border-indigo-ink/15 bg-paper px-2 py-1.5 text-start text-[10px] font-bold text-indigo-ink transition-colors hover:border-coral/40 hover:bg-mustard/20 disabled:opacity-60'
                >
                  <History className='size-3.5 shrink-0 text-coral' />
                  <span>{KIND_LABEL[revision.kind] ?? revision.kind}</span>
                  <span className='ms-auto font-mono text-[9px] text-indigo-light'>
                    {faDateTime(revision.createdAt)}
                  </span>
                  <span className='font-mono text-[9px] text-indigo-light'>{formatBytes(revision.sizeBytes)}</span>
                </button>
              </li>
            ))}
          </ol>
        )}
        {postId ? (
          <button type='button' onClick={() => void load()} disabled={loading} className={`${BTN_SECONDARY} w-full justify-center text-[10px]`}>
            به‌روزرسانی تاریخچه
          </button>
        ) : null}
      </div>

      <Dialog open={detail !== null} onOpenChange={(next) => { if (!next) setDetail(null); }}>
        <DialogContent className='max-w-3xl' dir='rtl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-sm font-black text-indigo-ink'>
              <History className='size-4 text-coral' />
              {detail ? `${KIND_LABEL[detail.kind] ?? detail.kind} — ${faDateTime(detail.createdAt)}` : "نسخه"}
            </DialogTitle>
          </DialogHeader>
          <div className='max-h-[55vh] overflow-y-auto rounded-sm border border-indigo-ink/15 bg-paper-light p-4'>
            {detail ? (
              <div className='post-body' dangerouslySetInnerHTML={{ __html: detail.contentHtml }} />
            ) : null}
          </div>
          <DialogFooter className='flex flex-wrap items-center justify-between gap-2'>
            <span className='text-[10px] font-medium text-indigo-light'>
              نسخهٔ فعلی پیش از بازگردانی هم به‌صورت خودکار ذخیره می‌شود.
            </span>
            <div className='flex gap-2'>
              <button type='button' className={BTN_SECONDARY} onClick={() => setDetail(null)}>بستن</button>
              <button type='button' className={BTN_PRIMARY} onClick={() => void restore()} disabled={restoring}>
                {restoring ? <LoaderCircle className='size-3.5 animate-spin' /> : <RotateCcw className='size-3.5' />}
                بازگردانی این نسخه
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Panel>
  );
}
