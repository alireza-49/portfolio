import { describe, expect, it } from "vitest";
import { parsePostInput } from "./validation";

function draft(extra: Record<string, unknown> = {}) {
  return {
    title: "یادداشت آزمایشی",
    slug: "test-post",
    excerpt: "",
    contentHtml: "<p>سلام دنیا</p>",
    coverUrl: "",
    author: "",
    tags: [],
    status: "draft",
    publishedAt: null,
    baseViews: 0,
    baseLikes: 0,
    ...extra,
  };
}

describe("parsePostInput baselines", () => {
  it("defaults to zero when the fields are missing", () => {
    const result = parsePostInput(draft({ baseViews: undefined, baseLikes: undefined }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.baseViews).toBe(0);
    expect(result.value.baseLikes).toBe(0);
  });

  it("clamps negatives to zero and fractions to whole numbers", () => {
    const result = parsePostInput(draft({ baseViews: -5, baseLikes: 12.7 }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.baseViews).toBe(0);
    expect(result.value.baseLikes).toBe(13);
  });

  it("caps absurd values at ten million and drops junk", () => {
    const high = parsePostInput(draft({ baseViews: 9e12, baseLikes: "abc" }));
    expect(high.ok).toBe(true);
    if (!high.ok) return;
    expect(high.value.baseViews).toBe(10_000_000);
    expect(high.value.baseLikes).toBe(0);
  });
});
