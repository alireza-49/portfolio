"use client";

import { useState } from "react";
import {
  Check,
  Dices,
  Download,
  Palette,
  Pipette,
  Shapes,
  SlidersHorizontal,
  Sparkles,
  Type,
} from "lucide-react";
import {
  FONTS,
  ICON_LIBRARIES,
  PRESET_PILLS,
  RADII,
  STYLES,
  SWATCHES,
  mixWithWhite,
  type FontId,
  type IconLibraryId,
  type StyleId,
} from "@/components/create-studio-config";
import { createThemePresets } from "@/components/create-components/style-presets";

type SidebarProps = {
  styleId: StyleId;
  onStyleChange: (id: StyleId) => void;
  primary: string;
  primarySubtle: string;
  colorName: string;
  onColorChange: (hex: string, subtle: string, name: string) => void;
  radius: number;
  onRadiusChange: (value: number) => void;
  font: FontId;
  onFontChange: (id: FontId) => void;
  iconLibrary: IconLibraryId;
  onIconLibraryChange: (id: IconLibraryId) => void;
  onShuffle: () => void;
  onExport: () => void;
};

export function CreateStudioSidebar({
  styleId,
  onStyleChange,
  primary,
  primarySubtle,
  colorName,
  onColorChange,
  radius,
  onRadiusChange,
  font,
  onFontChange,
  iconLibrary,
  onIconLibraryChange,
  onShuffle,
  onExport,
}: SidebarProps) {
  const [hexDraft, setHexDraft] = useState({
    source: primary,
    value: primary.toUpperCase(),
  });
  const [radiusDraft, setRadiusDraft] = useState({
    source: radius,
    value: String(radius),
  });
  const [colorMode, setColorMode] = useState<"presets" | "custom">("presets");

  // Derive the editable values during render: when the studio pushes a new
  // colour/radius (swatch, shuffle, custom input) the draft is stale, so the
  // incoming prop wins. No effect, no cascading renders.
  const hexInput =
    hexDraft.source === primary ? hexDraft.value : primary.toUpperCase();
  const customRadius =
    radiusDraft.source === radius ? radiusDraft.value : String(radius);

  const setHexInput = (value: string) => setHexDraft({ source: primary, value });
  const setCustomRadius = (value: string) =>
    setRadiusDraft({ source: radius, value });

  const currentStyleLabel =
    STYLES.find((item) => item.id === styleId)?.label ?? "";
  const radiusOption = RADII.find((item) => item.value === radius);
  const radiusLabel = radiusOption
    ? `${radiusOption.label} (${radiusOption.caption})`
    : `${radius}px (سفارشی)`;

  const applyHex = () => {
    const raw = hexInput.trim();
    if (!/^#?[0-9a-fA-F]{6}$/.test(raw)) return;
    const hex = (raw.startsWith("#") ? raw : `#${raw}`).toLowerCase();
    onColorChange(hex, mixWithWhite(hex, 0.9), "رنگ سفارشی");
    setColorMode("custom");
  };

  const applyRadius = () => {
    const value = Number(customRadius);
    if (Number.isFinite(value) && value >= 0 && value <= 48) {
      onRadiusChange(value);
    }
  };

  return (
    <aside className='order-1 z-20 flex w-full shrink-0 flex-col gap-4 border-b-[2.5px] border-indigo-ink bg-paper-light p-4 lg:h-full lg:min-h-0 lg:w-80 lg:overflow-y-auto lg:border-b-0 lg:border-l-[2.5px]'>
      <div className='flex flex-col gap-3 border-b border-indigo-ink/20 pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='flex size-8 items-center justify-center rounded-sm border border-indigo-ink bg-paper-dim text-coral shadow-craft-sm'>
              <Palette className='size-4' />
            </span>
            <div>
              <h2 className='text-xs font-black text-indigo-ink'>
                تنظیمات استودیو
              </h2>
              <span className='text-[10px] font-normal text-indigo-light'>
                پوسته کارگاه Shadcn
              </span>
            </div>
          </div>
          <span className='rounded-sm border border-indigo-ink bg-paper-dim px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-ink shadow-craft-sm'>
            v2.8 LIVE
          </span>
        </div>

        <button
          type='button'
          onClick={onShuffle}
          title='تولید تصادفی ترکیب استایل و رنگ'
          className='craft-btn flex w-full items-center justify-center gap-2 rounded-sm bg-coral px-3 py-2.5 text-xs font-black text-white'
        >
          <Dices className='size-[18px]' />
          <span>بر زدن و ترکیب تصادفی تم</span>
        </button>
      </div>

      <div className='flex flex-col gap-1.5'>
        <div className='flex items-center justify-between text-xs font-bold'>
          <span className='flex items-center gap-1 text-indigo-ink'>
            <span>سبک‌های بصری</span>
            <span className='text-[10px] font-normal text-indigo-light'>
              (Style)
            </span>
          </span>
          <span className='font-mono text-[11px] font-bold text-coral'>
            {currentStyleLabel}
          </span>
        </div>
        <div className='grid grid-cols-2 gap-1.5'>
          {STYLES.map((option) => {
            const active = styleId === option.id;
            const preset = createThemePresets[option.id];
            const tokens = preset.tokens;
            return (
              <button
                key={option.id}
                type='button'
                onClick={() => onStyleChange(option.id)}
                aria-pressed={active}
                className={`flex flex-col gap-1.5 rounded-sm border border-indigo-ink p-2 text-right text-[11px] transition-all ${
                  active
                    ? "bg-coral font-bold text-white shadow-craft-sm"
                    : "bg-paper-dim font-medium text-indigo-ink hover:bg-paper-light"
                }`}
              >
                <span className='flex items-center justify-between gap-1'>
                  <span
                    aria-hidden='true'
                    className='flex size-5 shrink-0 items-center justify-center font-mono text-[8px] font-black'
                    style={{
                      borderRadius: tokens.radius ?? 0,
                      borderStyle: tokens.borderStyle ?? "solid",
                      borderWidth: tokens.borderWidth ?? 1,
                      borderColor: tokens.border ?? "#264653",
                      backgroundColor: tokens.background ?? "#ffffff",
                      color: tokens.surfaceForeground ?? "#264653",
                      boxShadow:
                        tokens.shadow && tokens.shadow !== "none"
                          ? tokens.shadow
                          : undefined,
                    }}
                  >
                    Aa
                  </span>
                  {active ? (
                    <span className='size-1.5 rounded-full bg-white' />
                  ) : null}
                </span>
                <span className='flex flex-col'>
                  <span>{option.label}</span>
                  <span className='font-mono text-[9px] opacity-70'>
                    {preset.tone === "dark" ? "DARK" : "LIGHT"} ·{" "}
                    {tokens.radius ?? 0}px
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p className='text-[10px] leading-relaxed text-indigo-light'>
          هر سبک پالت، تایپوگرافی، بافت و فرم کنترل‌ها را عوض می‌کند و شعاع گوشه
          را با خودش همگام می‌سازد.
        </p>
      </div>

      <div className='flex flex-col gap-2 border-t border-indigo-ink/20 pt-1'>
        <div className='flex items-center justify-between text-xs font-bold'>
          <span className='flex items-center gap-1 text-indigo-ink'>
            <Palette className='size-[15px] text-coral' />
            <span>پالت و نقش رنگ‌ها</span>
          </span>
          <span className='rounded-sm border border-indigo-ink bg-paper-dim px-1.5 py-0.5 font-mono text-[10px] text-indigo-ink'>
            {colorName}
          </span>
        </div>

        <div className='grid grid-cols-2 rounded-sm border border-indigo-ink bg-paper-dim p-0.5 text-[11px] font-bold shadow-craft-sm'>
          <button
            type='button'
            onClick={() => setColorMode("presets")}
            aria-pressed={colorMode === "presets"}
            className={`flex items-center justify-center gap-1 rounded-sm py-1 transition-all ${
              colorMode === "presets"
                ? "bg-coral text-white shadow-craft-sm"
                : "text-indigo-light hover:bg-paper-light hover:text-indigo-ink"
            }`}
          >
            <Sparkles className='size-[13px]' />
            <span>پالت‌های آماده</span>
          </button>
          <button
            type='button'
            onClick={() => setColorMode("custom")}
            aria-pressed={colorMode === "custom"}
            className={`flex items-center justify-center gap-1 rounded-sm py-1 transition-all ${
              colorMode === "custom"
                ? "bg-coral text-white shadow-craft-sm"
                : "text-indigo-light hover:bg-paper-light hover:text-indigo-ink"
            }`}
          >
            <Pipette className='size-[13px]' />
            <span>پالت سفارشی</span>
          </button>
        </div>

        <div
          className={`flex flex-col gap-1.5 rounded-sm transition-all ${
            colorMode === "presets" ? "ring-2 ring-coral" : ""
          }`}
        >
          <div className='flex flex-wrap gap-1 border-b border-indigo-ink/15 py-1'>
            {PRESET_PILLS.map((pill) => {
              const active = primary.toLowerCase() === pill.hex.toLowerCase();
              return (
                <button
                  key={pill.hex}
                  type='button'
                  onClick={() => {
                    onColorChange(pill.hex, pill.subtle, pill.name);
                    setColorMode("presets");
                  }}
                  className={`flex items-center gap-1 rounded-full border border-indigo-ink px-2 py-0.5 text-[10px] transition-all ${
                    active
                      ? "bg-coral font-bold text-white shadow-craft-sm"
                      : "bg-paper-light font-medium text-indigo-ink hover:bg-paper-dim"
                  }`}
                >
                  <span
                    className='size-1.5 rounded-full border border-indigo-ink/40'
                    style={{ backgroundColor: pill.hex }}
                  />
                  <span>{pill.name}</span>
                </button>
              );
            })}
          </div>

          <div className='flex flex-col gap-1.5'>
            {SWATCHES.map((swatch) => {
              const active = primary.toLowerCase() === swatch.hex.toLowerCase();
              return (
                <button
                  key={swatch.hex}
                  type='button'
                  onClick={() => {
                    onColorChange(swatch.hex, swatch.subtle, swatch.name);
                    setColorMode("presets");
                  }}
                  aria-pressed={active}
                  className={`flex w-full items-center justify-between rounded-sm border border-indigo-ink p-1.5 text-right transition-all ${
                    active
                      ? "bg-paper-light shadow-craft-sm ring-2 ring-coral"
                      : "bg-paper-dim hover:bg-paper-light"
                  }`}
                >
                  <div className='flex items-center gap-2'>
                    <span
                      className='flex size-5 shrink-0 items-center justify-center rounded-sm border border-indigo-ink shadow-craft-sm'
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {active ? <Check className='size-3 text-white' /> : null}
                    </span>
                    <div className='flex flex-col text-right'>
                      <span className='text-[11px] font-bold text-indigo-ink'>
                        {swatch.name}
                      </span>
                      <span className='text-[9px] text-indigo-light'>
                        {swatch.role}
                      </span>
                    </div>
                  </div>
                  <span
                    className='rounded-sm border border-indigo-ink bg-paper-dim px-1 py-0.5 font-mono text-[9px] font-bold'
                    style={{ color: swatch.hex }}
                  >
                    {swatch.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`flex flex-col gap-2 rounded-sm border border-indigo-ink bg-paper-dim p-2.5 shadow-craft-sm transition-all ${
            colorMode === "custom" ? "ring-2 ring-coral" : ""
          }`}
        >
          <div className='flex items-center justify-between'>
            <span className='flex items-center gap-1 text-[10px] font-bold text-indigo-ink'>
              <SlidersHorizontal className='size-3 text-coral' />
              <span>تنظیم رنگ دلخواه (HEX Picker)</span>
            </span>
            <span className='font-mono text-[9px] font-bold text-indigo-light'>
              RGB / HEX
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='relative size-8 shrink-0 overflow-hidden rounded-sm border border-indigo-ink shadow-craft-sm'>
              <input
                type='color'
                value={primary}
                onChange={(event) => {
                  const hex = event.target.value;
                  onColorChange(hex, mixWithWhite(hex, 0.9), "رنگ سفارشی");
                  setColorMode("custom");
                }}
                aria-label='انتخاب رنگ'
                className='absolute -inset-2 size-12 cursor-pointer border-0 p-0'
              />
            </div>
            <input
              type='text'
              value={hexInput}
              onChange={(event) => setHexInput(event.target.value)}
              dir='ltr'
              placeholder='#HEX'
              className='w-full rounded-sm border border-indigo-ink bg-paper-light p-1.5 text-left font-mono text-xs font-bold text-indigo-ink uppercase outline-none focus:ring-1 focus:ring-coral'
            />
            <button
              type='button'
              onClick={applyHex}
              className='shrink-0 rounded-sm border border-indigo-ink bg-paper-light px-2 py-1.5 text-[10px] font-bold text-indigo-ink shadow-craft-sm transition-all hover:bg-paper-dim'
            >
              اعمال
            </button>
          </div>
          <div
            className='flex items-center gap-2 rounded-sm border border-indigo-ink/40 p-1.5'
            style={{ backgroundColor: primarySubtle }}
          >
            <span
              className='size-3 rounded-full border border-indigo-ink'
              style={{ backgroundColor: primary }}
            />
            <span
              className='font-mono text-[10px] font-bold'
              style={{ color: primary }}
            >
              {primary.toUpperCase()}
            </span>
            <span className='text-[10px] text-indigo-light'>
              پیش‌نمایش رنگ فعال
            </span>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-1.5 border-t border-indigo-ink/20 pt-1'>
        <div className='flex items-center justify-between text-xs font-bold'>
          <span className='flex items-center gap-1 text-indigo-ink'>
            <Shapes className='size-3.5 text-coral' />
            <span>کتابخانه آیکون‌ها</span>
          </span>
          <span className='font-mono text-[10px] text-indigo-light'>Icons</span>
        </div>
        <div className='grid grid-cols-3 gap-1'>
          {ICON_LIBRARIES.map((library) => {
            const active = iconLibrary === library.id;
            return (
              <button
                key={library.id}
                type='button'
                onClick={() => onIconLibraryChange(library.id)}
                aria-pressed={active}
                className={`flex flex-col items-center gap-0.5 rounded-sm border border-indigo-ink p-1.5 text-center transition-all ${
                  active
                    ? "bg-coral text-white shadow-craft-sm"
                    : "bg-paper-dim text-indigo-ink hover:bg-paper-light"
                }`}
              >
                <Shapes className='size-4' />
                <span className='text-[10px] font-bold'>{library.label}</span>
                <span
                  className={`font-mono text-[8px] ${
                    active ? "opacity-80" : "text-indigo-light"
                  }`}
                >
                  {library.note}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className='flex flex-col gap-1.5 border-t border-indigo-ink/20 pt-1'>
        <div className='flex items-center justify-between text-xs font-bold'>
          <span className='flex items-center gap-1 text-indigo-ink'>
            <span>گردی گوشه‌ها</span>
            <span className='text-[10px] font-normal text-indigo-light'>
              (Radius)
            </span>
          </span>
          <span className='font-mono text-[10px] font-bold text-coral'>
            {radiusLabel}
          </span>
        </div>
        <div className='grid grid-cols-5 gap-1'>
          {RADII.map((option) => {
            const active = radius === option.value;
            return (
              <button
                key={option.value}
                type='button'
                onClick={() => onRadiusChange(option.value)}
                aria-pressed={active}
                title={`${option.caption} (${option.label})`}
                className={`flex flex-col items-center rounded-sm border border-indigo-ink px-1 py-1 text-center transition-all ${
                  active
                    ? "bg-coral font-bold text-white shadow-craft-sm"
                    : "bg-paper-dim text-indigo-ink hover:bg-paper-light"
                }`}
              >
                <span className='font-mono text-xs'>{option.label}</span>
                <span
                  className={`text-[8px] ${
                    active ? "text-white/90" : "text-indigo-light"
                  }`}
                >
                  {option.caption}
                </span>
              </button>
            );
          })}
        </div>
        <div className='flex items-center gap-1.5 pt-1'>
          <div className='relative flex flex-1 items-center rounded-sm border border-indigo-ink bg-paper-dim p-1 shadow-craft-sm'>
            <input
              type='number'
              min={0}
              max={48}
              value={customRadius}
              onChange={(event) => setCustomRadius(event.target.value)}
              dir='ltr'
              placeholder='عدد دلخواه'
              className='w-full border-0 bg-transparent p-0 text-left font-mono text-xs font-bold text-indigo-ink outline-none'
            />
            <span className='shrink-0 px-1 font-mono text-[10px] text-indigo-light'>
              px
            </span>
          </div>
          <button
            type='button'
            onClick={applyRadius}
            className='shrink-0 rounded-sm border border-indigo-ink bg-paper-dim px-2.5 py-1 text-[11px] font-bold text-indigo-ink shadow-craft-sm transition-all hover:bg-paper-light active:translate-x-0.5 active:translate-y-0.5'
          >
            اعمال
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-1.5 border-t border-indigo-ink/20 pt-1'>
        <div className='flex items-center justify-between text-xs font-bold'>
          <span className='flex items-center gap-1 text-indigo-ink'>
            <Type className='size-3.5 text-coral' />
            <span>تایپوگرافی</span>
          </span>
          <span className='text-[10px] text-indigo-light'>Pairing</span>
        </div>
        <div className='flex flex-col gap-1 text-xs'>
          {FONTS.map((option) => {
            const active = font === option.id;
            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center justify-between rounded-sm border border-indigo-ink p-1.5 transition-colors ${
                  active
                    ? "bg-paper-light shadow-craft-sm"
                    : "bg-paper-dim hover:bg-paper-light"
                }`}
              >
                <div className='flex items-center gap-1.5'>
                  <input
                    type='radio'
                    name='font_family_choice'
                    value={option.id}
                    checked={active}
                    onChange={() => onFontChange(option.id)}
                    className='size-3 accent-coral'
                  />
                  <span className='text-[11px] text-indigo-ink'>
                    {option.label}
                  </span>
                </div>
                <span
                  className={`text-[9px] ${
                    active
                      ? "font-mono font-bold text-coral"
                      : "text-indigo-light"
                  }`}
                >
                  {option.note}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className='mt-auto flex flex-col gap-2 border-t border-indigo-ink/20 pt-2'>
        <button
          type='button'
          onClick={onExport}
          className='craft-btn flex w-full items-center justify-center gap-1.5 rounded-sm bg-coral px-2.5 py-2 text-xs font-bold text-white'
        >
          <Download className='size-[15px]' />
          <span>استخراج پیکربندی تم</span>
        </button>
      </div>
    </aside>
  );
}
