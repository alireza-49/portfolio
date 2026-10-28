"use client";

import { Mail } from "lucide-react";
import { faDateTime, faNumber } from "@/lib/fa";
import type { Submission, SubmissionStatus } from "@/lib/types";
import { InquiryStudioPanel } from "./inquiry-studio";

export function InquiryDetail({
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
  const estimate = submission.estimate;
  const min = estimate ? String(estimate.min ?? "") : "";
  const max = estimate ? String(estimate.max ?? "") : "";
  const type = estimate ? String(estimate.typeTitle ?? "") : "";
  const timeline = estimate ? String(estimate.timeline ?? "") : "";

  return (
    <div className='flex flex-1 flex-col gap-5 overflow-y-auto p-4 sm:p-5'>
      <div className='flex flex-col gap-1'>
        <span className='font-mono text-[0.625rem] font-bold tracking-widest text-coral uppercase'>
          INBOUND / مشروح درخواست
        </span>
        <h2 className='text-lg font-black text-indigo-ink'>{submission.name}</h2>
        <span className='text-xs font-bold text-indigo-light'>
          {submission.business || "بدون مجموعه"}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-2 rounded-sm border border-indigo-ink/20 bg-paper p-3'>
        <div className='flex flex-col'>
          <span className='text-[0.625rem] font-bold text-indigo-light'>
            نوع پروژه
          </span>
          <span className='text-[0.75rem] font-black text-indigo-ink'>
            {submission.projectType || type || "مشخص نشده"}
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='text-[0.625rem] font-bold text-indigo-light'>بودجه</span>
          <span className='text-[0.75rem] font-black text-coral'>
            {submission.budget ||
              (min && max ? `${min} تا ${max} میلیون تومان` : "اعلام نشده")}
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='text-[0.625rem] font-bold text-indigo-light'>
            زمان ثبت
          </span>
          <span className='text-[0.75rem] font-bold text-indigo-ink'>
            {faDateTime(submission.createdAt)}
          </span>
        </div>
        <div className='flex min-w-0 flex-col'>
          <span className='text-[0.625rem] font-bold text-indigo-light'>
            راه ارتباط
          </span>
          <span
            dir='ltr'
            className='truncate text-right font-mono text-[0.6875rem] font-bold text-indigo-ink'
          >
            {submission.contact}
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <span className='flex items-center gap-1 text-[0.75rem] font-black text-indigo-ink'>
          <Mail className='size-3.5 text-coral' />
          متن پیام کارفرما
        </span>
        <div className='rounded-sm border border-indigo-ink/20 bg-paper-dim p-3 text-[0.8125rem] leading-relaxed font-medium text-indigo-ink'>
          {submission.message ? (
            <p className='whitespace-pre-line'>{submission.message}</p>
          ) : (
            <p className='text-indigo-light'>
              پیامی نوشته نشده است؛ فقط اطلاعات تماس ثبت شده.
            </p>
          )}
        </div>
      </div>

      {estimate ? (
        <div className='flex flex-col gap-1.5 rounded-sm border-[1.5px] border-mustard-deep bg-mustard/20 p-3'>
          <span className='text-[0.75rem] font-black text-indigo-ink'>
            برآورد خودکار کارفرما
          </span>
          <div className='flex flex-wrap items-center gap-2 text-[0.6875rem] font-bold text-indigo-ink'>
            <span className='rounded-sm border border-indigo-ink/25 bg-paper px-1.5 py-0.5'>
              {type || "برآورد پروژه"}
            </span>
            <span>{timeline || "زمان اعلام نشده"}</span>
            {min && max ? (
              <span className='font-mono' dir='ltr'>
                {min}–{max}
              </span>
            ) : null}
            <span>
              {faNumber(Number(estimate.addonsCount ?? 0))} افزونهٔ انتخابی
            </span>
          </div>
        </div>
      ) : null}

      <InquiryStudioPanel
        submission={submission}
        pending={pending}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
    </div>
  );
}
