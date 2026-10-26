"use client";

import { useState } from "react";
import { Download, FileText, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatBytes, isTextLike } from "@/lib/media-url";
import { cn } from "cn";

function labelFor(kind: string): string {
  if (kind === "image") return "IMG";
  if (kind === "video") return "VID";
  if (kind === "audio") return "AUD";
  return "FILE";
}

export function FileCard({
  name,
  mime,
  size,
  href,
  assetId,
  kind = "file",
}: {
  name: string;
  mime?: string;
  size?: number;
  href: string;
  assetId?: string;
  kind?: string;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewUrl = assetId ? `/api/media/asset/${assetId}` : href;
  const downloadUrl = assetId ? `/api/media/asset/${assetId}/download` : href;
  const textPreview = isTextLike(mime, name);
  const pdfPreview = mime === "application/pdf" || /\.pdf$/i.test(name);

  const preview = async () => {
    setOpen(true);
    setError(null);
    setText(null);
    if (!textPreview) return;
    try {
      const response = await fetch(assetId ? `/api/media/asset/${assetId}/text` : href, {
        headers: { accept: "text/plain" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = (await response.json()) as { text?: string };
      setText(data.text ?? "");
    } catch {
      setError("پیش‌نمایش این فایل ممکن نیست؛ آن را دانلود کنید.");
    }
  };

  return (
    <>
      <div className={cn("post-file-card", "cc-file-card")}>
        <span className='post-file-icon' aria-hidden>{labelFor(kind)}</span>
        <span className='min-w-0 flex-1'>
          <span className='post-file-name' title={name}>{name}</span>
          <span className='post-file-meta'>
            {formatBytes(size ?? 0)}
            {mime ? ` · ${mime}` : ""}
          </span>
        </span>
        <button type='button' onClick={preview} className='cc-node-btn' aria-label={`پیش‌نمایش ${name}`}>
          <Eye className='size-3.5' />
          پیش‌نمایش
        </button>
        <a href={downloadUrl} download={name} rel='noopener noreferrer' className='cc-node-btn' aria-label={`دانلود ${name}`}>
          <Download className='size-3.5' />
          دانلود
        </a>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-4xl' dir='rtl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-sm font-black text-indigo-ink'>
              <FileText className='size-4 text-coral' />
              {name}
            </DialogTitle>
          </DialogHeader>
          {textPreview ? (
            error ? <p className='text-xs font-bold text-coral-dark'>{error}</p> : (
              <pre className='max-h-[65vh] overflow-auto rounded-sm bg-indigo-ink p-4 text-left text-xs text-paper' dir='ltr'>
                <code>{text ?? "در حال بارگذاری…"}</code>
              </pre>
            )
          ) : pdfPreview ? (
            <iframe src={previewUrl} title={name} className='h-[70vh] w-full rounded-sm border border-indigo-ink/20' />
          ) : (
            <p className='text-xs text-indigo-light'>برای این نوع فایل پیش‌نمایش درون‌صفحه‌ای نداریم؛ از دانلود استفاده کنید.</p>
          )}
          <a href={downloadUrl} download={name} rel='noopener noreferrer' className='inline-flex w-fit items-center gap-1.5 rounded-sm bg-indigo-ink px-3 py-1.5 text-[11px] font-bold text-paper'>
            <Download className='size-3.5' />
            دانلود فایل
          </a>
        </DialogContent>
      </Dialog>
    </>
  );
}
