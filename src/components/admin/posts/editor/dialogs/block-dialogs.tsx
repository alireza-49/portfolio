"use client";

import { useState, type ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import katex from "katex";
import { Frame as FrameIcon, Megaphone, Sigma, Workflow } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BTN_PRIMARY, BTN_SECONDARY, FIELD_CLASS } from "@/components/admin/ui";
import { CodeEditor } from "../code-editor";
import { insertBlock } from "../insert";
import { DemoBlock } from "@/components/editor-blocks/demo-block";
import { MermaidBlock } from "@/components/editor-blocks/mermaid-block";
import {
  embedFromUrl,
  encodePayload,
  validateDemoPayload,
  type DemoPayload,
  type EmbedProvider,
} from "@/lib/richtext";

const NEW_DEMO: DemoPayload = {
  title: "دموی تعاملی",
  html: `<button class="pulse" type="button">مرا بزن</button>
<p class="hint">یک دکمهٔ ساده با انیمیشن و شمارنده.</p>`,
  css: `:root { color-scheme: light; }
body { margin: 0; display: grid; place-items: center; min-height: 240px; font-family: Vazirmatn, sans-serif; background: #fffdf5; color: #264653; }
.pulse { border: 2px solid #264653; background: #e9c46a; color: #264653; border-radius: 10px; padding: 10px 18px; font: inherit; font-weight: 800; cursor: pointer; transition: transform .15s ease, background .15s ease; }
.pulse:hover { transform: translateY(-2px) rotate(-1deg); background: #f4b942; }
.pulse:active { transform: scale(.96); }
.hint { margin-top: 14px; font-size: 13px; color: #3c6373; }`,
  js: `const button = document.querySelector(".pulse");
let count = 0;
button?.addEventListener("click", () => {
  count += 1;
  button.textContent = "کلیک شد: " + count;
});`,
};

function Frame({
  open,
  onClose,
  title,
  icon,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className={wide ? "max-w-6xl" : "max-w-xl"} dir='rtl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-sm font-black text-indigo-ink'>
            {icon}
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function DemoDialog({
  editor,
  open,
  payload,
  pos,
  onClose,
}: {
  editor: Editor;
  open: boolean;
  payload?: DemoPayload;
  pos?: number;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<DemoPayload>(payload ?? NEW_DEMO);
  const [tab, setTab] = useState<"html" | "css" | "js">("html");
  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const valid = validateDemoPayload(draft);
    if (!valid) {
      setError("دمو معتبر نیست: حجم هر بخش باید کمتر از ۵۰ کیلوبایت باشد.");
      return;
    }
    const attrs = { payload: encodePayload(valid), live };
    if (pos !== undefined && editor.state.doc.nodeAt(pos)?.type.name === "demo") {
      editor.chain().focus().setNodeSelection(pos).command(({ tr }) => {
        tr.setNodeMarkup(pos, undefined, attrs);
        return true;
      }).run();
    } else {
      insertBlock(editor, { type: "demo", attrs });
    }
    onClose();
  };

  return (
    <Frame open={open} onClose={onClose} title='دموی تعاملی HTML/CSS/JS' icon={<Workflow className='size-4 text-coral' />} wide>
      <div className='grid gap-3 lg:grid-cols-2'>
        <div className='min-w-0'>
          <div className='mb-2 flex gap-1'>
            {(["html", "css", "js"] as const).map((item) => (
              <button
                key={item}
                type='button'
                onClick={() => setTab(item)}
                className={tab === item ? "rounded-sm bg-coral px-2 py-1 text-[10px] font-black text-paper" : "rounded-sm border border-indigo-ink/20 px-2 py-1 text-[10px] font-bold text-indigo-ink"}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <CodeEditor
            value={draft[tab]}
            onChange={(value) => setDraft((current) => ({ ...current, [tab]: value }))}
            language={tab === "js" ? "javascript" : tab}
            height='180px'
            ariaLabel={`کد ${tab}`}
          />
          <div className='mt-2 flex flex-wrap items-center justify-between gap-2'>
            <label className='flex items-center gap-2 text-[11px] font-bold text-indigo-ink'>
              <input type='checkbox' checked={live} onChange={(event) => setLive(event.target.checked)} />
              اجرای خودکار در صفحهٔ عمومی
            </label>
            <span className='text-[10px] text-indigo-light'>اجرا در iframe جداشده</span>
          </div>
        </div>
        <div className='min-w-0 rounded-md border-[2px] border-indigo-ink/20 bg-paper p-2'>
          <p className='mb-2 text-[10px] font-black text-indigo-light'>پیش‌نمایش زنده</p>
          <DemoBlock payload={draft} autoRun />
        </div>
      </div>
      {error ? <p className='text-[11px] font-bold text-coral-dark'>{error}</p> : null}
      <DialogFooter className='flex justify-end gap-2'>
        <button type='button' className={BTN_SECONDARY} onClick={onClose}>انصراف</button>
        <button type='button' className={BTN_PRIMARY} onClick={save}>ثبت دمو</button>
      </DialogFooter>
    </Frame>
  );
}

export function MermaidDialog({
  editor,
  open,
  code,
  pos,
  onClose,
}: {
  editor: Editor;
  open: boolean;
  code?: string;
  pos?: number;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(code ?? "graph TD\n  A[شروع] --> B{تصمیم}\n  B -->|بله| C[پایان]\n  B -->|نه| D[تلاش دوباره]");
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    if (!draft.trim()) {
      setError("کد نمودار خالی است.");
      return;
    }
    const attrs = { code: encodePayload(draft) };
    if (pos !== undefined && editor.state.doc.nodeAt(pos)?.type.name === "mermaid") {
      editor.chain().focus().setNodeSelection(pos).command(({ tr }) => {
        tr.setNodeMarkup(pos, undefined, attrs);
        return true;
      }).run();
    } else {
      insertBlock(editor, { type: "mermaid", attrs });
    }
    onClose();
  };

  return (
    <Frame open={open} onClose={onClose} title='نمودار Mermaid' icon={<Workflow className='size-4 text-coral' />} wide>
      <div className='grid gap-3 lg:grid-cols-2'>
        <CodeEditor value={draft} onChange={setDraft} language='markdown' height='300px' ariaLabel='کد Mermaid' />
        <div className='max-h-[300px] overflow-auto rounded-md border-[2px] border-indigo-ink/20 bg-paper p-2'>
          <MermaidBlock code={draft} />
        </div>
      </div>
      {error ? <p className='text-[11px] font-bold text-coral-dark'>{error}</p> : null}
      <DialogFooter className='flex justify-end gap-2'>
        <button type='button' className={BTN_SECONDARY} onClick={onClose}>انصراف</button>
        <button type='button' className={BTN_PRIMARY} onClick={save}>ثبت نمودار</button>
      </DialogFooter>
    </Frame>
  );
}

export function EmbedDialog({
  editor,
  open,
  provider,
  src,
  pos,
  onClose,
}: {
  editor: Editor;
  open: boolean;
  provider?: EmbedProvider;
  src?: string;
  pos?: number;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(src ?? "");
  const [error, setError] = useState<string | null>(null);
  const parsed = embedFromUrl(url);
  const current = parsed ?? (provider && src ? { provider, src } : null);

  const save = () => {
    if (!current) {
      setError("فقط نشانی یوتیوب یا ویمئو پشتیبانی می‌شود.");
      return;
    }
    const attrs = current;
    if (pos !== undefined && editor.state.doc.nodeAt(pos)?.type.name === "embed") {
      editor.chain().focus().setNodeSelection(pos).command(({ tr }) => {
        tr.setNodeMarkup(pos, undefined, attrs);
        return true;
      }).run();
    } else {
      insertBlock(editor, { type: "embed", attrs });
    }
    onClose();
  };

  return (
    <Frame open={open} onClose={onClose} title='جاسازی ویدیو' icon={<FrameIcon className='size-4 text-coral' />}>
      <label className='grid gap-1 text-[11px] font-bold text-indigo-ink'>
        نشانی یوتیوب یا ویمئو
        <input
          value={url}
          onChange={(event) => { setUrl(event.target.value); setError(null); }}
          dir='ltr'
          placeholder='https://www.youtube.com/watch?v=…'
          className={FIELD_CLASS}
          autoFocus
        />
      </label>
      {current ? (
        <div className='overflow-hidden rounded-md border-[2px] border-indigo-ink/20 bg-paper-dim'>
          <iframe
            src={current.src}
            title='پیش‌نمایش جاسازی'
            className='aspect-video w-full'
            sandbox='allow-scripts allow-same-origin allow-presentation'
            allow='accelerometer; gyroscope; picture-in-picture; fullscreen'
          />
        </div>
      ) : (
        <p className='text-[11px] text-indigo-light'>برای دیدن پیش‌نمایش، نشانی معتبر وارد کنید.</p>
      )}
      {error ? <p className='text-[11px] font-bold text-coral-dark'>{error}</p> : null}
      <DialogFooter className='flex justify-end gap-2'>
        <button type='button' className={BTN_SECONDARY} onClick={onClose}>انصراف</button>
        <button type='button' className={BTN_PRIMARY} onClick={save} disabled={!current}>ثبت جاسازی</button>
      </DialogFooter>
    </Frame>
  );
}

export function MathDialog({
  editor,
  open,
  latex,
  display,
  pos,
  onClose,
}: {
  editor: Editor;
  open: boolean;
  latex?: string;
  display?: boolean;
  pos?: number;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(latex ?? "");
  const [isDisplay, setIsDisplay] = useState(Boolean(display));
  const [error, setError] = useState<string | null>(null);

  let html = "";
  try {
    html = katex.renderToString(draft, { displayMode: isDisplay, throwOnError: false, strict: "ignore", trust: false });
  } catch {
    html = "";
  }

  const save = () => {
    if (!draft.trim()) {
      setError("فرمول خالی است.");
      return;
    }
    const type = isDisplay ? "mathBlock" : "mathInline";
    const attrs = { latex: draft };
    const node = pos !== undefined ? editor.state.doc.nodeAt(pos) : null;
    if (node && (node.type.name === "mathBlock" || node.type.name === "mathInline")) {
      if (node.type.name === type) {
        editor.chain().focus().setNodeSelection(pos!).command(({ tr }) => {
          tr.setNodeMarkup(pos!, undefined, attrs);
          return true;
        }).run();
      } else {
        editor.chain().focus().deleteRange({ from: pos!, to: pos! + node.nodeSize }).insertContentAt(pos!, { type, attrs }).run();
      }
    } else {
      editor.chain().focus().insertContent({ type, attrs }).run();
    }
    onClose();
  };

  return (
    <Frame open={open} onClose={onClose} title='فرمول ریاضی' icon={<Sigma className='size-4 text-coral' />}>
      <div className='grid gap-3'>
        <label className='grid gap-1 text-[11px] font-bold text-indigo-ink'>
          LaTeX
          <textarea
            value={draft}
            onChange={(event) => { setDraft(event.target.value); setError(null); }}
            dir='ltr'
            rows={4}
            className={FIELD_CLASS}
            placeholder='\frac{a}{b}'
          />
        </label>
        <label className='flex items-center gap-2 text-[11px] font-bold text-indigo-ink'>
          <input type='checkbox' checked={isDisplay} onChange={(event) => setIsDisplay(event.target.checked)} />
          نمایش بلوکی
        </label>
        <div className='min-h-16 overflow-auto rounded-md border border-indigo-ink/20 bg-paper p-3 text-center' dir='ltr'
          dangerouslySetInnerHTML={{ __html: html }} />
        {error ? <p className='text-[11px] font-bold text-coral-dark'>{error}</p> : null}
      </div>
      <DialogFooter className='flex justify-end gap-2'>
        <button type='button' className={BTN_SECONDARY} onClick={onClose}>انصراف</button>
        <button type='button' className={BTN_PRIMARY} onClick={save}>ثبت فرمول</button>
      </DialogFooter>
    </Frame>
  );
}

export function FootnoteDialog({
  editor,
  open,
  note,
  pos,
  onClose,
}: {
  editor: Editor;
  open: boolean;
  note?: string;
  pos?: number;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(note ?? "");
  const save = () => {
    const attrs = { note: draft.trim() };
    if (pos !== undefined && editor.state.doc.nodeAt(pos)?.type.name === "footnote") {
      editor.chain().focus().setNodeSelection(pos).command(({ tr }) => {
        tr.setNodeMarkup(pos, undefined, attrs);
        return true;
      }).run();
    } else {
      editor.chain().focus().insertContent({ type: "footnote", attrs }).run();
    }
    onClose();
  };

  return (
    <Frame open={open} onClose={onClose} title='پانویس' icon={<Megaphone className='size-4 text-coral' />}>
      <label className='grid gap-1 text-[11px] font-bold text-indigo-ink'>
        متن پانویس
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} className={FIELD_CLASS} autoFocus />
      </label>
      <DialogFooter className='flex justify-end gap-2'>
        <button type='button' className={BTN_SECONDARY} onClick={onClose}>انصراف</button>
        <button type='button' className={BTN_PRIMARY} onClick={save} disabled={!draft.trim()}>ثبت پانویس</button>
      </DialogFooter>
    </Frame>
  );
}
