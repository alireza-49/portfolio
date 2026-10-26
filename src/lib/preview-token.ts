import { createHash, randomBytes } from "node:crypto";

/**
 * A draft-preview link is a random bearer token. Only its SHA-256 hash is
 * stored, so a database dump does not hand out working preview URLs.
 */

export const PREVIEW_DAYS = 7;

export function issuePreviewToken(): {
  token: string;
  hash: string;
  expiresAt: Date;
} {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + PREVIEW_DAYS * 24 * 60 * 60 * 1000);
  return { token, hash: hashPreviewToken(token), expiresAt };
}

export function hashPreviewToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function isPreviewToken(value: string): boolean {
  return /^[A-Za-z0-9_-]{32,64}$/.test(value);
}

export function previewPath(token: string): string {
  return `/blog/preview/${token}`;
}
