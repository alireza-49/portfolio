"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { Link2, Unlink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BTN_PRIMARY, BTN_SECONDARY, FIELD_CLASS } from "@/components/admin/ui";
import { isSafeHref } from "@/lib/media-url";

export function LinkDialog({
  editor,
  open,
  onClose,
}: {
  editor: Editor;
  open: boolean;
  onClose: () => void;
}) {
  const [href, setHref] = useState(() => (editor.getAttributes("link") as { href?: string }).href ?? "");
  const [text, setText] = useState(() => {
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, " ");
  });
  const [newTab, setNewTab] = useState(() => (editor.getAttributes("link") as { target?: string }).target === "_blank");
  const [error, setError] = useState<string | null>(null);

  const apply = () => {
    const value = href.trim();
    if (!value) {
      setError("نشانی پیوند را وارد کنید.");
      return;
    }
    if (!isSafeHref(value)) {
      setError("فقط نشانی‌های http، https، mailto، tel یا مسیرهای همین سایت مجازند.");
      return;
    }
    const target = newTab ? "_blank" : undefined;
    const chain = editor.chain().focus();
    if (text.trim() && text.trim() !== editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, " ")) {
      chain.insertContent({
        type: "text",
        text: text.trim(),
        marks: [{ type: "link", attrs: { href: value, target } }],
      }).run();
    } else {
      chain.extendMarkRange("link").setLink({ href: value, target }).run();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className='max-w-lg' dir='rtl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-sm font-black text-indigo-ink'>
            <Link2 className='size-4 text-coral' />
            پیوند
          </DialogTitle>
        </DialogHeader>
        <div className='grid gap-3'>
          <label className='grid gap-1 text-[11px] font-bold text-indigo-ink'>
            نشانی
            <input
              value={href}
              onChange={(event) => { setHref(event.target.value); setError(null); }}
              dir='ltr'
              placeholder='https://…'
              className={FIELD_CLASS}
              autoFocus
            />
          </label>
          <label className='grid gap-1 text-[11px] font-bold text-indigo-ink'>
            متن پیوند
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder='اگر خالی بماند، متن انتخاب‌شده حفظ می‌شود.'
              className={FIELD_CLASS}
            />
          </label>
          <label className='flex items-center gap-2 text-[11px] font-bold text-indigo-ink'>
            <input type='checkbox' checked={newTab} onChange={(event) => setNewTab(event.target.checked)} />
            گشودن در زبانهٔ تازه
          </label>
          {error ? <p className='text-[11px] font-bold text-coral-dark'>{error}</p> : null}
        </div>
        <DialogFooter className='flex flex-wrap items-center justify-between gap-2'>
          <button
            type='button'
            className={BTN_SECONDARY}
            onClick={() => { editor.chain().focus().extendMarkRange("link").unsetLink().run(); onClose(); }}
          >
            <Unlink className='size-3.5' /> حذف پیوند
          </button>
          <div className='flex gap-2'>
            <button type='button' className={BTN_SECONDARY} onClick={onClose}>انصراف</button>
            <button type='button' className={BTN_PRIMARY} onClick={apply}>ثبت پیوند</button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
