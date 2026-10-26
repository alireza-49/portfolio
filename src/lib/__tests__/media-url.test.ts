import { describe, expect, it } from "vitest";
import {
  extensionOf,
  formatBytes,
  inferMediaKind,
  isSafeHref,
  isSafeMediaUrl,
  mimeFromExtension,
} from "../media-url";

describe("media urls", () => {
  it("accepts http(s) and site-relative urls only", () => {
    expect(isSafeMediaUrl("https://cdn.example.com/a.png")).toBe(true);
    expect(isSafeMediaUrl("/images/a.png")).toBe(true);
    expect(isSafeMediaUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeMediaUrl("data:image/png;base64,AAAA")).toBe(false);
    expect(isSafeHref("mailto:hi@example.com")).toBe(true);
    expect(isSafeHref("tel:+98912")).toBe(true);
    expect(isSafeHref("javascript:alert(1)")).toBe(false);
  });

  it("infers kinds and mime types", () => {
    expect(inferMediaKind("https://x/a.MP4")).toBe("video");
    expect(inferMediaKind("https://x/a.pdf")).toBe("file");
    expect(inferMediaKind("/x/a.png")).toBe("image");
    expect(extensionOf("https://x/a.PDF?x=1")).toBe("pdf");
    expect(mimeFromExtension("py")).toBe("text/x-python");
  });

  it("formats bytes in Persian", () => {
    expect(formatBytes(999)).toContain("۹۹۹");
    expect(formatBytes(2048)).toContain("۲");
  });
});
