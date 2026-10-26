import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { getGoogleAccount, saveGoogleAccount } from "./content";
import { TEHRAN_TZ } from "./schedule";
import { decryptSecret, encryptSecret } from "./secrets";

/**
 * Raw Google Calendar / OAuth client.
 *
 * Server-only, dependency-free (global `fetch` + `node:crypto`) so the console
 * does not pull in `googleapis`. Nothing here is re-exported to the browser:
 * `calendar-sync.ts` is the only caller, and it hands the UI plain
 * `GoogleConnectionState` objects.
 */

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const REVOKE_ENDPOINT = "https://oauth2.googleapis.com/revoke";
const USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";
const CALENDAR_BASE = "https://www.googleapis.com/calendar/v3";

export const GOOGLE_SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/calendar.events",
] as const;

const SCOPE_STRING = GOOGLE_SCOPES.join(" ");

/** Holds the signed OAuth `state` between `/start` and `/callback`. */
export const GOOGLE_STATE_COOKIE = "cc_google_state";

/** Refresh a minute early so a request cannot start with a dead token. */
const EXPIRY_MARGIN_MS = 60_000;
const STATE_TTL_MS = 10 * 60_000;

export type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export function getGoogleOAuthConfig(): GoogleOAuthConfig | null {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return {
    clientId,
    clientSecret,
    redirectUri:
      process.env.GOOGLE_OAUTH_REDIRECT_URI?.trim() ||
      "http://localhost:3000/api/google/callback",
  };
}

export function isGoogleConfigured(): boolean {
  return getGoogleOAuthConfig() !== null;
}

export class GoogleApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly reason: string,
  ) {
    super(message);
    this.name = "GoogleApiError";
  }
}

/* -------------------------------------------------------------------------- */
/*                              OAuth state (CSRF)                            */
/* -------------------------------------------------------------------------- */

function stateSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    "cc-dev-only-secret"
  );
}

function signState(payload: string): string {
  return createHmac("sha256", stateSecret()).update(payload).digest("base64url");
}

/** Short-lived signed nonce; the callback also requires the admin cookie. */
export function createOAuthState(): string {
  const payload = `${randomBytes(18).toString("base64url")}.${Date.now().toString(36)}`;
  return `${payload}.${signState(payload)}`;
}

export function verifyOAuthState(state: string): boolean {
  const [nonce, issued, signature] = state.split(".");
  if (!nonce || !issued || !signature) return false;

  const expected = signState(`${nonce}.${issued}`);
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return false;

  const age = Date.now() - Number.parseInt(issued, 36);
  return Number.isFinite(age) && age >= 0 && age < STATE_TTL_MS;
}

export function buildAuthUrl(state: string): string {
  const config = getGoogleOAuthConfig();
  if (!config) throw new GoogleApiError("کلیدهای OAuth گوگل تنظیم نشده است.", 500, "not_configured");
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: SCOPE_STRING,
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

/* -------------------------------------------------------------------------- */
/*                                   Tokens                                   */
/* -------------------------------------------------------------------------- */

export type TokenPayload = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
};

async function readError(response: Response): Promise<GoogleApiError> {
  let message = `Google API ${response.status}`;
  let reason = "";
  try {
    const payload = (await response.json()) as {
      error?: string | { message?: string; errors?: { reason?: string }[] };
    };
    if (typeof payload.error === "string") {
      reason = payload.error;
    } else if (payload.error) {
      message = payload.error.message ?? message;
      reason = payload.error.errors?.[0]?.reason ?? "";
    }
  } catch {
    // A non-JSON body (HTML error page) keeps the status-only message.
  }
  return new GoogleApiError(message, response.status, reason);
}

async function postToken(body: Record<string, string>): Promise<TokenPayload> {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });
  if (!response.ok) throw await readError(response);

  const payload = (await response.json()) as Partial<TokenPayload>;
  if (!payload.access_token) {
    throw new GoogleApiError("پاسخ گوگل توکن دسترسی نداشت.", 500, "no_token");
  }
  return {
    access_token: payload.access_token,
    expires_in: payload.expires_in ?? 3600,
    refresh_token: payload.refresh_token,
    scope: payload.scope,
  };
}

export async function exchangeCode(code: string): Promise<TokenPayload> {
  const config = getGoogleOAuthConfig();
  if (!config) throw new GoogleApiError("کلیدهای OAuth گوگل تنظیم نشده است.", 500, "not_configured");
  return postToken({
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    grant_type: "authorization_code",
  });
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenPayload> {
  const config = getGoogleOAuthConfig();
  if (!config) throw new GoogleApiError("کلیدهای OAuth گوگل تنظیم نشده است.", 500, "not_configured");
  return postToken({
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "refresh_token",
  });
}

/** The connected account's address, for the connection card. Empty on failure. */
export async function fetchUserEmail(accessToken: string): Promise<string> {
  try {
    const response = await fetch(USERINFO_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return "";
    const payload = (await response.json()) as { email?: unknown };
    return typeof payload.email === "string" ? payload.email : "";
  } catch {
    return "";
  }
}

export async function revokeToken(token: string): Promise<void> {
  try {
    await fetch(`${REVOKE_ENDPOINT}?token=${encodeURIComponent(token)}`, {
      method: "POST",
    });
  } catch {
    // Best effort: wiping the row is what actually disconnects the console.
  }
}

/**
 * A usable access token, refreshing and re-encrypting when it is about to
 * expire. `null` means “nothing to call Google with” — the caller falls back to
 * saving tasks as `skipped`.
 */
export async function getAccessToken(): Promise<string | null> {
  const account = await getGoogleAccount();
  if (!account || account.needsReauth) return null;

  const current = decryptSecret(account.accessToken);
  const expiresAt = account.accessExpiresAt
    ? Date.parse(account.accessExpiresAt)
    : 0;
  const stillValid =
    current !== null && Number.isFinite(expiresAt)
      ? expiresAt - EXPIRY_MARGIN_MS > Date.now()
      : false;

  if (current && stillValid) return current;

  const refreshToken = decryptSecret(account.refreshToken);
  if (!refreshToken) {
    await saveGoogleAccount({
      needsReauth: true,
      lastError: "توکن گوگل قابل خواندن نیست؛ دوباره متصل شوید.",
    });
    return null;
  }

  try {
    const token = await refreshAccessToken(refreshToken);
    await saveGoogleAccount({
      accessToken: encryptSecret(token.access_token),
      accessExpiresAt: new Date(
        Date.now() + token.expires_in * 1000,
      ).toISOString(),
      scope: token.scope ?? account.scope,
      needsReauth: false,
      lastError: "",
    });
    return token.access_token;
  } catch (error) {
    const fatal =
      error instanceof GoogleApiError &&
      (error.reason === "invalid_grant" || error.reason === "unauthorized_client");
    await saveGoogleAccount({
      needsReauth: fatal,
      lastError: googleErrorFa(error),
    });
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                                Calendar API                                */
/* -------------------------------------------------------------------------- */

export type GoogleEventItem = {
  id: string;
  status?: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  updated?: string;
  recurringEventId?: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?: { dateTime?: string; date?: string; timeZone?: string };
  extendedProperties?: { private?: Record<string, string> };
};

export type GoogleEventPage = {
  items: GoogleEventItem[];
  nextPageToken: string;
  nextSyncToken: string;
};

async function authorizedFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = await getAccessToken();
  if (!token) {
    throw new GoogleApiError("اتصال گوگل برقرار نیست.", 401, "no_token");
  }
  const response = await fetch(`${CALENDAR_BASE}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw await readError(response);
  return response;
}

const EVENT_FIELDS =
  "items(id,status,summary,description,location,htmlLink,updated,recurringEventId,start,end,extendedProperties),nextPageToken,nextSyncToken";

export async function listEvents(params: {
  calendarId: string;
  syncToken?: string;
  timeMin?: string;
  timeMax?: string;
  pageToken?: string;
  maxResults?: number;
}): Promise<GoogleEventPage> {
  const search = new URLSearchParams({
    singleEvents: "true",
    showDeleted: "true",
    maxResults: String(params.maxResults ?? 250),
    timeZone: TEHRAN_TZ,
    fields: EVENT_FIELDS,
  });

  if (params.syncToken) {
    search.set("syncToken", params.syncToken);
  } else {
    if (params.timeMin) search.set("timeMin", params.timeMin);
    if (params.timeMax) search.set("timeMax", params.timeMax);
  }
  if (params.pageToken) search.set("pageToken", params.pageToken);

  const response = await authorizedFetch(
    `/calendars/${encodeURIComponent(params.calendarId)}/events?${search.toString()}`,
  );
  const payload = (await response.json()) as {
    items?: GoogleEventItem[];
    nextPageToken?: string;
    nextSyncToken?: string;
  };

  return {
    items: payload.items ?? [],
    nextPageToken: payload.nextPageToken ?? "",
    nextSyncToken: payload.nextSyncToken ?? "",
  };
}

export async function insertEvent(
  calendarId: string,
  body: Record<string, unknown>,
): Promise<GoogleEventItem> {
  const response = await authorizedFetch(
    `/calendars/${encodeURIComponent(calendarId)}/events`,
    { method: "POST", body: JSON.stringify(body) },
  );
  return (await response.json()) as GoogleEventItem;
}

export async function patchEvent(
  calendarId: string,
  eventId: string,
  body: Record<string, unknown>,
): Promise<GoogleEventItem> {
  const response = await authorizedFetch(
    `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    { method: "PATCH", body: JSON.stringify(body) },
  );
  return (await response.json()) as GoogleEventItem;
}

/** A missing or already-deleted event is a success for our purposes. */
export async function deleteEvent(
  calendarId: string,
  eventId: string,
): Promise<void> {
  try {
    await authorizedFetch(
      `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      { method: "DELETE" },
    );
  } catch (error) {
    if (
      error instanceof GoogleApiError &&
      (error.status === 404 || error.status === 410)
    ) {
      return;
    }
    throw error;
  }
}

export async function moveEvent(
  fromCalendarId: string,
  eventId: string,
  toCalendarId: string,
): Promise<GoogleEventItem> {
  const response = await authorizedFetch(
    `/calendars/${encodeURIComponent(fromCalendarId)}/events/${encodeURIComponent(eventId)}/move?destination=${encodeURIComponent(toCalendarId)}`,
    { method: "POST" },
  );
  return (await response.json()) as GoogleEventItem;
}

/* -------------------------------------------------------------------------- */
/*                              Error reporting                               */
/* -------------------------------------------------------------------------- */

/** One Persian sentence the console can show verbatim in a banner. */
export function googleErrorFa(error: unknown): string {
  if (error instanceof GoogleApiError) {
    switch (error.status) {
      case 401:
        return "دسترسی گوگل منقضی شده است؛ از کارت اتصال دوباره وصل شوید.";
      case 403:
        return "این حساب اجازهٔ نوشتن در تقویم انتخاب‌شده را ندارد.";
      case 404:
        return "تقویم یا رویداد در گوگل پیدا نشد.";
      case 410:
        return "همگام‌سازی گوگل منقضی شد؛ یک همگام‌سازی کامل لازم است.";
      case 429:
        return "سقف درخواست‌های گوگل پر شده است؛ چند دقیقه بعد تلاش کنید.";
      default:
        return error.status >= 500
          ? "گوگل پاسخ نداد؛ کمی بعد دوباره تلاش کنید."
          : "ارتباط با گوگل ناموفق بود.";
    }
  }
  if (error instanceof Error && /fetch failed|ENOTFOUND|ECONN/i.test(error.message)) {
    return "ارتباط شبکه با گوگل برقرار نشد.";
  }
  return "ارتباط با گوگل ناموفق بود.";
}
