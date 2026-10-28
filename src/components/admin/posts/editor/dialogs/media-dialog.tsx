"use client";

import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { FileText, ImageIcon, Loader2, Music2, Upload, Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BTN_PRIMARY, BTN_SECONDARY, FIELD_CLASS } from "@/components/admin/ui";
import { insertBlock } from "../insert";
import { cn } from "cn";
import {
  formatBytes,
  inferMediaKind,
  isSafeMediaUrl,
  MEDIA_KIND_LABELS,
  mimeFromExtension,
  extensionOf,
  filenameFromUrl,
} from "@/lib/media-url";
import type { MediaKind } from "@/lib/types";
import type { MediaAsset } from "@/lib/types";
import {
  createMediaUploadAction,
  listMediaAssetsAction,
  markMediaUsedAction,
  registerMediaAssetAction,
  registerMediaUrlAction,
} from "@/app/admin/(console)/posts/media-actions";

type TabKey = "link" | "library" | "upload";

const KIND_ICONS = {
  image: ImageIcon,
  video: Video,
  audio: Music2,
  file: FileText,
} as const;

function MediaPreview({
  src,
  kind,
  name,
}: {
  src: string;
  kind: MediaKind;
  name?: string;
}) {
  if (!src || !isSafeMediaUrl(src)) {
    return <div className='cc-media-empty'>نشانی معتبر وارد کنید.</div>;
  }
  if (kind === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name ?? ""} className='cc-media-preview-img' />;
  }
  if (kind === "video") {
    return <video src={src} controls className='cc-media-preview-media' />;
  }
  if (kind === "audio") {
    return <audio src={src} controls className='w-full' />;
  }
  return (
    <div className='cc-media-file-preview'>
      <FileText className='size-8 text-coral' />
      <span>{name || filenameFromUrl(src)}</span>
    </div>
  );
}

export function MediaDialog({
  editor,
  open,
  initialKind,
  pos,
  onClose,
}: {
  editor: Editor;
  open: boolean;
  initialKind: MediaKind | "all";
  pos?: number;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<TabKey>(pos === undefined ? "link" : "library");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [kind, setKind] = useState<MediaKind>(
    initialKind === "all" ? "image" : initialKind,
  );
  const [manualKind, setManualKind] = useState(initialKind !== "all");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || tab !== "library") return;
    let active = true;
    const run = async () => {
      setLibraryLoading(true);
      const result = await listMediaAssetsAction({ query, kind: initialKind === "all" ? "all" : initialKind });
      if (!active) return;
      if (result.ok) setAssets(result.assets);
      else setError(result.message);
      setLibraryLoading(false);
    };
    void run();
    return () => {
      active = false;
    };
  }, [open, tab, query, initialKind]);

  const apply = (input: {
    src: string;
    kind: MediaKind;
    name?: string;
    mime?: string;
    size?: number;
    assetId?: string;
    alt?: string;
    caption?: string;
  }) => {
    const nodeType =
      input.kind === "image"
        ? "image"
        : input.kind === "video"
          ? "video"
          : input.kind === "audio"
            ? "audio"
            : "fileAttachment";

    const attrs = {
      src: input.src,
      assetId: input.assetId ?? null,
      name: input.name ?? filenameFromUrl(input.src),
      mime: input.mime ?? null,
      size: input.size ?? 0,
      kind: input.kind,
      alt: input.alt ?? "",
      title: input.caption ?? "",
      caption: input.caption ?? "",
    };

    if (pos !== undefined && editor.state.doc.nodeAt(pos)) {
      editor
        .chain()
        .focus()
        .command(({ tr }) => {
          tr.setNodeMarkup(pos, editor.schema.nodes[nodeType], attrs);
          return true;
        })
        .run();
    } else if (input.kind === "image") {
      editor.chain().focus().setImage({
        src: input.src,
        alt: input.alt ?? "",
        title: input.caption ?? "",
      }).run();
    } else {
      insertBlock(editor, { type: nodeType, attrs });
    }

    if (input.assetId) void markMediaUsedAction(input.assetId);
    onClose();
  };

  const applyLink = async () => {
    const value = url.trim();
    if (!isSafeMediaUrl(value) || (!value.startsWith("/") && !/^https?:\/\//i.test(value))) {
      setError("نشانی باید با https:// یا مسیر داخلی / شروع شود.");
      return;
    }
    const detected = inferMediaKind(value);
    const resolved = manualKind ? kind : detected;
    setSaving(true);
    try {
      const registration = await registerMediaUrlAction({
        url: value,
        filename: name.trim() || filenameFromUrl(value),
        kind: resolved,
        alt: alt.trim(),
      });
      apply({
        src: value,
        kind: resolved,
        name: name.trim() || filenameFromUrl(value),
        mime: mimeFromExtension(extensionOf(value)),
        alt: alt.trim(),
        caption: caption.trim(),
        assetId: registration.ok ? registration.asset.id : undefined,
      });
    } catch {
      setError("ثبت در کتابخانه انجام نشد؛ لینک بدون ثبت در کتابخانه درج می‌شود.");
      apply({
        src: value,
        kind: resolved,
        name: name.trim() || filenameFromUrl(value),
        mime: mimeFromExtension(extensionOf(value)),
        alt: alt.trim(),
        caption: caption.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  const upload = async () => {
    if (!uploadFile) return;
    setError(null);
    setUploading(true);
    setProgress(0);
    try {
      const presign = await createMediaUploadAction({
        filename: uploadFile.name,
        mime: uploadFile.type || mimeFromExtension(extensionOf(uploadFile.name)),
        size: uploadFile.size,
      });
      if (!presign.ok) {
        setError(presign.message);
        return;
      }
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presign.uploadUrl);
        xhr.setRequestHeader(
          "Content-Type",
          uploadFile.type || mimeFromExtension(extensionOf(uploadFile.name)),
        );
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(`HTTP ${xhr.status}`));
        xhr.onerror = () => reject(new Error("CORS یا شبکه"));
        xhr.send(uploadFile);
      });
      const registered = await registerMediaAssetAction({
        key: presign.key,
        filename: uploadFile.name,
        mime: uploadFile.type || mimeFromExtension(extensionOf(uploadFile.name)),
        size: uploadFile.size,
        alt: alt.trim(),
      });
      if (!registered.ok) {
        setError(registered.message);
        return;
      }
      apply({
        src: registered.asset.url,
        kind: registered.asset.kind,
        name: registered.asset.filename,
        mime: registered.asset.mime,
        size: registered.asset.sizeBytes,
        assetId: registered.asset.id,
        alt: alt.trim(),
        caption: caption.trim(),
      });
    } catch (uploadError) {
      console.error("[media] upload failed:", uploadError);
      setError(
        "آپلود مستقیم انجام نشد. اگر باکت تازه راه افتاده، CORS آن را برای این دامنه باز کنید یا نشانی فایل را در تب «لینک» بچسبانید.",
      );
    } finally {
      setUploading(false);
    }
  };

  const Icon = KIND_ICONS[kind];

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className='max-h-[88vh] overflow-y-auto sm:max-w-3xl' dir='rtl'>
        <DialogHeader>
          <DialogTitle>درج رسانه</DialogTitle>
          <DialogDescription>
            تصویر، ویدیو، صدا یا فایل را از نشانی، کتابخانه یا آپلود مستقیم اضافه کنید.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(value) => setTab(value as TabKey)}>
          <TabsList>
            <TabsTrigger value='link'>لینک</TabsTrigger>
            <TabsTrigger value='library'>کتابخانه</TabsTrigger>
            <TabsTrigger value='upload'>آپلود</TabsTrigger>
          </TabsList>

          <TabsContent value='link' className='flex flex-col gap-2 pt-2'>
            <label className='flex flex-col gap-1 text-[0.6875rem] font-bold text-indigo-light'>
              نشانی فایل
              <input
                dir='ltr'
                value={url}
                onChange={(event) => {
                  const value = event.target.value;
                  setUrl(value);
                  setError(null);
                  if (!manualKind && value) setKind(inferMediaKind(value));
                }}
                placeholder='https://…/file.png'
                className={cn(FIELD_CLASS, "font-mono text-xs")}
              />
            </label>
            <div className='grid gap-2 sm:grid-cols-3'>
              <label className='flex flex-col gap-1 text-[0.6875rem] font-bold text-indigo-light'>
                نوع
                <select
                  value={kind}
                  onChange={(event) => {
                    setManualKind(true);
                    setKind(event.target.value as MediaKind);
                  }}
                  className={cn(FIELD_CLASS, "h-9")}
                >
                  {(["image", "video", "audio", "file"] as MediaKind[]).map((item) => (
                    <option key={item} value={item}>{MEDIA_KIND_LABELS[item]}</option>
                  ))}
                </select>
              </label>
              <label className='flex flex-col gap-1 text-[0.6875rem] font-bold text-indigo-light'>
                نام نمایشی
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder='نام فایل'
                  className={cn(FIELD_CLASS, "h-9")}
                />
              </label>
              <label className='flex flex-col gap-1 text-[0.6875rem] font-bold text-indigo-light'>
                متن جانشین (alt)
                <input
                  value={alt}
                  onChange={(event) => setAlt(event.target.value)}
                  placeholder='برای تصویر و دسترس‌پذیری'
                  className={cn(FIELD_CLASS, "h-9")}
                />
              </label>
            </div>
            <label className='flex flex-col gap-1 text-[0.6875rem] font-bold text-indigo-light'>
              زیرنویس
              <input
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder='زیرنویس اختیاری'
                className={cn(FIELD_CLASS, "h-9")}
              />
            </label>

            <div className='rounded-md border border-indigo-ink/15 bg-paper-dim p-2'>
              <MediaPreview src={url} kind={kind} name={name || alt} />
            </div>

            <div className='flex items-center justify-between gap-2 pt-1'>
              <span className='flex items-center gap-1 text-[0.625rem] font-bold text-indigo-light'>
                <Icon className='size-3.5' /> {MEDIA_KIND_LABELS[kind]}
              </span>
              <button
                type='button'
                onClick={() => void applyLink()}
                disabled={saving}
                className={BTN_PRIMARY}
              >
                {saving ? <Loader2 className='size-4 animate-spin' /> : null}
                درج
              </button>
            </div>
          </TabsContent>

          <TabsContent value='library' className='flex flex-col gap-2 pt-2'>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='جست‌وجوی نام یا alt…'
              className={cn(FIELD_CLASS, "h-9")}
            />
            {libraryLoading ? (
              <p className='flex items-center gap-2 py-6 text-center text-xs font-bold text-indigo-light'>
                <Loader2 className='size-4 animate-spin' /> در حال خواندن کتابخانه…
              </p>
            ) : assets.length === 0 ? (
              <p className='py-6 text-center text-xs font-bold text-indigo-light'>
                هنوز رسانه‌ای در کتابخانه نیست؛ از تب «لینک» یا «آپلود» اضافه کنید.
              </p>
            ) : (
              <div className='grid max-h-[42vh] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3'>
                {assets.map((asset) => {
                  const AssetIcon = KIND_ICONS[asset.kind];
                  return (
                    <button
                      key={asset.id}
                      type='button'
                      onClick={() => {
                        apply({
                          src: asset.url,
                          kind: asset.kind,
                          name: asset.filename,
                          mime: asset.mime,
                          size: asset.sizeBytes,
                          assetId: asset.id,
                          alt: asset.alt,
                          caption: asset.alt,
                        });
                      }}
                      className='flex items-center gap-2 rounded-sm border border-indigo-ink/20 bg-paper p-2 text-right transition-colors hover:border-coral hover:bg-mustard/20'
                    >
                      <AssetIcon className='size-5 shrink-0 text-coral' />
                      <span className='min-w-0'>
                        <span className='block truncate text-[0.6875rem] font-bold text-indigo-ink'>{asset.filename}</span>
                        <span className='block text-[0.625rem] text-indigo-light'>{formatBytes(asset.sizeBytes)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value='upload' className='flex flex-col gap-2 pt-2'>
            <div className='rounded-md border-2 border-dashed border-indigo-ink/25 bg-paper-dim p-4 text-center'>
              <Upload className='mx-auto size-6 text-indigo-light' />
              <p className='mt-2 text-[0.6875rem] font-bold text-indigo-light'>
                فایل را انتخاب کنید؛ مستقیماً به باکت آروان آپلود می‌شود.
              </p>
              <input
                ref={fileInput}
                type='file'
                className='sr-only'
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setUploadFile(file);
                  setProgress(0);
                  setError(null);
                  if (file) {
                    setKind(inferMediaKind(file.name, file.type));
                    setName(file.name);
                  }
                }}
              />
              <button type='button' onClick={() => fileInput.current?.click()} className={cn(BTN_SECONDARY, "mt-3")}>
                انتخاب فایل
              </button>
              {uploadFile ? (
                <p className='mt-2 text-[0.6875rem] font-bold text-indigo-ink'>
                  {uploadFile.name} • {formatBytes(uploadFile.size)}
                </p>
              ) : null}
            </div>
            <label className='flex flex-col gap-1 text-[0.6875rem] font-bold text-indigo-light'>
              متن جانشین (alt)
              <input
                value={alt}
                onChange={(event) => setAlt(event.target.value)}
                placeholder='برای تصویر و دسترس‌پذیری'
                className={cn(FIELD_CLASS, "h-9")}
              />
            </label>
            {uploading ? (
              <div className='h-2 overflow-hidden rounded-full bg-indigo-ink/15'>
                <div className='h-full bg-coral transition-all' style={{ width: `${progress}%` }} />
              </div>
            ) : null}
            <button
              type='button'
              onClick={() => void upload()}
              disabled={!uploadFile || uploading}
              className={BTN_PRIMARY}
            >
              {uploading ? <Loader2 className='size-4 animate-spin' /> : <Upload className='size-4' />}
              {uploading ? `آپلود ${progress}%` : "آپلود و درج"}
            </button>
            <p className='text-[0.625rem] leading-5 text-indigo-light'>
              اگر آپلود به دلیل CORS باکت انجام نشد، از تب «لینک» استفاده کنید. این مسیر هرگز ذخیرهٔ مقاله را مسدود نمی‌کند.
            </p>
          </TabsContent>
        </Tabs>

        {error ? <p className='text-[0.6875rem] font-bold text-coral'>{error}</p> : null}
      </DialogContent>
    </Dialog>
  );
}
