"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  findNext,
  findPrev,
  replaceAll,
  replaceCurrent,
  replaceNext,
  SearchQuery,
  setSearchState,
} from "prosemirror-search";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BTN_PRIMARY, BTN_SECONDARY, FIELD_CLASS } from "@/components/admin/ui";

export function FindDialog({
  editor,
  open,
  onClose,
}: {
  editor: Editor;
  open: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState(() => {
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, " ").slice(0, 200);
  });
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [regexp, setRegexp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeQuery = () => {
    if (!search) {
      setError("عبارت جستجو را وارد کنید.");
      return null;
    }
    try {
      return new SearchQuery({ search, caseSensitive, wholeWord, regexp, replace });
    } catch {
      setError("عبارت جستجوی منظم معتبر نیست.");
      return null;
    }
  };

  const setQuery = (query: SearchQuery) => {
    const transaction = setSearchState(editor.state.tr, query);
    editor.view.dispatch(transaction);
  };

  const run = (direction: "next" | "prev" | "replace" | "replaceNext" | "replaceAll") => {
    const query = makeQuery();
    if (!query || !query.valid) {
      setError("عبارت جستجو معتبر نیست.");
      return;
    }
    setError(null);
    setQuery(query);
    if (direction === "next") findNext(editor.view.state, editor.view.dispatch);
    if (direction === "prev") findPrev(editor.view.state, editor.view.dispatch);
    if (direction === "replace") replaceCurrent(editor.view.state, editor.view.dispatch);
    if (direction === "replaceNext") replaceNext(editor.view.state, editor.view.dispatch);
    if (direction === "replaceAll") replaceAll(editor.view.state, editor.view.dispatch);
    editor.view.focus();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className='max-w-lg' dir='rtl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-sm font-black text-indigo-ink'>
            <Search className='size-4 text-coral' />
            جستجو و جایگزینی
          </DialogTitle>
        </DialogHeader>
        <div className='grid gap-3'>
          <label className='grid gap-1 text-[11px] font-bold text-indigo-ink'>
            جستجو
            <input
              value={search}
              onChange={(event) => { setSearch(event.target.value); setError(null); }}
              onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); run("next"); } }}
              className={FIELD_CLASS}
              autoFocus
            />
          </label>
          <label className='grid gap-1 text-[11px] font-bold text-indigo-ink'>
            جایگزین
            <input value={replace} onChange={(event) => setReplace(event.target.value)} className={FIELD_CLASS} />
          </label>
          <div className='flex flex-wrap gap-3 text-[11px] font-bold text-indigo-ink'>
            <label className='flex items-center gap-1.5'>
              <input type='checkbox' checked={caseSensitive} onChange={(event) => setCaseSensitive(event.target.checked)} />
              حساس به حرف بزرگ
            </label>
            <label className='flex items-center gap-1.5'>
              <input type='checkbox' checked={wholeWord} onChange={(event) => setWholeWord(event.target.checked)} />
              کل واژه
            </label>
            <label className='flex items-center gap-1.5'>
              <input type='checkbox' checked={regexp} onChange={(event) => setRegexp(event.target.checked)} />
              عبارت منظم
            </label>
          </div>
          {error ? <p className='text-[11px] font-bold text-coral-dark'>{error}</p> : null}
        </div>
        <DialogFooter className='flex flex-wrap gap-2'>
          <button type='button' className={BTN_SECONDARY} onClick={() => run("prev")}>قبلی</button>
          <button type='button' className={BTN_PRIMARY} onClick={() => run("next")}>بعدی</button>
          <button type='button' className={BTN_SECONDARY} onClick={() => run("replace")}>جایگزینی</button>
          <button type='button' className={BTN_SECONDARY} onClick={() => run("replaceNext")}>جایگزینی و بعدی</button>
          <button type='button' className={BTN_SECONDARY} onClick={() => run("replaceAll")}>همه را جایگزین کن</button>
          <button type='button' className={BTN_SECONDARY} onClick={onClose}>بستن</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
