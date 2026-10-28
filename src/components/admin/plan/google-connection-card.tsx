"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  CircleAlert,
  DownloadCloud,
  Link2Off,
  LoaderCircle,
  UploadCloud,
} from "lucide-react";
import { cn } from "cn";
import { faRelative } from "@/lib/fa";
import type { GoogleConnectionState } from "@/lib/types";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  FIELD_CLASS,
  LABEL_CLASS,
  Panel,
  PanelHeading,
  StatusPill,
} from "@/components/admin/ui";
import {
  disconnectGoogleAction,
  pullCalendarAction,
  pushAllTasksAction,
  saveCalendarSettingsAction,
} from "@/app/admin/(console)/plan/actions";

/**
 * One card owns the whole Google relationship: connect, which calendar, pull,
 * bulk push and disconnect. Without env keys it degrades into instructions —
 * tasks still save, they just stay `skipped`.
 */
export function GoogleConnectionCard({
  connection,
  notice,
}: {
  connection: GoogleConnectionState;
  notice: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(
    notice ? { ok: true, message: notice } : null,
  );
  const [armedDisconnect, setArmedDisconnect] = useState(false);
  const [calendarId, setCalendarId] = useState(connection.calendarId || "primary");

  const run = (
    key: string,
    work: () => Promise<{ ok: boolean; message: string }>,
  ) => {
    setBusy(key);
    startTransition(async () => {
      try {
        const result = await work();
        setFeedback({ ok: result.ok, message: result.message });
        if (result.ok) router.refresh();
      } catch {
        setFeedback({ ok: false, message: "درخواست ناموفق بود." });
      } finally {
        setBusy(null);
      }
    });
  };

  const working = pending || busy !== null;

  return (
    <Panel>
      <PanelHeading
        eyebrow='GOOGLE CALENDAR'
        title='اتصال تقویم گوگل'
        description='هر کار با زمان شروع و پایان، به‌صورت یک رویداد زمان‌دار در تقویم انتخابی ساخته می‌شود و تغییرات گوگل هم برگردانده می‌شوند.'
        actions={
          connection.connected ? (
            <StatusPill tone='teal'>متصل</StatusPill>
          ) : connection.configured ? (
            <StatusPill tone='mustard'>وصل نشده</StatusPill>
          ) : (
            <StatusPill tone='muted'>تنظیم نشده</StatusPill>
          )
        }
      />

      <div className='flex flex-col gap-3 px-4 py-4'>
        {feedback ? (
          <p
            role='status'
            aria-live='polite'
            className={cn(
              "rounded-sm border-[1.5px] px-3 py-2 text-xs font-bold",
              feedback.ok
                ? "border-teal-craft bg-teal-craft/10 text-teal-craft"
                : "border-coral bg-coral/10 text-coral-dark",
            )}
          >
            {feedback.message}
          </p>
        ) : null}

        {!connection.configured ? (
          <div className='flex flex-col gap-2'>
            <p className='text-xs leading-relaxed font-bold text-indigo-ink'>
              سه کلید گوگل هنوز در محیط تنظیم نشده‌اند. تا آن زمان کارها ذخیره
              می‌شوند اما در تقویم ساخته نمی‌شوند:
            </p>
            <ul className='flex flex-col gap-1 text-[0.6875rem] leading-relaxed font-medium text-indigo-light'>
              <li>
                ۱. در Google Cloud پروژه‌ای بسازید و Calendar API را فعال کنید.
              </li>
              <li>
                ۲. صفحهٔ رضایت OAuth را از نوع External بسازید و دامنهٔ{" "}
                <code className='font-mono text-indigo-ink'>
                  calendar.events
                </code>{" "}
                را اضافه کنید؛ سپس اپ را از حالت Testing به Production ببرید
                (وگرنه توکن در ۷ روز منقضی می‌شود).
              </li>
              <li>
                ۳. یک OAuth Client از نوع Web بسازید و نشانی بازگشت را ثبت کنید.
              </li>
            </ul>
            <pre className='overflow-x-auto rounded-sm border border-indigo-ink/20 bg-paper-dim px-3 py-2 font-mono text-[0.625rem] leading-relaxed text-indigo-ink'>
              {[
                "GOOGLE_OAUTH_CLIENT_ID=…",
                "GOOGLE_OAUTH_CLIENT_SECRET=…",
                "GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/google/callback",
              ].join("\n")}
            </pre>
          </div>
        ) : null}

        {connection.configured && !connection.connected ? (
          <div className='flex flex-wrap items-center gap-3'>
            <a href='/api/google/start' className={BTN_PRIMARY}>
              <CalendarCheck className='size-3.5' />
              <span>اتصال به تقویم گوگل</span>
            </a>
            <span className='text-[0.6875rem] font-medium text-indigo-light'>
              دسترسی فقط برای ساخت و خواندن رویدادها درخواست می‌شود؛ تقویم‌های
              دیگر شما دست‌نخورده می‌مانند.
            </span>
          </div>
        ) : null}

        {connection.connected ? (
          <div className='flex flex-col gap-3'>
            {connection.needsReauth ? (
              <div className='flex items-start gap-2 rounded-sm border-[1.5px] border-coral bg-coral/10 px-3 py-2'>
                <CircleAlert className='mt-0.5 size-4 shrink-0 text-coral' />
                <div className='flex flex-col gap-1'>
                  <span className='text-xs font-black text-coral-dark'>
                    دسترسی گوگل منقضی شده است.
                  </span>
                  <span className='text-[0.6875rem] font-medium text-indigo-light'>
                    {connection.lastError || "برای ادامه، اتصال را دوباره برقرار کنید."}
                  </span>
                  <a
                    href='/api/google/start'
                    className='mt-1 w-fit rounded-sm border-[1.5px] border-coral px-2 py-1 text-[0.6875rem] font-black text-coral-dark hover:bg-coral/15'
                  >
                    اتصال دوباره
                  </a>
                </div>
              </div>
            ) : null}

            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='flex flex-col gap-1'>
                <span className={LABEL_CLASS}>حساب گوگل</span>
                <span
                  dir='ltr'
                  className='truncate rounded-sm border border-indigo-ink/20 bg-paper-dim px-2 py-1.5 text-start font-mono text-[0.6875rem] font-bold text-indigo-ink'
                >
                  {connection.accountEmail || "—"}
                </span>
              </div>

              <div className='flex flex-col gap-1'>
                <span className={LABEL_CLASS}>آخرین دریافت تغییرات</span>
                <span className='rounded-sm border border-indigo-ink/20 bg-paper-dim px-2 py-1.5 text-[0.6875rem] font-bold text-indigo-ink'>
                  {connection.lastSyncedAt
                    ? faRelative(connection.lastSyncedAt)
                    : "هنوز انجام نشده"}
                </span>
              </div>
            </div>

            <div className='flex flex-wrap items-end gap-2'>
              <div className='flex min-w-56 flex-1 flex-col gap-1'>
                <label htmlFor='google-calendar-id' className={LABEL_CLASS}>
                  تقویم مقصد
                </label>
                <input
                  id='google-calendar-id'
                  dir='ltr'
                  value={calendarId}
                  onChange={(event) => setCalendarId(event.target.value)}
                  spellCheck={false}
                  className={cn(FIELD_CLASS, "h-9 py-1 text-start font-mono text-xs")}
                  placeholder='primary'
                />
              </div>
              <button
                type='button'
                disabled={working}
                onClick={() =>
                  run("save", () =>
                    saveCalendarSettingsAction({ calendarId }),
                  )
                }
                className={BTN_SECONDARY}
              >
                {busy === "save" ? (
                  <LoaderCircle className='size-3.5 animate-spin' />
                ) : null}
                <span>ذخیرهٔ تقویم</span>
              </button>
            </div>

            <p className='text-[0.625rem] leading-relaxed font-medium text-indigo-light'>
              پیش‌فرض <code className='font-mono text-indigo-ink'>primary</code>{" "}
              است. برای جداسازی، در گوگل تقویم تازه‌ای بسازید و شناسهٔ آن را از
              تنظیمات تقویم (Calendar ID) اینجا بگذارید؛ رویدادهای ساخته‌شده با
              تغییر تقویم، منتقل می‌شوند.
            </p>

            <div className='flex flex-wrap items-center gap-2 border-t border-dashed border-indigo-ink/20 pt-3'>
              <button
                type='button'
                disabled={working}
                onClick={() => run("pull", pullCalendarAction)}
                className={BTN_SECONDARY}
              >
                {busy === "pull" ? (
                  <LoaderCircle className='size-3.5 animate-spin' />
                ) : (
                  <DownloadCloud className='size-3.5' />
                )}
                <span>دریافت تغییرات گوگل</span>
              </button>

              <button
                type='button'
                disabled={working}
                onClick={() => run("push", pushAllTasksAction)}
                className={BTN_SECONDARY}
              >
                {busy === "push" ? (
                  <LoaderCircle className='size-3.5 animate-spin' />
                ) : (
                  <UploadCloud className='size-3.5' />
                )}
                <span>ارسال کارهای همگام‌نشده</span>
              </button>

              <button
                type='button'
                disabled={working}
                onClick={() => {
                  if (!armedDisconnect) {
                    setArmedDisconnect(true);
                    return;
                  }
                  setArmedDisconnect(false);
                  run("disconnect", disconnectGoogleAction);
                }}
                onBlur={() => setArmedDisconnect(false)}
                className={cn(
                  BTN_SECONDARY,
                  armedDisconnect && "border-coral bg-coral text-white",
                )}
              >
                <Link2Off className='size-3.5' />
                <span>
                  {armedDisconnect
                    ? "برای تأیید دوباره بزنید"
                    : "قطع اتصال"}
                </span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
