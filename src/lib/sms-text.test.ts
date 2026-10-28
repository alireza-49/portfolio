import { describe, expect, it } from "vitest";
import {
  SMS_BRAND,
  buildProjectProgressSms,
  buildProjectStatusSms,
  buildSubmissionSms,
  buildTestSms,
  normalizeMobile,
  smsSegments,
  truncateForSms,
} from "./sms-text";

const ISO = "2026-10-26T10:00:00.000Z";

describe("sms text", () => {
  it("normalizes every mobile shape to one national number", () => {
    for (const raw of [
      "09121234567",
      "+989121234567",
      "00989121234567",
      "989121234567",
      "9121234567",
      "۰۹۱۲ ۱۲۳ ۴۵۶۷",
      "+98 (912) 123-45-67",
    ]) {
      expect(normalizeMobile(raw)).toBe("09121234567");
    }
  });

  it("refuses landlines and anything too short", () => {
    expect(normalizeMobile("02188776655")).toBeNull();
    expect(normalizeMobile("0912123456")).toBeNull();
    expect(normalizeMobile("")).toBeNull();
    expect(normalizeMobile(null)).toBeNull();
  });

  it("counts Persian bodies in UCS-2 parts and Latin in GSM parts", () => {
    expect(smsSegments("")).toBe(0);
    expect(smsSegments("کوتاه")).toBe(1);
    expect(smsSegments("ا".repeat(70))).toBe(1);
    expect(smsSegments("ا".repeat(71))).toBe(2);
    expect(smsSegments("a".repeat(160))).toBe(1);
    expect(smsSegments("a".repeat(161))).toBe(2);
  });

  it("truncates a long project title instead of eating the message", () => {
    // No space to break on, so the hard cut keeps the budget exact.
    expect(truncateForSms("یک".repeat(40), 10)).toBe(`${"یک".repeat(4)}ی…`);
    // With words, the last partial word is dropped instead of half-rendered.
    expect(truncateForSms("سلام دنیای پیامک کوتاه", 12)).toBe("سلام دنیای…");
    expect(truncateForSms("  کوتاه  ")).toBe("کوتاه");
  });

  it("builds the submission message: brand, Persian date, reference, link", () => {
    const body = buildSubmissionSms({
      createdAt: ISO,
      reference: "REQ-1A2B3C4D",
      link: "https://phil.example/track?ref=abc",
    });

    expect(body.startsWith(`${SMS_BRAND}: `)).toBe(true);
    expect(body).toContain("درخواست شما در");
    // 2026-10-26 falls in آبان ۱۴۰۵.
    expect(body).toContain("۱۴۰۵");
    expect(body).toContain("REQ-1A2B3C4D");
    expect(body).toContain("https://phil.example/track?ref=abc");
  });

  it("builds the status message and drops the link for an unpublished project", () => {
    const linked = buildProjectStatusSms({
      title: "سایت آرین",
      statusLabel: "در حال اجرا",
      progress: 65,
      link: "https://phil.example/track/CC-1",
    });
    expect(linked).toContain("وضعیت پروژه «سایت آرین»");
    expect(linked).toContain("«در حال اجرا»");
    expect(linked).toContain("۶۵٪");
    expect(linked).toContain("https://phil.example/track/CC-1");

    const bare = buildProjectStatusSms({
      title: "سایت آرین",
      statusLabel: "در حال اجرا",
      progress: 65,
      link: null,
    });
    expect(bare).not.toContain("مشاهده");
    expect(bare).not.toContain("http");
  });

  it("builds the manual progress message with its phase", () => {
    const body = buildProjectProgressSms({
      title: "سایت آرین",
      progress: 80,
      phase: "تست نهایی",
      link: null,
    });
    expect(body).toContain("۸۰٪");
    expect(body).toContain("مرحله: تست نهایی");

    const noPhase = buildProjectProgressSms({
      title: "سایت آرین",
      progress: 80,
      phase: "  ",
      link: null,
    });
    expect(noPhase).not.toContain("مرحله");
  });

  it("keeps every body Persian-branded", () => {
    expect(buildTestSms().startsWith(`${SMS_BRAND}: `)).toBe(true);
  });
});
