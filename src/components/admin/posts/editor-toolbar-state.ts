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
  bullet: boolean;
  ordered: boolean;
  task: boolean;
  quote: boolean;
  codeBlock: boolean;
  alignRight: boolean;
  alignCenter: boolean;
  alignLeft: boolean;
  alignJustify: boolean;
  color: string | null;
  fontSize: string | null;
  highlight: string | null;
  text: string;
  canUndo: boolean;
  canRedo: boolean;
};

export function selectToolbarState(editor: Editor): ToolbarState {
  const attributes = editor.getAttributes("textStyle") as {
    color?: string;
    fontSize?: string;
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
    bullet: editor.isActive("bulletList"),
    ordered: editor.isActive("orderedList"),
    task: editor.isActive("taskList"),
    quote: editor.isActive("blockquote"),
    codeBlock: editor.isActive("codeBlock"),
    alignRight: editor.isActive({ textAlign: "right" }),
    alignCenter: editor.isActive({ textAlign: "center" }),
    alignLeft: editor.isActive({ textAlign: "left" }),
    alignJustify: editor.isActive({ textAlign: "justify" }),
    color: attributes.color ?? null,
    fontSize: attributes.fontSize ?? null,
    highlight: highlight.color ?? null,
    text: editor.getText(),
    canUndo: editor.can().undo(),
    canRedo: editor.can().redo(),
  };
}
