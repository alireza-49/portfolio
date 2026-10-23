"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  BookOpen,
  ChartLine,
  Code2,
  Copy,
  LayoutGrid,
  PanelsTopLeft,
  ShoppingBag,
  Stethoscope,
  X,
  type LucideIcon,
} from "lucide-react";
import { CreateStudioCanvas } from "@/components/create-studio-canvas";
import { CreateStudioSidebar } from "@/components/create-studio-sidebar";
import { createThemePresets } from "@/components/create-components/style-presets";
import {
  ARCHETYPES,
  SHUFFLE_PRESETS,
  buildThemeSnippet,
  type ArchetypeId,
  type IconLibraryId,
  type StyleId,
} from "@/components/create-studio-config";
import {
  addCustomFont,
  getCustomFontsServerSnapshot,
  getCustomFontsSnapshot,
  removeCustomFont,
  resolveFontStack,
  subscribeCustomFonts,
} from "@/components/create-studio-custom-fonts";

const ARCHETYPE_ICONS: Record<ArchetypeId, LucideIcon> = {
  components: LayoutGrid,
  landing: PanelsTopLeft,
  ecommerce: ShoppingBag,
  clinic: Stethoscope,
  dashboard: ChartLine,
};

export function CreateStudio() {
  const [archetype, setArchetype] = useState<ArchetypeId>("components");
  const [styleId, setStyleId] = useState<StyleId>("nova");
  const [primary, setPrimary] = useState("#e76f51");
  const [primarySubtle, setPrimarySubtle] = useState("#fbeee9");
  const [colorName, setColorName] = useState("سفال کهربایی");
  const [radius, setRadius] = useState(4);
  const [font, setFont] = useState<string>("vazirmatn");
  const [iconLibrary, setIconLibrary] = useState<IconLibraryId>("google");
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Uploaded fonts come from IndexedDB through the store; the server snapshot
  // is empty, so hydration starts from the same list the prerender produced.
  const customFonts = useSyncExternalStore(
    subscribeCustomFonts,
    getCustomFontsSnapshot,
    getCustomFontsServerSnapshot,
  );
  const fontStack = resolveFontStack(font, customFonts);

  const snippet = useMemo(
    () =>
      buildThemeSnippet({
        primary,
        primarySubtle,
        radius,
        style: styleId,
        fontStack,
      }),
    [primary, primarySubtle, radius, styleId, fontStack],
  );

  const selectColor = (hex: string, subtle: string, name: string) => {
    setPrimary(hex);
    setPrimarySubtle(subtle);
    setColorName(name);
  };

  const selectStyle = (id: StyleId) => {
    setStyleId(id);
    setRadius(createThemePresets[id].tokens.radius ?? radius);
  };

  const addFont = async (name: string, file: File) => {
    const customFont = await addCustomFont({ name, file });
    setFont(customFont.id);
  };

  const deleteFont = async (id: string) => {
    await removeCustomFont(id);
    if (font === id) setFont("vazirmatn");
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

  const activeArchetype =
    ARCHETYPES.find((item) => item.id === archetype) ?? ARCHETYPES[0];

  return (
    <>
      <section className='w-full shrink-0 border-b-[2.5px] border-indigo-ink bg-paper-dim px-4 py-3 sm:px-8'>
        <div className='mx-auto flex max-w-7xl flex-col gap-2.5'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-3'>
              <span className='flex size-11 shrink-0 items-center justify-center rounded-sm border-[1.5px] border-indigo-ink bg-mustard/30 text-indigo-ink shadow-craft-sm'>
                <BookOpen className='size-5' />
              </span>
              <div className='flex flex-col gap-0.5'>
                <span className='flex flex-wrap items-center gap-2 font-mono text-[9px] font-bold tracking-[0.18em] text-indigo-light uppercase'>
                  Scenario canvas
                  <span className='inline-flex items-center gap-1 rounded-sm border border-indigo-ink/40 bg-paper-light px-1.5 py-px text-[8px] font-bold tracking-normal text-indigo-ink normal-case'>
                    <span className='size-1 rounded-full bg-teal-craft' />
                    Studio ready
                  </span>
                </span>
                <h2 className='flex flex-wrap items-center gap-2 text-sm leading-tight font-black text-indigo-ink sm:text-base'>
                  <span>سناریوی بوم</span>
                  <span className='rounded-sm bg-indigo-ink px-1.5 py-0.5 text-[10px] font-bold text-paper'>
                    {activeArchetype.label}
                  </span>
                </h2>
                <p className='hidden max-w-md text-[11px] leading-relaxed text-indigo-light sm:block'>
                  صحنهٔ پیش‌نمایش را عوض کنید؛ همهٔ سناریوها با همان توکن‌های تم
                  رنگ می‌گیرند.
                </p>
              </div>
            </div>
          </div>

          <div className='-mx-1 grid grid-flow-col auto-cols-[minmax(10.5rem,1fr)] gap-2 overflow-x-auto px-1 pb-1 xl:mx-0 xl:grid-flow-row xl:grid-cols-5 xl:overflow-visible xl:px-0 xl:pb-0'>
            {ARCHETYPES.map((item) => {
              const active = archetype === item.id;
              const Icon = ARCHETYPE_ICONS[item.id];
              return (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => setArchetype(item.id)}
                  aria-pressed={active}
                  title={item.description}
                  className={`flex items-center gap-2 rounded-sm border-[1.5px] border-indigo-ink px-2.5 py-2 text-right transition-all ${
                    active
                      ? "bg-coral text-white shadow-craft"
                      : "bg-paper-light text-indigo-ink shadow-craft-sm hover:-translate-y-0.5 hover:bg-paper hover:shadow-craft"
                  }`}
                >
                  <span
                    aria-hidden='true'
                    className={`flex size-8 shrink-0 items-center justify-center rounded-sm border-[1.5px] ${
                      active
                        ? "border-white/40 bg-white/15 text-white"
                        : "border-indigo-ink bg-paper-dim text-coral"
                    }`}
                  >
                    <Icon className='size-4' />
                  </span>
                  <span className='flex min-w-0 flex-col gap-0.5'>
                    <span className='text-xs leading-tight font-black whitespace-nowrap'>
                      {item.label}
                    </span>
                    <span
                      dir='ltr'
                      className={`text-left font-mono text-[9px] leading-tight font-bold tracking-[0.14em] ${
                        active ? "text-white/80" : "text-indigo-light"
                      }`}
                    >
                      {item.tagline}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className='flex min-h-0 w-full flex-1 flex-col items-stretch overflow-y-auto border-b-[2.5px] border-indigo-ink bg-paper-shade lg:flex-row lg:overflow-hidden'>
        <CreateStudioSidebar
          styleId={styleId}
          onStyleChange={selectStyle}
          primary={primary}
          primarySubtle={primarySubtle}
          colorName={colorName}
          onColorChange={selectColor}
          radius={radius}
          onRadiusChange={setRadius}
          font={font}
          onFontChange={setFont}
          customFonts={customFonts}
          onAddCustomFont={addFont}
          onRemoveCustomFont={deleteFont}
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
          fontFamily={fontStack}
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
