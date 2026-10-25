"use client";

import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { faNumber } from "@/lib/fa";
import { EditorBlockRow } from "./editor-block-row";
import { EditorFormatRow } from "./editor-format-row";
import { EditorInsertBar } from "./editor-insert-bar";
import { EditorPalettes } from "./editor-palettes";
import { selectToolbarState } from "./editor-toolbar-state";

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) =>
      instance ? selectToolbarState(instance) : null,
  });

  if (!editor || !state) {
    return (
      <div className='rounded-sm border border-indigo-ink/20 bg-paper px-3 py-2 text-[11px] font-bold text-indigo-light'>
        ویرایشگر در حال آماده‌سازی است…
      </div>
    );
  }

  const words = state.text.trim() ? state.text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 220));

  return (
    <div className='flex flex-col gap-2 rounded-md border-[2px] border-indigo-ink bg-paper-dim p-2 shadow-craft-sm'>
      <EditorFormatRow editor={editor} state={state} />
      <EditorBlockRow editor={editor} state={state} />
      <EditorPalettes
        editor={editor}
        color={state.color}
        fontSize={state.fontSize}
        highlight={state.highlight}
      />
      <EditorInsertBar editor={editor} />
      <div className='flex flex-wrap items-center justify-between gap-2 border-t border-indigo-ink/15 pt-1.5 text-[10px] font-bold text-indigo-light'>
        <span>
          {faNumber(words)} کلمه • {faNumber(state.text.length)} کاراکتر
        </span>
        <span>زمان مطالعهٔ تقریبی: {faNumber(minutes)} دقیقه</span>
      </div>
    </div>
  );
}
