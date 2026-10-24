"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  Calculator,
  Coffee,
  Rocket,
  SlidersHorizontal,
  Smile,
} from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HeroSpecSheet } from "@/components/hero-spec-sheet";

const HERO_BADGES = [
  { icon: Coffee, label: "مشاوره ۱۰۰٪ رایگان و بدون تعهد", tone: "coral" },
  { icon: Calculator, label: "ماشین‌حساب آنلاین قیمت و زمان", tone: "teal" },
  {
    icon: SlidersHorizontal,
    label: "امکان تست و شخصی‌سازی آزمایشی",
    tone: "mustard",
  },
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
    <section className='dot-grid relative w-full overflow-hidden border-b-[2.5px] border-indigo-ink bg-paper px-4 pt-12 pb-20 sm:px-8 lg:px-12'>
      <div
        aria-hidden
        className='pointer-events-none absolute -top-10 left-10 h-72 w-72 rounded-full bg-mustard/25 blur-3xl'
      />
      <div
        aria-hidden
        className='pointer-events-none absolute right-10 bottom-4 h-80 w-80 rounded-full bg-coral/15 blur-3xl'
      />

      <div className='relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row'>
        <div className='flex w-full flex-col gap-6 text-right lg:w-7/12'>
          <div className='flex flex-wrap items-center gap-2.5'>
            {HERO_BADGES.map((badge) => (
              <Badge
                key={badge.label}
                variant='outline'
                data-cursor-morph
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold [&>svg]:size-4",
                  BADGE_TONES[badge.tone],
                )}
              >
                <badge.icon className='size-4' />
                {badge.label}
              </Badge>
            ))}
          </div>

          <h1 className='font-display text-[32px] leading-[1.3] font-black text-indigo-ink sm:text-[46px]'>
            طراحی وب{" "}
            <span
              className={`ink-splash-wrapper group mx-1.5 inline-block px-3 py-1 align-baseline text-coral ${
                splashed ? "splashed" : ""
              }`}
              title='برای پاشش جوهر ریزوگراف کلیک یا هاور کنید!'
              onMouseEnter={splatter}
              onMouseLeave={reset}
              onClick={splatter}
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
                className='ink-droplet-svg -inset-6 h-[calc(100%+48px)] w-[calc(100%+48px)] transition-all duration-300'
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
                ارزان ، سریع و شخصی سازی شده
              </span>

              <span className='absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-coral transition-opacity duration-200 group-[.splashed]:opacity-0' />
            </span>{" "}
            برای همه کسب‌وکارها{" "}
          </h1>

          <p className='max-w-2xl text-[17px] leading-[1.85] font-medium text-indigo-light sm:text-[18px]'>
            بدون واسطه و مستقیم با من گفتگو کنید! قبل از شروع می توانید با{" "}
            <strong className='font-bold text-indigo-ink'>
              ماشین‌حساب آنلاین
            </strong>{" "}
            هزینه و زمان دقیق پروژه‌تان را برآورد کنید، در{" "}
            <strong className='font-bold text-indigo-ink'>
              جلسه مشاوره رایگان ۳۰ دقیقه‌ای
            </strong>{" "}
            ایده‌تان را موشکافی کنیم و حتی می توانید از قسمت ساخت ساخت انلاین
            چیدمان و دیزاین را به صورت{" "}
            <strong className='font-bold text-indigo-ink'>
              رایگان و تست و شخصی‌سازی زنده
            </strong>{" "}
            مطابق سلیقه برند خود بررسی نمایید.
          </p>

          <div className='grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2'>
            {HERO_PROMISES.map((promise) => (
              <Card
                key={promise.title}
                data-cursor-morph
                className='flex flex-row items-center gap-3 rounded-sm border-[2px] border-indigo-ink bg-paper-light p-3 shadow-craft-inset'
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded border font-bold",
                    promise.box,
                  )}
                >
                  <promise.icon className='size-5' />
                </span>
                <div className='text-xs sm:text-sm'>
                  <strong className='block text-indigo-ink'>
                    {promise.title}
                  </strong>
                  <span className='text-indigo-light'>{promise.body}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className='flex flex-wrap items-center gap-4 pt-3'>
            <Link
              href='#contact-section'
              className='craft-btn inline-flex h-auto items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-6 py-3.5 text-base font-bold text-white shadow-craft-sm transition-colors hover:bg-coral-dark'
            >
              <span>رزرو جلسه مشاوره رایگان (۳۰ دقیقه)</span>
              <Coffee className='size-5' />
            </Link>
            <Link
              href='#estimator-section'
              className='craft-btn inline-flex h-auto items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink bg-mustard px-6 py-3.5 text-base font-bold text-indigo-ink shadow-craft-sm transition-colors hover:bg-mustard-deep'
            >
              <span>محاسبه آنلاین قیمت و زمان تحویل</span>
              <Calculator className='size-5' />
            </Link>
          </div>
        </div>

        <div className='flex w-full items-center justify-center lg:w-5/12'>
          <HeroSpecSheet />
        </div>
      </div>
    </section>
  );
}
