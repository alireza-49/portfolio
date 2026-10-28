import { faDecimal } from "./fa";
import type { MediaKind } from "./types";

/**
 * Client-safe URL and media helpers.
 *
 * `sanitize.ts` imports `sanitize-html` and must never reach a client bundle.
 * Everything the editor, the media dialog and the public runtime need to reason
 * about a URL lives here instead.
 */

export const MEDIA_KIND_LABELS: Record<MediaKind, string> = {
  image: "تصویر",
  video: "ویدیو",
  audio: "صدا",
  file: "فایل",
};

const IMAGE_EXT = new Set([
  "avif",
  "bmp",
  "gif",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "webp",
]);
const VIDEO_EXT = new Set(["m4v", "mov", "mp4", "ogv", "webm"]);
const AUDIO_EXT = new Set(["aac", "flac", "m4a", "mp3", "oga", "ogg", "wav"]);
const TEXT_EXT = new Set([
  "bash",
  "c",
  "css",
  "csv",
  "go",
  "html",
  "htm",
  "ini",
  "java",
  "js",
  "json",
  "jsx",
  "log",
  "md",
  "mjs",
  "php",
  "py",
  "rb",
  "rs",
  "sh",
  "sql",
  "svg",
  "toml",
  "ts",
  "tsx",
  "txt",
  "xml",
  "yaml",
  "yml",
]);

export function isSafeMediaUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith("/")) return !trimmed.startsWith("//");
  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isSafeHref(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  if (trimmed.startsWith("#")) return true;
  try {
    const url = new URL(trimmed);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol);
  } catch {
    return false;
  }
}

export function extensionOf(value: string): string {
  const clean = value.split(/[?#]/)[0] ?? "";
  const last = clean.split("/").pop() ?? "";
  const dot = last.lastIndexOf(".");
  return dot > 0 ? last.slice(dot + 1).toLowerCase() : "";
}

export function filenameFromUrl(value: string): string {
  try {
    const url = new URL(value);
    const name = decodeURIComponent(url.pathname.split("/").pop() ?? "");
    return name || url.hostname;
  } catch {
    const name = value.split(/[?#]/)[0]?.split("/").pop() ?? "";
    return name || "فایل";
  }
}

/** Best-effort kind from MIME first, then the extension. */
export function inferMediaKind(
  value: string,
  mime?: string | null,
): MediaKind {
  const type = (mime ?? "").toLowerCase();
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type) return "file";

  const ext = extensionOf(value);
  if (IMAGE_EXT.has(ext)) return "image";
  if (VIDEO_EXT.has(ext)) return "video";
  if (AUDIO_EXT.has(ext)) return "audio";
  return "file";
}

export function mimeFromExtension(ext: string): string {
  const key = ext.toLowerCase();
  const map: Record<string, string> = {
    avif: "image/avif",
    css: "text/css",
    gif: "image/gif",
    htm: "text/html",
    html: "text/html",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "text/javascript",
    json: "application/json",
    m4a: "audio/mp4",
    m4v: "video/mp4",
    md: "text/markdown",
    mov: "video/quicktime",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    ogg: "audio/ogg",
    pdf: "application/pdf",
    png: "image/png",
    py: "text/x-python",
    svg: "image/svg+xml",
    txt: "text/plain",
    webm: "video/webm",
    webp: "image/webp",
    xml: "application/xml",
    yaml: "text/yaml",
    yml: "text/yaml",
  };
  return map[key] ?? "application/octet-stream";
}

export function isTextLike(mime?: string | null, filename?: string): boolean {
  const type = (mime ?? "").toLowerCase();
  if (
    type.startsWith("text/") ||
    type === "application/json" ||
    type === "application/xml" ||
    type === "application/javascript" ||
    type === "application/x-javascript"
  ) {
    return true;
  }
  if (filename) return TEXT_EXT.has(extensionOf(filename));
  return false;
}

export function isPreviewable(asset: {
  mime: string;
  filename: string;
  kind: MediaKind;
}): boolean {
  if (asset.kind === "image" || asset.mime === "application/pdf") return true;
  return isTextLike(asset.mime, asset.filename);
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  const units = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  const rounded = index === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${faDecimal(rounded)} ${units[index]}`;
}

/** A conservative upper bound per kind; the server checks it again. */
export const UPLOAD_LIMITS: Record<MediaKind, number> = {
  image: 25 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  audio: 25 * 1024 * 1024,
  file: 20 * 1024 * 1024,
};

export const MEDIA_ACCEPT =
  "image/*,video/*,audio/*,.pdf,.py,.js,.mjs,.ts,.tsx,.jsx,.css,.html,.htm,.json,.md,.txt,.csv,.sql,.sh,.yaml,.yml,.xml,.svg";
