import Link from "next/link";
import { ArrowLeft, ClipboardCheck, KeyRound, Radar, ShieldCheck } from "lucide-react";
import { faNumber } from "@/lib/fa";

const STEPS = [
  {
    icon: KeyRound,
    title: "کد رهگیری را بردارید",
    body: "کد سفارش (مثل CDL-9402) در پیش‌فاکتور و پیام تأیید شروع پروژه برای شما ارسال شده است.",
  },
  {
    icon: Radar,
    title: "همین‌جا وضعیت را ببینید",
    body: "بدون تماس تلفنی: درصد پیشرفت کلی، فاز فعال، گام‌های تکمیل‌شده و موعد هر مرحله.",
  },
  {
    icon: ShieldCheck,
    title: "شفافیت کامل",
    body: "لاگ مهندسی و خروجی‌های استیجینگ هم ثبت می‌شوند؛ مالی فقط اگر خودتان اجازه داده باشید.",
  },
];

export function TrackGuide() {
  return (
    <>
      <section className='w-full px-4 py-10 sm:px-8 lg:px-12'>
        <div className='mx-auto grid max-w-7xl gap-3 md:grid-cols-3'>
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className='flex flex-col gap-2 rounded-sm border-[2px] border-indigo-ink/20 bg-paper-light p-4'
              >
                <div className='flex items-center justify-between'>
                  <span className='font-mono text-[10px] font-black text-coral'>
                    {faNumber(index + 1)}
                  </span>
                  <Icon className='size-5 text-coral' />
                </div>
                <h3 className='text-sm font-black text-indigo-ink'>
                  {step.title}
                </h3>
                <p className='text-[11px] leading-relaxed font-medium text-indigo-light'>
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className='border-t-[2.5px] border-indigo-ink bg-mustard/20 px-4 py-8 sm:px-8 lg:px-12'>
        <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <ClipboardCheck className='size-5 text-indigo-ink' />
            <p className='text-sm font-black text-indigo-ink'>
              کد رهگیری را پیدا نمی‌کنید؟ با کارگاه تماس بگیرید تا دوباره
              برایتان ارسال شود.
            </p>
          </div>
          <Link
            href='/#contact-section'
            className='craft-btn inline-flex items-center gap-1.5 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-3.5 py-2 text-xs font-black text-white'
          >
            تماس با کارگاه
            <ArrowLeft className='size-3.5' />
          </Link>
        </div>
      </section>
    </>
  );
}
