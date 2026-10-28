import { CheckCircle2, Hash, LockKeyhole, Phone } from "lucide-react";
import { faDigits } from "@/lib/fa";
import { contactRef, looksLikePhone, maskPhone } from "@/lib/contact-pending";
import type { Submission } from "@/lib/types";

/**
 * The locked state of `/track?ref=…`: the one card a visitor sees while the
 * workshop has not touched their request yet. Everything else on the page is
 * greyed out behind it. It repeats the old inline success copy (no more
 * "two hours" promise), the SMS line when a mobile number was given, and the
 * reference the visitor keeps to follow the project.
 */
export function PendingNotice({ submission }: { submission: Submission }) {
  const phone = looksLikePhone(submission.contact)
    ? maskPhone(submission.contact)
    : null;
  const reference = contactRef(submission.id);

  return (
    <section className='w-full border-b-[2.5px] border-indigo-ink bg-paper px-4 pt-8 pb-9 sm:px-8 lg:px-12'>
      <div className='mx-auto flex max-w-3xl flex-col gap-3'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='riso-stamp riso-stamp-mustard text-[0.625rem]'>
            Pending review // در انتظار بررسی
          </span>
          <span className='rounded-sm border-[1.5px] border-mustard-deep bg-mustard/25 px-2 py-0.5 text-[0.625rem] font-bold text-indigo-ink'>
            درخواست شما در صندوق کارگاه ثبت شد
          </span>
        </div>

        <div className='craft-card rounded-sm border-[2.5px] border-indigo-ink bg-paper-light p-4 shadow-craft sm:p-5'>
          <h1 className='flex items-start gap-2 text-lg leading-snug font-black text-indigo-ink sm:text-xl'>
            <CheckCircle2 className='mt-0.5 size-5 shrink-0 text-teal-craft' />
            <span>پیام شما با مهر کارگاه دریافت شد</span>
          </h1>

          <p className='mt-2 text-[0.8125rem] leading-relaxed font-bold text-indigo-ink sm:text-sm'>
            پیام شما در صندوق درخواست‌های کنسول ثبت شد. تا ساعاتی دیگر با شما
            تماس می‌گیرم.
          </p>

          {phone ? (
            <p className='mt-2 flex items-start gap-1.5 text-[0.75rem] leading-relaxed font-bold text-teal-craft'>
              <Phone className='mt-0.5 size-3.5 shrink-0' />
              <span>
                لینک این صفحه برای شما به شمارهٔ{" "}
                <span dir='ltr' className='font-mono'>
                  {faDigits(phone)}
                </span>{" "}
                پیامک شد.
              </span>
            </p>
          ) : null}

          <div className='mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-sm border border-dashed border-indigo-ink/40 bg-paper px-3 py-2'>
            <Hash className='size-3.5 shrink-0 text-coral' />
            <span className='text-[0.6875rem] font-bold text-indigo-light'>
              کد پیگیری درخواست شما
            </span>
            <code
              dir='ltr'
              className='select-all font-mono text-[0.8125rem] font-black text-indigo-ink'
            >
              {reference}
            </code>
          </div>

          <p className='mt-2 text-[0.6875rem] leading-relaxed font-medium text-indigo-light'>
            این کد را نگه دارید؛ با همین کد از همین صفحه پیشرفت پروژه را دنبال
            می‌کنید. جای این کد در پیامک و پیش‌فاکتور هم همان است.
          </p>

          <p className='mt-3 flex items-start gap-1.5 border-t-[1.5px] border-dashed border-indigo-ink/25 pt-2.5 text-[0.6875rem] leading-relaxed font-bold text-indigo-light'>
            <LockKeyhole className='mt-0.5 size-3.5 shrink-0' />
            <span>
              تا وقتی کارگاه وضعیت این درخواست را در کنسول تغییر دهد، گزینه‌های
              پایین غیرفعال‌اند. این صفحه خودکار به‌روز می‌شود و بعد از تغییر
              وضعیت، خودش باز می‌شود.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
