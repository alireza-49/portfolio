"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { ImagePlus, Link2, Table2, Trash2, Unlink } from "lucide-react";
import { cn } from "cn";
import { FIELD_CLASS } from "@/components/admin/ui";

/** URL-only media inserts: the deployment is serverless, so there is no upload. */
export function EditorInsertBar({ editor }: { editor: Editor }) {
  const [mode, setMode] = useState<"none" | "link" | "image">("none");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [invalid, setInvalid] = useState(false);

  const close = () => {
    setMode("none");
    setUrl("");
    setAlt("");
    setInvalid(false);
  };

  const open = (next: "link" | "image") => {
    setMode((current) => (current === next ? "none" : next));
    setUrl("");
    setAlt("");
    setInvalid(false);
  };

  const apply = () => {
    const value = url.trim();

    if (mode === "link") {
      if (!value) {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        close();
        return;
      }
      if (!/^(https?:\/\/|mailto:|tel:|\/)/i.test(value)) {
        setInvalid(true);
        return;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: value }).run();
      close();
      return;
    }

    if (!/^(https?:\/\/|\/)/i.test(value)) {
      setInvalid(true);
      return;
    }
    editor.chain().focus().setImage({ src: value, alt: alt.trim() }).run();
    close();
  };

  const icon = "flex size-7 items-center justify-center rounded-sm border border-indigo-ink/20 bg-paper text-indigo-ink transition-colors hover:bg-mustard/30";

  return (
    <div className='flex flex-col gap-1.5'>
      <div className='flex flex-wrap items-center gap-1'>
        <button
          type='button'
          onClick={() => open("link")}
          aria-pressed={mode === "link"}
          aria-label='درج لینک'
          className={cn(icon, mode === "link" && "border-coral bg-coral/15 text-coral")}
        >
          <Link2 className='size-3.5' />
        </button>
        <button
          type='button'
          onClick={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
          aria-label='حذف لینک'
          className={icon}
        >
          <Unlink className='size-3.5' />
        </button>
        <button
          type='button'
          onClick={() => open("image")}
          aria-pressed={mode === "image"}
          aria-label='درج تصویر'
          className={cn(icon, mode === "image" && "border-coral bg-coral/15 text-coral")}
        >
          <ImagePlus className='size-3.5' />
        </button>
        <span className='mx-1 h-5 w-px bg-indigo-ink/20' />
        <button
          type='button'
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          aria-label='درج جدول'
          className={icon}
        >
          <Table2 className='size-3.5' />
        </button>
        {editor.isActive("table") ? (
          <button
            type='button'
            onClick={() => editor.chain().focus().deleteTable().run()}
            aria-label='حذف جدول'
            className='flex size-7 items-center justify-center rounded-sm border border-coral/40 bg-coral/10 text-coral hover:bg-coral/20'
          >
            <Trash2 className='size-3.5' />
          </button>
        ) : null}
      </div>

      {mode !== "none" ? (
        <div className='flex flex-col gap-1.5 rounded-sm border border-indigo-ink/25 bg-paper p-2'>
          <div className='flex flex-col gap-1.5 sm:flex-row sm:items-center'>
            <input
              dir='ltr'
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                setInvalid(false);
              }}
              placeholder={
                mode === "link" ? "https://example.com" : "https://…/cover.jpg"
              }
              aria-label={mode === "link" ? "نشانی لینک" : "نشانی تصویر"}
              className={cn(
                FIELD_CLASS,
                "h-8 flex-1 py-1 text-left font-mono text-xs",
                invalid && "border-coral",
              )}
            />
            {mode === "image" ? (
              <input
                value={alt}
                onChange={(event) => setAlt(event.target.value)}
                placeholder='متن جانشین'
                aria-label='متن جانشین تصویر'
                className={cn(FIELD_CLASS, "h-8 py-1 text-xs sm:w-36")}
              />
            ) : null}
            <div className='flex items-center gap-1'>
              <button
                type='button'
                onClick={apply}
                className='rounded-sm border-[1.5px] border-indigo-ink bg-coral px-2 py-1 text-[11px] font-black text-white'
              >
                {mode === "link" ? "اعمال" : "درج"}
              </button>
              <button
                type='button'
                onClick={close}
                className='rounded-sm border border-indigo-ink/25 bg-paper px-2 py-1 text-[11px] font-bold text-indigo-ink'
              >
                بستن
              </button>
            </div>
          </div>
          {invalid ? (
            <p className='text-[10px] font-bold text-coral'>
              نشانی باید با https:// یا / شروع شود.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
