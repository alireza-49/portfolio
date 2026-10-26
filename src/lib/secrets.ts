import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

/**
 * Symmetric encryption for the stored Google OAuth tokens.
 *
 * Tokens live in Postgres, so a database dump must not be enough to read a
 * mailbox-free calendar. The key is derived from `ADMIN_SESSION_SECRET`: rotate
 * that secret and the stored tokens become unreadable (the console asks for a
 * reconnect instead of crashing).
 */

const VERSION = "v1";
const KEY_SALT = "cc-google-oauth";

type SecretsGlobal = typeof globalThis & { __ccSecretKey?: Buffer };
const globalSecrets = globalThis as SecretsGlobal;

function secretMaterial(): string {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    "cc-dev-only-secret"
  );
}

function key(): Buffer {
  if (!globalSecrets.__ccSecretKey) {
    globalSecrets.__ccSecretKey = scryptSync(secretMaterial(), KEY_SALT, 32);
  }
  return globalSecrets.__ccSecretKey;
}

/** `v1:iv:tag:cipher` (base64url). An empty input stays empty. */
export function encryptSecret(plain: string): string {
  if (!plain) return "";
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [
    VERSION,
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    encrypted.toString("base64url"),
  ].join(":");
}

/** Returns `null` on a rotated key or a tampered payload — never throws. */
export function decryptSecret(payload: string): string | null {
  if (!payload) return null;
  const [version, iv, tag, data] = payload.split(":");
  if (version !== VERSION || !iv || !tag || !data) return null;

  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key(),
      Buffer.from(iv, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    const plain = Buffer.concat([
      decipher.update(Buffer.from(data, "base64url")),
      decipher.final(),
    ]);
    return plain.toString("utf8");
  } catch {
    return null;
  }
}
