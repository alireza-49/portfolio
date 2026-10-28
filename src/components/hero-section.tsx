"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  Calculator,
  Coffee,
  Palette,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { Card } from "@/components/ui/card";
import { HeroSpecSheet } from "@/components/hero-spec-sheet";

type HeroPromise = {
  icon: LucideIcon;
  title: string;
  body: string;
  box: string;
  href?: string;
};

const HERO_PROMISES: HeroPromise[] = [
  {
    icon: Calculator,
    title: "اول قیمت، بعد تصمیم",
    body: "برآورد شفاف در چند ثانیه",
    box: "bg-mustard/30 text-indigo-ink border-indigo-ink/40",
  },
  {
    icon: Coffee,
    title: "۳۰ دقیقه مشاوره، رایگان",
    body: "بدون پیش‌پرداخت و بدون تعهد",
    box: "bg-paper-dim text-indigo-ink border-indigo-ink/40",
  },
  {
    icon: Rocket,
    title: "تحویل ۳ تا ۵ روز",
    body: "کدنویسی دست‌ساز، نه قالب آماده",
    box: "bg-coral/20 text-coral border-coral/40",
  },
  {
    icon: Palette,
    title: "تم را قبل از سفارش ببینید",
    body: "استودیو کدولوژی: رنگ، فونت و سبک را زنده امتحان کنید",
    box: "bg-teal-craft/20 text-teal-craft border-teal-craft/40",
    href: "/create",
  },
];

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
  return Array.from({ length: count }, () => {
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

  // Touch screens never fire mouseleave, so a tap has to clean up after itself.
  const tap = useCallback(() => {
    splatter();
    if (window.matchMedia("(hover: none)").matches) reset();
  }, [splatter, reset]);

  return (
    <section className='dot-grid relative w-full overflow-hidden border-b-[2.5px] border-indigo-ink bg-paper px-4 pt-8 pb-12 sm:px-8 sm:pt-12 sm:pb-20 lg:px-12'>
      <div
        aria-hidden
        className='pointer-events-none absolute -top-10 left-10 h-72 w-72 rounded-full bg-mustard/25 blur-3xl'
      />
      <div
        aria-hidden
        className='pointer-events-none absolute right-10 bottom-4 h-80 w-80 rounded-full bg-coral/15 blur-3xl'
      />

      <div className='relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-8 sm:gap-12 lg:flex-row'>
        <div className='flex w-full flex-col gap-6 text-right lg:w-7/12'>
          <h1 className='font-display text-[1.75rem] leading-[1.45] font-black text-indigo-ink sm:text-[2.125rem] sm:leading-[1.35] md:text-[2.5rem] md:leading-[1.3] lg:text-[clamp(2.375rem,3.4vw,2.875rem)]'>
            طراحی وب{" "}
            <span
              className={`ink-splash-wrapper group mx-1.5 inline-block max-sm:mx-0 max-sm:block max-sm:w-fit max-sm:whitespace-nowrap max-sm:text-[clamp(1rem,6.3vw,1.75rem)] px-0 py-0 align-baseline text-coral sm:px-3 sm:py-1 ${
                splashed ? "splashed" : ""
              }`}
              title='برای پاشش جوهر ریزوگراف کلیک یا هاور کنید!'
              onMouseEnter={splatter}
              onMouseLeave={reset}
              onClick={tap}
            >
              <span className='ink-blot-backdrop flex items-center justify-center'>
                <svg
                  className='h-full w-full overflow-visible text-coral drop-shadow-[-2px_3px_0px_rgba(38,70,83,0.35)]'
                  preserveAspectRatio='none'
                  viewBox='0 0 160 60'
                  aria-hidden
                >
                  <path
                    d='M12,28 C8,12 28,6 52,10 C75,5 95,2 120,6 C144,9 155,20 152,35 C149,49 135,54 110,52 C82,56 65,58 38,54 C16,51 6,42 12,28 Z'
                    fill='#E76F51'
                    opacity='0.94'
                  />
                  <path
                    d='M8,32 C4,16 26,10 50,14 C73,9 91,6 116,10 C140,13 151,24 148,39 C145,53 131,58 106,56 C78,60 61,62 34,58 C12,55 2,46 8,32 Z'
                    fill='#E9C46A'
                    opacity='0.45'
                    transform='translate(3, 2)'
                  />
                  <circle
                    cx='146'
                    cy='18'
                    r='5'
                    fill='#F237A1'
                    opacity='0.75'
                  />
                  <circle cx='15' cy='46' r='4' fill='#F237A1' opacity='0.7' />
                </svg>
              </span>

              <span className='pointer-events-none absolute inset-0 overflow-visible'>
                {particles.map((particle) => (
                  <span
                    key={particle.id}
                    className='ink-particle'
                    style={
                      {
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
                      } as CSSProperties
                    }
                  />
                ))}
              </span>

              <svg
                className='ink-droplet-svg -inset-6 block h-[calc(100%+3rem)] w-[calc(100%+3rem)] transition-all duration-300'
                viewBox='0 0 200 90'
                aria-hidden
                style={
                  splashed
                    ? { opacity: 1, transform: "scale(1.1) rotate(3deg)" }
                    : { opacity: 0, transform: "scale(0.8)" }
                }
              >
                <circle cx='12' cy='16' r='4' fill='#E76F51' opacity='0.85' />
                <circle cx='24' cy='6' r='3' fill='#E9C46A' opacity='0.9' />
                <circle cx='188' cy='18' r='4.5' fill='#E76F51' opacity='0.8' />
                <circle
                  cx='178'
                  cy='72'
                  r='3.5'
                  fill='#F237A1'
                  opacity='0.85'
                />
                <circle cx='8' cy='76' r='3' fill='#2A9D8F' opacity='0.75' />
                <path
                  d='M 194,44 Q 200,42 196,48 Q 192,46 194,44 Z'
                  fill='#E76F51'
                  opacity='0.9'
                />
                <path
                  d='M 6,34 Q 0,38 4,42 Q 8,38 6,34 Z'
                  fill='#E76F51'
                  opacity='0.85'
                />
              </svg>

              <span className='ink-text-target z-10 inline-block px-1 font-black tracking-normal'>
                سریع، سئو عالی و  قیمت منصفانه
              </span>

              <span className='absolute inset-x-0 bottom-0 h-[0.1875rem] rounded-full bg-coral transition-opacity duration-200 group-[.splashed]:opacity-0' />
            </span>
            <span className='block'>برای کسب‌وکارهای کوچک </span>
          </h1>

          <p className='max-w-2xl text-[1.0625rem] leading-[1.85] font-medium text-indigo-light sm:text-[1.125rem]'>
            مستقیم با خودم کار می‌کنید؛{" "}
            <strong className='font-bold text-indigo-ink'>
              بدون واسطه و بدون هزینهٔ پنهان
            </strong>
            . قیمت و زمان تحویل را همین حالا آنلاین می‌بینید، بعد در یک{" "}
            <strong className='font-bold text-indigo-ink'>
              جلسهٔ ۳۰ دقیقه‌ای رایگان
            </strong>{" "}
            ایده را با هم می‌سنجیم.
          </p>

          <p className='-mt-3 flex items-center gap-2 text-[0.8125rem] font-medium text-indigo-black/60 sm:text-sm'>
            <span className='size-1.5 shrink-0 rounded-full bg-teal-craft' />
            بیش از ۴ سال توسعهٔ فرانت‌اند در تیم‌های محصول
          </p>

          <div className='grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2'>
            {HERO_PROMISES.map((promise) => (
              <Card
                key={promise.title}
                className={cn(
                  "relative flex flex-row items-center gap-3 rounded-sm border-[2px] border-indigo-ink bg-paper-light p-3 shadow-craft-inset",
                  promise.href &&
                    "transition-colors hover:border-teal-craft hover:bg-teal-craft/5",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded border font-bold",
                    promise.box,
                  )}
                >
                  <promise.icon className='size-5' />
                </span>
                <div className='min-w-0 text-xs'>
                  <strong className='block text-indigo-ink'>
                    {promise.title}
                  </strong>
                  <span className='text-indigo-light'>{promise.body}</span>
                </div>
                {promise.href && (
                  <Link
                    href={promise.href}
                    className='absolute inset-0 rounded-sm'
                    aria-label={promise.title}
                  />
                )}
              </Card>
            ))}
          </div>

          <div className='flex flex-wrap items-center gap-4 pt-3'>
            <Link
              href='#contact-section'
              className='craft-btn inline-flex h-auto w-full items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-6 py-3.5 text-base font-bold text-white shadow-craft-sm transition-colors hover:bg-coral-dark sm:w-auto'
            >
              <span>رزرو مشاورهٔ رایگان</span>
              <Coffee className='size-5' />
            </Link>
            <Link
              href='#estimator-section'
              className='craft-btn inline-flex h-auto w-full items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink bg-mustard px-6 py-3.5 text-base font-bold text-indigo-ink shadow-craft-sm transition-colors hover:bg-mustard-deep sm:w-auto'
            >
              <span>محاسبهٔ قیمت و زمان</span>
              <Calculator className='size-5' />
            </Link>
          </div>

          <p className='-mt-1 text-[0.8125rem] font-medium text-indigo-light'>
            همان روز جواب می‌دهم، بدون پیش‌پرداخت.
          </p>
        </div>

        <div className='flex w-full items-center justify-center lg:w-5/12'>
          <HeroSpecSheet />
        </div>
      </div>
    </section>
  );
}
