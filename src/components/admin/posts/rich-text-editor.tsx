"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import {
  Code2,
  Eye,
  FileCode2,
  Focus,
  Minimize2,
  PenLine,
  X,
} from "lucide-react";
import { cn } from "cn";
import { faNumber, readingMinutes } from "@/lib/fa";
import { auditPost } from "@/lib/post-audit";
import type { PostIssue } from "@/lib/types";
import type { EditorActions } from "./editor/editor-context";
import { EditorActionsContext } from "./editor/editor-context";
import { editorExtensions } from "./editor/extensions";
import { EditorToolbar } from "./editor/toolbar";
import { CodeEditor } from "./editor/code-editor";
import { EditorDialogs } from "./editor/dialogs";
import { insertBlock } from "./editor/insert";
import type { EditorDialog } from "./editor/dialog-types";

const subscribeNothing = () => () => {};

export type OutlineItem = { level: number; text: string };

type Mode = "visual" | "markdown" | "html";

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

function getMarkdown(editor: Editor): string {
  try {
    return typeof editor.getMarkdown === "function" ? editor.getMarkdown() : "";
  } catch {
    return "";
  }
}

export function RichTextEditor({
  value,
  onChange,
  onOutlineChange,
  onReady,
  onRequestSave,
  onExport,
  onAuditChange,
  className,
}: {
  value: string;
  onChange: (html: string) => void;
  onOutlineChange?: (items: OutlineItem[]) => void;
  onReady?: (editor: Editor) => void;
  onRequestSave?: () => void;
  onExport?: (markdown: string) => void;
  onAuditChange?: (issues: PostIssue[]) => void;
  className?: string;
}) {
  const [mode, setMode] = useState<Mode>("visual");
  const [source, setSource] = useState("");
  const [sourceDirty, setSourceDirty] = useState(false);
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewing, setPreviewing] = useState(false);
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const [focus, setFocus] = useState(false);
  const [dialog, setDialog] = useState<EditorDialog>(null);
  const emitted = useRef(value);
  const previewEditor = useRef<Editor | null>(null);
  const onChangeRef = useRef(onChange);
  const outlineRef = useRef(onOutlineChange);
  const readyRef = useRef(onReady);
  const saveRef = useRef(onRequestSave);
  const auditRef = useRef(onAuditChange);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { outlineRef.current = onOutlineChange; }, [onOutlineChange]);
  useEffect(() => { readyRef.current = onReady; }, [onReady]);
  useEffect(() => { saveRef.current = onRequestSave; }, [onRequestSave]);
  useEffect(() => { auditRef.current = onAuditChange; }, [onAuditChange]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: "tiptap",
        dir: "rtl",
        "aria-label": "متن یادداشت",
      },
    },
    onCreate: ({ editor: instance }) => {
      emitted.current = instance.getHTML();
      outlineRef.current?.(extractOutline(instance));
      auditRef.current?.(auditPost(instance.getJSON()));
      readyRef.current?.(instance);
    },
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML();
      emitted.current = html;
      onChangeRef.current(html);
      outlineRef.current?.(extractOutline(instance));
      auditRef.current?.(auditPost(instance.getJSON()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value === emitted.current) return;
    if (editor.isFocused) return;
    editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    emitted.current = value;
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    const instance = new Editor({ extensions: editorExtensions, editable: false, content: "<p></p>" });
    previewEditor.current = instance;
    return () => {
      instance.destroy();
      previewEditor.current = null;
    };
  }, [editor]);

  useEffect(() => {
    if (mode === "visual" || !previewEditor.current) return;
    const timer = window.setTimeout(() => {
      try {
        previewEditor.current?.commands.setContent(source, {
          contentType: mode === "markdown" ? "markdown" : "html",
          emitUpdate: false,
        });
        setPreviewHtml(previewEditor.current?.getHTML() ?? "");
      } catch {
        setPreviewHtml("<p class='editor-source-error'>پیش‌نمایش این محتوا ممکن نیست.</p>");
      }
    }, 320);
    return () => window.clearTimeout(timer);
  }, [mode, source]);

  const applySource = useCallback((): boolean => {
    if (!editor) return false;
    try {
      editor.commands.setContent(source, {
        contentType: mode === "markdown" ? "markdown" : "html",
        emitUpdate: true,
      });
      setSourceDirty(false);
      setSourceError(null);
      return true;
    } catch {
      setSourceError("تبدیل منبع ناموفق بود؛ ساختار Markdown/HTML را بررسی کنید.");
      return false;
    }
  }, [editor, mode, source]);

  const switchMode = useCallback(
    (next: Mode) => {
      if (!editor || next === mode) return;
      if (mode !== "visual" && sourceDirty) {
        if (!window.confirm("تغییرات حالت منبع اعمال شود؟")) return;
        if (!applySource()) return;
      }
      if (next === "visual") {
        setMode("visual");
        return;
      }
      setSource(next === "markdown" ? getMarkdown(editor) : editor.getHTML());
      setSourceDirty(false);
      setSourceError(null);
      setMode(next);
    },
    [applySource, editor, mode, sourceDirty],
  );

  const actions = useMemo<EditorActions>(() => ({
    openMedia: (kind, pos) => setDialog({ kind: "media", mediaKind: kind ?? "all", pos }),
    openDemo: (payload, pos) => setDialog({ kind: "demo", payload, pos }),
    openNotebook: (payload, pos) => setDialog({ kind: "notebook", payload, pos }),
    openMermaid: (code, pos) => setDialog({ kind: "mermaid", code, pos }),
    openEmbed: (provider, src, pos) => setDialog({ kind: "embed", provider, src, pos }),
    openMath: (latex, display, pos) => setDialog({ kind: "math", latex, display, pos }),
    openFootnote: (note, pos) => setDialog({ kind: "footnote", note, pos }),
    openCallout: () => {
      if (!editor) return;
      insertBlock(editor, {
        type: "callout",
        attrs: { variant: "note", title: "" },
        content: [{ type: "paragraph" }],
      });
    },
    openCode: (pos) => setDialog({ kind: "code", pos }),
    openLink: () => setDialog({ kind: "link" }),
    openFind: () => setDialog({ kind: "find" }),
  }), [editor]);

  const text = editor
    ? editor.state.doc.textBetween(0, editor.state.doc.content.size, " ", " ")
    : "";
  const counts = {
    characters: text.length,
    words: text.trim() ? text.trim().split(/\s+/u).length : 0,
  };

  useEffect(() => {
    if (!editor) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveRef.current?.();
      }
      if (mod && event.key.toLowerCase() === "f") {
        event.preventDefault();
        setDialog({ kind: "find" });
      }
      if (event.key === "Escape" && focus) {
        setFocus(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editor, focus]);

  useEffect(() => {
    if (!focus) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [focus]);

  if (!mounted || !editor) {
    return <div className='post-editor min-h-96 animate-pulse rounded-sm border border-indigo-ink/15 bg-paper-dim' />;
  }

  return (
    <EditorActionsContext.Provider value={actions}>
      <div className={cn("post-editor", className)} data-focus={focus ? "true" : "false"}>
        <div className='editor-topbar'>
          <div className='editor-mode-tabs' role='tablist' aria-label='حالت ویرایش'>
            <button type='button' role='tab' aria-selected={mode === "visual"} onClick={() => switchMode("visual")} className={cn("editor-mode-tab", mode === "visual" && "is-active")}>
              <PenLine className='size-3.5' />
              ویرایش
            </button>
            <button type='button' role='tab' aria-selected={mode === "markdown"} onClick={() => switchMode("markdown")} className={cn("editor-mode-tab", mode === "markdown" && "is-active")}>
              <FileCode2 className='size-3.5' />
              Markdown
            </button>
            <button type='button' role='tab' aria-selected={mode === "html"} onClick={() => switchMode("html")} className={cn("editor-mode-tab", mode === "html" && "is-active")}>
              <Code2 className='size-3.5' />
              HTML
            </button>
          </div>
          <div className='editor-topbar-actions'>
            {onExport ? (
              <button type='button' onClick={() => onExport(getMarkdown(editor))} className='editor-icon-btn' title='خروجی Markdown'>
                <FileCode2 className='size-3.5' />
                خروجی
              </button>
            ) : null}
            <button type='button' onClick={() => setPreviewing(true)} className='editor-icon-btn' title='پیش‌نمایش'>
              <Eye className='size-3.5' />
            </button>
            <button type='button' onClick={() => setFocus((current) => !current)} className='editor-icon-btn' title={focus ? "خروج از تمرکز" : "حالت تمرکز"}>
              {focus ? <Minimize2 className='size-3.5' /> : <Focus className='size-3.5' />}
            </button>
          </div>
        </div>

        {mode === "visual" ? (
          <>
            <EditorToolbar editor={editor} />
            <div className='editor-canvas'>
              <EditorContent editor={editor} />
            </div>
          </>
        ) : (
          <div className='editor-source'>
            <div className='editor-source-bar'>
              <span className='editor-source-title'>{mode === "markdown" ? "منبع Markdown" : "منبع HTML"}</span>
              <span className='editor-source-note'>
                {mode === "markdown" ? "Markdown برای بلوک‌های تعاملی از HTML استفاده می‌کند." : "HTML ذخیره و پاک‌سازی می‌شود."}
              </span>
              <button type='button' onClick={applySource} disabled={!sourceDirty} className={cn("editor-apply-btn", sourceDirty && "is-dirty")}>
                اعمال در ویرایشگر
              </button>
            </div>
            <div className='editor-source-grid'>
              <CodeEditor
                value={source}
                onChange={(next) => { setSource(next); setSourceDirty(true); }}
                language={mode === "markdown" ? "markdown" : "html"}
                height='55vh'
                ariaLabel={`ویرایشگر ${mode}`}
              />
              <div className='post-body editor-source-preview' aria-label='پیش‌نمایش منبع'>
                {previewHtml ? <div dangerouslySetInnerHTML={{ __html: previewHtml }} /> : <p className='editor-source-empty'>پیش‌نمایش اینجا نمایش داده می‌شود.</p>}
              </div>
            </div>
            {sourceError ? <p className='editor-source-error' role='alert'>{sourceError}</p> : null}
          </div>
        )}

        <div className='editor-statusbar'>
          <span>{faNumber(counts.words)} واژه</span>
          <span>{faNumber(counts.characters)} نویسه</span>
          <span>{faNumber(readingMinutes(text))} دقیقه مطالعه</span>
          <span className='editor-status-hint'>Ctrl+S ذخیره · Ctrl+F جست‌وجو</span>
        </div>

        {dialog ? <EditorDialogs editor={editor} dialog={dialog} onClose={() => setDialog(null)} /> : null}

        {previewing ? (
          <div className='editor-preview-overlay' role='dialog' aria-modal='true' aria-label='پیش‌نمایش مقاله'>
            <div className='editor-preview-head'>
              <span>پیش‌نمایش</span>
              <button type='button' className='editor-icon-btn' onClick={() => setPreviewing(false)} aria-label='بستن'>
                <X className='size-4' />
              </button>
            </div>
            <div className='editor-preview-body'>
              <div className='post-body tiptap' dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
            </div>
          </div>
        ) : null}
      </div>
    </EditorActionsContext.Provider>
  );
}
