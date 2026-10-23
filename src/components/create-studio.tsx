"use client";

import {
  useMemo,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Coffee,
  Code2,
  Copy,
  HelpCircle,
  MousePointerClick,
  X,
} from "lucide-react";
import { LogoButton } from "@/assests/logo";
import { CreateStudioCanvas } from "@/components/create-studio-canvas";
import { CreateStudioSidebar } from "@/components/create-studio-sidebar";
import { CreateStudioTour } from "@/components/create-studio-tour";
import { createThemePresets } from "@/components/create-components/style-presets";
import {
  PALETTE_PRESETS,
  resetPaletteGroup,
  resetPaletteToken,
  studioPaletteFromPreset,
  withPaletteToken,
  type PalettePreset,
  type PaletteTokenId,
} from "@/components/create-studio-palette";
import {
  ARCHETYPE_ICONS,
  ARCHETYPES,
  DEFAULT_SHADOW,
  STYLE_FONTS,
  STYLES,
  buildThemeSnippet,
  type ArchetypeId,
  type StyleId,
} from "@/components/create-studio-config";
import {
  DEFAULT_STUDIO_CONFIG,
  materializeStudioConfig,
  updateStudioConfig,
  useStudioConfig,
  type StudioConfig,
} from "@/components/create-studio-store";
import {
  addCustomFont,
  getCustomFontsServerSnapshot,
  getCustomFontsSnapshot,
  removeCustomFont,
  resolveFontStack,
  subscribeCustomFonts,
} from "@/components/create-studio-custom-fonts";

/** Shared between the header tab and the canvas panel it controls. */
const scenarioTabId = (id: ArchetypeId) => `scenario-tab-${id}`;

export function CreateStudio() {
  const router = useRouter();

  // The sidebar configuration lives in localStorage; until the saved snapshot
  // arrives (and for every server render) the canvas uses the documented
  // defaults, so hydration always matches the prerendered HTML.
  const savedConfig = useStudioConfig();
  const config = savedConfig ?? DEFAULT_STUDIO_CONFIG;
  const { archetype, styleId, palette, radius, shadow, font, iconLibrary, iconStyle } =
    config;

  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tourRun, setTourRun] = useState(0);

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
        palette,
        radius,
        shadow,
        style: styleId,
        fontStack,
        iconStyle,
      }),
    [palette, radius, shadow, styleId, fontStack, iconStyle],
  );

  const patchConfig = (patch: Partial<StudioConfig>) => {
    updateStudioConfig(patch);
  };

  const selectPalette = (preset: PalettePreset) => {
    patchConfig({ palette: studioPaletteFromPreset(preset) });
  };

  const setPaletteColor = (token: PaletteTokenId, hex: string) => {
    patchConfig({ palette: withPaletteToken(palette, token, hex) });
  };

  const selectStyle = (id: StyleId) => {
    // Each style names the voice it was drawn for and owns its elevation and
    // geometry; the picker can override radius, font and shadow afterwards.
    patchConfig({
      styleId: id,
      radius: createThemePresets[id].tokens.radius ?? radius,
      font: STYLE_FONTS[id],
      shadow: DEFAULT_SHADOW,
    });
  };

  const addFont = async (name: string, file: File) => {
    const customFont = await addCustomFont({ name, file });
    patchConfig({ font: customFont.id });
  };

  const deleteFont = async (id: string) => {
    await removeCustomFont(id);
    if (font === id) patchConfig({ font: "vazirmatn" });
  };

  const shuffle = () => {
    // Random style + random ready palette: the preset already owns geometry
    // and typography, so a hand-maintained combination list would only go
    // stale.
    const nextStyle = STYLES[Math.floor(Math.random() * STYLES.length)];
    const nextPalette =
      PALETTE_PRESETS[Math.floor(Math.random() * PALETTE_PRESETS.length)];
    patchConfig({
      palette: studioPaletteFromPreset(nextPalette),
      radius: createThemePresets[nextStyle.id].tokens.radius ?? 8,
      styleId: nextStyle.id,
      font: STYLE_FONTS[nextStyle.id],
      shadow: DEFAULT_SHADOW,
    });
  };

  const selectScenario = (id: ArchetypeId, moveFocus = false) => {
    patchConfig({ archetype: id });
    if (moveFocus) {
      document.getElementById(scenarioTabId(id))?.focus();
    }
  };

  /**
   * Hand the current configuration to the home-page contact form: localStorage
   * already holds every edit, and this write also covers a visitor who liked
   * the untouched defaults.
   */
  const sendConfig = () => {
    materializeStudioConfig();
    router.push("/#contact-section");
  };

  // RTL tablist: ArrowLeft walks to the next scenario, ArrowRight to the previous.
  const handleScenarioKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const last = ARCHETYPES.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowLeft") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowRight") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next === null) return;
    event.preventDefault();
    selectScenario(ARCHETYPES[next].id, true);
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
      <header className='relative z-20 w-full shrink-0 border-b-[2.5px] border-indigo-ink bg-paper'>
        <div className='flex h-15 w-full items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8'>
          <div className='relative flex shrink-0 items-center'>
            <LogoButton
              aria-label='استودیو کدولوژی'
              logoClassName='size-full'
              className='size-8 rounded-sm border-[1.5px] border-indigo-ink bg-mustard/30 p-1 text-indigo-ink shadow-craft-inset hover:bg-mustard/30 hover:text-indigo-ink sm:size-9'
            />
            <span className='absolute -top-1 -right-1 flex h-2.5 w-2.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-craft opacity-75' />
              <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-craft' />
            </span>
          </div>

          <Link
            href='/'
            className='hidden shrink-0 font-display text-sm leading-tight font-black tracking-tight text-indigo-ink transition-colors hover:text-coral md:block lg:text-base'
          >
            استودیو کدولوژی
          </Link>

          <span className='mx-1 hidden h-6 w-px shrink-0 bg-indigo-ink/20 lg:block' />

          <div className='flex min-w-0 flex-1 items-center gap-2 lg:justify-center'>
            <span className='flex shrink-0 items-center gap-1 text-[10px] font-bold whitespace-nowrap text-indigo-light'>
              <MousePointerClick
                aria-hidden='true'
                className='size-3.5 text-coral'
              />
              <span className='sm:hidden'>سناریو</span>
              <span className='hidden sm:inline'>انتخاب سناریو</span>
            </span>

            <div
              role='tablist'
              aria-label='انتخاب سناریوی بوم'
              data-tour='scenarios'
              className='flex min-w-0 items-center gap-0.5 overflow-x-auto rounded-sm border-[1.5px] border-indigo-ink bg-paper-dim p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            >
              {ARCHETYPES.map((item, index) => {
                const active = archetype === item.id;
                const Icon = ARCHETYPE_ICONS[item.id];
                return (
                  <button
                    key={item.id}
                    id={scenarioTabId(item.id)}
                    type='button'
                    role='tab'
                    aria-selected={active}
                    aria-controls='studio-canvas'
                    aria-label={item.label}
                    title={item.description}
                    tabIndex={active ? 0 : -1}
                    onClick={() => selectScenario(item.id)}
                    onKeyDown={(event) => handleScenarioKeyDown(event, index)}
                    className={`flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-[2px] px-3 text-[11px] font-black whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-1 focus-visible:outline-none ${
                      active
                        ? "bg-indigo-ink text-paper"
                        : "text-indigo-ink/75 hover:bg-paper hover:text-indigo-ink"
                    }`}
                  >
                    <Icon
                      aria-hidden='true'
                      className={`size-3.5 ${active ? "text-mustard" : "text-coral"}`}
                    />
                    <span>{item.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <span className='mx-1 hidden h-6 w-px shrink-0 bg-indigo-ink/20 lg:block' />

          <button
            type='button'
            onClick={() => setTourRun((run) => run + 1)}
            aria-label='نمایش دوبارهٔ راهنمای استودیو'
            title='راهنمای استفاده از استودیو'
            className='craft-btn inline-flex h-auto shrink-0 items-center justify-center gap-1 rounded-sm bg-paper px-2 py-1.5 text-xs font-bold whitespace-nowrap text-indigo-ink transition-colors hover:bg-mustard/40 sm:px-2.5'
          >
            <HelpCircle className='size-4 text-coral' />
            <span className='hidden sm:inline'>راهنما</span>
          </button>

          <Link
            href='/#contact-section'
            aria-label='مشاوره و سفارش'
            className='craft-btn inline-flex h-auto shrink-0 items-center justify-center gap-1 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-2.5 py-1.5 text-xs font-bold whitespace-nowrap text-white shadow-craft-sm transition-colors hover:bg-coral-dark sm:px-3.5 sm:text-[13px]'
          >
            <Coffee className='size-4' />
            <span className='hidden sm:inline'>مشاوره و سفارش</span>
          </Link>
        </div>
      </header>

      <div className='flex min-h-0 w-full flex-1 scroll-pt-14 flex-col items-stretch overflow-y-auto border-b-[2.5px] border-indigo-ink bg-paper-shade lg:flex-row lg:overflow-hidden'>
        <CreateStudioSidebar
          styleId={styleId}
          onStyleChange={selectStyle}
          palette={palette}
          onPalettePreset={selectPalette}
          onPaletteToken={setPaletteColor}
          onResetPaletteToken={(token) =>
            patchConfig({ palette: resetPaletteToken(palette, token) })
          }
          onResetPaletteGroup={(group) =>
            patchConfig({ palette: resetPaletteGroup(palette, group) })
          }
          radius={radius}
          onRadiusChange={(value) => patchConfig({ radius: value })}
          shadow={shadow}
          onShadowChange={(value) => patchConfig({ shadow: value })}
          font={font}
          onFontChange={(id) => patchConfig({ font: id })}
          customFonts={customFonts}
          onAddCustomFont={addFont}
          onRemoveCustomFont={deleteFont}
          iconLibrary={iconLibrary}
          onIconLibraryChange={(id) => patchConfig({ iconLibrary: id })}
          iconStyle={iconStyle}
          onIconStyleChange={(style) => patchConfig({ iconStyle: style })}
          onShuffle={shuffle}
          onExport={() => setModalOpen(true)}
          onSendConfig={sendConfig}
        />
        <CreateStudioCanvas
          archetype={archetype}
          palette={palette}
          radius={radius}
          shadow={shadow}
          styleId={styleId}
          fontFamily={fontStack}
          iconLibrary={iconLibrary}
          iconStyle={iconStyle}
        />
      </div>

      <CreateStudioTour run={tourRun} />

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
