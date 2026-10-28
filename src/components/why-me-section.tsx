import {
  Clock,
  FileSearch,
  MousePointerClick,
  Palette,
  Radio,
  Wallet,
  Zap,
  BadgeCheck,
} from "lucide-react";
import { cn } from "cn";
import { Card } from "@/components/ui/card";

const REASONS = [
  {
    icon: Zap,
    iconBox: "bg-coral text-white shadow-craft-inset",
    blob: "bg-coral/10",
    title: "تحویل فوق‌سریع در چند روز",
    body: "دیگر ماه‌ها منتظر جلسات اداری و رفت‌وبرگشت‌های فرسایشی نشوید. پروژه شما طی ۳ تا ۷ روز آماده بهره‌برداری و جذب مشتری می‌شود.",
    footer: "⚡ میانگین تحویل: ۳ تا ۵ روز",
    footerTone: "text-coral",
    footerIcon: Clock,
  },
  {
    icon: Wallet,
    iconBox: "bg-mustard text-indigo-ink shadow-craft-inset",
    blob: "bg-mustard/20",
    title: "تعرفه منصفانه و اقتصادی",
    body: "بودجه شما صرف کیفیت کد و زیبایی بصری می‌شود؛ نه اجاره دفترهای لوکس آژانس‌ها یا حقوق مدیران واسطه و کارشناسان فروش.",
    footer: "💰 تا ۹۰٪ صرفه‌جویی بودجه",
    footerTone: "text-indigo-ink",
    footerIcon: BadgeCheck,
  },
  {
    icon: Palette,
    iconBox: "bg-teal-craft text-white shadow-craft-inset",
    blob: "bg-teal-craft/15",
    title: "رنگ استایل و فونت مطابق سلیقه شما ",
    body: "در استودیو کدولوژی پالت، فونت، گوشه‌ها و سبک را زنده عوض می‌کنید و همان انتخاب روی سایت شما پیاده می‌شود. چیزی که می‌بینید، همان چیزی است که تحویل می‌گیرید.",
    footer: "🖌️ پیش‌نمایش زنده، بدون حدس",
    footerTone: "text-teal-craft",
    footerIcon: MousePointerClick,
  },
  {
    icon: FileSearch,
    iconBox: "bg-indigo-ink text-paper shadow-craft-coral",
    blob: "bg-indigo-ink/10",
    title: "شفاف، از پیش‌پرداخت تا تحویل",
    body: "هر پروژه یک کد رهگیری دارد که درصد پیشرفت، فازهای اجرایی و لاگ مهندسی را نشان می‌دهد. دیگر لازم نیست بپرسید «کارم کجاست؟» — خودتان می‌بینید.",
    footer: "🔍 کد رهگیری و پیشرفت زنده",
    footerTone: "text-indigo-ink",
    footerIcon: Radio,
  },
] as const;

export function WhyMeSection() {
  return (
    <section
      id='why-me-section'
      className='w-full scroll-mt-16 border-b-[2.5px] border-indigo-ink bg-paper-dim px-4 py-12 sm:px-8 lg:px-12'
    >
      <div className='mx-auto flex max-w-7xl flex-col gap-10'>
        <div className='flex flex-col justify-between gap-4 border-b-[2px] border-indigo-ink pb-6 md:flex-row md:items-end'>
          <h2 className='text-[1.625rem] font-black text-indigo-ink sm:text-[2.125rem]'>
            چرا کار با یک سازنده مستقل بهتر و کم هزینه تر است؟
          </h2>
          <div className='riso-stamp-mustard self-start text-xs font-bold md:self-auto p-1 rounded-4xl'>
            بدون بوروکراسی شرکتی، مستقیم با خود سازنده
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {REASONS.map((reason) => (
            <Card
              key={reason.title}
              className='craft-card relative flex flex-col justify-between gap-0 overflow-hidden rounded-sm bg-paper-light p-6'
            >
              <div
                aria-hidden
                className={cn(
                  "absolute -top-6 -left-6 h-16 w-16 rounded-full",
                  reason.blob,
                )}
              />
              <div>
                <div
                  className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-sm border-[2px] border-indigo-ink",
                    reason.iconBox,
                  )}
                >
                  <reason.icon className='size-[1.625rem]' />
                </div>
                <h3 className='pb-2 text-[1.1875rem] font-extrabold text-indigo-ink'>
                  {reason.title}
                </h3>
                <p className='text-sm leading-relaxed text-indigo-light'>
                  {reason.body}
                </p>
              </div>
              <div
                className={cn(
                  "mt-5 flex items-center justify-between border-t-2 border-dashed border-indigo-ink/20 pt-3 text-xs font-bold",
                  reason.footerTone,
                )}
              >
                <span>{reason.footer}</span>
                <reason.footerIcon className='size-4' />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
