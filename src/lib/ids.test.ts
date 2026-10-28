import { describe, expect, it } from "vitest";
import { uniqueUuids } from "./ids";

describe("uniqueUuids", () => {
  it("keeps valid ids once, in order", () => {
    const a = "2c1f3c1e-0f6b-4b8f-9d1a-3c7e5a9b0d21";
    const b = "b7d1c2a4-5e6f-4a8b-9c0d-1e2f3a4b5c6d";
    expect(uniqueUuids([a, a.toUpperCase(), b, a])).toEqual([a, b]);
  });

  it("drops junk", () => {
    expect(uniqueUuids(["", "not-a-uuid", 42, null, {}])).toEqual([]);
    expect(uniqueUuids(undefined)).toEqual([]);
    expect(uniqueUuids("2c1f3c1e-0f6b-4b8f-9d1a-3c7e5a9b0d21")).toEqual([]);
  });
});
