import type { Editor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";

/**
 * Insert a block-level atom. If the cursor sits inside a table, insert after
 * the table instead of stuffing a media/demo block into a cell.
 */
export function insertBlock(editor: Editor, node: JSONContent): void {
  const { $from } = editor.state.selection;
  for (let depth = $from.depth; depth > 0; depth -= 1) {
    if ($from.node(depth).type.name === "table") {
      editor
        .chain()
        .focus()
        .insertContentAt($from.after(depth), node)
        .run();
      return;
    }
  }
  editor.chain().focus().insertContent(node).run();
}
