"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import {
  BadgeCheck,
  Calculator,
  CheckCircle2,
  Coffee,
  Rocket,
  SlidersHorizontal,
  Smile,
  XCircle,
} from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const HERO_BADGES = [
  { icon: Coffee, label: "مشاوره ۱۰۰٪ رایگان و بدون تعهد", tone: "coral" },
  { icon: Calculator, label: "ماشین‌حساب آنلاین قیمت و زمان", tone: "teal" },
  { icon: SlidersHorizontal, label: "امکان تست و شخصی‌سازی آزمایشی", tone: "mustard" },
] as const;

const BADGE_TONES: Record<string, string> = {
  coral: "bg-coral/10 text-coral border-coral/40",
  teal: "bg-teal-craft/15 text-teal-craft border-teal-craft/40",
  mustard: "bg-mustard/25 text-indigo-ink border-indigo-ink/20",
};

const HERO_PROMISES = [
  {
    icon: Smile,
    title: "مشاوره رایگان ۳۰ دقیقه‌ای",
    body: "بدون هیچ پیش‌پرداخت یا تعهد مالی",
    box: "bg-paper-dim text-indigo-ink border-indigo-ink/40",
  },
  {
    icon: Calculator,
    title: "تخمین آنلاین و شفاف هزینه",
    body: "محاسبه دقیق قیمت و تحویل در چند ثانیه",
    box: "bg-mustard/30 text-indigo-ink border-indigo-ink/40",
  },
  {
    icon: SlidersHorizontal,
    title: "تست و شخصی‌سازی آزمایشی",
    body: "بررسی زنده چیدمان قبل از شروع رسمی",
    box: "bg-teal-craft/20 text-teal-craft border-teal-craft/40",
  },
  {
    icon: Rocket,
    title: "تحویل چابک ۳ الی ۵ روز",
    body: "ارتباط مستقیم و کدنویسی اختصاصی",
    box: "bg-coral/20 text-coral border-coral/40",
  },
] as const;

const SPEC_SHEET = [
  {
    label: "معماری و استاندارد:",
    value: "Zero-Bloat Next 15",
    dot: "bg-teal-craft",
  },
  {
    label: "شاخص عملکرد (Lighthouse):",
    value: "99/100 Perf & SEO",
    dot: "bg-coral",
  },
  {
    label: "میانگین وزن صفحه:",
    value: "< 380 KB (سبک)",
    dot: "bg-mustard-deep",
  },
  {
    label: "آثار زیست‌محیطی:",
    value: "~0.14g CO2 (Eco)",
    dot: "bg-teal-craft",
  },
] as const;

const TECH_BADGES = [
  { label: "Next.js 15", className: "bg-paper-dim text-indigo-ink" },
  { label: "Tailwind CSS", className: "bg-coral/20 text-coral" },
  { label: "TypeScript", className: "bg-paper-dim text-indigo-ink" },
  { label: "Clean Canvas", className: "bg-teal-light text-teal-craft" },
  { label: "Bespoke UI", className: "bg-mustard/30 text-indigo-ink" },
] as const;

const INK_COLORS = ["#E76F51", "#E9C46A", "#F237A1", "#264653", "#2A9D8F"];

type Particle = {
  id: number;
  size: number;
  color: string;
  dx: number;
  dy: number;
  rot: number;
  radius: string;
  duration: number;
  delay: number;
};

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 48 + 32;
    const squish = () =>
      `${Math.floor(Math.random() * 40 + 30)}% ${Math.floor(Math.random() * 40 + 30)}% ${Math.floor(Math.random() * 40 + 30)}% ${Math.floor(Math.random() * 40 + 30)}%`;

    return {
      id: Math.random(),
      size: Math.floor(Math.random() * 9) + 4,
      color: INK_COLORS[Math.floor(Math.random() * INK_COLORS.length)],
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance * 0.65,
      rot: Math.random() * 180 - 90,
      radius: Math.random() > 0.4 ? squish() : "50%",
      duration: Math.random() * 320 + 380,
      delay: Math.random() * 40,
    } satisfies Particle;
  });
}

export function HeroSection() {
  const [splashed, setSplashed] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const splatter = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setSplashed(true);
    setParticles(createParticles(20));
  }, []);

  const reset = useCallback(() => {
    resetTimer.current = setTimeout(() => {
      setSplashed(false);
      setParticles((current) => (current.length ? [] : current));
    }, 700);
  }, []);

  return (
    <section className="dot-grid relative w-full overflow-hidden border-b-[2.5px] border-indigo-ink bg-paper px-4 pt-12 pb-20 sm:px-8 lg:px-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-10 h-72 w-72 rounded-full bg-mustard/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 bottom-4 h-80 w-80 rounded-full bg-coral/15 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row">
        <div className="flex w-full flex-col gap-6 text-right lg:w-7/12">
          <div className="flex flex-wrap items-center gap-2.5">
            {HERO_BADGES.map((badge) => (
              <Badge
                key={badge.label}
                variant="outline"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold [&>svg]:size-4",
                  BADGE_TONES[badge.tone],
                )}
              >
                <badge.icon className="size-4" />
                {badge.label}
              </Badge>
            ))}
          </div>

          <h1 className="font-display text-[32px] leading-[1.3] font-black text-indigo-ink sm:text-[46px]">
            طراحی وب با{" "}
            <span
              className={`ink-splash-wrapper group mx-1.5 inline-block px-3 py-1 align-baseline text-coral ${
                splashed ? "splashed" : ""
              }`}
              title="برای پاشش جوهر ریزوگراف کلیک یا هاور کنید!"
              onMouseEnter={splatter}
              onMouseLeave={reset}
              onClick={splatter}
            >
              <span className="ink-blot-backdrop flex items-center justify-center">
                <svg
                  className="h-full w-full overflow-visible text-coral drop-shadow-[-2px_3px_0px_rgba(38,70,83,0.35)]"
                  preserveAspectRatio="none"
                  viewBox="0 0 160 60"
                  aria-hidden
                >
                  <path
                    d="M12,28 C8,12 28,6 52,10 C75,5 95,2 120,6 C144,9 155,20 152,35 C149,49 135,54 110,52 C82,56 65,58 38,54 C16,51 6,42 12,28 Z"
                    fill="#E76F51"
                    opacity="0.94"
                  />
                  <path
                    d="M8,32 C4,16 26,10 50,14 C73,9 91,6 116,10 C140,13 151,24 148,39 C145,53 131,58 106,56 C78,60 61,62 34,58 C12,55 2,46 8,32 Z"
                    fill="#E9C46A"
                    opacity="0.45"
                    transform="translate(3, 2)"
                  />
                  <circle cx="146" cy="18" r="5" fill="#F237A1" opacity="0.75" />
                  <circle cx="15" cy="46" r="4" fill="#F237A1" opacity="0.7" />
                </svg>
              </span>

              <span className="pointer-events-none absolute inset-0 overflow-visible">
                {particles.map((particle) => (
                  <span
                    key={particle.id}
                    className="ink-particle"
                    style={{
                      width: particle.size,
                      height: particle.size,
                      backgroundColor: particle.color,
                      left: "50%",
                      top: "50%",
                      borderRadius: particle.radius,
                      "--ink-dx": `${particle.dx}px`,
                      "--ink-dy": `${particle.dy}px`,
                      "--ink-rot": `${particle.rot}deg`,
                      animation: `inkParticleBurst ${particle.duration}ms cubic-bezier(0.18, 0.89, 0.32, 1.28) ${particle.delay}ms forwards`,
                    } as CSSProperties}
                  />
                ))}
              </span>

              <svg
                className="ink-droplet-svg -inset-6 h-[calc(100%+48px)] w-[calc(100%+48px)] transition-all duration-300"
                viewBox="0 0 200 90"
                aria-hidden
                style={
                  splashed
                    ? { opacity: 1, transform: "scale(1.1) rotate(3deg)" }
                    : { opacity: 0, transform: "scale(0.8)" }
                }
              >
                <circle cx="12" cy="16" r="4" fill="#E76F51" opacity="0.85" />
                <circle cx="24" cy="6" r="3" fill="#E9C46A" opacity="0.9" />
                <circle cx="188" cy="18" r="4.5" fill="#E76F51" opacity="0.8" />
                <circle cx="178" cy="72" r="3.5" fill="#F237A1" opacity="0.85" />
                <circle cx="8" cy="76" r="3" fill="#2A9D8F" opacity="0.75" />
                <path
                  d="M 194,44 Q 200,42 196,48 Q 192,46 194,44 Z"
                  fill="#E76F51"
                  opacity="0.9"
                />
                <path
                  d="M 6,34 Q 0,38 4,42 Q 8,38 6,34 Z"
                  fill="#E76F51"
                  opacity="0.85"
                />
              </svg>

              <span className="ink-text-target z-10 inline-block px-1 font-black tracking-normal">
                روح و اصالت
              </span>

              <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-coral transition-opacity duration-200 group-[.splashed]:opacity-0" />
            </span>{" "}
            برای کسب‌وکارهای مستقل و خلاق
          </h1>

          <p className="max-w-2xl text-[17px] leading-[1.85] font-medium text-indigo-light sm:text-[18px]">
            بدون واسطه و مستقیم با سازنده گفتگو کنید! قبل از هرگونه تعهد، با{" "}
            <strong className="font-bold text-indigo-ink">ماشین‌حساب آنلاین</strong>{" "}
            هزینه و زمان دقیق پروژه‌تان را برآورد کنید، در{" "}
            <strong className="font-bold text-indigo-ink">
              جلسه مشاوره رایگان ۳۰ دقیقه‌ای
            </strong>{" "}
            ایده‌تان را موشکافی کنیم و حتی چیدمان و دیزاین را به صورت{" "}
            <strong className="font-bold text-indigo-ink">
              تست و شخصی‌سازی زنده
            </strong>{" "}
            مطابق سلیقه برند خود بررسی فرمایید.
          </p>

          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
            {HERO_PROMISES.map((promise) => (
              <Card
                key={promise.title}
                className="flex flex-row items-center gap-3 rounded-sm border-[2px] border-indigo-ink bg-paper-light p-3 shadow-craft-inset"
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded border font-bold",
                    promise.box,
                  )}
                >
                  <promise.icon className="size-5" />
                </span>
                <div className="text-xs sm:text-sm">
                  <strong className="block text-indigo-ink">{promise.title}</strong>
                  <span className="text-indigo-light">{promise.body}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <a
              href="#contact-section"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "craft-btn inline-flex h-auto items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-6 py-3.5 text-base font-bold text-white",
              )}
            >
              <span>رزرو جلسه مشاوره رایگان (۳۰ دقیقه)</span>
              <Coffee className="size-5" />
            </a>
            <a
              href="#estimator-section"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "craft-btn inline-flex h-auto items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink bg-mustard px-6 py-3.5 text-base font-bold text-indigo-ink",
              )}
            >
              <span>محاسبه آنلاین قیمت و زمان تحویل</span>
              <Calculator className="size-5" />
            </a>
          </div>
        </div>

        <div className="flex w-full justify-center lg:w-5/12">
          <div className="relative w-full max-w-sm sm:max-w-md">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-3 -right-3 h-full w-full rounded-sm border-[2.5px] border-indigo-ink bg-mustard"
            />

            <Card className="relative flex flex-col gap-4 overflow-hidden rounded-sm border-[2.5px] border-indigo-ink bg-paper-light p-5 shadow-craft-inset sm:p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute top-1 right-1 h-3 w-3 border-t-2 border-r-2 border-indigo-ink/40"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute top-1 left-1 h-3 w-3 border-t-2 border-l-2 border-indigo-ink/40"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute right-1 bottom-1 h-3 w-3 border-r-2 border-b-2 border-indigo-ink/40"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-1 left-1 h-3 w-3 border-b-2 border-l-2 border-indigo-ink/40"
              />

              <div className="relative flex items-center justify-between border-b-[2px] border-indigo-ink pb-3 font-mono text-xs text-indigo-ink">
                <div className="flex items-center gap-2 font-bold">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-craft opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-craft" />
                  </span>
                  <span className="tracking-tight text-indigo-ink">
                    STUDIO ARCHIVE // SPEC-2025
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="riso-stamp-teal px-2 py-[2px] text-[10px] font-bold">
                    شناسنامه فنی کارگاه
                  </span>
                  <span className="rounded-sm bg-indigo-ink px-1.5 py-[2px] font-mono text-[10px] font-bold text-paper">
                    № ۰۸۴
                  </span>
                </div>
              </div>

              <Card className="relative flex flex-col gap-3 overflow-hidden rounded-sm border-[2px] border-indigo-ink bg-paper-dim p-4 shadow-craft-inset">
                <div className="pointer-events-none absolute -top-2 left-3 z-10 -rotate-12 opacity-90 select-none">
                  <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-[2.5px] border-dashed border-coral bg-coral/10 p-1.5 text-center text-coral shadow-inner backdrop-blur-[1px]">
                    <span className="font-mono text-[8px] leading-tight font-black tracking-widest">
                      ORIGINAL
                    </span>
                    <BadgeCheck className="size-[18px]" />
                    <span className="text-[8px] leading-tight font-bold">
                      مهر کارگاه
                    </span>
                    <span className="font-mono text-[7px]">100% CRAFT</span>
                  </div>
                </div>

                <div className="pr-1 text-right">
                  <span className="font-mono text-[11px] font-bold tracking-wider text-coral uppercase">
                    MANIFESTO // مانیفست خلق محصول
                  </span>
                  <h3 className="mt-0.5 text-[17px] leading-snug font-black text-indigo-ink">
                    کد سبک، سرعت بالا، تبدیل حداکثری
                  </h3>
                  <p className="mt-1 max-w-[82%] text-[12px] leading-relaxed font-medium text-indigo-light">
                    توسعه فرانت‌اند دست‌ساز بر پایه مهندسی تمیز، بدون افزونه‌های
                    مخرب، با وفاداری به هویت بصری چاپ ریزوگراف و بالاترین سرعت
                    بارگذاری در وب فارسی.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-dashed border-indigo-ink/30 pt-2">
                  {SPEC_SHEET.map((spec) => (
                    <Card
                      key={spec.label}
                      className="gap-0 rounded-sm border border-indigo-ink/40 bg-paper p-2 text-right"
                    >
                      <span className="mb-0.5 block text-[10px] font-bold text-indigo-light">
                        {spec.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className={cn("h-1.5 w-1.5 rounded-full", spec.dot)}
                        />
                        <span className="font-mono text-[12px] font-black text-indigo-ink">
                          {spec.value}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>

              <Card className="flex flex-col gap-2 rounded-sm border-[1.5px] border-indigo-ink bg-paper p-3">
                <div className="flex items-center justify-between border-b border-indigo-ink/20 pb-1 text-[11px] font-bold text-indigo-ink">
                  <span>مقایسه فنی: کد دست‌ساز در برابر وردپرس سنگین</span>
                  <span className="font-mono text-[10px] font-bold text-teal-craft">
                    BENCHMARK
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-right">
                  <Card className="gap-0 rounded-sm border border-teal-craft/40 bg-teal-light/60 p-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-teal-craft">
                      <CheckCircle2 className="size-3.5" />
                      کد اختصاصی کارگاه:
                    </span>
                    <ul className="mt-1 space-y-0.5 text-[10px] leading-tight font-medium text-indigo-ink">
                      <li>• لود زیر ۰.۷ ثانیه</li>
                      <li>• ۱۰۰٪ سازگار با هویت برند</li>
                      <li>• امنیت بدون باگ و رخنه</li>
                    </ul>
                  </Card>
                  <Card className="gap-0 rounded-sm border border-coral/30 bg-coral/10 p-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-coral-dark">
                      <XCircle className="size-3.5" />
                      قالب آماده و المنتور:
                    </span>
                    <ul className="mt-1 space-y-0.5 text-[10px] leading-tight font-medium text-indigo-light">
                      <li>• لود کند (۴ تا ۸ ثانیه)</li>
                      <li>• ۳۰+ افزونه ناهمگون و تکراری</li>
                      <li>• هزینه مداوم رفع باگ و سرور</li>
                    </ul>
                  </Card>
                </div>
              </Card>

              <div className="flex flex-wrap gap-1.5 pt-0.5" dir="ltr">
                {TECH_BADGES.map((tech) => (
                  <Badge
                    key={tech.label}
                    variant="outline"
                    className={cn(
                      "rounded-sm border border-indigo-ink px-2 py-0.5 font-mono text-[10px] font-bold",
                      tech.className,
                    )}
                  >
                    {tech.label}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-dashed border-indigo-ink/30 pt-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-6 w-24 text-indigo-ink"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 24"
                    aria-hidden
                  >
                    <path
                      d="M2,2 h2 v20 h-2 Z M6,2 h1 v20 h-1 Z M9,2 h3 v20 h-3 Z M14,2 h1 v20 h-1 Z M17,2 h4 v20 h-4 Z M23,2 h2 v20 h-2 Z M27,2 h1 v20 h-1 Z M30,2 h3 v20 h-3 Z M35,2 h2 v20 h-2 Z M39,2 h4 v20 h-4 Z M45,2 h1 v20 h-1 Z M48,2 h3 v20 h-3 Z M53,2 h2 v20 h-2 Z M57,2 h1 v20 h-1 Z M60,2 h4 v20 h-4 Z M66,2 h2 v20 h-2 Z M70,2 h1 v20 h-1 Z M73,2 h3 v20 h-3 Z M78,2 h2 v20 h-2 Z M82,2 h3 v20 h-3 Z M87,2 h1 v20 h-1 Z M90,2 h4 v20 h-4 Z M96,2 h2 v20 h-2 Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="hidden font-mono text-[9px] font-bold tracking-widest text-indigo-light sm:inline">
                    CODOLOGY-SPEC#084
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-sm border border-indigo-ink/30 bg-mustard/25 px-2.5 py-1 text-[10px] font-bold text-indigo-ink">
                  <BadgeCheck className="size-3.5 text-coral" />
                  <span>ضمانت کد تمیز و اصیل</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
