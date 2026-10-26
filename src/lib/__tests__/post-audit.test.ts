import { describe, expect, it } from "vitest";
import { auditPost } from "../post-audit";

describe("post audit", () => {
  it("warns about missing alt, tables and code language", () => {
    const issues = auditPost({
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "hello" }] },
        { type: "image", attrs: { src: "/a.png", alt: "" } },
        { type: "table", content: [{ type: "tableRow", content: [{ type: "tableCell", content: [] }] }] },
        { type: "codeBlock", attrs: {}, content: [{ type: "text", text: "x" }] },
      ],
    });
    expect(issues.map((issue) => issue.id)).toEqual(
      expect.arrayContaining(["image-alt", "table-header", "code-language"]),
    );
  });

  it("does not invent issues for a clean document", () => {
    const issues = auditPost({
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "سلام" }] }],
    });
    expect(issues).toEqual([]);
  });
});
