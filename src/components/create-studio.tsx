"use client";

import { useMemo, useState } from "react";
import { BookOpen, Code2, Copy, Terminal, X } from "lucide-react";
import { CreateStudioCanvas } from "@/components/create-studio-canvas";
import { CreateStudioSidebar } from "@/components/create-studio-sidebar";
import {
  ARCHETYPES,
  SHUFFLE_PRESETS,
  buildThemeSnippet,
  buildTokenLine,
  type ArchetypeId,
  type FontId,
  type IconLibraryId,
  type StyleId,
} from "@/components/create-studio-config";

export function CreateStudio() {
  const [archetype, setArchetype] = useState<ArchetypeId>("components");
  const [styleId, setStyleId] = useState<StyleId>("nova");
  const [primary, setPrimary] = useState("#e76f51");
  const [primarySubtle, setPrimarySubtle] = useState("#fbeee9");
  const [colorName, setColorName] = useState("سفال کهربایی");
  const [radius, setRadius] = useState(4);
  const [font, setFont] = useState<FontId>("vazir");
  const [iconLibrary, setIconLibrary] = useState<IconLibraryId>("google");
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const snippet = useMemo(
    () =>
      buildThemeSnippet({
        primary,
        primarySubtle,
        radius,
        style: styleId,
        font,
      }),
    [primary, primarySubtle, radius, styleId, font],
  );

  const tokenLine = useMemo(
    () => buildTokenLine({ primary, radius, style: styleId }),
    [primary, radius, styleId],
  );

  const selectColor = (hex: string, subtle: string, name: string) => {
    setPrimary(hex);
    setPrimarySubtle(subtle);
    setColorName(name);
  };

  const shuffle = () => {
    const preset =
      SHUFFLE_PRESETS[Math.floor(Math.random() * SHUFFLE_PRESETS.length)];
    setPrimary(preset.hex);
    setPrimarySubtle(preset.subtle);
    setColorName(preset.name);
    setRadius(preset.radius);
    setStyleId(preset.style);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <section className="w-full border-b-[2.5px] border-indigo-ink bg-paper-dim px-4 py-2 sm:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-sm bg-indigo-ink px-2 py-0.5 font-mono text-xs font-bold text-paper shadow-craft-sm">
              <BookOpen className="size-3.5" />
              سناریوی بوم:
            </span>
            <div className="inline-flex flex-wrap gap-0.5 rounded-sm border border-indigo-ink bg-paper-light p-0.5 text-xs font-bold shadow-craft-sm">
              {ARCHETYPES.map((item) => {
                const active = archetype === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setArchetype(item.id)}
                    aria-pressed={active}
                    className={`rounded-sm px-3 py-1 transition-all ${
                      active
                        ? "bg-coral text-white shadow-craft-sm"
                        : "text-indigo-light hover:text-indigo-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="flex items-center gap-1 rounded-sm border border-indigo-ink bg-paper-light px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-ink shadow-craft-sm">
              <span className="size-1.5 rounded-full bg-teal-craft" />
              STUDIO READY
            </span>
          </div>
        </div>
      </section>

      <div className="flex w-full flex-1 flex-col items-stretch border-b-[2.5px] border-indigo-ink bg-paper-shade lg:flex-row">
        <CreateStudioSidebar
          styleId={styleId}
          onStyleChange={setStyleId}
          primary={primary}
          primarySubtle={primarySubtle}
          colorName={colorName}
          onColorChange={selectColor}
          radius={radius}
          onRadiusChange={setRadius}
          font={font}
          onFontChange={setFont}
          iconLibrary={iconLibrary}
          onIconLibraryChange={setIconLibrary}
          onShuffle={shuffle}
          onExport={() => setModalOpen(true)}
        />
        <CreateStudioCanvas
          archetype={archetype}
          primary={primary}
          primarySubtle={primarySubtle}
          radius={radius}
          styleId={styleId}
        />
      </div>

      <section className="sticky bottom-0 z-40 border-t-[2.5px] border-indigo-ink bg-paper/95 px-4 py-2 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="flex w-full items-center gap-2 overflow-x-auto py-1 sm:w-auto">
            <span className="flex items-center gap-1 whitespace-nowrap text-xs font-black text-indigo-ink">
              <Terminal className="size-4 text-coral" />
              خروجی فعال توکن‌ها:
            </span>
            <code
              dir="ltr"
              className="whitespace-nowrap rounded-sm border border-indigo-ink bg-paper-light px-3 py-1 font-mono text-[11px] font-bold text-coral shadow-craft-sm"
            >
              {tokenLine}
            </code>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => copy(tokenLine)}
              className="flex items-center gap-1 rounded-sm border border-indigo-ink bg-paper-light px-3 py-1 text-xs font-bold text-indigo-ink shadow-craft-sm transition-all hover:bg-paper-dim active:translate-x-0.5 active:translate-y-0.5"
            >
              <Copy className="size-3.5" />
              <span>کپی سریع</span>
            </button>
            {copied ? (
              <span className="rounded-sm border border-indigo-ink bg-coral px-2 py-0.5 text-xs font-bold text-white">
                کپی شد!
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-ink/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-4 overflow-y-auto rounded-sm border border-indigo-ink bg-paper-light p-6 shadow-craft-lg">
            <div className="flex items-center justify-between border-b border-indigo-ink/20 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="size-[22px] text-coral" />
                <h3 className="text-base font-black text-indigo-ink">
                  کد تم و پیکربندی خروجی استودیو کُدولوژی
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="بستن"
                className="rounded-sm border border-indigo-ink bg-paper-dim p-1 text-indigo-ink shadow-craft-sm hover:bg-paper-light"
              >
                <X className="size-[18px]" />
              </button>
            </div>
            <p className="text-xs text-indigo-light">
              این قطعه کد را در فایل{" "}
              <code className="font-mono">tailwind.config.js</code> یا شیوه
              پوشش‌دهی CSS متغیرهای پروژه خود کپی و جای‌گذاری نمایید.
            </p>
            <pre
              dir="ltr"
              className="overflow-x-auto rounded-sm border border-indigo-ink bg-indigo-ink p-4 text-left font-mono text-[12px] leading-relaxed text-paper select-all"
            >
              <code>{snippet}</code>
            </pre>
            <div className="flex items-center justify-end gap-2 border-t border-indigo-ink/20 pt-2">
              <button
                type="button"
                onClick={() => copy(snippet)}
                className="flex items-center gap-1.5 rounded-sm border border-indigo-ink bg-coral px-4 py-2 text-xs font-bold text-white shadow-craft-sm transition-all hover:bg-coral-dark active:translate-x-0.5 active:translate-y-0.5"
              >
                <Copy className="size-4" />
                <span>کپی در کلیپ‌بورد</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
