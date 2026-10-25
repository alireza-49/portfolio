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

