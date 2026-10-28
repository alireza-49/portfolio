/**
 * AmootSMS REST transport — one call, no SDK.
 *
 * `POST /rest/SendWithBackupLine` is the send method with Amoot's advertising-line
 * guarantee: a recipient who is blacklisted on the main line is delivered through
 * `BackupLineNumber` instead of being dropped. It answers HTTP 200 even for
 * logical failures and keeps the verdict in `Status` ("Success", "Token_NotExists",
 * "ServerError", "BackupLineNumber_NotExist", …), so every response is parsed
 * rather than trusted. `Mobiles` is documented as an array but the live endpoint
 * casts it to a scalar: an array fails with a Newtonsoft `JArray → JValue`
 * ServerError, so recipients go out as a comma-separated string. Nothing here
 * throws: a wrong token, an empty wallet or a network timeout comes back as
 * `{ ok: false, message }` and the caller records it.
 */

import { tehranWall } from "./schedule";

export type AmootResult = {
  ok: boolean;
  /** Amoot's `Status` word (or a failing entry's), or the HTTP status as text. */
  status: string | null;
  /** Persian text from Amoot, or our own explanation when it sent none. */
  message: string;
  messageId: string | null;
};

const TIMEOUT_MS = 10_000;
const ENDPOINT = "https://portal.amootsms.com/rest/SendWithBackupLine";

/**
 * «گارانتی خط تبلیغاتی (98)» — the backup line Amoot documents for this method.
 * It is a *line*, not a keyword: sending `"public"` here answers
 * `BackupLineNumber_NotExist` (verified against the live endpoint), while `"98"`
 * passes the line check and the request proceeds to the recipient validation.
 */
export const AMOOT_BACKUP_LINE = "98";

/** `2026-10-27 10:15:42` in Tehran — the wall time `SendDateTime` expects. */
export function amootSendDateTime(nowIso: string = new Date().toISOString()): string {
  const wall = tehranWall(nowIso);
  return `${wall.date} ${wall.time}:${wall.seconds}`;
}

/** Amoot's status words, in the words an operator can act on. */
export function describeAmootStatus(status: string | null): string {
  switch ((status ?? "").trim().toLowerCase()) {
    case "success":
      return "پیامک پذیرفته شد.";
    case "servererror":
      return "سرور آموت خطای داخلی داد؛ بعداً تلاش کنید.";
    case "token_invalid":
      return "توکن آموت ارسال نشده یا نامعتبر است.";
    case "token_notexists":
      return "توکن آموت در سامانه وجود ندارد.";
    case "backuplinenumber_empty":
      return "خط پشتیبان در درخواست خالی بود؛ مقدار پیش‌فرض «98» است.";
    case "backuplinenumber_notexist":
      return "خط پشتیبان در حساب آموت وجود ندارد؛ برای گارانتی خط تبلیغاتی مقدار «98» درست است.";
    case "mobiles_empty":
      return "شمارهٔ گیرنده در فرمت آموت خوانده نشد (نمونه: 9121234567).";
    default:
      return status?.trim()
        ? `آموت وضعیت «${status.trim()}» را برای این ارسال برگرداند.`
        : "ارتباط با آموت برقرار نشد.";
  }
}

/** HTTP-level failures — the token never reached Amoot's JSON envelope. */
export function describeAmootHttpError(status: number): string {
  switch (status) {
    case 400:
      return "پارامترهای ارسال ناقص بودند.";
    case 401:
      return "توکن آموت پذیرفته نشد.";
    case 403:
      return "دسترسی این توکن به ارسال بسته است.";
    case 404:
      return "نشانی وب‌سرویس آموت پیدا نشد.";
    case 429:
      return "درخواست‌ها بیش از حد مجاز بود؛ کمی بعد تلاش کنید.";
    default:
      return status >= 500
        ? "سرور آموت پاسخ نداد؛ بعداً تلاش کنید."
        : `آموت خطای ${status} برگرداند.`;
  }
}

/**
 * Amoot's examples always show the national form without the trunk zero
 * (`9120000000`); the console stores `09…`, so exactly that one digit is
 * dropped. A list stays a list, and anything else passes through untouched.
 */
function amootMobiles(receptor: string): string {
  return receptor
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      return /^09\d{9}$/.test(trimmed) ? trimmed.slice(1) : trimmed;
    })
    .join(",");
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Reads `{ Status, ErrorMessage?, Data: [{ Status, MessageID }] }` defensively.
 * A success needs a `Success` envelope *and* at least one successful recipient
 * row: an empty `Data` under `Status: "Success"` says nothing about the handset,
 * so it must not be reported as sent.
 */
export function parseAmootResponse(payload: unknown): AmootResult {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      ok: false,
      status: null,
      message: "پاسخ آموت قابل خواندن نبود.",
      messageId: null,
    };
  }

  const record = payload as Record<string, unknown>;
  const envelopeStatus = asText(record.Status) || null;
  const errorMessage = asText(record.ErrorMessage);

  // Documented as an array, but a single object is coerced instead of dropped.
  const raw = record.Data;
  const list = Array.isArray(raw) ? raw : raw && typeof raw === "object" ? [raw] : [];
  const entries = list.filter(
    (item): item is Record<string, unknown> =>
      Boolean(item) && typeof item === "object",
  );
  const first = entries[0] ?? null;
  const messageId =
    first && (typeof first.MessageID === "number" || typeof first.MessageID === "string")
      ? String(first.MessageID)
      : null;

  const failed =
    entries
      .map((entry) => asText(entry.Status))
      .find((status) => Boolean(status) && status.toLowerCase() !== "success") ??
    null;

  if (envelopeStatus?.toLowerCase() === "success" && !failed && entries.length === 0) {
    return {
      ok: false,
      status: envelopeStatus,
      message: "آموت درخواست را پذیرفت اما وضعیت این شماره را برنگرداند.",
      messageId: null,
    };
  }

  const ok = envelopeStatus?.toLowerCase() === "success" && !failed;
  const message =
    errorMessage ||
    (failed ? describeAmootStatus(failed) : describeAmootStatus(envelopeStatus));

  // A failing recipient row is the actionable code, even when the envelope said Success.
  return { ok, status: failed ?? envelopeStatus, message, messageId };
}

/**
 * `POST /rest/SendWithBackupLine`. `sender` is optional — blank sends on Amoot's
 * public line, which is why the console leaves it empty by default instead of
 * guessing a number; `backupLine` defaults to the advertising line «98». `now`
 * exists for tests; production passes nothing.
 */
export async function sendAmootSms(input: {
  token: string;
  sender?: string;
  receptor: string;
  message: string;
  backupLine?: string;
  timeoutMs?: number;
  now?: string;
}): Promise<AmootResult> {
  const token = input.token.trim();
  if (!token) {
    return {
      ok: false,
      status: null,
      message: "توکن آموت تنظیم نشده است.",
      messageId: null,
    };
  }

  const body = {
    SendDateTime: amootSendDateTime(input.now),
    SMSMessageText: input.message,
    LineNumber: input.sender?.trim() || "public",
    // Required by this method: a recipient blacklisted on the main line is sent
    // through this one. See AMOOT_BACKUP_LINE.
    BackupLineNumber: input.backupLine?.trim() || AMOOT_BACKUP_LINE,
    // A string in the national form (no trunk zero), not an array: see the note
    // at the top of this file.
    Mobiles: amootMobiles(input.receptor),
  };

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(input.timeoutMs ?? TIMEOUT_MS),
    });

    const payload: unknown = await response.json().catch(() => null);
    if (payload === null) {
      return {
        ok: false,
        status: String(response.status),
        message: describeAmootHttpError(response.status),
        messageId: null,
      };
    }

    const parsed = parseAmootResponse(payload);
    return { ...parsed, ok: parsed.ok && response.ok };
  } catch (error) {
    console.error("[amootsms] send failed:", error);
    return {
      ok: false,
      status: null,
      message: "ارتباط با آموت برقرار نشد (شبکه یا پایان زمان انتظار).",
      messageId: null,
    };
  }
}
