import { createHash, randomUUID } from "node:crypto";

export const READER_COOKIE = "cc_reader";
export const READER_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const READER_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isReaderId(value: string | null | undefined): value is string {
  return typeof value === "string" && READER_ID.test(value);
}

export function newReaderId(): string {
  return randomUUID();
}

/**
 * The cookie id never reaches Postgres: the database only sees this salted
 * digest, so a dump cannot be matched back to a browser.
 */
export function visitorHash(readerId: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${readerId}`).digest("hex");
}

export function readerSalt(): string {
  return process.env.ENGAGEMENT_SALT?.trim() || "cc-engagement-dev";
}
