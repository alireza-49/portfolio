"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  LoaderCircle,
  MessageSquareText,
  Send,
  TriangleAlert,
} from "lucide-react";
import {
  BTN_SECONDARY,
  Panel,
  PanelHeading,
  StatusPill,
} from "@/components/admin/ui";
import { faDateTime, faDigits } from "@/lib/fa";
import { maskPhone } from "@/lib/contact-pending";
import {
  buildProjectProgressSms,
  normalizeMobile,
  smsSegments,
} from "@/lib/sms-text";
import type { Project, SmsKind, SmsLogEntry } from "@/lib/types";
import { sendProjectProgressSmsAction } from "@/app/admin/(console)/projects/actions";

const KIND_LABEL: Record<SmsKind, string> = {
  submission: "درخواست سفارش",
  project_status: "تغییر وضعیت",
  project_progress: "پیشرفت دستی",
  test: "پیام آزمایشی",
};

/**
 * The manual half of the SMS feature. A status change texts the client by
 * itself; moving the slider or the phase does not, so this button sends the
 * current stored numbers — never the unsaved draft sitting in the form.
 */
export function ProjectSmsCard({
  project,
  origin,
  log,
  dirty,
}: {
  project: Project;
  origin: string;
  log: SmsLogEntry[];
  dirty: boolean;
}) {
  const router = useRouter();
  const [notice, setNotice] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  const mobile = normalizeMobile(project.clientMobile);
  const link = project.published ? `${origin}/track/${project.code}` : null;
  const body = buildProjectProgressSms({
    title: project.title,
    progress: project.progress,
    phase: project.currentPhase,
    link,
  });
  const segments = smsSegments(body);

  const send = () => {
    startTransition(async () => {
      const result = await sendProjectProgressSmsAction(project.id);
      setNotice({ ok: result.ok, message: result.message });
      router.refresh();
    });
  };

  return (
    <Panel>
      <PanelHeading
        eyebrow='CLIENT SMS'
        title='پیامک کارفرما'
        description='تغییر وضعیت پروژه خودکار پیامک می‌شود. برای درصد پیشرفت یا مرحله، همین دکمه پیام دستی می‌فرستد.'
        actions={
          <span
            className={
              mobile
                ? "inline-flex items-center gap-1 rounded-sm border border-teal-craft bg-teal-craft/10 px-1.5 py-0.5 text-[0.625rem] font-bold text-teal-craft"
                : "inline-flex items-center gap-1 rounded-sm border border-coral bg-coral/10 px-1.5 py-0.5 text-[0.625rem] font-bold text-coral-dark"
            }
          >
            {mobile ? (
              <CheckCircle2 className='size-3' />
            ) : (
              <TriangleAlert className='size-3' />
            )}
            <span dir='ltr' className='font-mono'>
              {mobile ? faDigits(maskPhone(mobile)) : "شمارهٔ معتبر ندارد"}
            </span>
          </span>
        }
      />

      <div className='flex flex-col gap-3 p-3 sm:p-4'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <span className='inline-flex items-center gap-1 text-[0.6875rem] font-bold text-indigo-light'>
            <MessageSquareText className='size-3.5' />
            متن پیام پیشرفت
          </span>
          <span className='rounded-sm border border-indigo-ink/25 bg-paper-light px-1.5 py-0.5 font-mono text-[0.625rem] font-bold text-indigo-light'>
            {faDigits(segments)} بخش
          </span>
        </div>

        <p className='rounded-sm border border-dashed border-indigo-ink/30 bg-paper px-2.5 py-2 text-[0.75rem] leading-relaxed font-bold text-indigo-ink'>
          {body}
        </p>

        {!project.published ? (
          <p className='text-[0.6875rem] leading-relaxed font-bold text-mustard-deep'>
            پروژه منتشر نشده است، پس پیامک لینک ندارد (به‌جای فرستادن نشانی ۴۰۴).
          </p>
        ) : null}

        {dirty ? (
          <p className='text-[0.6875rem] leading-relaxed font-bold text-coral-dark'>
            تغییرات ذخیره‌نشده دارید؛ اول ذخیره کنید تا پیامک همان چیزی را بگوید
            که کارفرما در صفحه می‌بیند.
          </p>
        ) : null}

        {notice ? (
          <p
            role='status'
            aria-live='polite'
            className={
              notice.ok
                ? "rounded-sm border-[1.5px] border-teal-craft bg-teal-craft/10 px-3 py-2 text-xs font-bold text-teal-craft"
                : "rounded-sm border-[1.5px] border-coral bg-coral/10 px-3 py-2 text-xs font-bold text-coral-dark"
            }
          >
            {notice.message}
          </p>
        ) : null}

        <div className='flex flex-wrap items-center gap-2'>
          <button
            type='button'
            onClick={send}
            disabled={pending || dirty}
            className={BTN_SECONDARY}
          >
            {pending ? (
              <LoaderCircle className='size-3.5 animate-spin' />
            ) : (
              <Send className='size-3.5' />
            )}
            <span>{pending ? "در حال ارسال…" : "ارسال پیام پیشرفت"}</span>
          </button>
          <span className='text-[0.6875rem] font-medium text-indigo-light'>
            تنظیمات کلید و خط فرستنده در «تنظیمات و پیامک» است.
          </span>
        </div>

        {log.length > 0 ? (
          <ul className='flex flex-col gap-1.5 border-t border-dashed border-indigo-ink/20 pt-2'>
            {log.map((entry) => (
              <li
                key={entry.id}
                className='flex flex-wrap items-center gap-2 text-[0.6875rem] font-bold text-indigo-light'
              >
                <StatusPill tone={entry.ok ? "teal" : "coral"}>
                  {entry.ok ? "ارسال شد" : "ارسال نشد"}
                </StatusPill>
                <span>{KIND_LABEL[entry.kind]}</span>
                <span className='font-mono text-[0.625rem]'>
                  {faDateTime(entry.createdAt)}
                </span>
                <span className='truncate'>{entry.providerMessage || "—"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-[0.6875rem] font-medium text-indigo-light'>
            هنوز پیامکی برای این پروژه تلاش نشده است.
          </p>
        )}
      </div>
    </Panel>
  );
}
