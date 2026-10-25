import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

/**
 * Single-admin session handling.
 *
 * Credentials live in the environment (`ADMIN_USERNAME` / `ADMIN_PASSWORD`), the
 * session is an HMAC-signed, HttpOnly cookie and every server action re-checks
 * it — the layout guard only decides whether the console renders at all.
 */

export const ADMIN_COOKIE = "cc_admin";

const DEV_SECRET = "kodology-dev-session-secret";
const SHORT_SESSION_SECONDS = 12 * 60 * 60;
const LONG_SESSION_SECONDS = 30 * 24 * 60 * 60;

export type AdminConfig = {
  username: string;
  password: string;
  secret: string;
  /** True when the development fallback credentials are in use. */
  usingFallback: boolean;
};

export type AdminSession = { username: string; expiresAt: number };

export function getAdminConfig(): AdminConfig | null {
  const isProduction = process.env.NODE_ENV === "production";
  const username = process.env.ADMIN_USERNAME?.trim() ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() ?? "";

  if (username && password && (secret || !isProduction)) {
    return {
      username,
      password,
      secret: secret || DEV_SECRET,
      usingFallback: false,
    };
  }

  // A local checkout without env vars still opens the console; production fails
  // closed instead of shipping a known password.
  if (!isProduction) {
    return {
      username: "admin",
      password: "codology-dev",
      secret: secret || DEV_SECRET,
      usingFallback: true,
    };
  }

  return null;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

function safeEqual(left: string, right: string): boolean {
  return timingSafeEqual(digest(left), digest(right));
}

export function credentialsMatch(
  config: AdminConfig,
  username: string,
  password: string,
): boolean {
  // Both comparisons always run, so the response time never reveals which half
  // was wrong.
  const usernameOk = safeEqual(config.username, username.trim());
  const passwordOk = safeEqual(config.password, password);
  return usernameOk && passwordOk;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSessionToken(
  config: AdminConfig,
  remember: boolean,
): { token: string; maxAge: number } {
  const maxAge = remember ? LONG_SESSION_SECONDS : SHORT_SESSION_SECONDS;
  const expiresAt = Date.now() + maxAge * 1000;
  const payload = Buffer.from(
    JSON.stringify({ sub: config.username, exp: expiresAt }),
    "utf8",
  ).toString("base64url");

  return { token: `${payload}.${sign(payload, config.secret)}`, maxAge };
}

export function verifySessionToken(
  token: string,
  secret: string,
): AdminSession | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload, secret);
  const given = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (!parsed || typeof parsed !== "object") return null;

    const { sub, exp } = parsed as { sub?: unknown; exp?: unknown };
    if (typeof sub !== "string" || typeof exp !== "number") return null;
    if (!Number.isFinite(exp) || exp <= Date.now()) return null;

    return { username: sub, expiresAt: exp };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  // Reading the cookie first keeps every console route request-time even when
  // the deployment is missing its env vars (a static "not configured" console
  // would otherwise be baked into the build).
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;

  const config = getAdminConfig();
  if (!config || !token) return null;

  return verifySessionToken(token, config.secret);
}

/** Guard for server components and server actions; redirects to the login card. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/**
 * Console pages re-authorize themselves (never relying on the layout alone) and
 * opt out of prerendering: every one of them reads the session and Postgres.
 */
export async function requireConsolePage(): Promise<AdminSession> {
  await connection();
  return requireAdmin();
}

export async function startAdminSession(
  username: string,
  remember: boolean,
): Promise<boolean> {
  const config = getAdminConfig();
  if (!config) return false;

  const { token, maxAge } = createSessionToken(config, remember);
  const store = await cookies();
  store.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return true;
}

export async function endAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete({ name: ADMIN_COOKIE, path: "/" });
}

/* -------------------------------------------------------------------------- */
/*  Failed-attempt throttle (per instance; enough for a single admin console)  */
/* -------------------------------------------------------------------------- */

const FAILURE_WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 6;

const failures = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string): boolean {
  const entry = failures.get(key);
  if (!entry) return false;
  if (entry.resetAt <= Date.now()) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function registerFailure(key: string): void {
  const now = Date.now();
  const entry = failures.get(key);
  if (!entry || entry.resetAt <= now) {
    failures.set(key, { count: 1, resetAt: now + FAILURE_WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearFailures(key: string): void {
  failures.delete(key);
}
