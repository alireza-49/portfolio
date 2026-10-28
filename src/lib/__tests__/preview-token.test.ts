import { describe, expect, it } from "vitest";
import { hashPreviewToken, isPreviewToken, issuePreviewToken, previewPath } from "../preview-token";

describe("preview tokens", () => {
  it("issues opaque hashed tokens", () => {
    const { token, hash, expiresAt } = issuePreviewToken();
    expect(isPreviewToken(token)).toBe(true);
    expect(hash).toBe(hashPreviewToken(token));
    expect(hash).not.toBe(token);
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
    expect(previewPath(token)).toBe(`/blog/preview/${token}`);
  });
});
