import { describe, expect, it } from "vitest";
import {
  CONTACT_SEND_WINDOW_MS,
  contactRef,
  latinDigits,
  looksLikePhone,
  maskPhone,
  readPendingContact,
  sendLockRemaining,
  writePendingContact,
} from "./contact-pending";

const ID = "2c1f3c1e-0f6b-4b8f-9d1a-3c7e5a9b0d21";

describe("looksLikePhone", () => {
  it("accepts Iranian mobiles in Latin and Persian digits", () => {
    expect(looksLikePhone("09121234567")).toBe(true);
    expect(looksLikePhone("۰۹۱۲۳۴۵۶۷۸۹")).toBe(true);
    expect(looksLikePhone("+98 912 123 4567")).toBe(true);
    expect(looksLikePhone("00989121234567")).toBe(true);
  });

  it("rejects landlines, emails and junk", () => {
    expect(looksLikePhone("02188776655")).toBe(false);
    expect(looksLikePhone("sara@example.com")).toBe(false);
    expect(looksLikePhone("@sara")).toBe(false);
    expect(looksLikePhone("")).toBe(false);
  });
});

describe("latinDigits", () => {
  it("converts Persian and Arabic digits", () => {
    expect(latinDigits("۰۹۱۲ ٤٥٦")).toBe("0912 456");
  });
});

describe("maskPhone", () => {
  it("keeps the first and last four digits, normalized to a local number", () => {
    expect(maskPhone("09121234567")).toBe("0912•••4567");
    expect(maskPhone("+98 912 123 4567")).toBe("0912•••4567");
    expect(maskPhone("۰۰۹۸۹۱۲۱۲۳۴۵۶۷")).toBe("0912•••4567");
    expect(maskPhone("0218877")).toBe("0218877");
  });
});

describe("sendLockRemaining", () => {
  it("counts down and never goes negative", () => {
    const sentAt = Date.now();
    expect(sendLockRemaining({ id: ID, sentAt })).toBeLessThanOrEqual(
      CONTACT_SEND_WINDOW_MS,
    );
    expect(sendLockRemaining({ id: ID, sentAt }, sentAt + 60_000)).toBe(
      CONTACT_SEND_WINDOW_MS - 60_000,
    );
    expect(sendLockRemaining({ id: ID, sentAt }, sentAt + 60 * 60_000)).toBe(0);
    expect(sendLockRemaining(null)).toBe(0);
  });
});

describe("contactRef", () => {
  it("derives a short stable code from the submission id", () => {
    expect(contactRef(ID)).toBe("REQ-2C1F3C1E");
  });
});

describe("pending storage", () => {
  it("is inert without a browser and rejects junk ids", () => {
    expect(readPendingContact()).toBeNull();
    expect(writePendingContact("not-a-uuid")).toBeNull();
  });
});
