"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { ArrowDown, ArrowUp, NotebookPen, Play, Plus, RotateCcw, Trash2 } from "lucide-react";
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
import { encodePayload, validateNotebookPayload, type NotebookCell, type NotebookPayload } from "@/lib/richtext";
import { useNotebookSession } from "@/components/editor-blocks/use-notebook-session";
import { CellOutput } from "@/components/editor-blocks/notebook-block";

function newCell(kind: NotebookCell["kind"], index: number): NotebookCell {
  return {
    id: `cell-${Date.now()}-${index}`,
    kind,
    source: kind === "code" ? 'print("سلام از پایتون")' : "",
  };
}

export function NotebookDialog({
  editor,
  open,
  payload,
  pos,
  onClose,
}: {
  editor: Editor;
  open: boolean;
  payload?: NotebookPayload;
  pos?: number;
  onClose: () => void;
}) {
  const initial = payload ?? {
    version: 1 as const,
    packages: [],
    cells: [newCell("code", 0)],
  };
  const [draft, setDraft] = useState<NotebookPayload>(initial);
  const [packagesText, setPackagesText] = useState(initial.packages.join(", "));
  const [error, setError] = useState<string | null>(null);
  const session = useNotebookSession(draft);

  const patchCell = (id: string, source: string) => {
    setDraft((current) => ({
      ...current,
      cells: current.cells.map((cell) => (cell.id === id ? { ...cell, source } : cell)),
    }));
  };

  const move = (index: number, direction: -1 | 1) => {
    setDraft((current) => {
      const next = [...current.cells];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, cells: next };
    });
  };

  const remove = (id: string) => {
    setDraft((current) => ({
      ...current,
      cells: current.cells.length > 1 ? current.cells.filter((cell) => cell.id !== id) : current.cells,
    }));
  };

  const add = (kind: NotebookCell["kind"]) => {
    setDraft((current) => ({ ...current, cells: [...current.cells, newCell(kind, current.cells.length)] }));
  };

  const save = () => {
    const packages = packagesText
      .split(/[,\s]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    const candidate: NotebookPayload = { ...draft, packages };
    const valid = validateNotebookPayload(candidate);
    if (!valid) {
      setError("دفترچه معتبر نیست؛ تعداد سلول‌ها، حجم یا نام بسته‌ها را بررسی کنید.");
      return;
    }
    const encoded = encodePayload(valid);
    if (pos !== undefined && editor.state.doc.nodeAt(pos)?.type.name === "notebook") {
      editor.chain().focus().command(({ tr }) => {
        tr.setNodeMarkup(pos, undefined, { ...editor.state.doc.nodeAt(pos)?.attrs, payload: encoded });
        return true;
      }).run();
    } else {
      insertBlock(editor, { type: "notebook", attrs: { payload: encoded } });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className='max-w-6xl' dir='rtl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-sm font-black text-indigo-ink'>
            <NotebookPen className='size-4 text-coral' />
            دفترچهٔ پایتون
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-wrap items-center gap-2'>
          <label className='flex min-w-64 flex-1 items-center gap-2 text-[11px] font-bold text-indigo-ink'>
            بسته‌ها
            <input
              value={packagesText}
              onChange={(event) => setPackagesText(event.target.value)}
              placeholder='numpy, pandas, matplotlib'
              dir='ltr'
              className={FIELD_CLASS}
            />
          </label>
          <button type='button' className={BTN_SECONDARY} onClick={() => session.runAll()} disabled={session.status === "booting" || session.runningId !== null}>
            <Play className='size-3.5' />
            اجرای همه
          </button>
          <button type='button' className={BTN_SECONDARY} onClick={session.restart} title='بازنشانی محیط'>
            <RotateCcw className='size-3.5' />
          </button>
        </div>

        <div className='max-h-[58vh] space-y-3 overflow-y-auto pl-1'>
          {draft.cells.map((cell, index) => (
            <div key={cell.id} className='rounded-sm border border-indigo-ink/15 bg-paper p-3'>
              <div className='mb-2 flex items-center justify-between gap-2'>
                <span className='text-[10px] font-black tracking-[0.18em] text-indigo-light'>
                  {cell.kind === "code" ? "کد پایتون" : "متن"}
                </span>
                <div className='flex items-center gap-1'>
                  {cell.kind === "code" ? (
                    <button type='button' className='cc-node-btn' onClick={() => session.runCell(cell)} disabled={session.runningId !== null} aria-label='اجرای سلول'>
                      <Play className='size-3' />
                      اجرا
                    </button>
                  ) : null}
                  <button type='button' className='cc-node-btn' onClick={() => move(index, -1)} disabled={index === 0} aria-label='بالا'>
                    <ArrowUp className='size-3' />
                  </button>
                  <button type='button' className='cc-node-btn' onClick={() => move(index, 1)} disabled={index === draft.cells.length - 1} aria-label='پایین'>
                    <ArrowDown className='size-3' />
                  </button>
                  <button type='button' className='cc-node-btn cc-node-btn-danger' onClick={() => remove(cell.id)} aria-label='حذف سلول'>
                    <Trash2 className='size-3' />
                  </button>
                </div>
              </div>
              {cell.kind === "code" ? (
                <CodeEditor value={cell.source} onChange={(value) => patchCell(cell.id, value)} language='python' height='150px' ariaLabel='کد پایتون' />
              ) : (
                <textarea
                  value={cell.source}
                  onChange={(event) => patchCell(cell.id, event.target.value)}
                  rows={3}
                  dir='auto'
                  className={FIELD_CLASS}
                  placeholder='متن توضیحی (Markdown ساده)'
                />
              )}
              {session.outputs[cell.id] ? <CellOutput output={session.outputs[cell.id]} /> : null}
            </div>
          ))}
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <button type='button' className={BTN_SECONDARY} onClick={() => add("code")}>
            <Plus className='size-3.5' />
            سلول کد
          </button>
          <button type='button' className={BTN_SECONDARY} onClick={() => add("markdown")}>
            <Plus className='size-3.5' />
            سلول متن
          </button>
          <span className='text-[10px] text-indigo-light'>وضعیت: {session.status}</span>
        </div>

        {error ? <p className='rounded-sm border border-coral/40 bg-coral/10 px-3 py-2 text-[11px] font-bold text-coral-dark'>{error}</p> : null}

        <DialogFooter className='flex justify-end gap-2'>
          <button type='button' className={BTN_SECONDARY} onClick={onClose}>انصراف</button>
          <button type='button' className={BTN_PRIMARY} onClick={save} aria-label='ثبت دفترچه'>ثبت دفترچه</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
