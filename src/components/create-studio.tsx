"use client";

import { useMemo, useState } from "react";
import { BookOpen, Code2, Copy, X } from "lucide-react";
import { CreateStudioCanvas } from "@/components/create-studio-canvas";
import { CreateStudioSidebar } from "@/components/create-studio-sidebar";
import {
  ARCHETYPES,
  SHUFFLE_PRESETS,
  buildThemeSnippet,
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
      <section className='w-full shrink-0 border-b-[2.5px] border-indigo-ink bg-paper-dim px-4 py-2 sm:px-8'>
        <div className='mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 md:flex-row md:items-center'>
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-bold'>
              <BookOpen className='size-3.5' />
              سناریوی بوم:
            </span>
            <div className='inline-flex flex-wrap gap-0.5 rounded-sm border border-indigo-ink bg-paper-light p-0.5 text-xs font-bold shadow-craft-sm'>
              {ARCHETYPES.map((item) => {
                const active = archetype === item.id;
                return (
                  <button
                    key={item.id}
                    type='button'
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

          <div className='flex items-center gap-2 self-end md:self-auto'>
            <span className='flex items-center gap-1 rounded-sm border border-indigo-ink bg-paper-light px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-ink shadow-craft-sm'>
              <span className='size-1.5 rounded-full bg-teal-craft' />
              STUDIO READY
            </span>
          </div>
        </div>
      </section>

      <div className='flex min-h-0 w-full flex-1 flex-col items-stretch overflow-y-auto border-b-[2.5px] border-indigo-ink bg-paper-shade lg:flex-row lg:overflow-hidden'>
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
          font={font}
          iconLibrary={iconLibrary}
        />
      </div>

      {modalOpen ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-indigo-ink/60 p-4 backdrop-blur-sm'>
          <div className='flex max-h-[90vh] w-full max-w-2xl flex-col gap-4 overflow-y-auto rounded-sm border border-indigo-ink bg-paper-light p-6 shadow-craft-lg'>
            <div className='flex items-center justify-between border-b border-indigo-ink/20 pb-3'>
              <div className='flex items-center gap-2'>
                <Code2 className='size-[22px] text-coral' />
                <h3 className='text-base font-black text-indigo-ink'>
                  کد تم و پیکربندی خروجی استودیو کُدولوژی
                </h3>
              </div>
              <button
                type='button'
                onClick={() => setModalOpen(false)}
                aria-label='بستن'
                className='rounded-sm border border-indigo-ink bg-paper-dim p-1 text-indigo-ink shadow-craft-sm hover:bg-paper-light'
              >
                <X className='size-[18px]' />
              </button>
            </div>
            <p className='text-xs text-indigo-light'>
              این قطعه کد را در فایل{" "}
              <code className='font-mono'>globals.css</code> پروژه خود (Tailwind
              CSS v4) کپی و جای‌گذاری نمایید.
            </p>
            <pre
              dir='ltr'
              className='overflow-x-auto rounded-sm border border-indigo-ink bg-indigo-ink p-4 text-left font-mono text-[12px] leading-relaxed text-paper select-all'
            >
              <code>{snippet}</code>
            </pre>
            <div className='flex items-center justify-end gap-2 border-t border-indigo-ink/20 pt-2'>
              <button
                type='button'
                onClick={() => copy(snippet)}
                className='flex items-center gap-1.5 rounded-sm border border-indigo-ink bg-coral px-4 py-2 text-xs font-bold text-white shadow-craft-sm transition-all hover:bg-coral-dark active:translate-x-0.5 active:translate-y-0.5'
              >
                <Copy className='size-4' />
                <span>{copied ? "کپی شد!" : "کپی در کلیپ‌بورد"}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
