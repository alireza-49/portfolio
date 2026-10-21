import {
  Clock,
  FlaskConical,
  Leaf,
  Palette,
  Wallet,
  Zap,
  BadgeCheck,
  Sparkles,
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
    footer: "💰 تا ۵۰٪ صرفه‌جویی بودجه",
    footerTone: "text-indigo-ink",
    footerIcon: BadgeCheck,
  },
  {
    icon: Palette,
    iconBox: "bg-teal-craft text-white shadow-craft-inset",
    blob: "bg-teal-craft/15",
    title: "طراحی دست‌ساز و بااصالت",
    body: "سایت شما شبیه هزاران وب‌سایت کپی‌شده دیگر نخواهد بود. پالت‌های رنگی جذاب، تایپوگرافی خوش‌خوان و بافت بصری باهویت متناسب با کسب‌وکارتان.",
    footer: "✨ هویت بصری منحصر‌به‌فرد",
    footerTone: "text-teal-craft",
    footerIcon: Sparkles,
  },
  {
    icon: FlaskConical,
    iconBox: "bg-indigo-ink text-paper shadow-craft-coral",
    blob: "bg-indigo-ink/10",
    title: "نظم علمی و معماری پایدار",
    body: "تخصص ارشد مهندسی بهداشت محیط به معنای احترام عمیق به بهینگی است: کدهای تمیز، لود زیر یک ثانیه و کمترین بار سرور و مصرف باتری.",
    footer: "🌱 رتبه لایت‌هاوس ۹۵ به بالا",
    footerTone: "text-indigo-ink",
    footerIcon: Leaf,
  },
] as const;

export function WhyMeSection() {
  return (
    <section
      id='why-me-section'
      className='w-full border-b-[2.5px] border-indigo-ink bg-paper-dim px-4 py-12 sm:px-8 lg:px-12'
    >
      <div className='mx-auto flex max-w-7xl flex-col gap-10'>
        <div className='flex flex-col justify-between gap-4 border-b-[2px] border-indigo-ink pb-6 md:flex-row md:items-end'>
          <h2 className='text-[26px] font-black text-indigo-ink sm:text-[34px]'>
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
                  <reason.icon className='size-[26px]' />
                </div>
                <h3 className='pb-2 text-[19px] font-extrabold text-indigo-ink'>
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
