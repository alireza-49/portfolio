"use client";

import { useMemo, useState } from "react";
import type { Editor } from "@tiptap/react";
import { Code } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/components/admin/ui";
import { CODE_LANGUAGES, CodeEditor, codeLanguageLabel } from "../code-editor";

function codeBlockPosition(editor: Editor): number | undefined {
  const { $from } = editor.state.selection;
  for (let depth = $from.depth; depth > 0; depth -= 1) {
    if ($from.node(depth).type.name === "codeBlock") return $from.before(depth);
  }
  return undefined;
}

export function CodeDialog({
  editor,
  open,
  pos,
  onClose,
}: {
  editor: Editor;
  open: boolean;
  pos?: number;
  onClose: () => void;
}) {
  const target = useMemo(() => pos ?? codeBlockPosition(editor), [editor, pos]);
  const initialNode = target !== undefined ? editor.state.doc.nodeAt(target) : null;
  const [code, setCode] = useState(initialNode?.textContent ?? "");
  const [language, setLanguage] = useState((initialNode?.attrs?.language as string | undefined) ?? "plaintext");

  const apply = () => {
    if (target !== undefined && editor.state.doc.nodeAt(target)?.type.name === "codeBlock") {
      const node = editor.state.doc.nodeAt(target)!;
      editor.chain().focus().command(({ tr }) => {
        tr.setNodeMarkup(target, undefined, { ...node.attrs, language });
        const from = target + 1;
        const to = target + node.nodeSize - 1;
        if (code) tr.replaceWith(from, to, editor.schema.text(code));
        else tr.delete(from, to);
        return true;
      }).run();
    } else {
      editor.chain().focus().insertContent({
        type: "codeBlock",
        attrs: { language },
        content: code ? [{ type: "text", text: code }] : [],
      }).run();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className='max-w-5xl' dir='rtl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-sm font-black text-indigo-ink'>
            <Code className='size-4 text-coral' />
            ویرایشگر کد
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-wrap items-center gap-2'>
          <label className='flex items-center gap-1.5 text-[11px] font-bold text-indigo-ink'>
            زبان
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className='h-8 rounded-sm border border-indigo-ink/20 bg-paper px-2 text-[11px] font-bold text-indigo-ink'
            >
              {CODE_LANGUAGES.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
          <span className='text-[10px] text-indigo-light'>{codeLanguageLabel(language)}</span>
        </div>
        <CodeEditor value={code} onChange={setCode} language={language} height='50vh' ariaLabel='ویرایشگر کد' />
        <DialogFooter className='flex justify-end gap-2'>
          <button type='button' className={BTN_SECONDARY} onClick={onClose}>انصراف</button>
          <button type='button' className={BTN_PRIMARY} onClick={apply}>ثبت کد</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
