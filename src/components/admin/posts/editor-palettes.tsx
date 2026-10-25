"use client";

import type { Editor } from "@tiptap/react";
import { cn } from "cn";

/**
 * Swatch values are the site's own CSS custom properties, so a coloured span
 * keeps following the riso palette instead of baking a hex into the article.
 */
const TEXT_COLORS = [
  { label: "جوهر", value: "var(--color-indigo-ink)" },
  { label: "مرجانی", value: "var(--color-coral)" },
  { label: "خردلی", value: "var(--color-mustard-deep)" },
  { label: "فیروزه‌ای", value: "var(--color-teal-craft)" },
];

const HIGHLIGHTS = [
  { label: "خردلی", value: "var(--color-mustard)" },
  { label: "مرجانی روشن", value: "var(--color-coral-soft)" },
  { label: "فیروزه‌ای روشن", value: "var(--color-teal-light)" },
];

const FONT_SIZES = ["", "14px", "16px", "18px", "20px", "24px", "30px"];

export function EditorPalettes({
  editor,
  color,
  fontSize,
  highlight,
}: {
  editor: Editor;
  color: string | null;
  fontSize: string | null;
  highlight: string | null;
}) {
  const chain = () => editor.chain().focus();

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div className='flex items-center gap-1 rounded-sm border border-indigo-ink/20 bg-paper px-1.5 py-1'>
        <span className='pr-0.5 text-[10px] font-bold text-indigo-light'>رنگ</span>
        {TEXT_COLORS.map((swatch) => (
          <button
            key={swatch.value}
            type='button'
            title={`رنگ متن: ${swatch.label}`}
            aria-label={`رنگ متن ${swatch.label}`}
            onClick={() => chain().setColor(swatch.value).run()}
            className={cn(
              "size-4 rounded-full border border-indigo-ink/40 transition-transform hover:scale-110",
              color === swatch.value ? "ring-2 ring-coral ring-offset-1" : "",
            )}
            style={{ backgroundColor: swatch.value }}
          />
        ))}
        <button
          type='button'
          onClick={() => chain().unsetColor().run()}
          className='rounded-sm px-1 text-[9px] font-bold text-indigo-light hover:text-coral'
        >
          پاک
        </button>
      </div>

      <div className='flex items-center gap-1 rounded-sm border border-indigo-ink/20 bg-paper px-1.5 py-1'>
        <span className='pr-0.5 text-[10px] font-bold text-indigo-light'>
          هایلایت
        </span>
        {HIGHLIGHTS.map((swatch) => (
          <button
            key={swatch.value}
            type='button'
            title={`هایلایت: ${swatch.label}`}
            aria-label={`هایلایت ${swatch.label}`}
            onClick={() => chain().toggleHighlight({ color: swatch.value }).run()}
            className={cn(
              "size-4 rounded-full border border-indigo-ink/40 transition-transform hover:scale-110",
              highlight === swatch.value ? "ring-2 ring-coral ring-offset-1" : "",
            )}
            style={{ backgroundColor: swatch.value }}
          />
        ))}
        <button
          type='button'
          onClick={() => chain().unsetHighlight().run()}
          className='rounded-sm px-1 text-[9px] font-bold text-indigo-light hover:text-coral'
        >
          پاک
        </button>
      </div>

      <label className='flex items-center gap-1 rounded-sm border border-indigo-ink/20 bg-paper px-1.5 py-1 text-[10px] font-bold text-indigo-light'>
        اندازه
        <select
          value={fontSize ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            if (value) chain().setFontSize(value).run();
            else chain().unsetFontSize().run();
          }}
          aria-label='اندازهٔ قلم'
          className='rounded-sm border border-indigo-ink/20 bg-paper px-1 py-0.5 text-[10px] font-bold text-indigo-ink'
        >
          {FONT_SIZES.map((size) => (
            <option key={size || "default"} value={size}>
              {size ? size.replace("px", "") : "پیش‌فرض"}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
