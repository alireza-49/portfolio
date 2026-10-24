import sanitizeHtml from "sanitize-html";

/**
 * Post bodies are authored in the console and rendered on the public blog, so
 * every write goes through this allowlist. It mirrors the Tiptap schema: rich
 * text, tables, task lists, tinted spans and images by URL — never scripts,
 * event handlers, iframes or arbitrary classes.
 */

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\([^)]{1,48}\)|var\(--[a-z0-9-]+\))$/i;
const SIZE = /^\d{1,3}(\.\d+)?(px|em|rem|%)$/;
const ALIGN = /^(left|right|center|justify|start|end)$/;

const ALLOWED_TAGS = [
  "p",
  "br",
  "h1",
  "h2",
  "h3",
  "h4",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "del",
  "mark",
  "code",
  "pre",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "hr",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "span",
  "figure",
  "figcaption",
  "div",
  "label",
  "input",
];

export function sanitizePostHtml(html: string): string {
  const clean = sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan", "colwidth", "style"],
      ul: ["data-type"],
      li: ["data-type", "data-checked"],
      label: [],
      input: ["type", "checked", "disabled", "aria-label"],
      "*": ["style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [ALIGN],
        color: [COLOR],
        "background-color": [COLOR],
        "font-size": [SIZE],
      },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: {
      // Author links open in a new tab and never hand over the opener.
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const external = /^https?:/i.test(href);
        return {
          tagName,
          attribs: external
            ? { ...attribs, target: "_blank", rel: "noopener noreferrer" }
            : { ...attribs, rel: "noopener noreferrer" },
        };
      },
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: attribs.loading ?? "lazy" },
      }),
    },
    exclusiveFilter: (frame) =>
      frame.tag === "img" && !frame.attribs.src?.trim(),
  });

  return clean.trim();
}

/** Plain text for reading time and excerpts. */
export function stripHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
    allowedSchemes: [],
  })
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Cover images and inline media are URLs. Site-relative paths and http(s) are
 * allowed; anything else (`javascript:`, `data:`) is rejected before storage.
 */
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
