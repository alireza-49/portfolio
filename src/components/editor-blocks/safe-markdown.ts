const SAFE_HREF = /^(https?:\/\/|\/|mailto:|tel:)/i;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escape first, then add a deliberately tiny inline markdown subset. */
export function renderSafeMarkdown(source: string): string {
  let text = escapeHtml(source);
  text = text.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  text = text.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  text = text.replace(
    /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (match, label: string, href: string) =>
      SAFE_HREF.test(href) ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>` : match,
  );
  return text.split(/\n{2,}/).map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`).join("");
}

const BLOCKED = new Set(["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "FORM", "LINK", "META"]);

/**
 * Pyodide can return `_repr_html_` from arbitrary packages. Keep a safe subset:
 * no scripts, no event handlers, no javascript: URLs.
 */
export function sanitizeDisplayHtml(html: string): string {
  if (typeof document === "undefined") return "";
  const template = document.createElement("template");
  template.innerHTML = html;
  for (const element of Array.from(template.content.querySelectorAll("*"))) {
    if (BLOCKED.has(element.tagName)) {
      element.remove();
      continue;
    }
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      if (name.startsWith("on") || name === "srcdoc") {
        element.removeAttribute(attribute.name);
        continue;
      }
      if ((name === "href" || name === "src" || name === "action") && !SAFE_HREF.test(value) && !/^data:image\//i.test(value)) {
        element.removeAttribute(attribute.name);
      }
    }
    if (element.tagName === "A") {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
    }
  }
  return template.innerHTML;
}
