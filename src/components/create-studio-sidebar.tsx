"use client";

import { useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Popover } from "@base-ui/react/popover";
import {
  Check,
  Dices,
  Download,
  Palette,
  Pipette,
  Plus,
  RotateCcw,
  Shapes,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  TriangleAlert,
  Type,
  Upload,
} from "lucide-react";
import { toPersianDigits } from "@/components/create-components/jalali";
import {
  DEFAULT_ICON_STYLE,
  FONTS,
  FONT_STACKS,
  ICON_LIBRARIES,
  ICON_SIZES,
  ICON_TONES,
  ICON_WEIGHTS,
  RADII,
  STYLE_GROUPS,
  STYLES,
  resolveIconStyle,
  type IconLibraryId,
  type IconSizeId,
  type IconStyle,
  type IconToneId,
  type IconWeightId,
  type StyleId,
} from "@/components/create-studio-config";
import { Icon, ICON_PREVIEW_NAMES } from "@/components/create-components";
import {
  COLOR_TOKENS,
  PALETTE_GROUPS,
  PALETTE_PRESETS,
  ROLE_IDS,
  activePalettePresetId,
  basePalettePreset,
  isTokenOverridden,
  normalizeHex,
  paletteContrastIssues,
  paletteLabel,
  resolvePaletteToken,
  type ColorToken,
  type PaletteGroupId,
  type PalettePreset,
  type PaletteTokenId,
  type StudioPalette,
} from "@/components/create-studio-palette";
import {
  CUSTOM_FONT_ACCEPT,
  CUSTOM_FONT_MAX_BYTES,
  resolveFontStack,
  type CustomFont,
} from "@/components/create-studio-custom-fonts";
import { createThemePresets } from "@/components/create-components/style-presets";

const FONT_GROUPS = [
  { kind: "text", label: "متن" },
  { kind: "display", label: "نمایشی" },
] as const;

/**
 * Preview swatches for the studio frame, which lives outside the preset's
 * `--cc-*` scope. The canvas itself reads the real tokens.
 */
const ICON_TONE_SWATCH: Record<IconToneId, string> = {
  inherit: "currentColor",
  primary: "var(--color-coral)",
  accent: "var(--color-mustard-deep)",
  muted: "var(--color-indigo-light)",
};

type SidebarProps = {
  styleId: StyleId;
  onStyleChange: (id: StyleId) => void;
  palette: StudioPalette;
  onPalettePreset: (preset: PalettePreset) => void;
  onPaletteToken: (token: PaletteTokenId, hex: string) => void;
  onResetPaletteToken: (token: PaletteTokenId) => void;
  onResetPaletteGroup: (group: PaletteGroupId) => void;
  radius: number;
  onRadiusChange: (value: number) => void;
  font: string;
  onFontChange: (id: string) => void;
  iconLibrary: IconLibraryId;
  onIconLibraryChange: (id: IconLibraryId) => void;
  iconStyle: IconStyle;
  onIconStyleChange: (style: IconStyle) => void;
  onShuffle: () => void;
  onExport: () => void;
  customFonts: CustomFont[];
  onAddCustomFont: (name: string, file: File) => Promise<void>;
  onRemoveCustomFont: (id: string) => Promise<void>;
};

export function CreateStudioSidebar({
  styleId,
  onStyleChange,
  palette,
  onPalettePreset,
  onPaletteToken,
  onResetPaletteToken,
  onResetPaletteGroup,
  radius,
  onRadiusChange,
  font,
  onFontChange,
  iconLibrary,
  onIconLibraryChange,
  iconStyle,
  onIconStyleChange,
  onShuffle,
  onExport,
  customFonts,
  onAddCustomFont,
  onRemoveCustomFont,
}: SidebarProps) {
  const [radiusDraft, setRadiusDraft] = useState({
    source: radius,
    value: String(radius),
  });
  const [colorMode, setColorMode] = useState<"presets" | "custom">(
    activePalettePresetId(palette) ? "presets" : "custom",
  );
  const [customGroup, setCustomGroup] = useState<PaletteGroupId>("roles");
  const [addingFont, setAddingFont] = useState(false);
  const [fontName, setFontName] = useState("");
  const [fontFile, setFontFile] = useState<File | null>(null);
  const [fontError, setFontError] = useState<string | null>(null);
  const [fontBusy, setFontBusy] = useState(false);
  const fontInputRef = useRef<HTMLInputElement>(null);

  const resolvedIconStyle = resolveIconStyle(iconStyle);

  // Derive the editable value during render: when the studio pushes a new
  // radius the draft is stale, so the incoming prop wins. No effect, no
  // cascading renders.
  const customRadius =
    radiusDraft.source === radius ? radiusDraft.value : String(radius);
  const setCustomRadius = (value: string) =>
    setRadiusDraft({ source: radius, value });

  const currentStyleLabel =
    STYLES.find((item) => item.id === styleId)?.label ?? "";
  const radiusOption = RADII.find((item) => item.value === radius);
  const radiusLabel = radiusOption
    ? `${radiusOption.label} (${radiusOption.caption})`
    : `${radius}px (سفارشی)`;

  const applyRadius = () => {
    const value = Number(customRadius);
    if (Number.isFinite(value) && value >= 0 && value <= 48) {
      onRadiusChange(value);
    }
  };

  const activePreset = activePalettePresetId(palette);
  const basePreset = basePalettePreset(palette);
  const customTokens = COLOR_TOKENS.filter(
    (token) => token.group === customGroup,
  );
  const contrastIssues = paletteContrastIssues(palette, styleId);
  const worstContrastIssue = [...contrastIssues].sort(
    (left, right) => left.ratio - right.ratio,
  )[0];

  const resetFontForm = () => {
    setAddingFont(false);
    setFontName("");
    setFontFile(null);
    setFontError(null);
  };

  const submitFont = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fontFile) {
      setFontError("یک فایل فونت انتخاب کنید.");
      return;
    }
    setFontBusy(true);
    setFontError(null);
    try {
      await onAddCustomFont(fontName, fontFile);
      resetFontForm();
    } catch (error) {
      setFontError(
        error instanceof Error ? error.message : "افزودن فونت ناموفق بود.",
      );
    } finally {
      setFontBusy(false);
    }
  };

  return (
    <aside className='order-2 z-20 flex w-full shrink-0 flex-col gap-4 border-b-[2.5px] border-indigo-ink bg-paper-light p-4 lg:order-1 lg:h-full lg:min-h-0 lg:w-80 lg:overflow-y-auto lg:border-b-0 lg:border-l-[2.5px]'>
      <div className='border-b border-indigo-ink/20 pb-3'>
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
        <div className='flex flex-col gap-2'>
          {STYLE_GROUPS.map((group) => {
            const options = STYLES.filter((style) => style.group === group.id);
            return (
              <div key={group.id} className='flex flex-col gap-1'>
                <div className='flex items-baseline justify-between gap-2'>
                  <span className='text-[10px] font-black text-indigo-ink'>
                    {group.label}
                  </span>
                  <span className='text-[9px] text-indigo-light'>
                    {group.caption}
                  </span>
                </div>
                <div className='grid grid-cols-2 gap-1.5'>
                  {options.map((option) => {
                    const active = styleId === option.id;
                    const preset = createThemePresets[option.id];
                    const tokens = preset.tokens;
                    const fontLabel =
                      FONTS.find((item) => item.id === option.font)?.label ?? "";
                    return (
                      <button
                        key={option.id}
                        type='button'
                        onClick={() => onStyleChange(option.id)}
                        aria-pressed={active}
                        title={option.description}
                        className={`flex flex-col gap-1 rounded-sm border border-indigo-ink p-1.5 text-right transition-all ${
                          active
                            ? "bg-coral font-bold text-white shadow-craft-sm"
                            : "bg-paper-dim font-medium text-indigo-ink hover:bg-paper-light"
                        }`}
                      >
                        <span className='flex items-center justify-between gap-1'>
                          <span
                            aria-hidden='true'
                            className='flex size-7 shrink-0 items-center justify-center font-black'
                            style={{
                              fontFamily: FONT_STACKS[option.font],
                              borderRadius: tokens.radius ?? 0,
                              borderStyle: tokens.borderStyle ?? "solid",
                              borderWidth: Math.min(tokens.borderWidth ?? 1, 3),
                              borderColor: tokens.border ?? "#264653",
                              backgroundColor: tokens.background ?? "#ffffff",
                              color: tokens.surfaceForeground ?? "#264653",
                            }}
                          >
                            Aa
                          </span>
                          <span className='flex items-center gap-0.5'>
                            <span
                              className='size-2 rounded-full border border-indigo-ink/30'
                              style={{
                                backgroundColor:
                                  tokens.background ?? "#ffffff",
                              }}
                            />
                            <span
                              className='size-2 rounded-full border border-indigo-ink/30'
                              style={{ backgroundColor: tokens.accent ?? "#e9c46a" }}
                            />
                            <span
                              className='size-2 rounded-full border border-indigo-ink/30'
                              style={{ backgroundColor: tokens.border ?? "#264653" }}
                            />
                          </span>
                        </span>
                        <span className='flex flex-col gap-0.5'>
                          <span className='text-[10px] leading-tight'>
                            {option.label}
                          </span>
                          <span className='text-[8px] leading-snug opacity-80'>
                            {option.description}
                          </span>
                          <span className='truncate font-mono text-[8px] opacity-60'>
                            {fontLabel} · {preset.tone === "dark" ? "DARK" : "LIGHT"} ·{" "}
                            {tokens.radius ?? 0}px
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <p className='text-[10px] leading-relaxed text-indigo-light'>
          هر سبک پالت، تایپوگرافی، بافت و فرم کنترل‌ها را عوض می‌کند و شعاع گوشه و
          فونت را با خودش همگام می‌سازد.
        </p>
      </div>

      <div className='flex flex-col gap-2 border-t border-indigo-ink/20 pt-1'>
        <div className='flex items-center justify-between text-xs font-bold'>
          <span className='flex items-center gap-1 text-indigo-ink'>
            <Palette className='size-[15px] text-coral' />
            <span>پالت و نقش رنگ‌ها</span>
          </span>
          <span className='max-w-[52%] truncate rounded-sm border border-indigo-ink bg-paper-dim px-1.5 py-0.5 font-mono text-[10px] text-indigo-ink'>
            {paletteLabel(palette)}
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

        {colorMode === "presets" ? (
          <div className='grid grid-cols-2 gap-1.5'>
            {PALETTE_PRESETS.map((preset) => {
              const active = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type='button'
                  onClick={() => onPalettePreset(preset)}
                  aria-pressed={active}
                  title={`${preset.name} — ${preset.note}`}
                  className={`flex flex-col gap-1 rounded-sm border border-indigo-ink p-1.5 text-right transition-all ${
                    active
                      ? "bg-paper-light shadow-craft-sm ring-2 ring-coral"
                      : "bg-paper-dim hover:bg-paper-light"
                  }`}
                >
                  <span className='flex h-3 w-full overflow-hidden rounded-[1px] border border-indigo-ink/30'>
                    {ROLE_IDS.map((role) => (
                      <span
                        key={role}
                        className='flex-1'
                        style={{ backgroundColor: preset.colors[role] }}
                      />
                    ))}
                  </span>
                  <span className='flex items-center justify-between gap-1'>
                    <span className='truncate text-[10px] font-bold text-indigo-ink'>
                      {preset.name}
                    </span>
                    {active ? (
                      <Check className='size-3 shrink-0 text-coral' />
                    ) : null}
                  </span>
                  <span className='truncate text-[8px] text-indigo-light'>
                    {preset.note}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        {colorMode === "custom" ? (
          <div className='flex flex-col gap-2 rounded-sm border border-indigo-ink bg-paper-dim p-2 shadow-craft-sm'>
            <div className='flex items-center justify-between gap-1'>
              <span className='flex items-center gap-1 text-[10px] font-bold text-indigo-ink'>
                <SlidersHorizontal className='size-3 text-coral' />
                <span>ویرایشگر پیشرفتهٔ رنگ</span>
              </span>
              <button
                type='button'
                onClick={() => onPalettePreset(basePreset)}
                title={`بازگشت به ${basePreset.name}`}
                className='flex items-center gap-1 rounded-sm border border-indigo-ink bg-paper-light px-1.5 py-0.5 text-[9px] font-bold text-indigo-ink shadow-craft-sm transition-colors hover:bg-paper-dim'
              >
                <RotateCcw className='size-3' />
                <span>پالت پایه</span>
              </button>
            </div>

            <div className='grid grid-cols-3 rounded-sm border border-indigo-ink bg-paper-light p-0.5 text-[10px] font-bold'>
              {PALETTE_GROUPS.map((group) => (
                <button
                  key={group.id}
                  type='button'
                  onClick={() => setCustomGroup(group.id)}
                  aria-pressed={customGroup === group.id}
                  title={group.caption}
                  className={`rounded-sm py-1 transition-all ${
                    customGroup === group.id
                      ? "bg-indigo-ink text-paper"
                      : "text-indigo-light hover:bg-paper-dim hover:text-indigo-ink"
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>

            {customGroup === "roles" ? (
              <div className='flex h-7 overflow-hidden rounded-sm border border-indigo-ink'>
                {ROLE_IDS.map((role) => (
                  <span
                    key={role}
                    className='flex-1'
                    style={{ backgroundColor: palette.colors[role] }}
                    title={
                      COLOR_TOKENS.find((token) => token.id === role)?.label ??
                      role
                    }
                  />
                ))}
              </div>
            ) : null}

            {customGroup === "neutrals" ? (
              <div
                className='rounded-sm border border-indigo-ink p-1'
                style={{
                  backgroundColor: resolvePaletteToken(
                    "background",
                    palette,
                    styleId,
                  ),
                }}
              >
                <div
                  className='rounded-[2px] border p-1.5'
                  style={{
                    backgroundColor: resolvePaletteToken(
                      "surface",
                      palette,
                      styleId,
                    ),
                    borderColor: resolvePaletteToken("border", palette, styleId),
                    color: resolvePaletteToken(
                      "surfaceForeground",
                      palette,
                      styleId,
                    ),
                  }}
                >
                  <span className='block text-[10px] font-bold'>
                    نمونهٔ متن اصلی
                  </span>
                  <span
                    className='mt-0.5 block text-[9px]'
                    style={{
                      color: resolvePaletteToken(
                        "mutedForeground",
                        palette,
                        styleId,
                      ),
                    }}
                  >
                    توضیح کم‌رنگ روی سطح کارت
                  </span>
                  <span
                    className='mt-1 inline-block rounded-[2px] px-1.5 py-0.5 text-[8px] font-bold'
                    style={{
                      backgroundColor: resolvePaletteToken(
                        "muted",
                        palette,
                        styleId,
                      ),
                      color: resolvePaletteToken(
                        "mutedForeground",
                        palette,
                        styleId,
                      ),
                    }}
                  >
                    برچسب فرورفته
                  </span>
                </div>
              </div>
            ) : null}

            {customGroup === "charts" ? (
              <div
                className='flex flex-col gap-0.5 rounded-sm border border-indigo-ink p-1'
                style={{
                  backgroundColor: resolvePaletteToken(
                    "surface",
                    palette,
                    styleId,
                  ),
                }}
              >
                <div className='flex h-6 items-end gap-0.5'>
                  {customTokens
                    .filter((token) => token.id !== "chartGrid")
                    .map((token, index) => (
                      <span
                        key={token.id}
                        className='flex-1 rounded-t-[1px]'
                        style={{
                          height: `${40 + index * 8}%`,
                          backgroundColor: resolvePaletteToken(
                            token.id,
                            palette,
                            styleId,
                          ),
                        }}
                        title={token.label}
                      />
                    ))}
                </div>
                <span
                  className='h-px w-full'
                  style={{
                    backgroundColor: resolvePaletteToken(
                      "chartGrid",
                      palette,
                      styleId,
                    ),
                  }}
                />
              </div>
            ) : null}

            {worstContrastIssue ? (
              <div
                role='status'
                className='flex items-start gap-1 rounded-sm border border-coral bg-paper-light px-1.5 py-1 text-[9px] leading-relaxed text-coral'
              >
                <TriangleAlert className='mt-0.5 size-3 shrink-0' />
                <span>
                  نسبت خوانایی متن با{" "}
                  {worstContrastIssue.surface === "background"
                    ? "پس‌زمینه"
                    : "سطح کارت"}{" "}
                  {toPersianDigits(worstContrastIssue.ratio.toFixed(1))}:۱ است؛
                  حداقل ۴.۵ توصیه می‌شود.
                </span>
              </div>
            ) : null}

            <div className='flex flex-col gap-1'>
              {customTokens.map((token) => (
                <PaletteTokenRow
                  key={token.id}
                  token={token}
                  value={resolvePaletteToken(token.id, palette, styleId)}
                  overridden={isTokenOverridden(palette, token.id)}
                  onApply={(hex) => {
                    onPaletteToken(token.id, hex);
                    setColorMode("custom");
                  }}
                  onReset={() => onResetPaletteToken(token.id)}
                />
              ))}
            </div>

            <div className='flex items-start justify-between gap-1 border-t border-indigo-ink/20 pt-1'>
              <span className='text-[9px] leading-relaxed text-indigo-light'>
                {customGroup === "roles"
                  ? "نقش‌ها روی همهٔ سبک‌ها اعمال می‌شوند."
                  : "روی سبک فعال سوار می‌شوند؛ با تغییر سبک مقدار جدید می‌آید مگر همین‌جا عوض شود."}
              </span>
              <button
                type='button'
                onClick={() => onResetPaletteGroup(customGroup)}
                className='flex shrink-0 items-center gap-1 rounded-sm border border-indigo-ink bg-paper-light px-1.5 py-0.5 text-[9px] font-bold text-indigo-ink shadow-craft-sm transition-colors hover:bg-paper-dim'
              >
                <RotateCcw className='size-3' />
                <span>بازنشانی گروه</span>
              </button>
            </div>
          </div>
        ) : null}
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
                title={`کتابخانهٔ ${library.label} (${library.note})`}
                className={`flex flex-col items-center gap-0.5 rounded-sm border border-indigo-ink p-1.5 text-center transition-all ${
                  active
                    ? "bg-coral text-white shadow-craft-sm"
                    : "bg-paper-dim text-indigo-ink hover:bg-paper-light"
                }`}
              >
                <span
                  aria-hidden='true'
                  className='flex items-center justify-center gap-0.5'
                >
                  {ICON_PREVIEW_NAMES.map((name) => (
                    <Icon
                      key={name}
                      name={name}
                      library={library.id}
                      strokeWidth={2}
                      className='size-3.5'
                    />
                  ))}
                </span>
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

        <div className='flex flex-col gap-1 rounded-sm border border-dashed border-indigo-ink/35 bg-paper-dim/70 p-1.5'>
          <div className='flex items-center justify-between gap-1'>
            <span className='text-[10px] font-bold text-indigo-ink'>
              ساخت و استایل آیکون
            </span>
            <button
              type='button'
              onClick={() => onIconStyleChange(DEFAULT_ICON_STYLE)}
              className='flex items-center gap-0.5 rounded-sm border border-indigo-ink/40 bg-paper-light px-1 py-0.5 text-[9px] font-bold text-indigo-ink transition-colors hover:bg-paper-dim'
            >
              <RotateCcw className='size-2.5' />
              <span>بازنشانی</span>
            </button>
          </div>

          <IconPickerRow
            label='اندازه'
            value={iconStyle.size}
            options={ICON_SIZES.map((option) => ({
              id: option.id,
              label: option.label,
            }))}
            onChange={(size: IconSizeId) =>
              onIconStyleChange({ ...iconStyle, size })
            }
          />
          <IconPickerRow
            label='ضخامت'
            value={iconStyle.weight}
            options={ICON_WEIGHTS.map((option) => ({
              id: option.id,
              label: option.label,
            }))}
            onChange={(weight: IconWeightId) =>
              onIconStyleChange({ ...iconStyle, weight })
            }
          />
          <IconPickerRow
            label='رنگ'
            columns={4}
            value={iconStyle.tone}
            options={ICON_TONES.map((option) => ({
              id: option.id,
              label: option.label,
            }))}
            onChange={(tone: IconToneId) =>
              onIconStyleChange({ ...iconStyle, tone })
            }
          />

          <div className='flex items-center justify-between gap-1 rounded-sm border border-indigo-ink/20 bg-paper-light px-1.5 py-1'>
            <span className='text-[9px] text-indigo-light'>پیش‌نمایش</span>
            <span
              className='flex items-center gap-2'
              style={{ color: ICON_TONE_SWATCH[iconStyle.tone] }}
            >
              {ICON_PREVIEW_NAMES.map((name) => (
                <Icon
                  key={name}
                  name={name}
                  library={iconLibrary}
                  strokeWidth={resolvedIconStyle.stroke}
                  className='size-4'
                  style={{
                    transform: `scale(${resolvedIconStyle.scale})`,
                    transformOrigin: "center",
                  }}
                />
              ))}
            </span>
          </div>

          <span className='text-[9px] leading-relaxed text-indigo-light'>
            {iconLibrary === "google"
              ? "آیکون‌های متریال توپرند؛ ضخامت خط روی لوسید و تب‌لر دیده می‌شود."
              : "همهٔ آیکون‌های بوم اندازه، ضخامت و رنگ را از همین‌جا می‌گیرند."}
          </span>
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
          <span className='text-[10px] text-indigo-light'>
            {toPersianDigits(FONTS.length + customFonts.length)} فونت
          </span>
        </div>
        <div className='flex flex-col gap-1.5 text-xs'>
          {FONT_GROUPS.map((group) => (
            <div key={group.kind} className='flex flex-col gap-1'>
              <span className='font-mono text-[9px] font-bold tracking-[0.12em] text-indigo-light uppercase'>
                {group.label}
              </span>
              {FONTS.filter((option) => option.kind === group.kind).map(
                (option) => {
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
                      <div className='flex min-w-0 items-center gap-1.5'>
                        <input
                          type='radio'
                          name='font_family_choice'
                          value={option.id}
                          checked={active}
                          onChange={() => onFontChange(option.id)}
                          className='size-3 shrink-0 accent-coral'
                        />
                        <span
                          className='truncate text-[13px] leading-6 text-indigo-ink'
                          style={{ fontFamily: FONT_STACKS[option.id] }}
                        >
                          {option.label}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 ps-2 text-[9px] ${
                          active
                            ? "font-mono font-bold text-coral"
                            : "text-indigo-light"
                        }`}
                      >
                        {option.note}
                      </span>
                    </label>
                  );
                },
              )}
            </div>
          ))}

          {customFonts.length > 0 ? (
            <div className='flex flex-col gap-1'>
              <span className='font-mono text-[9px] font-bold tracking-[0.12em] text-indigo-light uppercase'>
                فونت‌های من
              </span>
              {customFonts.map((customFont) => {
                const active = font === customFont.id;
                return (
                  <div
                    key={customFont.id}
                    className={`flex items-center gap-1 rounded-sm border border-indigo-ink p-1.5 transition-colors ${
                      active
                        ? "bg-paper-light shadow-craft-sm"
                        : "bg-paper-dim hover:bg-paper-light"
                    }`}
                  >
                    <label className='flex min-w-0 flex-1 cursor-pointer items-center gap-1.5'>
                      <input
                        type='radio'
                        name='font_family_choice'
                        value={customFont.id}
                        checked={active}
                        onChange={() => onFontChange(customFont.id)}
                        className='size-3 shrink-0 accent-coral'
                      />
                      <span
                        className='truncate text-[13px] leading-6 text-indigo-ink'
                        style={{
                          fontFamily: resolveFontStack(
                            customFont.id,
                            customFonts,
                          ),
                        }}
                      >
                        {customFont.name}
                      </span>
                    </label>
                    <span
                      dir='ltr'
                      className={`shrink-0 font-mono text-[9px] ${
                        active ? "font-bold text-coral" : "text-indigo-light"
                      }`}
                    >
                      {Math.max(1, Math.round(customFont.size / 1024))}KB
                    </span>
                    <button
                      type='button'
                      onClick={() => void onRemoveCustomFont(customFont.id)}
                      aria-label={`حذف فونت ${customFont.name}`}
                      title='حذف فونت'
                      className='shrink-0 rounded-sm border border-transparent p-0.5 text-indigo-light transition-colors hover:border-indigo-ink hover:text-coral'
                    >
                      <Trash2 className='size-3.5' />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : null}

          {addingFont ? (
            <form
              onSubmit={submitFont}
              className='flex flex-col gap-1.5 rounded-sm border border-indigo-ink bg-paper-dim p-2 shadow-craft-sm'
            >
              <label
                htmlFor='custom-font-name'
                className='text-[10px] font-bold text-indigo-ink'
              >
                نام فونت
              </label>
              <input
                id='custom-font-name'
                autoFocus
                value={fontName}
                onChange={(event) => setFontName(event.target.value)}
                maxLength={28}
                placeholder='مثلاً: فونت برند من'
                className='w-full rounded-sm border border-indigo-ink bg-paper-light px-1.5 py-1 text-[11px] font-bold text-indigo-ink outline-none focus:ring-1 focus:ring-coral'
              />
              <button
                type='button'
                onClick={() => fontInputRef.current?.click()}
                className='flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-sm border border-dashed border-indigo-ink bg-paper-light px-1.5 py-1 text-[10px] font-bold text-indigo-ink hover:bg-paper-dim'
              >
                <span className='flex min-w-0 items-center gap-1'>
                  <Upload className='size-3 shrink-0 text-coral' />
                  <span className='truncate' dir='ltr'>
                    {fontFile ? fontFile.name : "woff2 / woff / ttf / otf"}
                  </span>
                </span>
                <span className='shrink-0 rounded-sm border border-indigo-ink bg-paper-dim px-1.5 py-0.5 text-[9px]'>
                  انتخاب فایل
                </span>
              </button>
              {/* Hidden file input: display:none keeps it out of layout, so the
                  browser cannot scroll the page to "reveal" it on focus. */}
              <input
                ref={fontInputRef}
                type='file'
                accept={CUSTOM_FONT_ACCEPT}
                onChange={(event) => {
                  setFontFile(event.target.files?.[0] ?? null);
                  setFontError(null);
                }}
                className='hidden'
              />
              {fontError ? (
                <span
                  role='alert'
                  className='text-[9px] leading-relaxed font-bold text-coral'
                >
                  {fontError}
                </span>
              ) : null}
              <div className='flex items-center gap-1.5'>
                <button
                  type='submit'
                  disabled={fontBusy || !fontFile}
                  className='flex flex-1 items-center justify-center gap-1 rounded-sm border border-indigo-ink bg-coral px-2 py-1 text-[10px] font-bold text-white shadow-craft-sm transition-all hover:bg-coral-dark active:translate-x-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <Upload className='size-3' />
                  <span>{fontBusy ? "در حال بارگذاری…" : "افزودن فونت"}</span>
                </button>
                <button
                  type='button'
                  onClick={resetFontForm}
                  className='rounded-sm border border-indigo-ink bg-paper-light px-2 py-1 text-[10px] font-bold text-indigo-ink shadow-craft-sm hover:bg-paper-dim'
                >
                  انصراف
                </button>
              </div>
              <span className='text-[9px] leading-relaxed text-indigo-light'>
                فایل فقط روی همین دستگاه ذخیره می‌شود؛ حداکثر{" "}
                {toPersianDigits(CUSTOM_FONT_MAX_BYTES / (1024 * 1024))} مگابایت.
              </span>
            </form>
          ) : (
            <button
              type='button'
              onClick={() => {
                setAddingFont(true);
                setFontName("");
                setFontFile(null);
                setFontError(null);
              }}
              className='flex w-full items-center justify-center gap-1.5 rounded-sm border border-dashed border-indigo-ink bg-paper-dim px-2 py-1.5 text-[11px] font-bold text-indigo-ink shadow-craft-sm transition-all hover:bg-paper-light active:translate-x-0.5 active:translate-y-0.5'
            >
              <Plus className='size-3.5 text-coral' />
              <span>افزودن فونت سفارشی</span>
            </button>
          )}
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

type PaletteTokenRowProps = {
  token: ColorToken;
  value: string;
  overridden: boolean;
  onApply: (hex: string) => void;
  onReset: () => void;
};

/**
 * One colour token in the advanced editor. The draft follows the
 * `{ source, value }` pattern: whenever the studio pushes a new value, the
 * incoming prop wins, so palettes and resets never leave a stale hex behind.
 */
function PaletteTokenRow({
  token,
  value,
  overridden,
  onApply,
  onReset,
}: PaletteTokenRowProps) {
  const [draft, setDraft] = useState({
    source: value,
    value: value.toUpperCase(),
    invalid: false,
  });
  const hex = draft.source === value ? draft.value : value.toUpperCase();
  const invalid = draft.source === value ? draft.invalid : false;

  const commit = (raw: string) => {
    const normalized = normalizeHex(raw);
    if (!normalized) {
      setDraft({ source: value, value: raw.toUpperCase(), invalid: true });
      return;
    }
    setDraft({
      source: normalized,
      value: normalized.toUpperCase(),
      invalid: false,
    });
    onApply(normalized);
  };

  return (
    <div className='flex flex-col gap-0.5'>
      <div className='flex items-center gap-1.5 rounded-sm border border-indigo-ink bg-paper-light p-1 shadow-craft-sm'>
        <Popover.Root>
          <Popover.Trigger
            aria-label={`انتخاب ${token.label}`}
            title={value.toUpperCase()}
            className='size-6 shrink-0 cursor-pointer rounded-[2px] border border-indigo-ink shadow-craft-sm transition-transform focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-1 focus-visible:outline-none'
            style={{ backgroundColor: value }}
          />
          <PaletteColorPicker
            label={token.label}
            value={value}
            onChange={commit}
          />
        </Popover.Root>
        <span className='flex min-w-0 flex-1 flex-col'>
          <span className='flex items-center gap-1'>
            <span className='truncate text-[10px] font-bold text-indigo-ink'>
              {token.label}
            </span>
            <span className='shrink-0 rounded-[2px] border border-indigo-ink/30 bg-paper-dim px-1 font-mono text-[7px] text-indigo-light'>
              {token.tag}
            </span>
            {overridden ? (
              <span
                aria-label='مقدار سفارشی'
                title='مقدار سفارشی'
                className='size-1.5 shrink-0 rounded-full bg-coral'
              />
            ) : null}
          </span>
          <span
            dir='ltr'
            className='truncate text-left font-mono text-[8px] text-indigo-light'
          >
            {token.token}
          </span>
        </span>
        <input
          type='text'
          dir='ltr'
          value={hex}
          aria-label={`کد رنگ ${token.label}`}
          aria-invalid={invalid}
          onChange={(event) =>
            setDraft({
              source: value,
              value: event.target.value.toUpperCase(),
              invalid: false,
            })
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit(hex);
            }
          }}
          className={`w-16 shrink-0 rounded-[2px] border bg-paper-dim px-1 py-0.5 text-left font-mono text-[10px] font-bold text-indigo-ink uppercase outline-none focus:ring-1 focus:ring-coral ${
            invalid ? "border-coral" : "border-indigo-ink"
          }`}
        />
        <button
          type='button'
          onClick={() => commit(hex)}
          aria-label={`اعمال رنگ ${token.label}`}
          className='shrink-0 rounded-[2px] border border-indigo-ink bg-paper-light p-1 text-indigo-ink shadow-craft-sm hover:bg-paper-dim'
        >
          <Check className='size-3' />
        </button>
        <button
          type='button'
          onClick={() => {
            setDraft({
              source: value,
              value: value.toUpperCase(),
              invalid: false,
            });
            onReset();
          }}
          disabled={!overridden}
          aria-label={`بازنشانی ${token.label}`}
          className='shrink-0 rounded-[2px] border border-indigo-ink bg-paper-light p-1 text-indigo-ink shadow-craft-sm hover:bg-paper-dim disabled:cursor-not-allowed disabled:opacity-35'
        >
          <RotateCcw className='size-3' />
        </button>
      </div>
      <span className='px-0.5 text-[8px] leading-relaxed text-indigo-light'>
        {token.description}
      </span>
      {invalid ? (
        <span role='alert' className='px-0.5 text-[8px] font-bold text-coral'>
          کد رنگ معتبر نیست؛ نمونهٔ درست: #E76F51 یا #ABC
        </span>
      ) : null}
    </div>
  );
}

type HsvColor = { h: number; s: number; v: number };

const HUE_GRADIENT =
  "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)";

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function hexToHsv(hex: string): HsvColor {
  const normalized = normalizeHex(hex) ?? "#000000";
  const red = parseInt(normalized.slice(1, 3), 16) / 255;
  const green = parseInt(normalized.slice(3, 5), 16) / 255;
  const blue = parseInt(normalized.slice(5, 7), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  return { h: hue, s: max === 0 ? 0 : delta / max, v: max };
}

function hsvToHex({ h, s, v }: HsvColor): string {
  const hue = ((h % 360) + 360) % 360;
  const chroma = v * s;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = v - chroma;

  let red = 0;
  let green = 0;
  let blue = 0;
  if (hue < 60) [red, green, blue] = [chroma, x, 0];
  else if (hue < 120) [red, green, blue] = [x, chroma, 0];
  else if (hue < 180) [red, green, blue] = [0, chroma, x];
  else if (hue < 240) [red, green, blue] = [0, x, chroma];
  else if (hue < 300) [red, green, blue] = [x, 0, chroma];
  else [red, green, blue] = [chroma, 0, x];

  return `#${[red, green, blue]
    .map((channel) =>
      Math.round((channel + match) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

type PaletteColorPickerProps = {
  label: string;
  value: string;
  onChange: (hex: string) => void;
};

/**
 * In-page HSV picker. The browser's native colour dialog is an OS popup and
 * can be anchored off-screen (notably Chrome on Wayland), so the studio uses
 * a portal popover with collision handling instead: it always opens inside
 * the viewport, even when the sidebar sits against the right edge.
 */
function PaletteColorPicker({
  label,
  value,
  onChange,
}: PaletteColorPickerProps) {
  const [draft, setDraft] = useState(() => ({
    hex: value.toLowerCase(),
    hsv: hexToHsv(value),
  }));
  // External edits (palette preset, HEX field, reset) win over a stale draft.
  const hsv =
    draft.hex === value.toLowerCase() ? draft.hsv : hexToHsv(value);

  const apply = (next: HsvColor) => {
    const clamped: HsvColor = {
      h: ((next.h % 360) + 360) % 360,
      s: clamp01(next.s),
      v: clamp01(next.v),
    };
    const hex = hsvToHex(clamped);
    setDraft({ hex, hsv: clamped });
    onChange(hex);
  };

  const updateSaturationValue = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    apply({
      ...hsv,
      s: clamp01((event.clientX - rect.left) / rect.width),
      v: clamp01(1 - (event.clientY - rect.top) / rect.height),
    });
  };

  return (
    <Popover.Portal>
      <Popover.Positioner
        side='bottom'
        align='start'
        sideOffset={6}
        collisionPadding={8}
        className='z-[80]'
      >
        <Popover.Popup className='w-56 max-w-[calc(100vw-1rem)] rounded-sm border border-indigo-ink bg-paper-light p-2 text-indigo-ink shadow-craft-lg outline-none'>
          <Popover.Title className='mb-1.5 flex items-center justify-between gap-2 text-[10px] font-bold'>
            <span>{label}</span>
            <span
              dir='ltr'
              className='rounded-[2px] border border-indigo-ink/30 bg-paper-dim px-1 font-mono text-[9px]'
            >
              {value.toUpperCase()}
            </span>
          </Popover.Title>

          <div
            role='slider'
            tabIndex={0}
            aria-label={`اشباع و روشنایی ${label}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(hsv.s * 100)}
            aria-valuetext={`اشباع ${toPersianDigits(
              Math.round(hsv.s * 100),
            )}٪، روشنایی ${toPersianDigits(Math.round(hsv.v * 100))}٪`}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              updateSaturationValue(event);
            }}
            onPointerMove={(event) => {
              if (event.buttons === 1) updateSaturationValue(event);
            }}
            onKeyDown={(event) => {
              const step = event.shiftKey ? 0.1 : 0.02;
              let next: HsvColor | null = null;
              if (event.key === "ArrowLeft") {
                next = { ...hsv, s: clamp01(hsv.s - step) };
              } else if (event.key === "ArrowRight") {
                next = { ...hsv, s: clamp01(hsv.s + step) };
              } else if (event.key === "ArrowDown") {
                next = { ...hsv, v: clamp01(hsv.v - step) };
              } else if (event.key === "ArrowUp") {
                next = { ...hsv, v: clamp01(hsv.v + step) };
              }
              if (!next) return;
              event.preventDefault();
              apply(next);
            }}
            className='relative h-28 w-full cursor-crosshair touch-none overflow-hidden rounded-sm border border-indigo-ink outline-none select-none focus-visible:ring-2 focus-visible:ring-coral'
            style={{ backgroundColor: `hsl(${hsv.h} 100% 50%)` }}
          >
            <span
              className='pointer-events-none absolute inset-0'
              style={{
                backgroundImage:
                  "linear-gradient(to right, #ffffff, rgba(255,255,255,0))",
              }}
            />
            <span
              className='pointer-events-none absolute inset-0'
              style={{
                backgroundImage:
                  "linear-gradient(to top, #000000, rgba(0,0,0,0))",
              }}
            />
            <span
              className='pointer-events-none absolute z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_3px_rgba(0,0,0,0.45)]'
              style={{
                left: `${hsv.s * 100}%`,
                top: `${(1 - hsv.v) * 100}%`,
                backgroundColor: value,
              }}
            />
          </div>

          <div
            className='relative mt-2 h-4 w-full rounded-full border border-indigo-ink focus-within:ring-2 focus-within:ring-coral'
            style={{ backgroundImage: HUE_GRADIENT }}
          >
            <input
              type='range'
              min={0}
              max={359}
              step={1}
              value={Math.round(hsv.h)}
              onChange={(event) =>
                apply({ ...hsv, h: Number(event.target.value) })
              }
              aria-label={`تن رنگ ${label}`}
              className='absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0'
            />
            <span
              className='pointer-events-none absolute top-1/2 z-20 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_3px_rgba(0,0,0,0.45)]'
              style={{
                left: `${(hsv.h / 360) * 100}%`,
                backgroundColor: `hsl(${hsv.h} 100% 50%)`,
              }}
            />
          </div>

          <p className='mt-1.5 text-[9px] leading-relaxed text-indigo-light'>
            مربع را بکشید یا با کلیدهای جهت تنظیم کنید؛ نوار پایین تن رنگ است.
          </p>

        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );
}

type IconPickerRowProps<T extends string> = {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  columns?: 3 | 4;
};

/** A labelled segmented control for one icon-style axis. */
function IconPickerRow<T extends string>({
  label,
  options,
  value,
  onChange,
  columns = 3,
}: IconPickerRowProps<T>) {
  return (
    <div className='flex items-center gap-1'>
      <span className='w-9 shrink-0 text-[9px] text-indigo-light'>{label}</span>
      <div
        role='group'
        aria-label={label}
        className={
          columns === 4
            ? "grid flex-1 grid-cols-4 gap-1"
            : "grid flex-1 grid-cols-3 gap-1"
        }
      >
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type='button'
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={`rounded-sm border border-indigo-ink/40 px-1 py-0.5 text-[9px] font-bold transition-colors ${
                active
                  ? "bg-indigo-ink text-paper"
                  : "bg-paper-light text-indigo-ink hover:bg-paper-dim"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

