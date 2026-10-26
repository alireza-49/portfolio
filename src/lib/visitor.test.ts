import { describe, expect, it } from "vitest";
import { isReaderId, newReaderId, visitorHash } from "./visitor";

describe("reader identity", () => {
  it("mints ids its own validator accepts", () => {
    const id = newReaderId();
    expect(isReaderId(id)).toBe(true);
    expect(isReaderId("not-a-uuid")).toBe(false);
    expect(isReaderId("")).toBe(false);
    expect(isReaderId(null)).toBe(false);
  });

  it("hashes one reader to one 64-char digest", () => {
    const id = "2c1f3c1e-0f6b-4b8f-9d1a-3c7e5a9b0d21";
    expect(visitorHash(id, "salt-a")).toBe(visitorHash(id, "salt-a"));
    expect(visitorHash(id, "salt-a")).toMatch(/^[0-9a-f]{64}$/);
  });

  it("separates readers and salts", () => {
    const a = "2c1f3c1e-0f6b-4b8f-9d1a-3c7e5a9b0d21";
    const b = "b7d1c2a4-5e6f-4a8b-9c0d-1e2f3a4b5c6d";
    expect(visitorHash(a, "salt-a")).not.toBe(visitorHash(b, "salt-a"));
    expect(visitorHash(a, "salt-a")).not.toBe(visitorHash(a, "salt-b"));
  });
});
