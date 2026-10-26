/**
 * Client-safe helpers for the HTML payloads embedded inside a post.
 *
 * A demo or a notebook is authored in the console and saved into a `data-*`
 * attribute. The payload is base64url-encoded JSON, so quotes, Persian text and
 * emoji never need HTML escaping and can never close the attribute early.
 */

export const MAX_CONTENT_HTML = 1_500_000;
export const MAX_DEMO_BYTES = 120_000;
export const MAX_NOTEBOOK_BYTES = 300_000;
export const MAX_EMBEDDED_BYTES = 600_000;
export const MAX_BLOCK_COUNT = 40;
export const MAX_DEMO_SOURCE = 50_000;
export const MAX_NOTEBOOK_SOURCE = 20_000;
export const MAX_CELLS = 40;

const B64 = /^[A-Za-z0-9_-]+$/;
const PACKAGE = /^[a-zA-Z0-9._-]{1,80}$/;

export type DemoPayload = {
  title?: string;
  html: string;
  css: string;
  js: string;
};

export type NotebookCellKind = "code" | "markdown";

export type NotebookCell = {
  id: string;
  kind: NotebookCellKind;
  source: string;
};

export type NotebookPayload = {
  version: 1;
  packages: string[];
  cells: NotebookCell[];
};

export function encodePayload(value: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function decodePayload<T = unknown>(raw: string): T | null {
  const value = raw.trim();
  if (!value || !B64.test(value)) return null;
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
}

export function payloadSize(value: unknown): number {
  try {
    return new TextEncoder().encode(JSON.stringify(value)).length;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function validateDemoPayload(value: unknown): DemoPayload | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const payload: DemoPayload = {
    title: asString(record.title).trim().slice(0, 120),
    html: asString(record.html),
    css: asString(record.css),
    js: asString(record.js),
  };
  if (
    payload.html.length > MAX_DEMO_SOURCE ||
    payload.css.length > MAX_DEMO_SOURCE ||
    payload.js.length > MAX_DEMO_SOURCE
  ) {
    return null;
  }
  if (!payload.html.trim() && !payload.css.trim() && !payload.js.trim()) {
    return null;
  }
  if (payloadSize(payload) > MAX_DEMO_BYTES) return null;
  return payload;
}

export function validateNotebookPayload(
  value: unknown,
): NotebookPayload | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (record.version !== 1) return null;

  const packages = Array.isArray(record.packages)
    ? Array.from(
        new Set(
          record.packages
            .filter((item): item is string => typeof item === "string")
            .map((item) => item.trim())
            .filter((item) => PACKAGE.test(item)),
        ),
      ).slice(0, 12)
    : [];

  if (!Array.isArray(record.cells)) return null;
  if (record.cells.length < 1 || record.cells.length > MAX_CELLS) return null;

  const cells: NotebookCell[] = [];
  for (const [index, item] of record.cells.entries()) {
    if (!item || typeof item !== "object") return null;
    const cell = item as Record<string, unknown>;
    const kind = cell.kind === "markdown" ? "markdown" : "code";
    const source = asString(cell.source);
    if (source.length > MAX_NOTEBOOK_SOURCE) return null;
    const id = asString(cell.id).trim() || `cell-${index + 1}`;
    cells.push({ id: id.slice(0, 80), kind, source });
  }

  const payload: NotebookPayload = { version: 1, packages, cells };
  if (payloadSize(payload) > MAX_NOTEBOOK_BYTES) return null;
  return payload;
}

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
]);
const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);

export type EmbedProvider = "youtube" | "vimeo";

export function embedFromUrl(value: string): {
  provider: EmbedProvider;
  src: string;
} | null {
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) return null;
  try {
    const url = new URL(trimmed);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    const host = url.hostname.toLowerCase();

    if (YOUTUBE_HOSTS.has(host)) {
      let id = "";
      if (host === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0] ?? "";
      else if (url.pathname.startsWith("/embed/")) id = url.pathname.split("/")[2] ?? "";
      else if (url.pathname.startsWith("/shorts/")) id = url.pathname.split("/")[2] ?? "";
      else id = url.searchParams.get("v") ?? "";
      if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) return null;
      return {
        provider: "youtube",
        src: `https://www.youtube-nocookie.com/embed/${id}`,
      };
    }

    if (VIMEO_HOSTS.has(host)) {
      const id = url.pathname.split("/").filter(Boolean).pop() ?? "";
      if (!/^\d{5,12}$/.test(id)) return null;
      return { provider: "vimeo", src: `https://player.vimeo.com/video/${id}` };
    }
  } catch {
    return null;
  }
  return null;
}

const PAYLOAD_ATTRS = [
  "data-demo",
  "data-notebook",
  "data-mermaid",
] as const;

function attrValues(html: string, attr: string): string[] {
  const values: string[] = [];
  const pattern = new RegExp(`${attr}="([^"]*)"`, "g");
  for (const match of html.matchAll(pattern)) {
    if (match[1]) values.push(match[1]);
  }
  return values;
}

/**
 * Server-side guard for the block payloads that bypass the tag allowlist
 * (their content lives inside a data attribute). Returns a Persian error, or
 * `null` when everything is within budget.
 */
export function validateEmbeddedBlocks(html: string): string | null {
  const demos = attrValues(html, "data-demo");
  const notebooks = attrValues(html, "data-notebook");
  const mermaids = attrValues(html, "data-mermaid");
  const embeds = attrValues(html, "data-embed");
  const total = demos.length + notebooks.length + mermaids.length + embeds.length;

  if (total > MAX_BLOCK_COUNT) {
    return "تعداد بلوک‌های تعاملی بیش از حد مجاز است.";
  }

  let bytes = 0;
  for (const raw of demos) {
    const payload = decodePayload(raw);
    if (!validateDemoPayload(payload)) {
      return "یکی از بلوک‌های دمو معتبر نیست یا بیش از حد بزرگ است.";
    }
    bytes += raw.length;
  }

  for (const raw of notebooks) {
    const payload = decodePayload(raw);
    if (!validateNotebookPayload(payload)) {
      return "یکی از نوت‌بوک‌ها معتبر نیست یا بیش از حد بزرگ است.";
    }
    bytes += raw.length;
  }

  for (const raw of mermaids) {
    const code = decodePayload<string>(raw);
    if (typeof code !== "string" || code.length > MAX_DEMO_SOURCE) {
      return "یکی از نمودارهای Mermaid معتبر نیست.";
    }
    bytes += raw.length;
  }

  if (bytes > MAX_EMBEDDED_BYTES) {
    return "حجم بلوک‌های تعاملی بیشتر از حد مجاز است.";
  }

  return null;
}

export function countEmbeddedBlocks(html: string): number {
  return [...PAYLOAD_ATTRS, "data-embed"].reduce(
    (sum, attr) => sum + attrValues(html, attr).length,
    0,
  );
}

/** A stable enough id for a new cell; the runtime only needs uniqueness. */
export function cellId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `cell-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
