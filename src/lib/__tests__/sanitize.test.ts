import { describe, expect, it } from "vitest";
import { sanitizePostHtml } from "../sanitize";

describe("post sanitizer", () => {
  it("keeps rich media, tables and text styles", () => {
    const html = sanitizePostHtml(
      '<h2 dir="rtl">عنوان</h2><p style="font-family: var(--font-serif); font-size: 20px"><span style="color: var(--color-coral)">رنگ</span></p>' +
        '<video controls src="https://cdn.example.com/a.mp4"></video>' +
        '<audio controls><source src="https://cdn.example.com/a.mp3" type="audio/mpeg"></audio>' +
        '<table data-table-style="striped"><colgroup><col style="width: 25%" /></colgroup><tbody><tr><th colspan="2">h</th></tr></tbody></table>' +
        '<div data-demo="abc" data-live="true"></div><sup data-footnote="note"></sup>',
    );
    expect(html).toContain("<video");
    expect(html).toContain("<audio");
    expect(html).toContain("<colgroup>");
    expect(html).toContain('data-table-style="striped"');
    expect(html).toContain("font-family:var(--font-serif)");
    expect(html).toContain('data-demo="abc"');
    expect(html).toContain('data-footnote="note"');
    expect(html).toContain('dir="rtl"');
  });

  it("removes scripts, event handlers and unsafe urls", () => {
    const html = sanitizePostHtml(
      '<script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(2)" /><a href="javascript:alert(3)">x</a>',
    );
    expect(html).not.toContain("<script");
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<img");
  });

  it("adds safe external link attributes", () => {
    const html = sanitizePostHtml('<a href="https://example.com">x</a>');
    expect(html).toContain('target="_blank"');
    expect(html).toContain("noopener noreferrer");
  });
});
