import { describe, expect, it } from "vitest";
import {
  decodePayload,
  embedFromUrl,
  encodePayload,
  isEmbedProvider,
  validateDemoPayload,
  validateEmbeddedBlocks,
  validateNotebookPayload,
} from "../richtext";

describe("embedded payloads", () => {
  it("round-trips unicode through base64url", () => {
    const value = { text: "سلام <b>دنیا</b> & ۱۰۰" };
    expect(decodePayload(encodePayload(value))).toEqual(value);
  });

  it("validates demo payloads", () => {
    expect(validateDemoPayload({ html: "<b>ok</b>", css: "", js: "" })).not.toBeNull();
    expect(validateDemoPayload({ html: " ", css: "", js: "" })).toBeNull();
    expect(validateDemoPayload({ html: "x".repeat(60_000), css: "", js: "" })).toBeNull();
  });

  it("validates notebook cells", () => {
    expect(
      validateNotebookPayload({
        version: 1,
        packages: ["numpy", "bad package!"],
        cells: [{ id: "a", kind: "code", source: "print(1)" }],
      }),
    ).toMatchObject({ packages: ["numpy"] });
    expect(validateNotebookPayload({ version: 1, packages: [], cells: [] })).toBeNull();
  });

  it("rejects invalid embedded blocks", () => {
    const demo = encodePayload({ html: "<b>x</b>", css: "", js: "" });
    expect(validateEmbeddedBlocks(`<div data-demo="${demo}"></div>`)).toBeNull();
    expect(validateEmbeddedBlocks(`<div data-demo="not-base64!!"></div>`)).toContain("دمو");
    expect(validateEmbeddedBlocks(`<div data-mermaid="abc"></div>`)).toContain("Mermaid");
  });
});

describe("embed urls", () => {
  it("reads aparat links in every shape the site hands out", () => {
    const src = "https://www.aparat.com/video/video/embed/videohash/woh65a0/vt/frame";
    for (const url of [
      "https://www.aparat.com/v/woh65a0",
      "https://aparat.com/v/woh65a0/",
      "https://www.aparat.com/embed/woh65a0?data[rnddiv]=1&data[responsive]=yes",
      src,
    ]) {
      expect(embedFromUrl(url)).toEqual({ provider: "aparat", src });
    }
  });

  it("refuses malformed aparat hashes", () => {
    expect(embedFromUrl("https://www.aparat.com/v/")).toBeNull();
    expect(embedFromUrl("https://www.aparat.com/v/ab")).toBeNull();
    expect(embedFromUrl("https://www.aparat.com/v/<script>")).toBeNull();
    expect(embedFromUrl("https://example.com/v/woh65a0")).toBeNull();
  });

  it("keeps the existing providers and narrows stored providers", () => {
    expect(embedFromUrl("https://youtu.be/dQw4w9WgXcQ")).toMatchObject({ provider: "youtube" });
    expect(embedFromUrl("https://vimeo.com/76979871")).toMatchObject({ provider: "vimeo" });
    expect(isEmbedProvider("aparat")).toBe(true);
    expect(isEmbedProvider("vimeo")).toBe(true);
    expect(isEmbedProvider("dailymotion")).toBe(false);
    expect(isEmbedProvider(null)).toBe(false);
  });
});
