/**
 * Client-safe comment payload rules. The route applies these before touching
 * the database; the admin page never re-validates stored rows.
 */

export const COMMENT_LIMITS = { name: 80, email: 160, body: 3000 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type CommentInput = { name: string; email: string; body: string };

export type CommentParseResult =
  | { ok: true; value: CommentInput }
  | { ok: false; error: string };

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function parseCommentInput(raw: unknown): CommentParseResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "دادهٔ نظر معتبر نیست." };
  }
  const record = raw as Record<string, unknown>;
  const name = field(record.name, COMMENT_LIMITS.name);
  const email = field(record.email, COMMENT_LIMITS.email);
  const body = field(record.body, COMMENT_LIMITS.body);

  if (!name) return { ok: false, error: "نام الزامی است." };
  if (!email) return { ok: false, error: "ایمیل الزامی است." };
  if (!EMAIL.test(email)) return { ok: false, error: "ایمیل معتبر نیست." };
  if (!body) return { ok: false, error: "متن نظر الزامی است." };

  return { ok: true, value: { name, email, body } };
}

/** Bots fill every field; humans never see `website`, so a value means a bot. */
export function isHoneypot(raw: unknown): boolean {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
  const value = (raw as Record<string, unknown>).website;
  return typeof value === "string" && value.trim().length > 0;
}
