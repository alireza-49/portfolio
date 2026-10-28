"use client";

import { useEffect, useState } from "react";
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import {
  ARCHETYPE_ICONS,
  ARCHETYPES,
  STYLES,
  resolveIconStyle,
  shadowOverrides,
  type ArchetypeId,
  type IconLibraryId,
  type IconStyle,
  type ShadowChoice,
  type StyleId,
} from "@/components/create-studio-config";
import {
  paletteThemeOverrides,
  type StudioPalette,
} from "@/components/create-studio-palette";
import { AnalyticsDashboardView } from "@/components/create-scenarios/analytics-dashboard";
import { ClinicReservationView } from "@/components/create-scenarios/clinic-reservation";
import { ClothingShopView } from "@/components/create-scenarios/clothing-shop";
import { ElementsGalleryView } from "@/components/create-scenarios/elements-gallery";
import { TutoringLandingView } from "@/components/create-scenarios/tutoring-landing";
import {
  CreateComponentsThemeProvider,
  IconSetProvider,
  type CreateComponentTheme,
} from "@/components/create-components";

type CanvasProps = {
  archetype: ArchetypeId;
  /** Studio palette: roles plus optional neutral/chart overrides. */
  palette: StudioPalette;
  radius: number;
  /** Elevation pinned from the sidebar; `style` follows the preset. */
  shadow: ShadowChoice;
  styleId: StyleId;
  /** Fully resolved CSS stack, built-ins and uploaded fonts alike. */
  fontFamily: string;
  iconLibrary: IconLibraryId;
  /** Size / weight / tone tokens shared by every glyph on the canvas. */
  iconStyle: IconStyle;
};

export function CreateStudioCanvas({
  archetype,
  palette,
  radius,
  shadow,
  styleId,
  fontFamily,
  iconLibrary,
  iconStyle,
}: CanvasProps) {
  const effectiveRadius = radius;
  const icons = resolveIconStyle(iconStyle);

  const ChromeIcon = ARCHETYPE_ICONS[archetype];
  const [expanded, setExpanded] = useState(false);
  const activeScenario =
    ARCHETYPES.find((item) => item.id === archetype) ?? ARCHETYPES[0];

  // Full-screen preview: Escape leaves the stage without hunting for the button.
  useEffect(() => {
    if (!expanded) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expanded]);


  // The sidebar owns the colour layer (roles always, neutrals/charts when the
  // visitor edited them), radius, body font and, when pinned, the elevation;
  // the rest of the visual identity — geometry, typography voice, texture —
  // still comes from the preset through the provider.
  const theme: Partial<CreateComponentTheme> = {
    ...paletteThemeOverrides(palette, styleId),
    radius: effectiveRadius,
    fontFamily,
    iconScale: icons.scale,
    iconStroke: icons.stroke,
    iconColor: icons.color,
    ...shadowOverrides(shadow),
  };

  return (
    <section
      id='studio-canvas'
      role='tabpanel'
      aria-labelledby={`scenario-tab-${archetype}`}
      className={`studio-desk order-1 flex min-h-0 w-full flex-1 flex-col gap-3 overflow-x-clip p-3 sm:p-5 lg:order-2 lg:gap-4 lg:overflow-hidden lg:p-8 xl:p-10 ${
        expanded ? "fixed inset-0 z-[60] overflow-hidden" : ""
      }`}
    >
      {/* The frame belongs to the studio: page tokens only. The preset's
          --cc-* scope starts at the content viewport below, so switching the
          style restyles the site inside the window and never the window. */}

      <div
        data-preview-window=''
        className='relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-sm border-[2.5px] border-indigo-ink bg-paper-dim'
      >
        {/* Scope alert: the preset restyles a theme, never the layout. It is a
            deliberate dark band (ink + paper) so it cannot be skimmed past, and
            it sits above the browser bar and outside the viewport scroller, so
            the browser chrome still always stays up. */}
        <div
          role='note'
          aria-label='دامنهٔ استودیو'
          className='flex shrink-0 items-start gap-2 border-b-[2.5px] border-coral bg-indigo-ink px-2.5 py-2 text-[0.71875rem] leading-snug font-black text-paper-light sm:items-center sm:gap-2.5 sm:px-3 sm:py-2.5 sm:text-[0.8125rem]'
        >
          <span className='inline-flex shrink-0 items-center gap-1 rounded-sm border-[1.5px] border-indigo-ink bg-mustard px-1.5 py-0.5 text-[0.625rem] font-black text-indigo-ink sm:text-[0.6875rem]'>
            <TriangleAlert aria-hidden='true' className='size-3.5' />
            مهم
          </span>
          <span className='min-w-0'>
            این تم فقط رنگ، پالت، فونت و سبک بصری را می‌سازد؛{" "}
            <span className='underline decoration-mustard decoration-2 underline-offset-4'>
              چیدمان، بخش‌ها و عملکرد سایت بخشی از تم نیست
            </span>
            {" "}و کاملاً سفارشی و از صفر طراحی می‌شود.
          </span>
        </div>

        {/* One-line browser bar. Painted with the studio's mustard ink so it can
            never be confused with the preset's own page background inside. */}
        <div
          data-preview-chrome=''
          data-tour='canvas-chrome'
          className='relative z-10 flex w-full shrink-0 flex-nowrap items-center gap-1.5 border-b-[2.5px] border-indigo-ink bg-mustard px-2 py-1.5 select-none sm:gap-2 sm:px-3'
        >
          <button
            type='button'
            onClick={() => setExpanded((value) => !value)}
            aria-pressed={expanded}
            aria-label={expanded ? "بستن بزرگ‌نمایی بوم" : "بزرگ‌نمایی بوم"}
            title={expanded ? "بستن بزرگ‌نمایی بوم" : "بزرگ‌نمایی بوم"}
            className='flex shrink-0 items-center gap-1 rounded-sm border-[1.5px] border-indigo-ink bg-indigo-ink px-2 py-1 text-[0.625rem] font-bold whitespace-nowrap text-paper shadow-craft-sm transition-colors hover:bg-coral active:translate-x-px active:translate-y-px'
          >
            {expanded ? (
              <Minimize2 className='size-3.5' />
            ) : (
              <Maximize2 className='size-3.5' />
            )}
            <span className='hidden sm:inline'>
              {expanded ? "بستن" : "بزرگ‌نمایی"}
            </span>
          </button>

          <span className='h-4 w-px shrink-0 bg-indigo-ink/25' />

          <div className='flex shrink-0 items-center gap-1.5'>
            <span className='size-3 rounded-full border-[1.5px] border-indigo-ink bg-coral' />
            <span className='size-3 rounded-full border-[1.5px] border-indigo-ink bg-paper' />
            <span className='size-3 rounded-full border-[1.5px] border-indigo-ink bg-teal-craft' />
          </div>

          <div className='hidden min-w-0 shrink items-center gap-1.5 md:flex'>
            <ChromeIcon
              aria-hidden='true'
              className='size-4 shrink-0 text-coral'
            />
            <span className='truncate font-display text-[0.8125rem] font-black text-indigo-ink'>
              {activeScenario.label}
            </span>
          </div>

          <div
            dir='ltr'
            title='این پنجره یک سایت مستقل است'
            className='flex min-w-0 flex-1 items-center gap-1.5 rounded-sm border-[1.5px] border-indigo-ink bg-paper-light px-2 py-1 shadow-craft-sm sm:mx-auto sm:max-w-[20rem]'
          >
            <ShieldCheck
              aria-hidden='true'
              className='size-3.5 shrink-0 text-teal-craft'
            />
            <span className='truncate font-mono text-[0.625rem] font-bold text-indigo-ink/80 sm:text-[0.6875rem]'>
              https://{activeScenario.demoHost}
            </span>
          </div>

          <div className='flex shrink-0 items-center gap-1.5 sm:gap-2'>
            <span className='hidden items-center gap-1 rounded-full border-[1.5px] border-indigo-ink bg-teal-light px-2 py-0.5 text-[0.625rem] font-bold whitespace-nowrap text-indigo-ink xl:inline-flex'>
              <span className='size-1.5 animate-pulse rounded-full bg-teal-craft' />
              پیش‌نمایش زنده
            </span>
            <span
              title='سبک فعال استودیو'
              className='hidden items-center gap-1 rounded-sm border-[1.5px] border-indigo-ink bg-paper-light px-2 py-0.5 text-[0.625rem] font-bold whitespace-nowrap text-indigo-ink shadow-craft-sm lg:inline-flex'
            >
              سبک:{" "}
              {STYLES.find((style) => style.id === styleId)?.label ?? styleId}
            </span>
          </div>
        </div>

        {/* The site viewport: the only scroller in the artboard. The tab strip,
            toolbar and status bar live outside it, so the header always stays. */}
        <div
          data-preview-viewport=''
          dir='ltr'
          className='studio-scroll relative flex min-h-0 w-full flex-1 flex-col overflow-x-clip overflow-y-auto'
        >
          <CreateComponentsThemeProvider
            preset={styleId}
            theme={theme}
            className='flex w-full flex-1 flex-col overflow-x-clip'
          >
            <IconSetProvider library={iconLibrary}>
              <div
                dir='rtl'
                data-cc-shadow={shadow === "style" ? undefined : shadow}
                className='flex flex-col gap-6 p-5 sm:p-7'
              >
                {archetype === "components" ? <ElementsGalleryView /> : null}
                {archetype === "landing" ? <TutoringLandingView /> : null}
                {archetype === "ecommerce" ? <ClothingShopView /> : null}
                {archetype === "clinic" ? <ClinicReservationView /> : null}
                {archetype === "dashboard" ? <AnalyticsDashboardView /> : null}
              </div>
            </IconSetProvider>
          </CreateComponentsThemeProvider>
        </div>

        {/* Browser status bar: repeats the "separate site" contract. */}
        <div
          data-tour='canvas-status'
          className='flex shrink-0 items-center justify-between gap-2 border-t-[2.5px] border-indigo-ink bg-paper px-2.5 py-1 text-[0.5625rem] font-bold text-indigo-ink/65 sm:text-[0.625rem]'
        >
          <span className='flex min-w-0 items-center gap-1.5'>
            <ExternalLink
              aria-hidden='true'
              className='size-3 shrink-0 text-coral'
            />
            <span className='truncate'>
              این محتوا یک سایت مستقل است، نه بخشی از این صفحه
            </span>
          </span>
          <span
            dir='ltr'
            className='hidden shrink-0 font-mono text-[0.5625rem] text-indigo-ink/45 sm:inline'
          >
            {activeScenario.demoHost}
          </span>
        </div>
      </div>
    </section>
  );
}
