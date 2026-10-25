import { NextResponse } from "next/server";
import { createSubmission } from "@/lib/content";
import { hasDatabaseConfig } from "@/lib/db";

/**
 * Public contact endpoint. The form posts one JSON object; everything is capped,
 * trimmed and stored as plain text (React escapes it on the way back out).
 * The studio hand-off payload is stored as JSONB so the console can show and
 * download exactly what the visitor sent.
 */

const TEXT_LIMITS = {
  name: 120,
  contact: 160,
  business: 160,
  message: 6000,
  studioSummary: 20000,
  studioStatus: 40,
  designChoice: 40,
} as const;

const OBJECT_LIMIT = 400_000;

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 6;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function asText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  try {
    if (JSON.stringify(value).length > OBJECT_LIMIT) return null;
    return value as Record<string, unknown>;
  } catch {
    return null;
  }
}

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  const key = clientKey(request);
  const now = Date.now();
  const entry = hits.get(key);

  if (entry && entry.resetAt > now && entry.count >= RATE_MAX) {
    return fail(
      "تعداد پیام‌های ارسالی از این دستگاه زیاد بوده است؛ چند دقیقه بعد دوباره تلاش کنید.",
      429,
    );
  }

  if (entry && entry.resetAt > now) {
    entry.count += 1;
  } else {
    hits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("بدنهٔ درخواست معتبر نیست.", 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return fail("بدنهٔ درخواست معتبر نیست.", 400);
  }

  const record = body as Record<string, unknown>;
  const name = asText(record.name, TEXT_LIMITS.name);
  const contact = asText(record.contact, TEXT_LIMITS.contact);

  if (!name || !contact) {
    return fail("نام و راه ارتباطی الزامی است.", 422);
  }

  if (!hasDatabaseConfig()) {
    return fail(
      "صندوق درخواست‌ها هنوز به پایگاه داده وصل نشده است. لطفاً مستقیم در تلگرام پیام دهید.",
      503,
    );
  }

  try {
    const submission = await createSubmission({
      name,
      contact,
      business: asText(record.business, TEXT_LIMITS.business),
      message: asText(record.message, TEXT_LIMITS.message),
      projectType: "",
      budget: "",
      estimate: asObject(record.estimate),
      studioConfig: asObject(record.studioConfig),
      studioSummary: asText(record.studioSummary, TEXT_LIMITS.studioSummary),
      studioStatus: asText(record.studioStatus, TEXT_LIMITS.studioStatus),
      designChoice: asText(record.designChoice, TEXT_LIMITS.designChoice),
    });

    return NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("[contact] failed to store submission:", error);
    return fail(
      "ثبت پیام در پایگاه داده ناموفق بود؛ لطفاً دوباره تلاش کنید یا در تلگرام پیام دهید.",
      500,
    );
  }
}
