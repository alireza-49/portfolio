/**
 * Client-safe text helpers: no Node-only imports, so both the archive (a client
 * component) and the server reader can share them.
 */
export function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** First N characters of the body, used when the author left the excerpt empty. */
export function deriveExcerpt(html: string, max = 170): string {
  const text = stripTags(html);
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}
