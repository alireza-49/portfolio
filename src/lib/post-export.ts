import type { Post } from "./types";

function yaml(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * A portable Markdown export. The body is the editor's own Markdown
 * serialization; the frontmatter carries the metadata the device may not have.
 */
export function buildPostMarkdown(post: Post, markdown: string): string {
  const lines = [
    "---",
    `title: ${yaml(post.title)}`,
    `slug: ${yaml(post.slug)}`,
    `excerpt: ${yaml(post.excerpt)}`,
    `author: ${yaml(post.author)}`,
    `status: ${post.status}`,
    `published_at: ${post.publishedAt ?? "null"}`,
    `tags: [${post.tags.map(yaml).join(", ")}]`,
    "---",
    "",
    markdown.trim(),
    "",
  ];
  return lines.join("\n");
}

export function downloadTextFile(
  filename: string,
  content: string,
  mime = "text/markdown;charset=utf-8",
): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
