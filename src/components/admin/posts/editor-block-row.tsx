"use client";

import type { Editor } from "@tiptap/react";
import { List, ListChecks, ListOrdered, Quote, SquareCode } from "lucide-react";
import { ToolButton, ToolDivider } from "./editor-format-row";
import type { ToolbarState } from "./editor-toolbar-state";

export function EditorBlockRow({
  editor,
  state,
}: {
  editor: Editor;
  state: ToolbarState;
}) {
  const chain = () => editor.chain().focus();

  return (
    <div className='flex flex-wrap items-center gap-1'>
      <ToolButton
        label='فهرست نقطه‌ای'
        active={state.bullet}
        onClick={() => chain().toggleBulletList().run()}
      >
        <List className='size-3.5' />
      </ToolButton>
      <ToolButton
        label='فهرست شماره‌دار'
        active={state.ordered}
        onClick={() => chain().toggleOrderedList().run()}
      >
        <ListOrdered className='size-3.5' />
      </ToolButton>
      <ToolButton
        label='فهرست وظایف'
        active={state.task}
        onClick={() => chain().toggleTaskList().run()}
      >
        <ListChecks className='size-3.5' />
      </ToolButton>
      <ToolDivider />
      <ToolButton
        label='نقل قول / کالاوت'
        active={state.quote}
        onClick={() => chain().toggleBlockquote().run()}
      >
        <Quote className='size-3.5' />
      </ToolButton>
      <ToolButton
        label='بلوک کد'
        active={state.codeBlock}
        onClick={() => chain().toggleCodeBlock().run()}
      >
        <SquareCode className='size-3.5' />
      </ToolButton>
      <ToolButton
        label='خط جداکننده'
        onClick={() => chain().setHorizontalRule().run()}
      >
        <span className='text-[13px] leading-none font-black'>—</span>
      </ToolButton>
    </div>
  );
}
