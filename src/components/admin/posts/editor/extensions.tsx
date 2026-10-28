"use client";

import { Extension, Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Color, FontFamily, FontSize, LineHeight, TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Markdown } from "@tiptap/markdown";
import { common, createLowlight } from "lowlight";
import { search } from "prosemirror-search";
import katex from "katex";
import { Trash2, PencilLine, Play, FileText, ExternalLink } from "lucide-react";
import { cn } from "cn";
import { decodePayload, type DemoPayload, type NotebookPayload } from "@/lib/richtext";
import { formatBytes, MEDIA_KIND_LABELS } from "@/lib/media-url";
import { DemoBlock } from "@/components/editor-blocks/demo-block";
import { useEditorActions } from "./editor-context";

const lowlight = createLowlight(common);

const Search = Extension.create({
  name: "search",
  addProseMirrorPlugins() {
    return [search()];
  },
});

function escapeAttr(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function nodePos(getPos: NodeViewProps["getPos"]): number | undefined {
  try {
    return typeof getPos === "function" ? getPos() : undefined;
  } catch {
    return undefined;
  }
}

function EditDelete({
  onEdit,
  onDelete,
  editLabel = "ویرایش",
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
}) {
  return (
    <span className='cc-node-actions' contentEditable={false}>
      {onEdit ? (
        <button type='button' className='cc-node-btn' onClick={onEdit}>
          <PencilLine className='size-3.5' /> {editLabel}
        </button>
      ) : null}
      {onDelete ? (
        <button type='button' className='cc-node-btn cc-node-btn-danger' onClick={onDelete} aria-label='حذف'>
          <Trash2 className='size-3.5' />
        </button>
      ) : null}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Direction and tables                          */
/* -------------------------------------------------------------------------- */

const Direction = Extension.create({
  name: "direction",
  addGlobalAttributes() {
    return [
      {
        types: ["heading", "paragraph", "blockquote", "listItem", "tableCell", "tableHeader"],
        attributes: {
          dir: {
            default: null,
            parseHTML: (element) => element.getAttribute("dir"),
            renderHTML: (attributes) =>
              attributes.dir ? { dir: attributes.dir } : {},
          },
        },
      },
    ];
  },
});

const TableExtras = Extension.create({
  name: "tableExtras",
  addGlobalAttributes() {
    return [
      {
        types: ["table"],
        attributes: {
          tableStyle: {
            default: null,
            parseHTML: (element) => element.getAttribute("data-table-style"),
            renderHTML: (attributes) =>
              attributes.tableStyle
                ? { "data-table-style": attributes.tableStyle }
                : {},
          },
        },
      },
      {
        types: ["tableCell", "tableHeader"],
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) => element.style.backgroundColor || null,
            renderHTML: (attributes) =>
              attributes.backgroundColor
                ? { style: `background-color:${attributes.backgroundColor}` }
                : {},
          },
          verticalAlign: {
            default: null,
            parseHTML: (element) => element.style.verticalAlign || null,
            renderHTML: (attributes) =>
              attributes.verticalAlign
                ? { style: `vertical-align:${attributes.verticalAlign}` }
                : {},
          },
          cellAlign: {
            default: null,
            parseHTML: (element) => element.style.textAlign || null,
            renderHTML: (attributes) =>
              attributes.cellAlign
                ? { style: `text-align:${attributes.cellAlign}` }
                : {},
          },
        },
      },
    ];
  },
});

/* -------------------------------------------------------------------------- */
/*                                    Media                                   */
/* -------------------------------------------------------------------------- */

function VideoView({ node, deleteNode, getPos }: NodeViewProps) {
  const actions = useEditorActions();
  return (
    <NodeViewWrapper className='cc-media-block' data-kind='video' contentEditable={false}>
      <video src={node.attrs?.src} poster={node.attrs?.poster || undefined} controls preload='metadata' />
      {node.attrs?.caption ? <p className='cc-media-caption'>{node.attrs?.caption}</p> : null}
      <EditDelete
        onEdit={() => actions.openMedia("video", nodePos(getPos))}
        onDelete={() => deleteNode()}
      />
    </NodeViewWrapper>
  );
}

function AudioView({ node, deleteNode, getPos }: NodeViewProps) {
  const actions = useEditorActions();
  return (
    <NodeViewWrapper className='cc-media-block' data-kind='audio' contentEditable={false}>
      <audio src={node.attrs?.src} controls preload='metadata' />
      {node.attrs?.caption ? <p className='cc-media-caption'>{node.attrs?.caption}</p> : null}
      <EditDelete
        onEdit={() => actions.openMedia("audio", nodePos(getPos))}
        onDelete={() => deleteNode()}
      />
    </NodeViewWrapper>
  );
}

function FileView({ node, deleteNode, getPos }: NodeViewProps) {
  const actions = useEditorActions();
  const kind = (node.attrs?.kind || "file") as keyof typeof MEDIA_KIND_LABELS;
  return (
    <NodeViewWrapper className='cc-file-card' contentEditable={false}>
      <FileText className='size-6 shrink-0 text-coral' />
      <span className='cc-file-meta'>
        <a href={node.attrs?.src} target='_blank' rel='noopener noreferrer'>
          {node.attrs?.name || "فایل"}
        </a>
        <span>
          {MEDIA_KIND_LABELS[kind] ?? "فایل"}
          {node.attrs?.size ? ` • ${formatBytes(Number(node.attrs?.size))}` : ""}
        </span>
      </span>
      <a
        href={node.attrs?.src}
        target='_blank'
        rel='noopener noreferrer'
        className='cc-node-btn'
        aria-label='باز کردن فایل'
      >
        <ExternalLink className='size-3.5' />
      </a>
      <EditDelete
        onEdit={() => actions.openMedia(kind === "file" ? "file" : kind, nodePos(getPos))}
        onDelete={() => deleteNode()}
      />
    </NodeViewWrapper>
  );
}

function EmbedView({ node, deleteNode, getPos }: NodeViewProps) {
  const actions = useEditorActions();
  return (
    <NodeViewWrapper className='cc-embed' contentEditable={false}>
      <iframe
        src={node.attrs?.src}
        title='ویدیوی جاسازی‌شده'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
        referrerPolicy='no-referrer'
      />
      <EditDelete
        onEdit={() => actions.openEmbed(node.attrs?.provider, node.attrs?.src, nodePos(getPos))}
        onDelete={() => deleteNode()}
      />
    </NodeViewWrapper>
  );
}

const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      src: { default: null },
      assetId: { default: null },
      poster: { default: null },
      caption: { default: null },
    };
  },
  parseHTML() {
    return [
      {
        tag: "figure[data-kind='video']",
        getAttrs: (element) => {
          const video = element.querySelector("video");
          return {
            src: video?.getAttribute("src") ?? null,
            poster: video?.getAttribute("poster") ?? null,
            caption: element.querySelector("figcaption")?.textContent ?? null,
            assetId: element.getAttribute("data-asset-id"),
          };
        },
      },
      { tag: "video[src]" },
    ];
  },
  renderHTML({ node }) {
    return [
      "figure",
      { class: "post-media", "data-kind": "video", "data-asset-id": node.attrs?.assetId ?? undefined },
      [
        "video",
        mergeAttributes({
          src: node.attrs?.src,
          poster: node.attrs?.poster || undefined,
          controls: "",
          preload: "metadata",
        }),
      ],
      node.attrs?.caption ? ["figcaption", {}, node.attrs?.caption] : ["figcaption", {}],
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(VideoView);
  },
  renderMarkdown: (node) =>
    `<figure data-kind="video"><video src="${escapeAttr(node.attrs?.src)}" controls></video>${node.attrs?.caption ? `<figcaption>${escapeAttr(node.attrs?.caption)}</figcaption>` : ""}</figure>`,
});

const Audio = Node.create({
  name: "audio",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return { src: { default: null }, assetId: { default: null }, caption: { default: null } };
  },
  parseHTML() {
    return [
      {
        tag: "figure[data-kind='audio']",
        getAttrs: (element) => {
          const audio = element.querySelector("audio");
          return {
            src: audio?.getAttribute("src") ?? null,
            caption: element.querySelector("figcaption")?.textContent ?? null,
            assetId: element.getAttribute("data-asset-id"),
          };
        },
      },
      { tag: "audio[src]" },
    ];
  },
  renderHTML({ node }) {
    return [
      "figure",
      { class: "post-media", "data-kind": "audio", "data-asset-id": node.attrs?.assetId ?? undefined },
      ["audio", mergeAttributes({ src: node.attrs?.src, controls: "", preload: "metadata" })],
      node.attrs?.caption ? ["figcaption", {}, node.attrs?.caption] : ["figcaption", {}],
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(AudioView);
  },
  renderMarkdown: (node) =>
    `<figure data-kind="audio"><audio src="${escapeAttr(node.attrs?.src)}" controls></audio></figure>`,
});

const FileAttachment = Node.create({
  name: "fileAttachment",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      src: { default: null },
      assetId: { default: null },
      name: { default: null },
      mime: { default: null },
      size: { default: 0 },
      kind: { default: "file" },
    };
  },
  parseHTML() {
    return [
      {
        tag: "figure[data-file]",
        getAttrs: (element) => {
          const anchor = element.querySelector("a");
          return {
            src: anchor?.getAttribute("href") ?? null,
            name: anchor?.getAttribute("download") || anchor?.textContent?.replace(/\s*—\s*دانلود$/, "") || null,
            kind: element.getAttribute("data-kind") || "file",
            assetId: element.getAttribute("data-asset-id"),
          };
        },
      },
    ];
  },
  renderHTML({ node }) {
    const name = node.attrs?.name || "فایل";
    return [
      "figure",
      {
        "data-file": "file",
        "data-kind": node.attrs?.kind,
        "data-asset-id": node.attrs?.assetId ?? undefined,
        class: "post-file",
      },
      ["a", { href: node.attrs?.src, download: name, rel: "noopener noreferrer" }, `${name} — دانلود`],
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(FileView);
  },
  renderMarkdown: (node) =>
    `<figure data-file="file" data-kind="${escapeAttr(node.attrs?.kind)}"><a href="${escapeAttr(node.attrs?.src)}" download="${escapeAttr(node.attrs?.name)}">${escapeAttr(node.attrs?.name || "فایل")}</a></figure>`,
});

const Embed = Node.create({
  name: "embed",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return { provider: { default: "youtube" }, src: { default: null } };
  },
  parseHTML() {
    return [
      {
        tag: "div[data-embed]",
        getAttrs: (element) => ({
          provider: element.getAttribute("data-embed") || "youtube",
          src: element.getAttribute("data-src"),
        }),
      },
    ];
  },
  renderHTML({ node }) {
    return [
      "div",
      { "data-embed": node.attrs?.provider, "data-src": node.attrs?.src, class: "post-embed" },
      ["a", { href: node.attrs?.src, target: "_blank", rel: "noopener noreferrer" }, "تماشا در سرویس اصلی"],
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(EmbedView);
  },
  renderMarkdown: (node) =>
    `<div data-embed="${escapeAttr(node.attrs?.provider)}" data-src="${escapeAttr(node.attrs?.src)}"></div>`,
});

/* -------------------------------------------------------------------------- */
/*                              Interactive blocks                            */
/* -------------------------------------------------------------------------- */

function DemoView({ node, deleteNode, getPos }: NodeViewProps) {
  const actions = useEditorActions();
  const payload = decodePayload<DemoPayload>(node.attrs?.payload);
  const ok = Boolean(payload && typeof payload.html === "string");
  return (
    <NodeViewWrapper className='cc-demo-shell' contentEditable={false}>
      {ok ? (
        <DemoBlock payload={payload as DemoPayload} onEdit={() => actions.openDemo(payload as DemoPayload, nodePos(getPos))} />
      ) : (
        <p className='cc-invalid'>این بلوک دمو معتبر نیست.</p>
      )}
      <EditDelete onDelete={() => deleteNode()} />
    </NodeViewWrapper>
  );
}

function NotebookView({ node, deleteNode, getPos }: NodeViewProps) {
  const actions = useEditorActions();
  const payload = decodePayload<NotebookPayload>(node.attrs?.payload);
  const cells = payload?.cells?.length ?? 0;
  return (
    <NodeViewWrapper className='cc-notebook-shell' contentEditable={false}>
      <div className='cc-notebook-summary'>
        <span className='cc-notebook-title'>نوت‌بوک پایتون</span>
        <span className='text-[0.6875rem] text-indigo-light'>{cells} سلول • اجرا در مرورگر</span>
        <div className='flex items-center gap-1.5'>
          <button type='button' className='cc-demo-btn cc-demo-btn-primary' onClick={() => actions.openNotebook(payload ?? undefined, nodePos(getPos))}>
            <Play className='size-3.5' /> باز کردن
          </button>
          <button type='button' className='cc-demo-btn' onClick={() => deleteNode()} aria-label='حذف'>
            <Trash2 className='size-3.5' />
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

const Demo = Node.create({
  name: "demo",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return { payload: { default: null }, live: { default: true } };
  },
  parseHTML() {
    return [
      {
        tag: "div[data-demo]",
        getAttrs: (element) => ({
          payload: element.getAttribute("data-demo"),
          live: element.getAttribute("data-live") !== "false",
        }),
      },
    ];
  },
  renderHTML({ node }) {
    return [
      "div",
      { "data-demo": node.attrs?.payload, "data-live": node.attrs?.live ? "true" : "false", class: "post-demo" },
      ["p", {}, "دموی تعاملی"],
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(DemoView);
  },
  renderMarkdown: (node) =>
    `<div data-demo="${node.attrs?.payload}" data-live="${node.attrs?.live ? "true" : "false"}"></div>`,
});

const Notebook = Node.create({
  name: "notebook",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return { payload: { default: null } };
  },
  parseHTML() {
    return [
      {
        tag: "div[data-notebook]",
        getAttrs: (element) => ({ payload: element.getAttribute("data-notebook") }),
      },
    ];
  },
  renderHTML({ node }) {
    return ["div", { "data-notebook": node.attrs?.payload, class: "post-notebook" }, ["p", {}, "نوت‌بوک پایتون"]];
  },
  addNodeView() {
    return ReactNodeViewRenderer(NotebookView);
  },
  renderMarkdown: (node) => `<div data-notebook="${node.attrs?.payload}"></div>`,
});

function MermaidView({ node, deleteNode, getPos }: NodeViewProps) {
  const actions = useEditorActions();
  const code = decodePayload<string>(node.attrs?.code) ?? "";
  return (
    <NodeViewWrapper className='cc-mermaid' contentEditable={false}>
      <div className='cc-mermaid-head'>
        <span>نمودار Mermaid</span>
        <div className='flex items-center gap-1.5'>
          <button type='button' className='cc-node-btn' onClick={() => actions.openMermaid(code, nodePos(getPos))}>ویرایش</button>
          <button type='button' className='cc-node-btn cc-node-btn-danger' onClick={() => deleteNode()} aria-label='حذف'><Trash2 className='size-3.5' /></button>
        </div>
      </div>
      <pre dir='ltr' className='cc-mermaid-code'>{code || "بدون کد"}</pre>
    </NodeViewWrapper>
  );
}

const Mermaid = Node.create({
  name: "mermaid",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return { code: { default: null } };
  },
  parseHTML() {
    return [
      {
        tag: "div[data-mermaid]",
        getAttrs: (element) => ({ code: element.getAttribute("data-mermaid") }),
      },
    ];
  },
  renderHTML({ node }) {
    return ["div", { "data-mermaid": node.attrs?.code, class: "post-mermaid" }, ["pre", {}, decodePayload<string>(node.attrs?.code) ?? ""]];
  },
  addNodeView() {
    return ReactNodeViewRenderer(MermaidView);
  },
  renderMarkdown: (node) => `<div data-mermaid="${node.attrs?.code}"></div>`,
});

/* -------------------------------------------------------------------------- */
/*                         Callouts, footnotes and math                         */
/* -------------------------------------------------------------------------- */

function CalloutView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const variant = String(node.attrs?.variant || "note");
  return (
    <NodeViewWrapper className={cn("cc-callout", `cc-callout-${variant}`)} data-callout={variant}>
      <div className='cc-callout-head' contentEditable={false}>
        <select
          value={variant}
          onChange={(event) => updateAttributes({ variant: event.target.value })}
          aria-label='نوع کالاوت'
          className='cc-callout-select'
        >
          <option value='note'>یادداشت</option>
          <option value='info'>اطلاعات</option>
          <option value='tip'>نکته</option>
          <option value='warning'>هشدار</option>
          <option value='danger'>خطر</option>
        </select>
        <input
          value={String(node.attrs?.title || "")}
          onChange={(event) => updateAttributes({ title: event.target.value })}
          placeholder='عنوان کالاوت (اختیاری)'
          aria-label='عنوان کالاوت'
          className='cc-callout-title-input'
        />
        <button type='button' className='cc-node-btn cc-node-btn-danger' onClick={() => deleteNode()} aria-label='حذف کالاوت'>
          <Trash2 className='size-3.5' />
        </button>
      </div>
      <NodeViewContent className='cc-callout-body' />
    </NodeViewWrapper>
  );
}

const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      variant: { default: "note" },
      title: { default: "" },
    };
  },
  parseHTML() {
    return [
      {
        tag: "div[data-callout]",
        contentElement: (element: HTMLElement) => element.querySelector("[data-callout-body]") ?? element,
        getAttrs: (element) => ({
          variant: element.getAttribute("data-callout") || "note",
          title:
            element.getAttribute("data-callout-title") ||
            element.querySelector("[data-callout-title]")?.textContent ||
            "",
        }),
      },
    ];
  },
  renderHTML({ node }) {
    return [
      "div",
      {
        "data-callout": node.attrs?.variant,
        "data-callout-title": node.attrs?.title || "",
        class: "post-callout",
      },
      ["p", { "data-callout-title": "" }, node.attrs?.title || ""],
      ["div", { "data-callout-body": "" }, 0],
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(CalloutView);
  },
  renderMarkdown: (node, helpers) =>
    `<div data-callout="${escapeAttr(node.attrs?.variant)}" data-callout-title="${escapeAttr(node.attrs?.title)}"><div data-callout-body>\n\n${helpers.renderChildren(node.content ?? [])}\n\n</div></div>`,
});

function FootnoteView({ node, getPos }: NodeViewProps) {
  const actions = useEditorActions();
  return (
    <NodeViewWrapper as='sup' className='cc-footnote' data-footnote={node.attrs?.note} contentEditable={false}>
      <button type='button' className='cc-footnote-btn' onClick={() => actions.openFootnote(String(node.attrs?.note || ""), nodePos(getPos))} aria-label='ویرایش پانویس'>
        {String(node.attrs?.note || "").trim() ? "پانویس" : "پانویس خالی"}
      </button>
    </NodeViewWrapper>
  );
}

const Footnote = Node.create({
  name: "footnote",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  addAttributes() {
    return { note: { default: "" } };
  },
  parseHTML() {
    return [
      {
        tag: "sup[data-footnote]",
        getAttrs: (element) => ({ note: element.getAttribute("data-footnote") ?? "" }),
      },
    ];
  },
  renderHTML({ node }) {
    return ["sup", { "data-footnote": node.attrs?.note }, "[پانویس]"];
  },
  addNodeView() {
    return ReactNodeViewRenderer(FootnoteView);
  },
  renderMarkdown: (node) => `<sup data-footnote="${escapeAttr(node.attrs?.note)}"></sup>`,
});

function MathView({ node, getPos, deleteNode }: NodeViewProps) {
  const actions = useEditorActions();
  const display = node.type.name === "mathBlock";
  const latex = String(node.attrs?.latex || "");
  let html = "";
  try {
    html = katex.renderToString(latex, { displayMode: display, throwOnError: false, strict: "ignore", trust: false });
  } catch {
    html = "";
  }
  return (
    <NodeViewWrapper as={display ? "div" : "span"} className={display ? "cc-math-block" : "cc-math-inline"} contentEditable={false}>
      {html ? (
        <span dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <code>{latex || "فرمول خالی"}</code>
      )}
      <button type='button' className='cc-node-btn' onClick={() => actions.openMath(latex, display, nodePos(getPos))} aria-label='ویرایش فرمول'>
        ویرایش
      </button>
      {display ? (
        <button type='button' className='cc-node-btn cc-node-btn-danger' onClick={() => deleteNode()} aria-label='حذف فرمول'>
          <Trash2 className='size-3.5' />
        </button>
      ) : null}
    </NodeViewWrapper>
  );
}

const mathAttrs = { latex: { default: "" } };

const MathInline = Node.create({
  name: "mathInline",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  addAttributes() {
    return mathAttrs;
  },
  parseHTML() {
    return [
      {
        tag: "span[data-math='inline']",
        getAttrs: (element) => ({ latex: element.getAttribute("data-tex") ?? "" }),
      },
    ];
  },
  renderHTML({ node }) {
    return ["span", { "data-math": "inline", "data-tex": node.attrs?.latex }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(MathView);
  },
  renderMarkdown: (node) => `<span data-math="inline" data-tex="${escapeAttr(node.attrs?.latex)}"></span>`,
});

const MathBlock = Node.create({
  name: "mathBlock",
  group: "block",
  atom: true,
  selectable: true,
  addAttributes() {
    return mathAttrs;
  },
  parseHTML() {
    return [
      {
        tag: "div[data-math='block']",
        getAttrs: (element) => ({ latex: element.getAttribute("data-tex") ?? "" }),
      },
    ];
  },
  renderHTML({ node }) {
    return ["div", { "data-math": "block", "data-tex": node.attrs?.latex }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(MathView);
  },
  renderMarkdown: (node) => `<div data-math="block" data-tex="${escapeAttr(node.attrs?.latex)}"></div>`,
});

/* -------------------------------------------------------------------------- */
/*                                Extension list                              */
/* -------------------------------------------------------------------------- */

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3, 4] },
    codeBlock: false,
    link: {
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
    },
  }),
  TextStyle,
  Color,
  FontSize,
  FontFamily,
  LineHeight,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Image.configure({
    inline: false,
    allowBase64: false,
    resize: { enabled: true, minWidth: 80, minHeight: 80 },
  }),
  Table.configure({ resizable: true, lastColumnResizable: true, allowTableNodeSelection: true }),
  TableRow,
  TableHeader,
  TableCell,
  TaskList,
  TaskItem.configure({ nested: true }),
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: "plaintext",
    HTMLAttributes: { class: "code-block" },
  }),
  Placeholder.configure({ placeholder: "متن یادداشت را اینجا بنویسید…" }),
  CharacterCount,
  Direction,
  TableExtras,
  Video,
  Audio,
  FileAttachment,
  Embed,
  Demo,
  Notebook,
  Mermaid,
  Callout,
  Footnote,
  MathInline,
  MathBlock,
  Search,
  Markdown.configure({ indentation: { style: "space", size: 2 } }),
];
