"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, LoaderCircle, Link2, Trash2 } from "lucide-react";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  FIELD_CLASS,
} from "@/components/admin/ui";
import {
  createPreviewLinkAction,
  revokePreviewLinkAction,
} from "@/app/admin/(console)/posts/preview-actions";
import { faDateTime } from "@/lib/fa";

export function PostPreviewLink({ postId }: { postId: string | null }) {
  const [link, setLink] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const create = async () => {
    if (!postId) return;
    setPending(true);
    setMessage(null);
    const result = await createPreviewLinkAction(postId);
    setPending(false);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setLink(`${window.location.origin}${result.path}`);
    setExpiresAt(result.expiresAt);
  };

  const revoke = async () => {
    if (!postId) return;
    setPending(true);
    const result = await revokePreviewLinkAction(postId);
    setPending(false);
    setMessage(result.message);
    if (result.ok) {
      setLink(null);
      setExpiresAt(null);
    }
  };

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setMessage("کپی خودکار ممکن نشد؛ نشانی را دستی انتخاب کنید.");
    }
  };

  return (
    <div className='flex flex-col gap-2 border-t border-dashed border-indigo-ink/20 pt-2.5'>
      <span className='flex items-center gap-1 text-[10px] font-black text-indigo-ink'>
        <Link2 className='size-3.5 text-coral' />
        لینک پیش‌نمایش خصوصی
      </span>
      {!postId ? (
        <p className='text-[10px] leading-relaxed font-medium text-indigo-light'>
          برای ساخت لینک، ابتدا پیش‌نویس را ذخیره کنید.
        </p>
      ) : link ? (
        <>
          <input
            readOnly
            value={link}
            dir='ltr'
            onFocus={(event) => event.currentTarget.select()}
            className={`${FIELD_CLASS} text-left font-mono text-[10px]`}
            aria-label='نشانی پیش‌نمایش'
          />
          <p className='text-[9px] font-medium text-indigo-light'>
            اعتبار تا {expiresAt ? faDateTime(expiresAt) : "۷ روز"}؛ فقط با این نشانی باز می‌شود.
          </p>
          <div className='flex flex-wrap gap-1.5'>
            <button type='button' onClick={() => void copy()} className={`${BTN_SECONDARY} text-[10px]`}>
              {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
              {copied ? "کپی شد" : "کپی"}
            </button>
            <a href={link} target='_blank' rel='noopener noreferrer' className={`${BTN_SECONDARY} text-[10px]`}>
              <ExternalLink className='size-3.5' />
              باز کردن
            </a>
            <button type='button' onClick={() => void revoke()} disabled={pending} className={`${BTN_SECONDARY} text-[10px] text-coral-dark`}>
              <Trash2 className='size-3.5' />
              باطل‌کردن
            </button>
          </div>
        </>
      ) : (
        <button type='button' onClick={() => void create()} disabled={pending} className={`${BTN_PRIMARY} w-full justify-center text-[10px]`}>
          {pending ? <LoaderCircle className='size-3.5 animate-spin' /> : <Link2 className='size-3.5' />}
          ساخت لینک ۷ روزه
        </button>
      )}
      {message ? (
        <p className='text-[10px] font-bold text-coral-dark'>{message}</p>
      ) : null}
    </div>
  );
}
