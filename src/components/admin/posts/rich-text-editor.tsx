"use client";

import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Color, FontSize, TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Eye, PencilLine } from "lucide-react";
import { EditorToolbar } from "./editor-toolbar";

export type OutlineItem = { level: number; text: string };

function extractOutline(editor: Editor): OutlineItem[] {
  const items: OutlineItem[] = [];
  editor.state.doc.descendants((node) => {
    if (node.type.name === "heading") {
      items.push({
        level: Number(node.attrs.level ?? 2),
        text: node.textContent.trim(),
      });
    }
  });
  return items;
}

export function RichTextEditor({
  value,
  onChange,
  onOutlineChange,
  onReady,
}: {
  value: string;
  onChange: (html: string) => void;
  onOutlineChange?: (items: OutlineItem[]) => void;
  onReady?: (editor: Editor) => void;
}) {
  const [preview, setPreview] = useState(false);

  // Tiptap keeps its own document; callbacks are read through refs so a parent
  // re-render never re-creates the editor or captures a stale handler.
  const onChangeRef = useRef(onChange);
  const onOutlineRef = useRef(onOutlineChange);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onOutlineRef.current = onOutlineChange;
  }, [onOutlineChange]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: false }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: "متن یادداشت را اینجا بنویسید…",
      }),
      CharacterCount,
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: "tiptap",
        dir: "rtl",
        "aria-label": "متن یادداشت",
      },
    },
    onCreate: ({ editor: instance }) => {
      onOutlineRef.current?.(extractOutline(instance));
      onReadyRef.current?.(instance);
    },
    onUpdate: ({ editor: instance }) => {
      onChangeRef.current(instance.getHTML());
      onOutlineRef.current?.(extractOutline(instance));
    },
  });

  useEffect(() => {
    if (editor) onReadyRef.current?.(editor);
  }, [editor]);

  return (
    <div className='flex flex-col gap-2'>
      <div className='sticky top-16 z-20 flex items-center justify-between gap-2'>
        <span className='rounded-sm border border-indigo-ink/25 bg-paper px-2 py-1 font-mono text-[10px] font-bold text-indigo-light'>
          MANUSCRIPT / ویرایشگر مقاله
        </span>
        <button
          type='button'
          onClick={() => setPreview((current) => !current)}
          className='inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-indigo-ink bg-paper px-2.5 py-1 text-[11px] font-black text-indigo-ink transition-colors hover:bg-mustard/30'
        >
          {preview ? (
            <>
              <PencilLine className='size-3.5' />
              بازگشت به ویرایش
            </>
          ) : (
            <>
              <Eye className='size-3.5' />
              پیش‌نمایش متن
            </>
          )}
        </button>
      </div>

      <div className={preview ? "hidden" : "block"}>
        <EditorToolbar editor={editor} />
      </div>

      <div className='rounded-md border-[2px] border-indigo-ink bg-paper-light p-4 shadow-craft sm:p-5'>
        <div className={preview ? "hidden" : "block"}>
          <EditorContent editor={editor} />
        </div>
        {preview ? (
          <div
            className='post-body min-h-64'
            // The admin is the author, and Tiptap has already parsed this HTML
            // through its schema; the saved copy is sanitized server-side.
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : null}
      </div>
    </div>
  );
}
