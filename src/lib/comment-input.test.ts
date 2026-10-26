import { describe, expect, it } from "vitest";
import { isHoneypot, parseCommentInput } from "./comment-input";

describe("parseCommentInput", () => {
  it("trims and accepts a valid comment", () => {
    const result = parseCommentInput({
      name: "  سارا ",
      email: " sara@example.com ",
      body: " سلام\nدنیا ",
    });
    expect(result).toEqual({
      ok: true,
      value: { name: "سارا", email: "sara@example.com", body: "سلام\nدنیا" },
    });
  });

  it("rejects blank name, malformed email and blank body", () => {
    expect(parseCommentInput({ name: " ", email: "a@b.co", body: "x" })).toEqual({
      ok: false,
      error: "نام الزامی است.",
    });
    expect(parseCommentInput({ name: "سارا", email: "sara", body: "x" })).toEqual({
      ok: false,
      error: "ایمیل معتبر نیست.",
    });
    expect(
      parseCommentInput({ name: "سارا", email: "sara@example.com", body: " " }),
    ).toEqual({ ok: false, error: "متن نظر الزامی است." });
    expect(parseCommentInput(null)).toEqual({
      ok: false,
      error: "دادهٔ نظر معتبر نیست.",
    });
  });

  it("caps name and body at the published limits", () => {
    const result = parseCommentInput({
      name: "ن".repeat(100),
      email: "sara@example.com",
      body: "م".repeat(4000),
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.name).toHaveLength(80);
    expect(result.value.body).toHaveLength(3000);
  });
});

describe("isHoneypot", () => {
  it("flags only a filled website field", () => {
    expect(isHoneypot({ website: "" })).toBe(false);
    expect(isHoneypot({ website: "   " })).toBe(false);
    expect(isHoneypot({ website: "http://spam.test" })).toBe(true);
    expect(isHoneypot(null)).toBe(false);
    expect(isHoneypot({})).toBe(false);
  });
});
