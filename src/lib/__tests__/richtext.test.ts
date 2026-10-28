import { describe, expect, it } from "vitest";
import {
  decodePayload,
  encodePayload,
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
