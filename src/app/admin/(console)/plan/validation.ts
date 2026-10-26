import type { ProjectTaskInput } from "@/lib/types";

/**
 * Server-side validation for the planning screen.
 *
 * The task form sends UTC instants (the Jalali date/time field owns the Tehran
 * conversion), so this file only has to prove the instants are real, ordered and
 * inside a sane range before they reach Postgres.
 */

export type TaskParseResult =
  | { ok: true; value: ProjectTaskInput }
  | { ok: false; error: string };

export type CalendarSettingsResult =
  | { ok: true; value: { calendarId: string } }
  | { ok: false; error: string };

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CALENDAR_ID = /^[A-Za-z0-9._%@+-]{3,180}$/;

const MIN_YEAR = 2000;
const MAX_YEAR = 2100;
const MAX_DURATION_MS = 24 * 60 * 60 * 1000;

function asInstant(value: unknown): number | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  const year = new Date(parsed).getUTCFullYear();
  if (year < MIN_YEAR || year > MAX_YEAR) return null;
  return parsed;
}

export function isTaskId(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value.trim());
}

export function parseTaskInput(raw: unknown): TaskParseResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "دادهٔ کار معتبر نیست." };
  }

  const record = raw as Record<string, unknown>;

  const projectId =
    typeof record.projectId === "string" ? record.projectId.trim() : "";
  if (!isTaskId(projectId)) {
    return { ok: false, error: "پروژهٔ انتخاب‌شده معتبر نیست." };
  }

  const title =
    typeof record.title === "string" ? record.title.trim().slice(0, 160) : "";
  if (title.length < 2) {
    return { ok: false, error: "عنوان کار باید حداقل ۲ کاراکتر باشد." };
  }

  const note =
    typeof record.note === "string" ? record.note.trim().slice(0, 1000) : "";

  const start = asInstant(record.startsAt);
  const end = asInstant(record.endsAt);
  if (start === null || end === null) {
    return { ok: false, error: "زمان شروع و پایان کار معتبر نیست." };
  }
  if (end <= start) {
    return { ok: false, error: "زمان پایان باید بعد از زمان شروع باشد." };
  }
  if (end - start > MAX_DURATION_MS) {
    return { ok: false, error: "هر کار حداکثر ۲۴ ساعت می‌تواند باشد." };
  }

  return {
    ok: true,
    value: {
      projectId,
      title,
      note,
      startsAt: new Date(start).toISOString(),
      endsAt: new Date(end).toISOString(),
      done: record.done === true,
    },
  };
}

/**
 * `primary` is Google's own alias; anything else must look like a calendar id or
 * a calendar address (a dedicated «کدولوژی» calendar the user created).
 */
export function parseCalendarSettings(raw: unknown): CalendarSettingsResult {
  const calendarId =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>).calendarId
      : null;

  const value =
    typeof calendarId === "string" ? calendarId.trim() : "";

  if (value === "primary" || CALENDAR_ID.test(value)) {
    return { ok: true, value: { calendarId: value } };
  }

  return {
    ok: false,
    error: "شناسهٔ تقویم معتبر نیست (مثال: primary یا شناسهٔ تقویم گوگل).",
  };
}
