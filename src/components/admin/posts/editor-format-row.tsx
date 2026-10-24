"use client";

import type { ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Italic,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { cn } from "cn";
import type { ToolbarState } from "./editor-toolbar-state";

export function ToolButton({
  active = false,
  disabled = false,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "flex size-7 items-center justify-center rounded-sm border transition-colors disabled:opacity-40",
        active
          ? "border-coral bg-coral/15 text-coral"
          : "border-indigo-ink/20 bg-paper text-indigo-ink hover:bg-mustard/30",
      )}
    >
      {children}
    </button>
  );
}

export const ToolDivider = () => (
  <span className='mx-1 h-5 w-px bg-indigo-ink/20' />
);

export function EditorFormatRow({
  editor,
  state,
}: {
  editor: Editor;
  state: ToolbarState;
}) {
  const chain = () => editor.chain().focus();
  const block = state.h1 ? "1" : state.h2 ? "2" : state.h3 ? "3" : state.h4 ? "4" : "p";

  return (
    <div className='flex flex-wrap items-center gap-1'>
      <ToolButton
        label='بازگردانی'
        disabled={!state.canUndo}
        onClick={() => chain().undo().run()}
      >
        <Undo2 className='size-3.5' />
      </ToolButton>
      <ToolButton
        label='تکرار'
        disabled={!state.canRedo}
        onClick={() => chain().redo().run()}
      >
        <Redo2 className='size-3.5' />
      </ToolButton>
      <ToolDivider />
      <select
        value={block}
        onChange={(event) => {
          const value = event.target.value;
          if (value === "p") {
            chain().setParagraph().run();
          } else {
            chain()
              .setHeading({ level: Number(value) as 1 | 2 | 3 | 4 })
              .run();
          }
        }}
        aria-label='سطح تیتر'
        className='h-7 rounded-sm border border-indigo-ink/20 bg-paper px-1.5 text-[11px] font-bold text-indigo-ink'
      >
        <option value='p'>پاراگراف</option>
        <option value='1'>تیتر H1</option>
        <option value='2'>تیتر H2</option>
        <option value='3'>تیتر H3</option>
        <option value='4'>تیتر H4</option>
      </select>
      <ToolDivider />
      <ToolButton
        label='ضخیم'
        active={state.bold}
        onClick={() => chain().toggleBold().run()}
      >
        <Bold className='size-3.5' />
      </ToolButton>
      <ToolButton
        label='ایتالیک'
        active={state.italic}
        onClick={() => chain().toggleItalic().run()}
      >
        <Italic className='size-3.5' />
      </ToolButton>
      <ToolButton
        label='زیرخط'
        active={state.underline}
        onClick={() => chain().toggleUnderline().run()}
      >
        <Underline className='size-3.5' />
      </ToolButton>
      <ToolButton
        label='خط‌خورده'
        active={state.strike}
        onClick={() => chain().toggleStrike().run()}
      >
        <Strikethrough className='size-3.5' />
      </ToolButton>
      <ToolButton
        label='کد درون‌خطی'
        active={state.code}
        onClick={() => chain().toggleCode().run()}
      >
        <Code className='size-3.5' />
      </ToolButton>
      <ToolDivider />
      <ToolButton
        label='راست‌چین'
        active={state.alignRight}
        onClick={() => chain().setTextAlign("right").run()}
      >
        <AlignRight className='size-3.5' />
      </ToolButton>
      <ToolButton
        label='وسط‌چین'
        active={state.alignCenter}
        onClick={() => chain().setTextAlign("center").run()}
      >
        <AlignCenter className='size-3.5' />
      </ToolButton>
      <ToolButton
        label='چپ‌چین'
        active={state.alignLeft}
        onClick={() => chain().setTextAlign("left").run()}
      >
        <AlignLeft className='size-3.5' />
      </ToolButton>
      <ToolButton
        label='تراز دوطرفه'
        active={state.alignJustify}
        onClick={() => chain().setTextAlign("justify").run()}
      >
        <AlignJustify className='size-3.5' />
      </ToolButton>
    </div>
  );
}
