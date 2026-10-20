import { ArrowLeft, Leaf, Mail, Send } from "lucide-react";

const QUICK_LINKS = [
  { href: "#projects-container", label: "پروژه‌های منتخب و آزموده" },
  { href: "#estimator-section", label: "برآوردگر زنده هزینه و زمان" },
  { href: "#why-me-section", label: "چرا کار با سازنده مستقل؟" },
  { href: "#craft-values", label: "مرام‌نامه و تعهد اخلاقی کارگاه" },
  { href: "#contact-section", label: "جلسه مشاوره رایگان ۳۰ دقیقه‌ای" },
];

const CHANNELS = [
  { href: "https://t.me", label: "تلگرام", handle: "@code_ecology", icon: Send },
  {
    href: "mailto:hello@code-ecology.dev",
    label: "ایمیل",
    handle: "hello@...",
    icon: Mail,
  },
];

const CRAFT_TAGS = [
  { label: "۱۰۰٪ کد اختصاصی", dot: "bg-coral" },
  { label: "بدون واسطه آژانس", dot: "bg-coral" },
  { label: "لود زیر ۱ ثانیه", dot: "bg-coral" },
];

const FOOTER_PILLARS = [
  { label: "Clean Code", tone: "text-coral" },
  { label: "Sustainable Web", tone: "text-teal-craft" },
  { label: "Risograph Spirit", tone: "text-mustard-deep" },
  { label: "Direct Delivery", tone: "text-indigo-ink" },
];

export function SiteFooter() {
  return (
    <footer className="w-full border-t-[2.5px] border-indigo-ink bg-paper">
      <div className="border-b-[2.5px] border-indigo-ink bg-paper-dim/80 px-4 py-3.5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs md:flex-row">
          <div className="flex items-center gap-3">
            <span className="riso-stamp flex items-center gap-1.5 bg-paper px-3 py-1 text-[11px] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-craft opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-craft" />
              </span>
              <strong className="font-bold text-indigo-ink">ظرفیت باز:</strong>
              پذیرش فعال سفارش‌های جدید ماه جاری
            </span>
            <span className="hidden font-mono text-[11px] text-indigo-light sm:inline-block">
              EST. 2025 // CRAFT STUDIO
            </span>
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] font-bold text-indigo-ink/80"
            dir="ltr"
          >
            {FOOTER_PILLARS.map((pillar, index) => (
              <span key={pillar.label} className="flex items-center gap-2">
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

      <div className="mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-4 text-right lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-sm border-[1.5px] border-indigo-ink bg-mustard/30 font-display text-sm font-black text-indigo-ink shadow-craft-inset">
                ک
              </span>
              <div className="flex flex-col">
                <span className="font-display text-lg leading-tight font-black tracking-tight text-indigo-ink">
                  استودیو کدولوژی
                </span>
                <span className="mt-0.5 font-mono text-[11px] leading-none font-bold text-teal-craft">
                  CRAFT WEB &amp; DIGITAL PRINT
                </span>
              </div>
            </div>

            <p className="text-xs leading-[1.8] font-medium text-indigo-light sm:text-sm">
              تلفیق وسواس مهندسی و هویت بصری چاپ ریزوگراف. بدون فریمورک‌های زائد،
              واسطه‌های آژانس و قالب‌های آماده؛ وب‌سایت‌هایی سبک، اصیل و دست‌ساز
              برای سازندگان مستقل.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {CRAFT_TAGS.map((tag) => (
                <span
                  key={tag.label}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-indigo-ink/20 bg-paper-dim px-3 py-1 text-xs font-bold text-indigo-ink shadow-craft-inset"
                >
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tag.dot}`} />
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 text-right lg:col-span-3">
            <div className="flex items-center gap-2 border-b border-indigo-ink/20 pb-1">
              <span className="inline-block h-2 w-2 rounded-full bg-coral" />
              <span className="text-sm font-bold text-indigo-ink">
                دسترسی سریع و بخش‌ها
              </span>
            </div>
            <ul className="flex flex-col gap-2.5 pt-1 text-xs font-bold text-indigo-ink/80 sm:text-[13px]">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center gap-1.5 transition-colors hover:text-coral"
                  >
                    <ArrowLeft className="size-3.5 text-coral" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 text-right lg:col-span-2">
            <div className="flex items-center gap-2 border-b border-indigo-ink/20 pb-1">
              <span className="inline-block h-2 w-2 rounded-full bg-teal-craft" />
              <span className="text-sm font-bold text-indigo-ink">ارتباط مستقیم</span>
            </div>
            <div className="flex flex-col gap-2 pt-1 text-xs font-bold">
              {CHANNELS.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-sm border border-indigo-ink/25 bg-paper p-2 text-indigo-ink transition-all hover:border-indigo-ink hover:bg-mustard/20"
                >
                  <span className="flex items-center gap-1.5">
                    <channel.icon className="size-[15px] text-coral" />
                    {channel.label}
                  </span>
                  <span className="font-mono text-[10px] text-indigo-light" dir="ltr">
                    {channel.handle}
                  </span>
                </a>
              ))}
              <div className="grid grid-cols-3 gap-1.5 pt-1" dir="ltr">
                {[
                  { href: "https://github.com", label: "GH" },
                  { href: "https://linkedin.com", label: "IN" },
                  { href: "https://instagram.com", label: "IG" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm border border-indigo-ink/30 bg-paper p-1.5 text-center font-mono text-[11px] font-bold text-indigo-ink transition-colors hover:bg-indigo-ink hover:text-paper"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-3">
            <div className="craft-card relative flex flex-col gap-2.5 rounded-sm border-[2px] border-indigo-ink bg-paper-light p-4">
              <div className="flex items-center justify-between border-b border-dashed border-indigo-ink/20 pb-1">
                <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-teal-craft">
                  <Leaf className="size-[15px]" />
                  GREEN WEB ACCREDITED
                </span>
                <span className="font-mono text-[10px] font-bold text-coral">
                  ~0.12g CO2/view
                </span>
              </div>
              <h5 className="text-[13px] font-black text-indigo-ink">
                طراحی وب کم‌کربن و دوستدار محیط زیست
              </h5>
              <p className="text-[11px] leading-relaxed font-medium text-indigo-light">
                بهینه‌سازی حداکثری اسکریپت‌ها و بار سرور بر اساس موازین علمی
                مهندسی بهداشت محیط؛ تضمین حداقل مصرف انرژی سخت‌افزار کاربر و نهایت
                سبکی در اینترنت.
              </p>
              <div className="flex items-center justify-between border-t border-indigo-ink/15 pt-1 text-[10px] font-bold text-indigo-ink/70">
                <span>فاقد ترکر تبلیغاتی</span>
                <span className="font-mono font-bold text-teal-craft">
                  99+ ECO LIGHTHOUSE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-indigo-ink/30 bg-paper-dim/40 px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs font-medium text-indigo-light sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <span className="font-bold text-indigo-ink">© ۲۰۲۵ استودیو کدولوژی</span>
            <span className="hidden text-indigo-ink/30 sm:inline-block">|</span>
            <span>
              تمامی حقوق و دیزاین با هویت چاپ دیجیتال دو رنگ ریزوگراف محفوظ است.
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="inline-flex items-center rounded-sm border-[1.5px] border-indigo-ink bg-paper p-[2px] text-[10px] font-bold shadow-craft-inset">
              <a href="#" className="rounded-[2px] bg-indigo-ink px-2 py-[2px] text-paper">
                فا
              </a>
              <a
                href="#"
                className="px-2 py-[2px] font-mono text-indigo-ink transition-colors hover:text-coral"
              >
                EN
              </a>
            </div>
            <span className="riso-stamp-mustard px-2 py-[2px] text-[10px] font-bold">
              ساخته‌شده با وسواس مهندسی و عشق به وب اصیل
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
