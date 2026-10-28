import { randomUUID } from "node:crypto";
import { isIP } from "node:net";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { extensionOf, mimeFromExtension } from "./media-url";

/**
 * Server-only S3 bridge for the existing ArvanCloud bucket. Uploads are
 * optional: when the env is absent the editor keeps the URL-paste path and
 * never shows an upload control that cannot work.
 */

type StorageConfig = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
  forcePathStyle: boolean;
};

function readConfig(): StorageConfig | null {
  const endpoint = process.env.ARVAN_S3_ENDPOINT?.trim();
  const region = process.env.ARVAN_S3_REGION?.trim();
  const bucket = process.env.ARVAN_S3_BUCKET?.trim();
  const accessKeyId = process.env.ARVAN_S3_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.ARVAN_S3_SECRET_ACCESS_KEY?.trim();
  if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) {
    return null;
  }

  const publicBaseUrl =
    process.env.ARVAN_S3_PUBLIC_BASE_URL?.trim() ||
    `${endpoint.replace(/\/+$/, "")}/${bucket}`;

  return {
    endpoint,
    region,
    bucket,
    accessKeyId,
    secretAccessKey,
    publicBaseUrl: publicBaseUrl.replace(/\/+$/, ""),
    forcePathStyle:
      (process.env.ARVAN_S3_FORCE_PATH_STYLE ?? "true").toLowerCase() !==
      "false",
  };
}

export function hasStorageConfig(): boolean {
  return readConfig() !== null;
}

let cachedClient: S3Client | null = null;
let cachedKey = "";

function client(config: StorageConfig): S3Client {
  const key = [
    config.endpoint,
    config.region,
    config.accessKeyId,
    config.secretAccessKey,
  ].join("|");
  if (cachedClient && cachedKey === key) return cachedClient;

  cachedClient = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    forcePathStyle: config.forcePathStyle,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  cachedKey = key;
  return cachedClient;
}

function safeExtension(filename: string, mime: string): string {
  const fromName = extensionOf(filename).replace(/[^a-z0-9]/g, "");
  if (fromName && fromName.length <= 8) return fromName;
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "application/pdf": "pdf",
    "text/plain": "txt",
    "text/css": "css",
    "text/html": "html",
    "text/javascript": "js",
    "application/json": "json",
  };
  return map[mime] ?? "bin";
}

export function keyForUpload(filename: string, mime: string): string {
  const month = new Date().toISOString().slice(0, 7);
  return `media/${month}/${randomUUID()}.${safeExtension(filename, mime)}`;
}

export function assertStorageKey(key: string): boolean {
  return /^media\/\d{4}-\d{2}\/[0-9a-f-]{36}\.[a-z0-9]{1,8}$/i.test(key);
}

export function publicUrlFor(key: string): string {
  const config = readConfig();
  if (!config) throw new Error("پیکربندی فضای ذخیره‌سازی کامل نیست.");
  return `${config.publicBaseUrl}/${key.replace(/^\/+/, "")}`;
}

export function storageKeyFromUrl(url: string): string | null {
  const config = readConfig();
  if (!config) return null;
  try {
    const base = new URL(config.publicBaseUrl);
    const target = new URL(url);
    if (base.host !== target.host) return null;
    const prefix = base.pathname.replace(/\/+$/, "");
    if (prefix && !target.pathname.startsWith(`${prefix}/`)) return null;
    return decodeURIComponent(
      target.pathname.slice((prefix + "/").length),
    ).replace(/^\/+/, "");
  } catch {
    return null;
  }
}

export async function createPresignedUpload(
  key: string,
  mime: string,
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const config = readConfig();
  if (!config) throw new Error("پیکربندی فضای ذخیره‌سازی کامل نیست.");

  const uploadUrl = await getSignedUrl(
    client(config),
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      ContentType: mime,
    }),
    { expiresIn: 600 },
  );
  return { uploadUrl, publicUrl: publicUrlFor(key) };
}

export async function presignedDownload(
  key: string,
  filename: string,
): Promise<string | null> {
  const config = readConfig();
  if (!config) return null;

  const safeName = filename.replace(/["\\\r\n]/g, "").slice(0, 120);
  const disposition = `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`;

  return getSignedUrl(
    client(config),
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
      ResponseContentDisposition: disposition,
    }),
    { expiresIn: 300 },
  );
}

function isPrivateIp(host: string): boolean {
  if (isIP(host) === 6) {
    const lower = host.toLowerCase();
    return (
      lower === "::1" ||
      lower.startsWith("fc") ||
      lower.startsWith("fd") ||
      lower.startsWith("fe80")
    );
  }
  if (isIP(host) !== 4) return false;
  const parts = host.split(".").map(Number);
  return (
    parts[0] === 10 ||
    parts[0] === 127 ||
    (parts[0] === 169 && parts[1] === 254) ||
    (parts[0] === 192 && parts[1] === 168) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    parts[0] === 0
  );
}

/**
 * The public proxy only fetches hosts the owner has configured. This prevents
 * the preview route from becoming an SSRF gadget for an arbitrary pasted URL.
 */
export function isAllowedPreviewHost(value: string): boolean {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    if (url.username || url.password) return false;
    const host = url.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      isPrivateIp(host)
    ) {
      return false;
    }

    const allowed = new Set<string>();
    const config = readConfig();
    if (config) {
      try {
        allowed.add(new URL(config.publicBaseUrl).hostname.toLowerCase());
      } catch {
        /* invalid public base is ignored */
      }
    }
    for (const entry of (process.env.MEDIA_PREVIEW_HOSTS ?? "").split(",")) {
      const trimmed = entry.trim().toLowerCase();
      if (!trimmed) continue;
      allowed.add(trimmed.replace(/^https?:\/\//, "").replace(/\/.*$/, ""));
    }

    return allowed.has(host);
  } catch {
    return false;
  }
}

/** Guard for a URL that is only being stored, never fetched. */
export function uploadMimeFor(filename: string, declared: string): string {
  const ext = extensionOf(filename);
  return declared && declared !== "application/octet-stream"
    ? declared
    : mimeFromExtension(ext);
}
