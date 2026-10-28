"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardPaste,
  Code2,
  Coffee,
  Copy,
  FileDown,
  FileUp,
  HelpCircle,
  MousePointerClick,
  SlidersHorizontal,
  Upload,
  X,
} from "lucide-react";
import { LogoButton } from "@/assests/logo";
import { CreateStudioCanvas } from "@/components/create-studio-canvas";
import { CreateStudioSidebar } from "@/components/create-studio-sidebar";
import { CreateStudioTour } from "@/components/create-studio-tour";
import { createThemePresets } from "@/components/create-components/style-presets";
import {
  paletteForStyle,
  resetPaletteGroup,
  resetPaletteToken,
  studioPaletteFromPreset,
  withPaletteToken,
  type PalettePreset,
  type PaletteTokenId,
} from "@/components/create-studio-palette";
import { rollStudioConfig } from "@/components/create-studio-shuffle";
import {
  ARCHETYPE_ICONS,
  ARCHETYPES,
  DEFAULT_SHADOW,
  STYLE_FONTS,
  buildThemeSnippet,
  type ArchetypeId,
  type StyleId,
} from "@/components/create-studio-config";
import {
  buildStudioHandoff,
  describeStudioConfig,
  isStudioFontAvailable,
  parseStudioConfigPayload,
  type StudioImportResult,
} from "@/components/create-studio-handoff";
import {
  DEFAULT_STUDIO_CONFIG,
  materializeStudioConfig,
  resetStudioConfig,
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

/**
 * The settings panel is an overlay side sheet below `lg` and the always-visible
 * column above it. Media-query state is read through `useSyncExternalStore` so
 * the first paint keeps the desktop (inline) shape and the drawer only appears
 * after hydration, matching the prerendered markup.
 */
const COMPACT_QUERY = "(max-width: 1023px)";

function subscribeCompact(onChange: () => void) {
  const query = window.matchMedia(COMPACT_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getCompactSnapshot = () => window.matchMedia(COMPACT_QUERY).matches;
const getCompactServerSnapshot = () => false;

export function CreateStudio() {
  const router = useRouter();
  const compact = useSyncExternalStore(
    subscribeCompact,
    getCompactSnapshot,
    getCompactServerSnapshot,
  );

  // The sidebar configuration lives in localStorage; until the saved snapshot
  // arrives (and for every server render) the canvas uses the documented
  // defaults, so hydration always matches the prerendered HTML.
  const savedConfig = useStudioConfig();
  const config = savedConfig ?? DEFAULT_STUDIO_CONFIG;
  const {
    archetype,
    styleId,
    palette,
    radius,
    shadow,
    font,
    iconLibrary,
    iconStyle,
  } = config;

  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState<"css" | "config" | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [tourRun, setTourRun] = useState(0);
  // Below `lg` the settings panel is a modal side sheet. One state drives the
  // trigger, the panel and the backdrop; `compact` (above) is derived from a
  // media query so the same markup stays the inline column on desktop.
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsTriggerRef = useRef<HTMLButtonElement>(null);
  const settingsWasOpenRef = useRef(false);

  // Move focus into the sheet when it opens and back to the trigger when it
  // closes, so a keyboard user never loses their place in the page.
  useEffect(() => {
    if (settingsOpen) {
      settingsWasOpenRef.current = true;
      const frame = window.requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>("#studio-settings [data-settings-close]")
          ?.focus({ preventScroll: true });
      });
      return () => window.cancelAnimationFrame(frame);
    }
    if (settingsWasOpenRef.current) {
      settingsWasOpenRef.current = false;
      settingsTriggerRef.current?.focus({ preventScroll: true });
    }
  }, [settingsOpen]);

  // A resize past the breakpoint turns the sheet back into the static column;
  // drop the overlay state instead of leaving a stale "open" backdrop behind.
  // This listens to the media query itself (an external event), so it never
  // sets state during a render or synchronously inside an effect body.
  useEffect(() => {
    const query = window.matchMedia(COMPACT_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (!event.matches) setSettingsOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Escape closes the sheet and Tab cycles inside it. The panel is the only
  // focusable region while it is open, so focus can never wander behind the
  // backdrop. Above `lg` the same panel is an inline column, so the trap and
  // Escape handler stay out of the way.
  useEffect(() => {
    if (!compact || !settingsOpen) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSettingsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      // The tour popover is portaled outside the sheet and drives its own
      // next/prev buttons; trapping Tab here would yank focus out of it.
      const current = document.activeElement;
      if (current instanceof Element && current.closest(".driver-popover")) {
        return;
      }
      const panel = document.getElementById("studio-settings");
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !panel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !panel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [compact, settingsOpen]);

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

  // The same payload the contact form submits: configuration + labels +
  // resolved tokens + CSS. Copying it is the only way to move a theme between
  // browsers, so the export dialog offers it next to the CSS snippet.
  const handoffJson = useMemo(
    () => JSON.stringify(buildStudioHandoff(config, customFonts), null, 2),
    [config, customFonts],
  );

  // Live validation of a pasted/loaded configuration. `null` means the field is
  // still empty, so the dialog can keep the apply button disabled.
  const importPreview: StudioImportResult | null = useMemo(
    () => (importText.trim() ? parseStudioConfigPayload(importText) : null),
    [importText],
  );
  const importFontMissing =
    importPreview?.status === "ok" &&
    !isStudioFontAvailable(importPreview.config.font, customFonts);

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
    // Each style names the voice it was drawn for and owns its elevation,
    // geometry and colour family; the picker can override palette, radius,
    // font and shadow afterwards. The palette is synced here (dropping stale
    // neutral/chart overrides) so a style swap never keeps the previous
    // language's brand colours.
    patchConfig({
      styleId: id,
      palette: paletteForStyle(id),
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
    // One press rerolls style, palette, font, shadow, radius and the icon
    // setup. `rollStudioConfig` skips the current value per dimension, so the
    // button always produces a visible change, and it leaves the scenario alone.
    // Uploaded faces join the built-in list so the dice covers every font the
    // typography picker shows.
    patchConfig(
      rollStudioConfig(config, {
        extraFontIds: customFonts.map((item) => item.id),
      }),
    );
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
    setSettingsOpen(false);
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

  const copy = async (text: string, kind: "css" | "config") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  /**
   * Export the whole configuration as a file. Unlike the CSS snippet, this
   * round-trips: the import dialog in the sidebar restores it verbatim, which
   * is how a visitor moves a theme between browsers or sends it by message.
   */
  const downloadConfig = () => {
    const blob = new Blob([handoffJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kodology-theme-${styleId}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const closeImportDialog = () => {
    setImportOpen(false);
    setImportText("");
    setImportError(null);
  };

  const openImportDialog = () => {
    setSettingsOpen(false);
    setImportOpen(true);
    setImportText("");
    setImportError(null);
  };

  // The export dialog is opened from the sheet on mobile; close the sheet first
  // so its backdrop never sits above or below the modal ambiguously.
  const openExportDialog = () => {
    setSettingsOpen(false);
    setModalOpen(true);
  };

  const readConfigFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setImportError("حجم فایل پیکربندی باید کمتر از ۱ مگابایت باشد.");
      return;
    }
    try {
      setImportText(await file.text());
      setImportError(null);
    } catch {
      setImportError("خواندن فایل ممکن نشد؛ متن پیکربندی را دستی بچسبانید.");
    }
  };

  const pasteConfigFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setImportError(
          "کلیپ‌بورد خالی است؛ ابتدا پیکربندی را در استودیو کپی کنید.",
        );
        return;
      }
      setImportText(text);
      setImportError(null);
    } catch {
      setImportError(
        "دسترسی به کلیپ‌بورد ممکن نشد؛ متن را دستی در کادر بچسبانید.",
      );
    }
  };

  const applyImportedConfig = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (importPreview?.status !== "ok") return;
    const next = importPreview.config;
    // A configuration can name an uploaded font this browser does not have;
    // fall back to the face its style ships with instead of leaving the canvas
    // without a usable family.
    patchConfig({
      ...next,
      font: isStudioFontAvailable(next.font, customFonts)
        ? next.font
        : STYLE_FONTS[next.styleId],
    });
    closeImportDialog();
  };

  return (
    <>
      <header className='relative z-20 w-full shrink-0 border-b-[2.5px] border-indigo-ink bg-paper'>
        <div className='flex w-full flex-wrap items-center gap-x-2 gap-y-1.5 px-3 py-2 lg:h-15 lg:flex-nowrap lg:gap-3 lg:px-8 lg:py-0'>
          <div className='relative flex shrink-0 items-center'>
            <LogoButton
              aria-label='وب دیزاین فیل'
              logoClassName='size-full'
              className='size-11 rounded-sm border-[1.5px] border-indigo-ink bg-mustard/30 p-1 text-indigo-ink shadow-craft-inset hover:bg-mustard/30 hover:text-indigo-ink lg:size-13'
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
            وب دیزاین فیل
          </Link>

          <span className='mx-1 hidden h-6 w-px shrink-0 bg-indigo-ink/20 lg:block' />

          <div className='order-last flex w-full min-w-0 items-center gap-2 lg:order-none lg:w-auto lg:flex-1 lg:justify-center'>
            <span className='hidden shrink-0 items-center gap-1 text-[0.625rem] font-bold whitespace-nowrap text-indigo-light md:flex'>
              <MousePointerClick
                aria-hidden='true'
                className='size-3.5 text-coral'
              />
              <span>انتخاب سناریو</span>
            </span>

            <div
              role='tablist'
              aria-label='انتخاب سناریوی بوم'
              data-tour='scenarios'
              className='flex w-full min-w-0 items-center gap-1 overflow-x-auto rounded-sm border-[1.5px] border-indigo-ink bg-paper-dim p-1 [scrollbar-width:none] lg:w-auto lg:gap-0.5 lg:p-0.5 [&::-webkit-scrollbar]:hidden'
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
                    className={`flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[0.125rem] px-1.5 text-[0.625rem] font-black whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-1 focus-visible:outline-none max-lg:flex-1 lg:gap-1.5 lg:px-3 lg:text-[0.6875rem] ${
                      active
                        ? "bg-indigo-ink text-paper"
                        : "text-indigo-ink/75 hover:bg-paper hover:text-indigo-ink"
                    }`}
                  >
                    <Icon
                      aria-hidden='true'
                      className={`size-3.5 max-[359px]:hidden ${active ? "text-mustard" : "text-coral"}`}
                    />
                    <span>{item.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <span className='mx-1 hidden h-6 w-px shrink-0 bg-indigo-ink/20 lg:block' />

          <button
            ref={settingsTriggerRef}
            type='button'
            onClick={() => setSettingsOpen(true)}
            aria-expanded={settingsOpen}
            aria-controls='studio-settings'
            aria-haspopup='dialog'
            aria-label='باز کردن تنظیمات استودیو'
            title='تنظیمات سبک، پالت، گردی، سایه و فونت'
            className='craft-btn inline-flex h-auto shrink-0 items-center justify-center gap-1 rounded-sm border-[2.5px] border-indigo-ink bg-mustard px-2 py-1.5 text-xs font-bold whitespace-nowrap text-indigo-ink shadow-craft-sm transition-colors hover:bg-mustard/80 max-lg:ms-auto lg:hidden'
          >
            <SlidersHorizontal className='size-4 text-indigo-ink' />
            <span className='hidden sm:inline'>تنظیمات</span>
          </button>

          <button
            type='button'
            onClick={() => setTourRun((run) => run + 1)}
            aria-label='نمایش دوبارهٔ راهنمای استودیو'
            title='راهنمای استفاده از استودیو'
            className='craft-btn inline-flex h-auto shrink-0 items-center justify-center gap-1 rounded-sm bg-paper px-2 py-1.5 text-xs font-bold whitespace-nowrap text-indigo-ink transition-colors hover:bg-mustard/40 lg:px-2.5'
          >
            <HelpCircle className='size-4 text-coral' />
            <span className='hidden sm:inline'>راهنما</span>
          </button>

          <Link
            href='/#contact-section'
            aria-label='مشاوره و سفارش'
            className='craft-btn inline-flex h-auto shrink-0 items-center justify-center gap-1 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-2.5 py-1.5 text-xs font-bold whitespace-nowrap text-white shadow-craft-sm transition-colors hover:bg-coral-dark sm:px-3.5 sm:text-[0.8125rem]'
          >
            <Coffee className='size-4' />
            <span className='hidden sm:inline'>مشاوره و سفارش</span>
          </Link>
        </div>
      </header>

      <div className='relative flex min-h-0 w-full flex-1 flex-col items-stretch overflow-hidden border-b-[2.5px] border-indigo-ink bg-paper-shade lg:flex-row'>
        <CreateStudioSidebar
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
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
          onReset={resetStudioConfig}
          onExport={openExportDialog}
          onImport={openImportDialog}
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

      {settingsOpen ? (
        <button
          type='button'
          tabIndex={-1}
          aria-label='بستن تنظیمات'
          onClick={() => setSettingsOpen(false)}
          className='fixed inset-0 z-40 cursor-default bg-indigo-ink/45 lg:hidden'
        />
      ) : null}

      <CreateStudioTour
        run={tourRun}
        onSettingsChange={setSettingsOpen}
      />

      {modalOpen ? (
        <StudioDialog
          title='کد تم و پیکربندی خروجی استودیو فیل وب'
          icon={<Code2 className='size-[1.375rem] text-coral' />}
          onClose={() => setModalOpen(false)}
        >
          <p className='text-xs text-indigo-light'>
            این قطعه کد را در فایل{" "}
            <code className='font-mono'>globals.css</code> پروژه خود (Tailwind
            CSS v4) کپی و جای‌گذاری نمایید.
          </p>
          <pre
            dir='ltr'
            className='max-h-[34vh] overflow-auto rounded-sm border border-indigo-ink bg-indigo-ink p-4 text-left font-mono text-[0.75rem] leading-relaxed text-paper select-all'
          >
            <code>{snippet}</code>
          </pre>
          <div className='flex items-center justify-end gap-2 border-t border-indigo-ink/20 pt-2'>
            <button
              type='button'
              onClick={() => void copy(snippet, "css")}
              className='flex items-center gap-1.5 rounded-sm border border-indigo-ink bg-coral px-4 py-2 text-xs font-bold text-white shadow-craft-sm transition-all hover:bg-coral-dark active:translate-x-0.5 active:translate-y-0.5'
            >
              <Copy className='size-4' />
              <span>{copied === "css" ? "کپی شد!" : "کپی کد CSS"}</span>
            </button>
          </div>

          <div className='flex flex-col gap-2 rounded-sm border border-dashed border-indigo-ink bg-paper-dim p-3'>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <span className='flex items-center gap-1.5 text-[0.75rem] font-black text-indigo-ink'>
                <FileDown className='size-4 text-coral' />
                پیکربندی کامل (JSON)
              </span>
              <span className='rounded-sm border border-indigo-ink bg-paper px-1.5 py-0.5 text-[0.625rem] font-bold text-indigo-light'>
                قابل بارگذاری دوباره در استودیو
              </span>
            </div>
            <p className='text-[0.6875rem] leading-relaxed text-indigo-light'>
              این فایل همهٔ گزینه‌ها، رنگ‌های پالت، توکن‌های نهایی و کد CSS را
              نگه می‌دارد؛ با «بارگذاری پیکربندی کپی‌شده» در نوار کنار بوم،
              دقیقاً همین تم برمی‌گردد.
            </p>
            <pre
              dir='ltr'
              className='max-h-28 overflow-auto rounded-sm border border-indigo-ink bg-paper p-2 text-left font-mono text-[0.625rem] leading-relaxed text-indigo-ink select-all'
            >
              <code>{handoffJson}</code>
            </pre>
            <div className='flex flex-wrap items-center justify-end gap-2'>
              <button
                type='button'
                onClick={() => void copy(handoffJson, "config")}
                className='flex items-center gap-1.5 rounded-sm border border-indigo-ink bg-indigo-ink px-3 py-1.5 text-[0.6875rem] font-bold text-paper shadow-craft-sm transition-all hover:bg-indigo-ink/90 active:translate-x-0.5 active:translate-y-0.5'
              >
                <Copy className='size-3.5' />
                <span>{copied === "config" ? "کپی شد!" : "کپی پیکربندی"}</span>
              </button>
              <button
                type='button'
                onClick={downloadConfig}
                className='flex items-center gap-1.5 rounded-sm border border-indigo-ink bg-paper px-3 py-1.5 text-[0.6875rem] font-bold text-indigo-ink shadow-craft-sm transition-all hover:bg-paper-light active:translate-x-0.5 active:translate-y-0.5'
              >
                <FileDown className='size-3.5' />
                <span>دانلود فایل .json</span>
              </button>
            </div>
          </div>
        </StudioDialog>
      ) : null}

      {importOpen ? (
        <StudioDialog
          title='بارگذاری پیکربندی کپی‌شده'
          icon={<Upload className='size-[1.375rem] text-coral' />}
          onClose={closeImportDialog}
        >
          <form className='flex flex-col gap-3' onSubmit={applyImportedConfig}>
            <p className='text-xs leading-relaxed text-indigo-light'>
              پیکربندی‌ای را که با «کپی پیکربندی (JSON)» گرفته‌اید یا فایل{" "}
              <code className='font-mono'>.json</code> آن را اینجا بگذارید. سبک،
              پالت، گردی گوشه، سایه، فونت، آیکون‌ها و سناریوی بوم بازیابی
              می‌شوند.
            </p>

            <div className='flex flex-wrap items-center gap-2'>
              <label className='flex cursor-pointer items-center gap-1.5 rounded-sm border border-indigo-ink bg-paper-dim px-2.5 py-1.5 text-[0.6875rem] font-bold text-indigo-ink shadow-craft-sm transition-all hover:bg-paper-light'>
                <FileUp className='size-4 text-coral' />
                <span>انتخاب فایل .json</span>
                <input
                  type='file'
                  accept='.json,application/json'
                  className='hidden'
                  onChange={(event) => {
                    void readConfigFile(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </label>
              <button
                type='button'
                onClick={() => void pasteConfigFromClipboard()}
                className='flex items-center gap-1.5 rounded-sm border border-indigo-ink bg-paper px-2.5 py-1.5 text-[0.6875rem] font-bold text-indigo-ink shadow-craft-sm transition-all hover:bg-paper-dim active:translate-x-0.5 active:translate-y-0.5'
              >
                <ClipboardPaste className='size-4 text-coral' />
                <span>چسباندن از کلیپ‌بورد</span>
              </button>
            </div>

            <textarea
              dir='ltr'
              value={importText}
              onChange={(event) => {
                setImportText(event.target.value);
                setImportError(null);
              }}
              rows={6}
              spellCheck={false}
              autoFocus
              aria-label='متن پیکربندی JSON'
              placeholder={
                '{\n  "version": 1,\n  "config": { "styleId": "corporate", … }\n}'
              }
              className='w-full resize-none rounded-sm border border-indigo-ink bg-paper p-2 text-left font-mono text-[0.6875rem] leading-relaxed text-indigo-ink outline-none focus-visible:ring-2 focus-visible:ring-coral/40'
            />

            {importError ? (
              <p role='alert' className='text-[0.6875rem] font-bold text-coral'>
                {importError}
              </p>
            ) : null}

            {importPreview?.status === "error" ? (
              <p role='alert' className='text-[0.6875rem] font-bold text-coral'>
                {importPreview.message}
              </p>
            ) : null}

            {importPreview?.status === "ok" ? (
              <div className='flex flex-col gap-1.5 rounded-sm border border-teal-craft bg-teal-light p-2'>
                <span className='text-[0.6875rem] font-black text-teal-craft'>
                  پیکربندی معتبر است و آمادهٔ اعمال:
                </span>
                <div className='flex flex-wrap gap-1'>
                  {describeStudioConfig(importPreview.config, customFonts).map(
                    (item) => (
                      <span
                        key={item.label}
                        className='rounded-sm border border-indigo-ink/30 bg-paper px-1.5 py-0.5 text-[0.625rem] font-bold text-indigo-ink'
                      >
                        <span className='text-indigo-light'>{item.label}:</span>{" "}
                        {item.value}
                      </span>
                    ),
                  )}
                </div>
                {importFontMissing ? (
                  <span className='text-[0.625rem] leading-relaxed font-bold text-coral'>
                    فونت سفارشی این پیکربندی روی این دستگاه نیست؛ فونت پیش‌فرض
                    سبک انتخاب‌شده جایگزین می‌شود.
                  </span>
                ) : null}
              </div>
            ) : null}

            <div className='flex flex-wrap items-center justify-end gap-2 border-t border-indigo-ink/20 pt-2'>
              <button
                type='button'
                onClick={closeImportDialog}
                className='rounded-sm border border-indigo-ink bg-paper-dim px-3 py-1.5 text-[0.6875rem] font-bold text-indigo-ink shadow-craft-sm hover:bg-paper-light'
              >
                انصراف
              </button>
              <button
                type='submit'
                disabled={importPreview?.status !== "ok"}
                className='flex items-center gap-1.5 rounded-sm border border-indigo-ink bg-indigo-ink px-4 py-2 text-xs font-bold text-paper shadow-craft-sm transition-all hover:bg-indigo-ink/90 active:translate-x-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <Upload className='size-4' />
                <span>بارگذاری و اعمال</span>
              </button>
            </div>
          </form>
        </StudioDialog>
      ) : null}
    </>
  );
}

type StudioDialogProps = {
  title: string;
  icon: ReactNode;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Shared chrome for the studio dialogs (CSS/JSON export and config import).
 *
 * Escape and a backdrop click both close it, the panel scrolls internally so a
 * long JSON payload never pushes the action buttons off-screen, and the title
 * names the dialog for assistive tech.
 */
function StudioDialog({ title, icon, onClose, children }: StudioDialogProps) {
  const titleId = useId();

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-indigo-ink/60 p-4 backdrop-blur-sm'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        className='flex max-h-[90vh] w-full max-w-3xl flex-col gap-4 overflow-y-auto rounded-sm border border-indigo-ink bg-paper-light p-6 shadow-craft-lg'
      >
        <div className='flex items-center justify-between border-b border-indigo-ink/20 pb-3'>
          <div className='flex items-center gap-2'>
            {icon}
            <h3 id={titleId} className='text-base font-black text-indigo-ink'>
              {title}
            </h3>
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label='بستن'
            className='rounded-sm border border-indigo-ink bg-paper-dim p-1 text-indigo-ink shadow-craft-sm hover:bg-paper-light'
          >
            <X className='size-[1.125rem]' />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
