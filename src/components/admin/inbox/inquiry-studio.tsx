"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  Mail,
  Palette,
  Trash2,
  Wand2,
} from "lucide-react";
import { StatusPill } from "@/components/admin/ui";
import {
  SUBMISSION_STATUSES,
  SUBMISSION_STATUS_META,
  type Submission,
  type SubmissionStatus,
} from "@/lib/types";

const DESIGN_CHOICE_LABEL: Record<string, string> = {
  none: "بدون تم استودیو",
  studio: "تم استودیو ضمیمه شده",
  delegated: "انتخاب ظاهر با استودیو",
};

const STUDIO_STATUS_LABEL: Record<string, string> = {
  none: "استودیو استفاده نشده",
  defaults: "ترکیب پیش‌فرض استودیو",
  customized: "تم سفارشی ساخته‌شده",
};

function downloadStudioConfig(submission: Submission) {
  if (!submission.studioConfig) return;
  const payload = {
    exportedAt: new Date().toISOString(),
    applicant: {
      name: submission.name,
      contact: submission.contact,
      business: submission.business,
    },
    studioStatus: submission.studioStatus,
    designChoice: submission.designChoice,
    studioConfig: submission.studioConfig,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `studio-config-${submission.name.replace(/\s+/g, "-")}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function InquiryStudioPanel({
  submission,
  pending,
  onStatusChange,
  onDelete,
}: {
  submission: Submission;
  pending: boolean;
  onStatusChange: (status: SubmissionStatus) => void;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const replyText = [
    `${submission.name} عزیز، سلام`,
    "",
    "پیام شما در کارگاه فیل دریافت شد. برای هماهنگی جلسهٔ مشاورهٔ رایگان، لطفاً یکی از بازه‌های زیر را اعلام کنید:",
    "• شنبه تا چهارشنبه، ۱۰ تا ۱۸",
    "",
    "با احترام، وب دیزاین فیل",
  ].join("\n");

  const copyReply = async () => {
    try {
      await navigator.clipboard.writeText(replyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <div className='flex flex-col gap-2 rounded-sm border border-indigo-ink/20 bg-paper p-3'>
        <span className='flex items-center gap-1.5 text-[12px] font-black text-indigo-ink'>
          <Palette className='size-3.5 text-coral' />
          ظاهر و تم استودیو
        </span>
        <div className='flex flex-wrap gap-1.5'>
          <StatusPill tone='ink' dot={false}>
            {DESIGN_CHOICE_LABEL[submission.designChoice] ||
              submission.designChoice ||
              "نامشخص"}
          </StatusPill>
          <StatusPill tone='mustard' dot={false}>
            {STUDIO_STATUS_LABEL[submission.studioStatus] ||
              submission.studioStatus ||
              "نامشخص"}
          </StatusPill>
          {submission.studioConfig ? (
            <StatusPill tone='teal' dot={false}>
              پیکربندی کامل ضمیمه است
            </StatusPill>
          ) : null}
        </div>
        {submission.studioSummary ? (
          <pre className='max-h-40 overflow-auto rounded-sm bg-paper-dim p-2 text-[10px] leading-relaxed font-medium whitespace-pre-wrap text-indigo-ink'>
            {submission.studioSummary}
          </pre>
        ) : (
          <p className='text-[11px] font-medium text-indigo-light'>
            این درخواست بدون پیکربندی استودیو ارسال شده است.
          </p>
        )}
        {submission.studioConfig ? (
          <button
            type='button'
            onClick={() => downloadStudioConfig(submission)}
            className='inline-flex w-fit items-center gap-1.5 rounded-sm border-[1.5px] border-indigo-ink bg-paper px-2 py-1 text-[11px] font-black text-indigo-ink transition-colors hover:bg-mustard/30'
          >
            <Download className='size-3.5' />
            دانلود پیکربندی JSON
          </button>
        ) : null}
      </div>

      <div className='flex flex-col gap-1.5'>
        <label
          htmlFor='submission-status'
          className='text-[12px] font-black text-indigo-ink'
        >
          تغییر وضعیت درخواست
        </label>
        <select
          id='submission-status'
          defaultValue={submission.status}
          disabled={pending}
          onChange={(event) =>
            onStatusChange(event.target.value as SubmissionStatus)
          }
          className='rounded-sm border-[2px] border-indigo-ink bg-paper px-3 py-2 text-sm font-bold text-indigo-ink focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/25'
        >
          {SUBMISSION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {SUBMISSION_STATUS_META[status].label}
            </option>
          ))}
        </select>
      </div>

      <div className='flex flex-wrap items-center gap-2 border-t-[2px] border-dashed border-indigo-ink/20 pt-3'>
        <button
          type='button'
          onClick={copyReply}
          className='inline-flex items-center gap-1.5 rounded-sm border-[2px] border-indigo-ink bg-paper px-2.5 py-1.5 text-[11px] font-black text-indigo-ink transition-colors hover:bg-mustard/30'
        >
          {copied ? (
            <Check className='size-3.5' />
          ) : (
            <Copy className='size-3.5' />
          )}
          {copied ? "متن پاسخ کپی شد" : "کپی متن پاسخ"}
        </button>
        <a
          href={`mailto:${submission.contact}?subject=${encodeURIComponent("پاسخ وب دیزاین فیل")}&body=${encodeURIComponent(replyText)}`}
          className='inline-flex items-center gap-1.5 rounded-sm border-[2px] border-indigo-ink bg-paper px-2.5 py-1.5 text-[11px] font-black text-indigo-ink transition-colors hover:bg-mustard/30'
        >
          <Mail className='size-3.5' />
          ایمیل رسمی
        </a>
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
          className='ms-auto inline-flex items-center gap-1.5 rounded-sm border-[2px] border-coral bg-coral/10 px-2.5 py-1.5 text-[11px] font-black text-coral transition-colors hover:bg-coral hover:text-white disabled:opacity-60'
        >
          <Trash2 className='size-3.5' />
          {confirmDelete ? "برای حذف دوباره بزنید" : "حذف درخواست"}
        </button>
      </div>

      <p className='flex items-center gap-1.5 text-[10px] font-medium text-indigo-light'>
        <Wand2 className='size-3' />
        این پنل فقط داده‌های ثبت‌شده در پایگاه داده را نمایش می‌دهد؛ اعلان
        ایمیلی خودکار ارسال نمی‌شود.
      </p>
    </>
  );
}
