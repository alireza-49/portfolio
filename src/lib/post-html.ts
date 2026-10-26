import hljs from "highlight.js";
import katex from "katex";
import { faNumber } from "./fa";
import { stripTags } from "./text";

export type PostHeading = { id: string; text: string; level: number };

/**
 * The editor does not write anchors, so the reader adds one stable id per H2/H3
 * and returns the outline for the table of contents. Ids are positional
 * (`section-1`, …) which keeps them unique even when two headings share a title.
 */
export function addHeadingIds(html: string): {
  html: string;
  headings: PostHeading[];
} {
  const headings: PostHeading[] = [];
  let index = 0;

  const withIds = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, level: string, attrs: string, inner: string) => {
      index += 1;
      const id = `section-${index}`;
      const text = stripTags(inner);
      headings.push({ id, text, level: Number(level) });
      const cleaned = attrs.replace(/\sid="[^"]*"/gi, "");
      return `<h${level}${cleaned} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: withIds, headings };
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_m, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&#(\d+);/g, (_m, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const LANGUAGE_LABELS: Record<string, string> = {
  bash: "Bash",
  css: "CSS",
  diff: "Diff",
  html: "HTML",
  javascript: "JavaScript",
  js: "JavaScript",
  json: "JSON",
  jsx: "JSX",
  markdown: "Markdown",
  md: "Markdown",
  plaintext: "متن",
  python: "Python",
  py: "Python",
  sql: "SQL",
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  xml: "XML",
  yaml: "YAML",
  yml: "YAML",
};

function normalizeLanguage(value: string): string {
  const key = value.trim().toLowerCase();
  if (!key) return "plaintext";
  return hljs.getLanguage(key) ? key : "plaintext";
}

function languageLabel(language: string): string {
  return LANGUAGE_LABELS[language] ?? language.toUpperCase();
}

function renderCodeBlock(attrs: string, inner: string): string {
  const attrLanguage = /\bdata-language="([^"]*)"/i.exec(attrs)?.[1] ?? "";
  const codeMatch = /<code([^>]*)>([\s\S]*?)<\/code>/i.exec(inner);
  const codeAttrs = codeMatch?.[1] ?? "";
  const classLanguage =
    /\bclass="[^"]*language-([a-z0-9_+-]+)[^"]*"/i.exec(codeAttrs)?.[1] ?? "";
  const language = normalizeLanguage(attrLanguage || classLanguage);
  const raw = decodeEntities(codeMatch?.[2] ?? inner);
  const label = languageLabel(language);

  let body: string;
  if (language === "plaintext") {
    body = escapeHtml(raw);
  } else {
    try {
      body = hljs.highlight(raw, { language, ignoreIllegals: true }).value;
    } catch {
      body = escapeHtml(raw);
    }
  }

  return `<div class="post-code" data-language="${escapeHtml(language)}"><div class="post-code-head"><span class="post-code-lang">${escapeHtml(label)}</span><button type="button" class="post-code-copy" data-code-copy aria-label="کپی کد">کپی</button></div><pre><code class="hljs language-${escapeHtml(language)}">${body}</code></pre></div>`;
}

function highlightCodeBlocks(html: string): string {
  return html.replace(/<pre([^>]*)>([\s\S]*?)<\/pre>/gi, (_match, attrs, inner) =>
    renderCodeBlock(attrs, inner),
  );
}

function renderMath(html: string): string {
  return html.replace(
    /<(span|div)([^>]*\bdata-math="(inline|block)"[^>]*)>([\s\S]*?)<\/\1>/gi,
    (_match, _tag, attrs: string, mode: string, fallback: string) => {
      const tex = decodeEntities(
        /\bdata-tex="([^"]*)"/i.exec(attrs)?.[1] ?? "",
      );
      const displayMode = mode === "block";
      try {
        const rendered = katex.renderToString(tex, {
          displayMode,
          throwOnError: false,
          strict: "ignore",
          trust: false,
        });
        return displayMode
          ? `<div class="post-math post-math-block">${rendered}</div>`
          : `<span class="post-math">${rendered}</span>`;
      } catch {
        return `<code class="post-math-fallback">${escapeHtml(
          tex || decodeEntities(fallback),
        )}</code>`;
      }
    },
  );
}

function renderFootnotes(html: string): string {
  const notes: string[] = [];

  const withRefs = html.replace(
    /<sup[^>]*\bdata-footnote="([^"]*)"[^>]*>[\s\S]*?<\/sup>/gi,
    (_match, rawNote: string) => {
      notes.push(decodeEntities(rawNote));
      const number = notes.length;
      return `<sup class="post-fn-ref" id="fnref-${number}"><a href="#fn-${number}" aria-label="پانویس ${faNumber(number)}">${faNumber(number)}</a></sup>`;
    },
  );

  if (notes.length === 0) return withRefs;

  const items = notes
    .map(
      (note, index) =>
        `<li id="fn-${index + 1}">${escapeHtml(note).replace(/\n/g, "<br>")} <a class="post-fn-back" href="#fnref-${index + 1}" aria-label="بازگشت به متن">↩</a></li>`,
    )
    .join("");

  return `${withRefs}<section class="post-footnotes" aria-label="پانویس‌ها"><p class="post-footnotes-title">پانویس‌ها</p><ol>${items}</ol></section>`;
}

/**
 * Server-side enhancement for the saved body: syntax highlighting, KaTeX and
 * footnote links. It runs after sanitization, so the generated classes and
 * wrappers are trusted output — never feed raw author HTML through here.
 */
export function enhancePostHtml(html: string): string {
  let result = highlightCodeBlocks(html);
  result = renderMath(result);
  result = renderFootnotes(result);
  return result;
}
