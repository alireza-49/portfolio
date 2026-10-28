// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import { editorExtensions } from "../extensions";
import { encodePayload } from "@/lib/richtext";

function makeEditor(content: string, markdown = false) {
  return new Editor({
    extensions: editorExtensions,
    content,
    ...(markdown ? { contentType: "markdown" } : {}),
  } as never);
}

describe("editor markdown round-trip", () => {
  it("keeps headings, tables, media and interactive blocks", () => {
    const demo = encodePayload({ html: "<b>ok</b>", css: "", js: "" });
    const notebook = encodePayload({ version: 1, packages: [], cells: [{ id: "c1", kind: "code", source: "print(1)" }] });
    const source = [
      "<h2>عنوان</h2>",
      "<p><strong>متن</strong> <em>کج</em></p>",
      "<table><tbody><tr><th>a</th><th>b</th></tr><tr><td>1</td><td>2</td></tr></tbody></table>",
      '<figure data-kind="video" data-asset-id="abc"><video controls src="https://cdn.example.com/a.mp4"></video><figcaption>ویدیو</figcaption></figure>',
      `<div data-demo="${demo}" data-live="true"></div>`,
      '<div data-callout="warning" data-callout-title="هشدار"><div data-callout-body><p>محتوا</p></div></div>',
      '<sup data-footnote="نکته"></sup>',
      '<span data-math="inline" data-tex="x^2"></span>',
      `<div data-notebook="${notebook}"></div>`,
      '<div data-mermaid="Z3JhcGggVEQ="></div>',
      '<div data-embed="youtube" data-src="https://www.youtube-nocookie.com/embed/abc"></div>',
      '<figure data-file="file" data-href="https://cdn.example.com/a.pdf"><a href="https://cdn.example.com/a.pdf">a.pdf</a><figcaption>PDF</figcaption></figure>',
    ].join("");

    const editor = makeEditor(source);
    const markdown = editor.getMarkdown();
    const restored = makeEditor(markdown, true);
    const html = restored.getHTML();

    expect(markdown).toContain("## عنوان");
    expect(markdown).toContain("**متن**");
    expect(html).toContain("<h2");
    expect(html).toContain("<strong>");
    expect(html).toContain("data-demo");
    expect(html).toContain("data-callout");
    expect(html).toContain("محتوا");
    expect(html).toContain("هشدار");
    expect(html).toContain("data-footnote");
    expect(html).toContain("data-tex");
    expect(html).toContain("data-notebook");
    expect(html).toContain("data-mermaid");
    expect(html).toContain("data-embed");
    expect(html).toContain("data-file");
    expect(html).toContain("<table");

    editor.destroy();
    restored.destroy();
  });
});
