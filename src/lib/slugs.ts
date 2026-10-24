/**
 * Slugs stay readable for Persian titles (URLs may contain Persian letters) and
 * keep Latin/digit words untouched. The action layer is responsible for the
 * uniqueness check; this helper only normalizes.
 */
function randomSuffix(): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return uuid.slice(0, 8);
  return Math.random().toString(36).slice(2, 10);
}

export function slugify(value: string, fallback = "post"): string {
  const base = value
    .trim()
    .toLowerCase()
    // ZWNJ and any punctuation/whitespace run becomes one dash.
    .replace(/[\u200c\u200f\u200e]+/g, "-")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");

  return base || `${fallback}-${randomSuffix()}`;
}
