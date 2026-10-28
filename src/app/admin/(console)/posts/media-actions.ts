"use server";

import { requireAdmin } from "@/lib/auth";
import {
  createMediaAsset,
  listMediaAssets,
  markMediaUsed,
  type MediaAssetInput,
} from "@/lib/content";
import {
  extensionOf,
  filenameFromUrl,
  inferMediaKind,
  isSafeMediaUrl,
  mimeFromExtension,
  UPLOAD_LIMITS,
} from "@/lib/media-url";
import {
  assertStorageKey,
  createPresignedUpload,
  hasStorageConfig,
  keyForUpload,
  publicUrlFor,
} from "@/lib/storage";
import type { MediaAsset, MediaKind } from "@/lib/types";

export type MediaActionResult =
  | { ok: true; asset: MediaAsset }
  | { ok: false; message: string };

export type MediaListResult =
  | { ok: true; assets: MediaAsset[] }
  | { ok: false; message: string };

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function kindOf(value: unknown): MediaKind {
  return value === "image" ||
    value === "video" ||
    value === "audio" ||
    value === "file"
    ? value
    : "file";
}

export async function listMediaAssetsAction(input?: {
  query?: string;
  kind?: MediaKind | "all";
}): Promise<MediaListResult> {
  await requireAdmin();
  try {
    const assets = await listMediaAssets({
      query: clean(input?.query, 80),
      kind:
        input?.kind && input.kind !== "all" ? kindOf(input.kind) : undefined,
      limit: 80,
    });
    return { ok: true, assets };
  } catch (error) {
    console.error("[media] list failed:", error);
    return { ok: false, message: "خواندن کتابخانهٔ رسانه ناموفق بود." };
  }
}

export async function createMediaUploadAction(input: {
  filename: string;
  mime: string;
  size: number;
}): Promise<
  | { ok: true; uploadUrl: string; publicUrl: string; key: string }
  | { ok: false; message: string }
> {
  await requireAdmin();

  if (!hasStorageConfig()) {
    return {
      ok: false,
      message:
        "آپلود مستقیم پیکربندی نشده است؛ می‌توانید نشانی فایل را بچسبانید.",
    };
  }

  const filename = clean(input.filename, 180) || "file";
  const mime = clean(input.mime, 120) || mimeFromExtension(extensionOf(filename));
  const size = Number(input.size);
  const kind = inferMediaKind(filename, mime);

  if (!Number.isFinite(size) || size <= 0) {
    return { ok: false, message: "حجم فایل معتبر نیست." };
  }
  if (size > UPLOAD_LIMITS[kind]) {
    return {
      ok: false,
      message: "حجم فایل برای این نوع رسانه بیش از حد مجاز است.",
    };
  }

  try {
    const key = keyForUpload(filename, mime);
    const { uploadUrl, publicUrl } = await createPresignedUpload(key, mime);
    return { ok: true, uploadUrl, publicUrl, key };
  } catch (error) {
    console.error("[media] presign failed:", error);
    return { ok: false, message: "ساخت نشانی آپلود ناموفق بود." };
  }
}

export async function registerMediaAssetAction(input: {
  key: string;
  filename: string;
  mime: string;
  size: number;
  alt?: string;
  width?: number;
  height?: number;
}): Promise<MediaActionResult> {
  await requireAdmin();

  const key = clean(input.key, 300);
  if (!assertStorageKey(key)) {
    return { ok: false, message: "کلید فایل معتبر نیست." };
  }

  const filename = clean(input.filename, 180) || filenameFromUrl(key);
  const mime = clean(input.mime, 120) || mimeFromExtension(extensionOf(filename));
  const size = Math.max(0, Number(input.size) || 0);
  const kind = inferMediaKind(filename, mime);

  try {
    const asset = await createMediaAsset({
      url: publicUrlFor(key),
      storageKey: key,
      filename,
      mime,
      sizeBytes: size,
      kind,
      alt: clean(input.alt, 300),
      width:
        Number.isFinite(Number(input.width)) && Number(input.width) > 0
          ? Math.round(Number(input.width))
          : null,
      height:
        Number.isFinite(Number(input.height)) && Number(input.height) > 0
          ? Math.round(Number(input.height))
          : null,
    });
    return { ok: true, asset };
  } catch (error) {
    console.error("[media] register failed:", error);
    return { ok: false, message: "ثبت فایل در کتابخانه ناموفق بود." };
  }
}

export async function registerMediaUrlAction(input: {
  url: string;
  filename?: string;
  mime?: string;
  size?: number;
  kind?: MediaKind;
  alt?: string;
}): Promise<MediaActionResult> {
  await requireAdmin();

  const url = clean(input.url, 1200);
  if (!isSafeMediaUrl(url) || url.startsWith("/")) {
    return {
      ok: false,
      message: "نشانی رسانه باید با http(s) شروع شود و معتبر باشد.",
    };
  }

  const filename = clean(input.filename, 180) || filenameFromUrl(url);
  const mime =
    clean(input.mime, 120) ||
    mimeFromExtension(extensionOf(filename || url));
  const kind = input.kind ? kindOf(input.kind) : inferMediaKind(filename, mime);
  const size = Math.max(0, Number(input.size) || 0);

  const payload: MediaAssetInput = {
    url,
    filename,
    mime,
    sizeBytes: size,
    kind,
    alt: clean(input.alt, 300),
  };

  try {
    const asset = await createMediaAsset(payload);
    return { ok: true, asset };
  } catch (error) {
    console.error("[media] url register failed:", error);
    return { ok: false, message: "ثبت نشانی در کتابخانه ناموفق بود." };
  }
}

export async function markMediaUsedAction(id: string): Promise<void> {
  await requireAdmin();
  try {
    await markMediaUsed(clean(id, 60));
  } catch (error) {
    console.error("[media] mark used failed:", error);
  }
}
