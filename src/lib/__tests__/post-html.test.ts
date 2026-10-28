import { describe, expect, it } from "vitest";
import { addHeadingIds, enhancePostHtml } from "../post-html";

describe("post html", () => {
  it("adds positional heading ids and returns the outline", () => {
    const result = addHeadingIds('<h2 id="old">یک</h2><h3>دو</h3>');
    expect(result.headings).toEqual([
      { id: "section-1", text: "یک", level: 2 },
      { id: "section-2", text: "دو", level: 3 },
    ]);
    expect(result.html).toContain('id="section-1"');
    expect(result.html).not.toContain('id="old"');
  });

  it("highlights code and escapes unknown languages", () => {
    const html = enhancePostHtml(
      '<pre data-language="javascript"><code>const a = 1;</code></pre><pre data-language="nope"><code>&lt;x&gt;</code></pre>',
    );
    expect(html).toContain('class="post-code"');
    expect(html).toContain('data-code-copy');
    expect(html).toContain("hljs");
    expect(html).toContain("&lt;x&gt;");
  });

  it("renders math and footnotes", () => {
    const html = enhancePostHtml(
      '<span data-math="inline" data-tex="x^2">x</span><sup data-footnote="نکته">1</sup>',
    );
    expect(html).toContain("katex");
    expect(html).toContain('id="fnref-1"');
    expect(html).toContain('class="post-footnotes"');
  });
});
