"use client";

import type { Editor } from "@tiptap/react";
import type { EditorDialog } from "../dialog-types";
import { MediaDialog } from "./media-dialog";
import { LinkDialog } from "./link-dialog";
import { FindDialog } from "./find-dialog";
import { CodeDialog } from "./code-dialog";
import { NotebookDialog } from "./notebook-dialog";
import {
  DemoDialog,
  EmbedDialog,
  FootnoteDialog,
  MathDialog,
  MermaidDialog,
} from "./block-dialogs";

export function EditorDialogs({
  editor,
  dialog,
  onClose,
}: {
  editor: Editor;
  dialog: EditorDialog;
  onClose: () => void;
}) {
  if (!dialog) return null;

  switch (dialog.kind) {
    case "media":
      return (
        <MediaDialog
          editor={editor}
          open
          initialKind={dialog.mediaKind}
          pos={dialog.pos}
          onClose={onClose}
        />
      );
    case "link":
      return <LinkDialog editor={editor} open onClose={onClose} />;
    case "find":
      return <FindDialog editor={editor} open onClose={onClose} />;
    case "code":
      return <CodeDialog editor={editor} open pos={dialog.pos} onClose={onClose} />;
    case "demo":
      return (
        <DemoDialog
          editor={editor}
          open
          payload={dialog.payload}
          pos={dialog.pos}
          onClose={onClose}
        />
      );
    case "notebook":
      return (
        <NotebookDialog
          editor={editor}
          open
          payload={dialog.payload}
          pos={dialog.pos}
          onClose={onClose}
        />
      );
    case "mermaid":
      return (
        <MermaidDialog editor={editor} open code={dialog.code} pos={dialog.pos} onClose={onClose} />
      );
    case "embed":
      return (
        <EmbedDialog
          editor={editor}
          open
          provider={dialog.provider}
          src={dialog.src}
          pos={dialog.pos}
          onClose={onClose}
        />
      );
    case "math":
      return (
        <MathDialog
          editor={editor}
          open
          latex={dialog.latex}
          display={dialog.display}
          pos={dialog.pos}
          onClose={onClose}
        />
      );
    case "footnote":
      return (
        <FootnoteDialog editor={editor} open note={dialog.note} pos={dialog.pos} onClose={onClose} />
      );
    default:
      return null;
  }
}
