import { BrandMarkButton } from "@/components/brand-mark";
import { ArrowLeft, Leaf, Mail, MessageCircle, Send } from "lucide-react";

const QUICK_LINKS = [
  { href: "/#projects-container", label: "نمونه‌کارها" },
  { href: "/blog", label: "روزنامهٔ کارگاه" },
  { href: "/track", label: "رهگیری پیشرفت پروژه" },
  { href: "/#estimator-section", label: "برآورد هزینه و زمان" },
  { href: "/#why-me-section", label: "چرا سازندهٔ مستقل؟" },
  { href: "/create", label: "استودیو کدولوژی" },
  { href: "/#contact-section", label: "مشاورهٔ رایگان ۳۰ دقیقه‌ای" },
];

const CONTACT_EMAIL = "alirezafarasat@hotmail.com";
const TELEGRAM_URL = "https://t.me/phillweb";
const EITAA_URL = "https://eitaa.com/phillweb";

const CHANNELS = [
  {
    href: TELEGRAM_URL,
    label: "تلگرام",
    handle: "@phillweb",
    icon: Send,
  },
  {
    href: EITAA_URL,
    label: "ایتا",
    handle: "@phillweb",
    icon: MessageCircle,
  },
  {
    href: `mailto:${CONTACT_EMAIL}`,
    label: "ایمیل",
    handle: CONTACT_EMAIL,
    icon: Mail,
  },
];

const CRAFT_TAGS = [
  { label: "کد اختصاصی، قابل توسعه", dot: "bg-coral" },
  { label: "تحویل ۳ تا ۵ روز", dot: "bg-coral" },
  { label: "تم و فونت به سلیقهٔ شما", dot: "bg-coral" },
];

const FOOTER_PILLARS = [
  { label: "NO TEMPLATES", tone: "text-coral" },
  { label: "RISO INK", tone: "text-teal-craft" },
  { label: "LOW-CARBON", tone: "text-mustard-deep" },
  { label: "DIRECT LINE", tone: "text-indigo-ink" },
];

export function SiteFooter() {
  return (
    <footer className='w-full border-t-[2.5px] border-indigo-ink bg-paper'>
      <div className='border-b-[2.5px] border-indigo-ink bg-paper-dim/80 px-4 py-3 sm:px-8 sm:py-3.5'>
        <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs md:flex-row'>
          <div className='flex w-full items-center justify-center gap-3 md:w-auto md:justify-start'>
            <span className='riso-stamp flex max-w-full items-center justify-center gap-x-2 gap-y-0.5 bg-paper px-3.5 py-1.5 text-center text-[0.75rem] leading-snug shadow-sm md:py-1 md:text-[0.6875rem] md:whitespace-nowrap'>
              <span className='relative flex h-2 w-2 shrink-0'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-craft opacity-75' />
                <span className='relative inline-flex h-2 w-2 rounded-full bg-teal-craft' />
              </span>
              <strong className='font-bold text-indigo-ink'>پذیرش باز:</strong>
              <span>برای پروژه‌های تازه جا هست</span>
            </span>
            <span className='hidden shrink-0 font-mono text-[0.6875rem] whitespace-nowrap text-indigo-light md:inline-block'>
              CRAFT STUDIO — TEHRAN
            </span>
          </div>

          <div
            className='hidden flex-wrap items-center justify-center gap-2 font-mono text-[0.6875rem] font-bold text-indigo-ink/80 lg:flex'
            dir='ltr'
          >
            {FOOTER_PILLARS.map((pillar, index) => (
              <span key={pillar.label} className='flex items-center gap-2'>
                {index > 0 ? <span>✦</span> : null}
                <span
                  className={`rounded border border-indigo-ink/20 bg-paper px-2 py-0.5 ${pillar.tone}`}
                >
                  {pillar.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 pt-9 pb-8 sm:px-8 sm:pt-12 sm:pb-10'>
        <div className='grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-8 lg:grid-cols-12 lg:gap-10'>
          <div className='flex flex-col gap-4 text-right lg:col-span-4'>
            <div className='flex items-center gap-3'>
              <BrandMarkButton
                aria-label='وب دیزاین فیل'
                className='size-13 rounded-sm border-[1.5px] border-indigo-ink bg-mustard/30 p-1 text-indigo-ink shadow-craft-inset hover:bg-mustard/30 hover:text-indigo-ink'
              />
              <div className='flex flex-col'>
                <span className='font-display text-lg leading-tight font-black tracking-tight text-indigo-ink'>
                  وب دیزاین فیل
                </span>
                <span className='mt-0.5 font-mono text-[0.6875rem] leading-none font-bold text-teal-craft'>
                  HAND-BUILT WEB &amp; RISO PRINT
                </span>
              </div>
            </div>

            <p className='text-[0.8125rem] leading-[1.85] font-medium text-indigo-light sm:text-sm'>
              هر خط کد را خودم می‌نویسم: بدون قالب آماده، بدون واسطه و بدون کد
              اضافه. رنگ و فونت را هم با همان وسواس چاپ دستی انتخاب می‌کنم تا
              سایت سبک بماند و شبیه هیچ سایت دیگری نباشد.
            </p>

            <div className='flex flex-wrap gap-1.5 pt-1 sm:gap-2'>
              {CRAFT_TAGS.map((tag) => (
                <span
                  key={tag.label}
                  className='inline-flex items-center gap-1.5 rounded-sm border border-indigo-ink/20 bg-paper-dim px-2.5 py-1 text-[0.75rem] font-bold text-indigo-ink shadow-craft-inset sm:px-3 sm:text-xs'
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${tag.dot}`}
                  />
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-3 text-right lg:col-span-3'>
            <div className='flex items-center gap-2 border-b border-indigo-ink/20 pb-1'>
              <span className='inline-block h-2 w-2 rounded-full bg-coral' />
              <span className='text-sm font-bold text-indigo-ink'>
                بخش‌های سایت
              </span>
            </div>
            <ul className='grid grid-cols-2 gap-x-4 gap-y-2.5 pt-1 text-[0.8125rem] font-bold text-indigo-ink/80 md:grid-cols-1 md:text-xs lg:text-[0.8125rem]'>
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className='flex items-start gap-1.5 transition-colors hover:text-coral'
                  >
                    <ArrowLeft className='size-3.5 text-coral' />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex flex-col gap-3 text-right lg:col-span-2'>
            <div className='flex items-center gap-2 border-b border-indigo-ink/20 pb-1'>
              <span className='inline-block h-2 w-2 rounded-full bg-teal-craft' />
              <span className='text-sm font-bold text-indigo-ink'>
                ارتباط مستقیم
              </span>
            </div>
            <div className='grid grid-cols-2 gap-2 pt-1 text-xs font-bold md:flex md:flex-col'>
              {CHANNELS.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex flex-col gap-1 rounded-sm border border-indigo-ink/25 bg-paper p-2 text-indigo-ink transition-all hover:border-indigo-ink hover:bg-mustard/20'
                >
                  <span className='flex items-center gap-1.5'>
                    <channel.icon className='size-[0.9375rem] text-coral' />
                    {channel.label}
                  </span>
                  <span
                    className='text-right font-mono text-[0.625rem] text-indigo-light'
                    dir='ltr'
                  >
                    {channel.handle}
                  </span>
                </a>
              ))}
              <div className='col-span-2 grid grid-cols-2 gap-1.5 pt-1 md:col-span-1' dir='ltr'>
                {[
                  { href: "https://github.com/alireza49", label: "GH" },
                  { href: "https://instagram.com/phill.web", label: "IG" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='rounded-sm border border-indigo-ink/30 bg-paper p-1.5 text-center font-mono text-[0.6875rem] font-bold text-indigo-ink transition-colors hover:bg-indigo-ink hover:text-paper'
                  >
                    {social.label}
                  </a>
                ))}
              </div>
              <p className='col-span-2 pt-1 text-[0.6875rem] leading-relaxed font-medium text-indigo-light md:col-span-1'>
                معمولاً همان روز پاسخ می‌دهم.
              </p>
            </div>
          </div>

          <div className='flex flex-col lg:col-span-3'>
            <div className='craft-card relative flex h-full flex-col gap-2.5 rounded-sm border-[2px] border-indigo-ink bg-paper-light p-4'>
              <div className='flex items-center justify-between border-b border-dashed border-indigo-ink/20 pb-1'>
                <span className='flex items-center gap-1 font-mono text-[0.6875rem] font-bold text-teal-craft'>
                  <Leaf className='size-[0.9375rem]' />
                  LIGHT WEB
                </span>
                <span className='font-mono text-[0.625rem] font-bold text-coral'>
                  NO BLOAT
                </span>
              </div>
              <h5 className='text-[0.8125rem] font-black text-indigo-ink'>
                کم‌مصرف‌تر از یک برگ کاغذ
              </h5>
              <p className='text-[0.6875rem] leading-relaxed font-medium text-indigo-light'>
                هر کیلوبایت اضافه، هم اینترنت بازدیدکننده را می‌خورد و هم باتری
                گوشی‌اش را. برای همین کد را فقط به اندازهٔ نیاز می‌نویسم،
                تصویرها را بهینه می‌کنم و هیچ ردیاب یا تبلیغی به صفحه اضافه
                نمی‌کنم.
              </p>
              <div className='flex items-center justify-between border-t border-indigo-ink/15 pt-1 text-[0.625rem] font-bold text-indigo-ink/70'>
                <span>بدون ردیاب و پاپ‌آپ</span>
                <span className='font-mono font-bold text-teal-craft'>
                  ECO BY DEFAULT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='border-t border-dashed border-indigo-ink/30 bg-paper-dim/40 px-4 py-4 sm:px-8 sm:py-5'>
        <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs font-medium text-indigo-light sm:flex-row sm:gap-4'>
          <div className='flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center sm:justify-start sm:gap-3 sm:text-right'>
            <span className='font-bold text-indigo-ink'>
              © ۱۴۰۵ وب دیزاین فیل{" "}
            </span>
            <span className='hidden text-indigo-ink/30 sm:inline-block'>|</span>
            <span>تمامی حقوق مادی و معنوی محفوظ است.</span>
          </div>
          <div className='flex shrink-0 items-center gap-3'>
            <span className='riso-stamp-mustard px-2 py-[0.125rem] text-[0.625rem] font-bold'>
              ساخته‌شده با جوهر و وسواس
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
