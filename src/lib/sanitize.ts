import sanitizeHtml from "sanitize-html";

/**
 * Post bodies are authored in the console and rendered on the public blog, so
 * every write goes through this allowlist. It mirrors the Tiptap schema: rich
 * text, tables, task lists, tinted spans, media by URL, callouts, footnotes,
 * math placeholders and the data attributes used by interactive blocks.
 *
 * Never allow scripts, event handlers, style tags or arbitrary iframes here.
 */

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\([^)]{1,48}\)|var\(--[a-z0-9-]+\))$/i;
const SIZE = /^\d{1,4}(\.\d+)?(px|em|rem|%)$/;
const ALIGN = /^(left|right|center|justify|start|end)$/;
const FONT_FAMILY =
  /^(var\(--font-(sans|display|serif|mono)\)|["']?(Vazir|Samim|Gandom|Dirooz)["']?)$/;
const LINE_HEIGHT = /^(1(\.\d+)?|2(\.\d+)?|3(\.\d+)?)$/;
const WIDTH = /^(\d{1,4}(\.\d+)?(px|%|rem)|auto)$/;
const VERTICAL_ALIGN = /^(top|middle|bottom|baseline)$/;

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
  "video",
  "audio",
  "source",
  "track",
  "hr",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "colgroup",
  "col",
  "span",
  "sup",
  "sub",
  "figure",
  "figcaption",
  "div",
  "aside",
  "label",
  "input",
];

const DATA_ATTRS = [
  "data-demo",
  "data-notebook",
  "data-mermaid",
  "data-embed",
  "data-src",
  "data-live",
  "data-callout",
  "data-callout-title",
  "data-callout-body",
  "data-math",
  "data-tex",
  "data-footnote",
  "data-file",
  "data-kind",
  "data-asset-id",
  "data-table-style",
  "data-language",
];

export function sanitizePostHtml(html: string): string {
  const clean = sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title", "target", "rel", "download", "aria-label"],
      img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
      video: [
        "src",
        "poster",
        "controls",
        "preload",
        "loop",
        "muted",
        "playsinline",
        "width",
        "height",
        "data-asset-id",
      ],
      audio: ["src", "controls", "preload", "loop", "data-asset-id"],
      source: ["src", "type"],
      track: ["kind", "src", "srclang", "label", "default"],
      pre: ["data-language"],
      code: ["data-language"],
      table: ["data-table-style"],
      th: ["colspan", "rowspan", "scope", "colwidth", "style"],
      td: ["colspan", "rowspan", "colwidth", "style"],
      col: ["span", "style"],
      colgroup: ["span"],
      ul: ["data-type"],
      li: ["data-type", "data-checked"],
      label: [],
      input: ["type", "checked", "disabled", "aria-label"],
      sup: ["data-footnote"],
      span: ["data-math", "data-tex"],
      div: [
        "data-demo",
        "data-notebook",
        "data-mermaid",
        "data-embed",
        "data-src",
        "data-live",
        "data-callout",
        "data-callout-title",
        "data-callout-body",
        "data-math",
        "data-tex",
      ],
      p: ["data-callout-title"],
      figure: ["data-file", "data-kind", "data-asset-id"],
      "*": ["style", "dir", ...DATA_ATTRS.filter((attr) => attr !== "data-tex")],
    },
    allowedStyles: {
      "*": {
        "text-align": [ALIGN],
        color: [COLOR],
        "background-color": [COLOR],
        "font-size": [SIZE],
        "font-family": [FONT_FAMILY],
        "line-height": [LINE_HEIGHT],
        width: [WIDTH],
        "max-width": [WIDTH],
        "vertical-align": [VERTICAL_ALIGN],
      },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"],
      video: ["http", "https"],
      audio: ["http", "https"],
      source: ["http", "https"],
      track: ["http", "https"],
    },
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
        attribs: {
          ...attribs,
          loading: attribs.loading ?? "lazy",
          decoding: attribs.decoding ?? "async",
        },
      }),
      video: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          controls: attribs.controls ?? "",
          preload: attribs.preload ?? "metadata",
        },
      }),
      audio: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          controls: attribs.controls ?? "",
          preload: attribs.preload ?? "metadata",
        },
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
 * Re-exported here for the server-side callers that already import this module.
 */
export { isSafeMediaUrl } from "./media-url";
