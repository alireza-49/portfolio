"use client";

import { useState, useTransition } from "react";
import {
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  Save,
  Send,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  FIELD_CLASS,
  LABEL_CLASS,
  PageHeader,
  Panel,
  PanelHeading,
  StatusPill,
} from "@/components/admin/ui";
import { faDateTime, faDigits } from "@/lib/fa";
import { maskPhone } from "@/lib/contact-pending";
import type { SmsKind, SmsLogEntry, SmsSettings } from "@/lib/types";
import {
  saveSmsSettingsAction,
  sendTestSmsAction,
} from "@/app/admin/(console)/settings/actions";

export type SmsPreview = {
  id: string;
  label: string;
  when: string;
  body: string;
  segments: number;
};

const KIND_LABEL: Record<SmsKind, string> = {
  submission: "درخواست سفارش",
  project_status: "تغییر وضعیت",
  project_progress: "پیشرفت دستی",
  test: "پیام آزمایشی",
};

type Notice = { ok: boolean; message: string } | null;

export function SmsSettingsPanel({
  settings,
  log,
  previews,
}: {
  settings: SmsSettings;
  log: SmsLogEntry[];
  previews: SmsPreview[];
}) {
  const [enabled, setEnabled] = useState(settings.enabled);
  const [sender, setSender] = useState(settings.sender);
  const [token, setToken] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [testNotice, setTestNotice] = useState<Notice>(null);
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();
  const [testing, startTest] = useTransition();

  /**
   * The switch and the fields only become real settings when they are saved, and
   * `sendTestSmsAction` reads the stored row — so testing a freshly ticked box
   * would answer «ارسال پیامک در تنظیمات خاموش است» about the *old* value.
   */
  const dirty =
    enabled !== settings.enabled ||
    sender.trim() !== settings.sender.trim() ||
    token.trim() !== "";

  const tokenChip = settings.hasToken ? (
    <span className='inline-flex items-center gap-1 rounded-sm border border-teal-craft bg-teal-craft/10 px-1.5 py-0.5 text-[0.625rem] font-bold text-teal-craft'>
      <CheckCircle2 className='size-3' />
      توکن ذخیره شده است
    </span>
  ) : settings.tokenUnreadable ? (
    <span className='inline-flex items-center gap-1 rounded-sm border border-coral bg-coral/10 px-1.5 py-0.5 text-[0.625rem] font-bold text-coral-dark'>
      <TriangleAlert className='size-3' />
      توکن ذخیره‌شده خوانده نمی‌شود (راز نشست عوض شده)
    </span>
  ) : (
    <span className='inline-flex items-center gap-1 rounded-sm border border-dashed border-indigo-ink/40 px-1.5 py-0.5 text-[0.625rem] font-bold text-indigo-light'>
      <KeyRound className='size-3' />
      توکنی ثبت نشده
    </span>
  );

  const save = (clearToken = false) => {
    startTransition(async () => {
      const result = await saveSmsSettingsAction({
        enabled,
        sender,
        token,
        clearToken,
      });
      setNotice(result);
      if (result.ok) {
        setToken("");
        if (clearToken) setArmed(false);
      }
    });
  };

  const test = () => {
    startTest(async () => {
      const result = await sendTestSmsAction(testPhone);
      setTestNotice(result);
    });
  };

  return (
    <div className='flex flex-col gap-5'>
      <PageHeader
        eyebrow='SETTINGS // AMOOTSMS'
        title='تنظیمات و پیامک'
        description='توکن آموت را یک بار اینجا می‌گذارید؛ متن پیام‌ها در کد نوشته شده و توکن رمزنگاری‌شده در پایگاه داده نگهداری می‌شود.'
      />

      <div className='grid gap-5 lg:grid-cols-2'>
        <Panel>
          <PanelHeading
            eyebrow='AMOOTSMS'
            title='اتصال به آموت'
            description='توکن از پنل آموت (بخش وب‌سرویس) گرفته می‌شود. فیلد توکن هرگز مقدار ذخیره‌شده را نشان نمی‌دهد.'
          />
          <div className='flex flex-col gap-4 p-4 sm:p-5'>
            <div className='flex flex-wrap items-center gap-2'>
              {tokenChip}
              {settings.updatedAt ? (
                <span className='text-[0.625rem] font-bold text-indigo-light'>
                  آخرین تغییر: {faDateTime(settings.updatedAt)}
                </span>
              ) : null}
            </div>

            <label className='flex flex-col gap-1.5'>
              <span className={LABEL_CLASS}>توکن API آموت</span>
              <input
                type='password'
                value={token}
                onChange={(event) => {
                  setToken(event.target.value);
                  setNotice(null);
                }}
                dir='ltr'
                autoComplete='off'
                spellCheck={false}
                placeholder={
                  settings.hasToken
                    ? "توکن جدید را وارد کنید؛ خالی بماند، قبلی می‌ماند"
                    : "توکن وب‌سرویس آموت"
                }
                className={`${FIELD_CLASS} font-mono text-xs`}
              />
            </label>

            <label className='flex flex-col gap-1.5'>
              <span className={LABEL_CLASS}>خط فرستنده (اختیاری)</span>
              <input
                value={sender}
                onChange={(event) => {
                  setSender(event.target.value);
                  setNotice(null);
                }}
                dir='ltr'
                inputMode='numeric'
                placeholder='خالی = خط عمومی آموت («public»)'
                className={`${FIELD_CLASS} font-mono text-xs`}
              />
            </label>

            <label className='flex items-start gap-2 rounded-sm border-[1.5px] border-dashed border-indigo-ink/30 bg-paper px-3 py-2'>
              <input
                type='checkbox'
                checked={enabled}
                onChange={(event) => {
                  setEnabled(event.target.checked);
                  setNotice(null);
                }}
                className='mt-0.5 size-4 accent-coral'
              />
              <span className='flex flex-col gap-0.5'>
                <span className='text-xs font-black text-indigo-ink'>
                  ارسال خودکار پیامک فعال باشد
                </span>
                <span className='text-[0.6875rem] leading-relaxed font-medium text-indigo-light'>
                  درخواست جدید و تغییر وضعیت پروژه پیامک می‌شود. خاموش کردن این
                  گزینه فقط ارسال را متوقف می‌کند؛ پروژه‌ها و درخواست‌ها مثل
                  همیشه ذخیره می‌شوند.
                </span>
              </span>
            </label>

            {notice ? <NoticeBar notice={notice} /> : null}

            <div className='flex flex-wrap items-center gap-2'>
              <button
                type='button'
                onClick={() => save(false)}
                disabled={pending}
                className={BTN_PRIMARY}
              >
                {pending ? (
                  <LoaderCircle className='size-3.5 animate-spin' />
                ) : (
                  <Save className='size-3.5' />
                )}
                <span>{pending ? "در حال ذخیره…" : "ذخیرهٔ تنظیمات"}</span>
              </button>

              {settings.hasToken || settings.tokenUnreadable ? (
                <button
                  type='button'
                  onClick={() => {
                    if (!armed) {
                      setArmed(true);
                      return;
                    }
                    save(true);
                  }}
                  onBlur={() => setArmed(false)}
                  disabled={pending}
                  className={BTN_SECONDARY}
                >
                  <Trash2 className='size-3.5' />
                  <span>
                    {armed ? "برای حذف دوباره بزنید" : "حذف توکن ذخیره‌شده"}
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeading
            eyebrow='TEST SEND'
            title='ارسال پیام آزمایشی'
            description='پیش از اعتماد به توکن، یک پیامک واقعی به شمارهٔ خودتان بفرستید. نتیجه و متن دقیق در فهرست پایین ثبت می‌شود.'
          />
          <div className='flex flex-col gap-4 p-4 sm:p-5'>
            <label className='flex flex-col gap-1.5'>
              <span className={LABEL_CLASS}>شمارهٔ موبایل گیرندهٔ آزمایشی</span>
              <input
                value={testPhone}
                onChange={(event) => {
                  setTestPhone(event.target.value);
                  setTestNotice(null);
                }}
                dir='ltr'
                inputMode='tel'
                placeholder='۰۹۱۲۱۲۳۴۵۶۷'
                className={`${FIELD_CLASS} font-mono text-xs`}
              />
            </label>

            {testNotice ? <NoticeBar notice={testNotice} /> : null}

            <button
              type='button'
              onClick={test}
              disabled={testing || dirty || !testPhone.trim()}
              className={BTN_SECONDARY}
            >
              {testing ? (
                <LoaderCircle className='size-3.5 animate-spin' />
              ) : (
                <Send className='size-3.5' />
              )}
              <span>{testing ? "در حال ارسال…" : "ارسال پیام آزمایشی"}</span>
            </button>

            <p className='text-[0.6875rem] leading-relaxed font-medium text-indigo-light'>
              هر پیامک فارسی تا ۷۰ کاراکتر یک بخش حساب می‌شود و بعد از آن هر ۶۷
              کاراکتر یک بخش دیگر. اگر ارسال خاموش باشد، همین آزمایش هم دلیل
              نرفتن پیام را نشان می‌دهد.
            </p>

            {dirty ? (
              <p className='rounded-sm border-[1.5px] border-dashed border-mustard bg-mustard/15 px-3 py-2 text-[0.6875rem] leading-relaxed font-bold text-indigo-ink'>
                تغییرات ذخیره نشده است؛ آزمایش از تنظیمات ذخیره‌شده می‌خواند، پس
                اول «ذخیرهٔ تنظیمات» را بزنید.
              </p>
            ) : !settings.enabled ? (
              <p className='rounded-sm border-[1.5px] border-dashed border-coral px-3 py-2 text-[0.6875rem] leading-relaxed font-bold text-coral-dark'>
                ارسال پیامک در تنظیمات ذخیره‌شده خاموش است. تیک «ارسال خودکار
                پیامک فعال باشد» را بزنید و ذخیره کنید.
              </p>
            ) : null}
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeading
          eyebrow='MESSAGE COPY'
          title='متن پیام‌ها'
          description='متن‌ها در کد نوشته می‌شوند تا با صفحهٔ رهگیری یکی بمانند؛ این‌ها همان چیزی است که کارفرما می‌خواند.'
        />
        <div className='grid gap-3 p-3 sm:p-4 lg:grid-cols-2'>
          {previews.map((preview) => (
            <div
              key={preview.id}
              className='flex flex-col gap-2 rounded-sm border-[1.5px] border-indigo-ink/25 bg-paper p-3'
            >
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <span className='text-xs font-black text-indigo-ink'>
                  {preview.label}
                </span>
                <span className='rounded-sm border border-indigo-ink/25 bg-paper-light px-1.5 py-0.5 font-mono text-[0.625rem] font-bold text-indigo-light'>
                  {faDigits(preview.segments)} بخش
                </span>
              </div>
              <p className='text-[0.6875rem] font-medium text-indigo-light'>
                {preview.when}
              </p>
              <p className='rounded-sm border border-dashed border-indigo-ink/30 bg-paper-light px-2.5 py-2 text-[0.75rem] leading-relaxed font-bold text-indigo-ink'>
                {preview.body}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelHeading
          eyebrow='SEND LOG'
          title='آخرین پیامک‌ها'
          description='هر تلاش — حتی وقتی ارسال نشد — یک ردیف دارد تا «پیامک نرسید» از روی شواهد بررسی شود.'
          actions={
            <span className='text-[0.6875rem] font-bold text-indigo-light'>
              {faDigits(log.length)} ردیف
            </span>
          }
        />
        {log.length === 0 ? (
          <p className='px-4 py-8 text-center text-xs font-bold text-indigo-light'>
            هنوز هیچ پیامکی تلاش نشده است.
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse text-right'>
              <thead>
                <tr className='border-b-[1.5px] border-indigo-ink/20 text-[0.625rem] font-black text-indigo-light'>
                  <th className='px-3 py-2'>زمان</th>
                  <th className='px-3 py-2'>نوع</th>
                  <th className='px-3 py-2'>گیرنده</th>
                  <th className='px-3 py-2'>نتیجه</th>
                  <th className='px-3 py-2'>پاسخ آموت</th>
                </tr>
              </thead>
              <tbody>
                {log.map((entry) => (
                  <tr
                    key={entry.id}
                    className='border-b border-dashed border-indigo-ink/15 align-top text-[0.6875rem] font-bold text-indigo-ink'
                  >
                    <td className='px-3 py-2 whitespace-nowrap text-indigo-light'>
                      {faDateTime(entry.createdAt)}
                    </td>
                    <td className='px-3 py-2 whitespace-nowrap'>
                      {KIND_LABEL[entry.kind]}
                    </td>
                    <td className='px-3 py-2'>
                      <span dir='ltr' className='font-mono'>
                        {entry.receptor
                          ? faDigits(maskPhone(entry.receptor))
                          : "—"}
                      </span>
                    </td>
                    <td className='px-3 py-2'>
                      <StatusPill tone={entry.ok ? "teal" : "coral"}>
                        {entry.ok ? "ارسال شد" : "ارسال نشد"}
                      </StatusPill>
                    </td>
                    <td className='max-w-64 px-3 py-2 text-right text-indigo-light'>
                      {entry.providerMessage || "—"}
                      {entry.providerStatus ? (
                        <span className='ms-1 font-mono text-[0.625rem] text-indigo-ink/50'>
                          ({entry.providerStatus})
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

function NoticeBar({ notice }: { notice: { ok: boolean; message: string } }) {
  return (
    <p
      role='status'
      aria-live='polite'
      className={
        notice.ok
          ? "flex items-start gap-1.5 rounded-sm border-[1.5px] border-teal-craft bg-teal-craft/10 px-3 py-2 text-xs font-bold text-teal-craft"
          : "flex items-start gap-1.5 rounded-sm border-[1.5px] border-coral bg-coral/10 px-3 py-2 text-xs font-bold text-coral-dark"
      }
    >
      {notice.ok ? (
        <CheckCircle2 className='mt-0.5 size-3.5 shrink-0' />
      ) : (
        <TriangleAlert className='mt-0.5 size-3.5 shrink-0' />
      )}
      <span>{notice.message}</span>
    </p>
  );
}
