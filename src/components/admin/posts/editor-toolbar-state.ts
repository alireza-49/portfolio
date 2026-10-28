import type { Editor } from "@tiptap/react";

/** Everything the toolbar needs to know about the current selection. */
export type ToolbarState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  code: boolean;
  h1: boolean;
  h2: boolean;
  h3: boolean;
  h4: boolean;
  paragraph: boolean;
  bullet: boolean;
  ordered: boolean;
  task: boolean;
  quote: boolean;
  codeBlock: boolean;
  table: boolean;
  link: boolean;
  alignRight: boolean;
  alignCenter: boolean;
  alignLeft: boolean;
  alignJustify: boolean;
  color: string | null;
  fontSize: string | null;
  fontFamily: string | null;
  lineHeight: string | null;
  highlight: string | null;
  dir: "rtl" | "ltr" | null;
  text: string;
  canUndo: boolean;
  canRedo: boolean;
};

function blockDir(editor: Editor): "rtl" | "ltr" | null {
  const value = editor.getAttributes("paragraph").dir ?? editor.getAttributes("heading").dir;
  return value === "rtl" || value === "ltr" ? value : null;
}

export function selectToolbarState(editor: Editor): ToolbarState {
  const attributes = editor.getAttributes("textStyle") as {
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    lineHeight?: string;
  };
  const highlight = editor.getAttributes("highlight") as { color?: string };

  return {
    bold: editor.isActive("bold"),
    italic: editor.isActive("italic"),
    underline: editor.isActive("underline"),
    strike: editor.isActive("strike"),
    code: editor.isActive("code"),
    h1: editor.isActive("heading", { level: 1 }),
    h2: editor.isActive("heading", { level: 2 }),
    h3: editor.isActive("heading", { level: 3 }),
    h4: editor.isActive("heading", { level: 4 }),
    paragraph: editor.isActive("paragraph"),
    bullet: editor.isActive("bulletList"),
    ordered: editor.isActive("orderedList"),
    task: editor.isActive("taskList"),
    quote: editor.isActive("blockquote"),
    codeBlock: editor.isActive("codeBlock"),
    table: editor.isActive("table"),
    link: editor.isActive("link"),
    alignRight: editor.isActive({ textAlign: "right" }),
    alignCenter: editor.isActive({ textAlign: "center" }),
    alignLeft: editor.isActive({ textAlign: "left" }),
    alignJustify: editor.isActive({ textAlign: "justify" }),
    color: attributes.color ?? null,
    fontSize: attributes.fontSize ?? null,
    fontFamily: attributes.fontFamily ?? null,
    lineHeight: attributes.lineHeight ?? null,
    highlight: highlight.color ?? null,
    dir: blockDir(editor),
    text: editor.getText(),
    canUndo: editor.can().undo(),
    canRedo: editor.can().redo(),
  };
}
