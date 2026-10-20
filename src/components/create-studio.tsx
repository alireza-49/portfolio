"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Eye,
  Palette,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

type PaletteId = "coral" | "mustard" | "teal" | "indigo";
type DensityId = "compact" | "comfortable" | "spacious";

type Palette = {
  name: string;
  hex: string;
  soft: string;
  ink: string;
};

type Density = {
  name: string;
  label: string;
  pad: number;
  gap: number;
};

const PALETTES: Record<PaletteId, Palette> = {
  coral: { name: "مرجانی", hex: "#e76f51", soft: "#fbeee9", ink: "#ffffff" },
  mustard: { name: "خردلی", hex: "#e9c46a", soft: "#fdf7e7", ink: "#264653" },
  teal: { name: "فیروزه‌ای", hex: "#2a9d8f", soft: "#e0f2f1", ink: "#ffffff" },
  indigo: { name: "سرمه‌ای", hex: "#264653", soft: "#e6eef1", ink: "#ffffff" },
};

const PALETTE_ORDER: PaletteId[] = ["coral", "mustard", "teal", "indigo"];

const DENSITIES: Record<DensityId, Density> = {
  compact: { name: "فشرده", label: "compact", pad: 12, gap: 8 },
  comfortable: { name: "متعادل", label: "comfortable", pad: 20, gap: 12 },
  spacious: { name: "جادار", label: "spacious", pad: 28, gap: 18 },
};

const DENSITY_ORDER: DensityId[] = ["compact", "comfortable", "spacious"];

const RADII = [0, 4, 8, 12, 16];

export function CreateStudio() {
  const [paletteId, setPaletteId] = useState<PaletteId>("coral");
  const [radius, setRadius] = useState<number>(4);
  const [densityId, setDensityId] = useState<DensityId>("comfortable");
  const [copied, setCopied] = useState(false);

  const palette = PALETTES[paletteId];
  const density = DENSITIES[densityId];

  const snippet = useMemo(
    () => `/* استودیو کدولوژی // خروجی تم */
:root {
  --accent: ${palette.hex};
  --accent-soft: ${palette.soft};
  --radius: ${radius}px;
  --density: ${density.label};
}

/* tailwind.config.ts */
export default {
  theme: {
    extend: {
      colors: { accent: "${palette.hex}" },
      borderRadius: { craft: "${radius}px" },
    },
  },
};`,
    [palette, radius, density],
  );

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="create-studio"
      className="w-full border-b-[2.5px] border-indigo-ink bg-paper px-4 py-20 sm:px-8 lg:px-12"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="border-b-[2px] border-indigo-ink pb-6 text-right">
          <span className="riso-stamp mb-3 inline-flex text-[10px]">
            THEME WORKSHOP // کارگاه تم
          </span>
          <h1 className="text-[26px] font-black text-indigo-ink sm:text-[34px]">
            تم ریسوگراف خودت را بساز
          </h1>
          <p className="max-w-2xl pt-2 text-base font-medium text-indigo-light">
            پالت رنگ، شعاع گوشه و تراکم را انتخاب کن؛ پیش‌نمایش زنده بلافاصله
            به‌روز می‌شود و خروجی CSS و Tailwind آماده کپی است. بدون واسطه،
            بدون حدس و گمان.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="craft-card flex flex-col gap-6 rounded-sm bg-paper-light p-6 sm:p-8 lg:col-span-5">
            <div>
              <span className="mb-3 flex items-center gap-2 text-[16px] font-black text-indigo-ink">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral font-mono text-xs text-white">
                  ۱
                </span>
                <Palette className="size-4" />
                <span>پالت رنگ اصلی:</span>
              </span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PALETTE_ORDER.map((id) => {
                  const option = PALETTES[id];
                  const active = paletteId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaletteId(id)}
                      aria-pressed={active}
                      className={`flex items-center justify-between gap-2 rounded-sm border-[2px] p-2.5 text-right transition-colors ${
                        active
                          ? "border-indigo-ink bg-mustard/25"
                          : "border-indigo-ink/40 bg-paper hover:border-indigo-ink"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="flex size-5 items-center justify-center rounded-[2px] border border-indigo-ink"
                          style={{ backgroundColor: option.hex }}
                        >
                          {active ? (
                            <Check
                              className="size-3"
                              style={{ color: option.ink }}
                            />
                          ) : null}
                        </span>
                        <span className="text-xs font-bold text-indigo-ink">
                          {option.name}
                        </span>
                      </span>
                      <span className="font-mono text-[10px] font-bold text-indigo-light">
                        {option.hex.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="mb-3 flex items-center gap-2 text-[16px] font-black text-indigo-ink">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral font-mono text-xs text-white">
                  ۲
                </span>
                <SlidersHorizontal className="size-4" />
                <span>شعاع گوشه‌ها:</span>
              </span>
              <div className="grid grid-cols-5 gap-2">
                {RADII.map((value) => {
                  const active = radius === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRadius(value)}
                      aria-pressed={active}
                      className={`flex flex-col items-center gap-1 rounded-sm border-[2px] py-2 transition-colors ${
                        active
                          ? "border-indigo-ink bg-mustard/25"
                          : "border-indigo-ink/40 bg-paper hover:border-indigo-ink"
                      }`}
                    >
                      <span
                        className="size-4 border-[1.5px] border-indigo-ink bg-coral/30"
                        style={{ borderRadius: value }}
                      />
                      <span className="font-mono text-[10px] font-bold text-indigo-ink">
                        {value}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="mb-3 flex items-center gap-2 text-[16px] font-black text-indigo-ink">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral font-mono text-xs text-white">
                  ۳
                </span>
                <span>تراکم چیدمان:</span>
              </span>
              <div className="grid grid-cols-3 gap-2">
                {DENSITY_ORDER.map((id) => {
                  const option = DENSITIES[id];
                  const active = densityId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setDensityId(id)}
                      aria-pressed={active}
                      className={`rounded-sm border-[2px] p-2.5 text-center transition-colors ${
                        active
                          ? "border-indigo-ink bg-mustard/25"
                          : "border-indigo-ink/40 bg-paper hover:border-indigo-ink"
                      }`}
                    >
                      <span className="block text-xs font-bold text-indigo-ink">
                        {option.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-[10px] text-indigo-light">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-sm border-[1.5px] border-dashed border-indigo-ink/40 bg-paper-dim p-3 text-[11px] leading-relaxed font-medium text-indigo-light">
              همه مقادیر با توکن‌های کارگاه هم‌خوان هستند؛ خروجی را می‌توانی
              مستقیم در <span className="font-mono font-bold">globals.css</span>{" "}
              پروژه خودت جای‌گذاری کنی.
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-7">
            <div className="craft-card rounded-sm bg-paper-light p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-[2px] border-indigo-ink pb-2">
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-indigo-ink">
                  <Eye className="size-3.5" />
                  LIVE PREVIEW // پیش‌نمایش زنده
                </span>
                <span className="riso-stamp-teal px-2 py-[2px] text-[10px] font-bold">
                  {palette.name} / {radius}px
                </span>
              </div>

              <div
                className="mt-4 border-[2.5px] border-indigo-ink bg-paper"
                style={{ borderRadius: radius, padding: density.pad }}
              >
                <div
                  className="flex flex-col"
                  style={{ gap: density.gap }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 border-[1.5px] border-indigo-ink px-2.5 py-1 text-[11px] font-bold"
                      style={{
                        borderRadius: radius,
                        backgroundColor: palette.soft,
                        color: palette.hex,
                      }}
                    >
                      <Sparkles className="size-3.5" />
                      نمونه کارت
                    </span>
                    <span className="font-mono text-[10px] font-bold text-indigo-light">
                      {palette.hex.toUpperCase()} / {radius}px / {density.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-indigo-ink">
                      تیتر نمونه کارت
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed font-medium text-indigo-light">
                      این متن با تراکم «{density.name}» و شعاع گوشه {radius}{" "}
                      پیکسل رندر می‌شود. تغییرات را در پنل کنار اعمال کن.
                    </p>
                  </div>

                  <div
                    className="flex flex-wrap items-center"
                    style={{ gap: density.gap / 2 }}
                  >
                    <button
                      type="button"
                      className="border-[2px] border-indigo-ink px-3 py-1.5 text-xs font-bold"
                      style={{
                        borderRadius: radius,
                        backgroundColor: palette.hex,
                        color: palette.ink,
                      }}
                    >
                      دکمه اصلی
                    </button>
                    <button
                      type="button"
                      className="border-[2px] border-indigo-ink bg-paper-light px-3 py-1.5 text-xs font-bold text-indigo-ink"
                      style={{ borderRadius: radius }}
                    >
                      دکمه ثانویه
                    </button>
                  </div>

                  <div
                    className="grid grid-cols-2"
                    style={{ gap: density.gap / 2 }}
                  >
                    <div
                      className="border-[1.5px] border-indigo-ink/40 bg-paper-light p-2"
                      style={{ borderRadius: radius }}
                    >
                      <span className="block text-[10px] font-bold text-indigo-light">
                        شاخص عملکرد
                      </span>
                      <span className="font-mono text-sm font-black text-indigo-ink">
                        99/100
                      </span>
                    </div>
                    <div
                      className="border-[1.5px] border-indigo-ink/40 bg-paper-light p-2"
                      style={{ borderRadius: radius }}
                    >
                      <span className="block text-[10px] font-bold text-indigo-light">
                        وزن صفحه
                      </span>
                      <span className="font-mono text-sm font-black text-indigo-ink">
                        &lt; 380 KB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="craft-card rounded-sm bg-paper-light p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-[2px] border-indigo-ink pb-2">
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-indigo-ink">
                  <Code2 className="size-3.5" />
                  THEME EXPORT // خروجی تم
                </span>
                <button
                  type="button"
                  onClick={copySnippet}
                  className="craft-btn inline-flex items-center gap-1.5 rounded-sm bg-mustard px-2.5 py-1 text-[11px] font-bold text-indigo-ink"
                >
                  {copied ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  <span>{copied ? "کپی شد" : "کپی کد"}</span>
                </button>
              </div>

              <pre
                dir="ltr"
                className="mt-3 overflow-x-auto rounded-sm bg-indigo-ink p-3 text-left font-mono text-[11px] leading-relaxed text-paper"
              >
                <code>{snippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
