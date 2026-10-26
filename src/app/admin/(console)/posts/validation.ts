import { readingMinutes } from "@/lib/fa";
import { isSafeMediaUrl, sanitizePostHtml, stripHtml } from "@/lib/sanitize";
import { slugify } from "@/lib/slugs";
import {
  POST_STATUSES,
  type PostInput,
  type PostStatus,
} from "@/lib/types";

/**
 * Post payloads come from the Tiptap editor, so the HTML is sanitized here (not
 * at render time) and the metadata is re-validated field by field.
 */

export type PostParseResult =
  | { ok: true; value: PostInput; readingMinutes: number }
  | { ok: false; error: string };

const SLUG = /^[\p{L}\p{N}-]{1,80}$/u;
const ISO_DATE_TIME =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,6})?)?(Z|[+-]\d{2}:\d{2})$/;

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function parsePostInput(raw: unknown): PostParseResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "دادهٔ یادداشت معتبر نیست." };
  }

  const record = raw as Record<string, unknown>;
  const title = text(record.title, 180);

  if (!title) {
    return { ok: false, error: "عنوان یادداشت الزامی است." };
  }

  const slugInput = text(record.slug, 120);
  const slug = slugInput ? slugInput : slugify(title);

  if (!SLUG.test(slug)) {
    return {
      ok: false,
      error:
        "نامک فقط می‌تواند شامل حروف، ارقام و خط تیره باشد (حداکثر ۸۰ کاراکتر).",
    };
  }

  const contentHtml = sanitizePostHtml(
    typeof record.contentHtml === "string" ? record.contentHtml.slice(0, 250_000) : "",
  );
  const plain = stripHtml(contentHtml);
  const status: PostStatus =
    typeof record.status === "string" &&
    (POST_STATUSES as readonly string[]).includes(record.status)
      ? (record.status as PostStatus)
      : "draft";

  if (status === "published" && plain.length < 40) {
    return {
      ok: false,
      error: "برای انتشار، متن یادداشت باید حداقل ۴۰ کاراکتر باشد.",
    };
  }

  const coverUrl = text(record.coverUrl, 600);
  if (!isSafeMediaUrl(coverUrl)) {
    return {
      ok: false,
      error: "نشانی تصویر کاور باید با http(s) یا / شروع شود.",
    };
  }

  const tags = Array.isArray(record.tags)
    ? Array.from(
        new Set(
          record.tags
            .filter((tag): tag is string => typeof tag === "string")
            .map((tag) => tag.trim().slice(0, 30))
            .filter(Boolean),
        ),
      ).slice(0, 8)
    : [];

  let publishedAt: string | null = null;
  if (status === "published") {
    const candidate = text(record.publishedAt, 40);
    publishedAt =
      ISO_DATE_TIME.test(candidate) && !Number.isNaN(Date.parse(candidate))
        ? new Date(candidate).toISOString()
        : new Date().toISOString();
  }

  const value: PostInput = {
    title,
    slug,
    excerpt: text(record.excerpt, 400),
    contentHtml,
    coverUrl,
    author: text(record.author, 120) || "وب دیزاین فیل",
    tags,
    status,
    publishedAt,
  };

  return {
    ok: true,
    value,
    readingMinutes: Math.min(240, readingMinutes(plain || title)),
  };
}
