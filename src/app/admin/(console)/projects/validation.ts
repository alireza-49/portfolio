import { randomUUID } from "node:crypto";
import { isSafeMediaUrl } from "@/lib/sanitize";
import {
  PHASE_STATUSES,
  PROJECT_STATUSES,
  UPDATE_TYPES,
  type PhaseStatus,
  type ProjectInput,
  type ProjectStatus,
  type ProjectStep,
  type ProjectUpdate,
  type UpdateType,
} from "@/lib/types";

/**
 * Server-side validation for the project editor.
 *
 * The editor posts one plain object (identity + steps + updates + finance), so
 * every field is re-validated here before it reaches Postgres — the client is
 * never trusted for ranges, enums or array shapes.
 */

export type ParseResult =
  | { ok: true; value: ProjectInput }
  | { ok: false; error: string };

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function asString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function asNumber(value: unknown, min: number, max: number): number | null {
  const parsed =
    typeof value === "number" ? value : Number(String(value ?? "").trim());
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return null;
  return Math.round(parsed);
}

function asDate(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  return DATE.test(value.trim()) ? value.trim() : null;
}

function asEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function parseSteps(value: unknown): ProjectStep[] {
  if (!Array.isArray(value)) return [];

  return value.slice(0, 30).map((raw) => {
    const record = (raw ?? {}) as Record<string, unknown>;
    return {
      id:
        typeof record.id === "string" && record.id.trim()
          ? record.id.trim().slice(0, 64)
          : randomUUID(),
      title: asString(record.title, 160) || "گام بدون عنوان",
      description: asString(record.description, 800),
      status: asEnum<PhaseStatus>(record.status, PHASE_STATUSES, "queued"),
      progress: asNumber(record.progress, 0, 100) ?? 0,
      dueDate: asDate(record.dueDate),
    };
  });
}

function parseUpdates(value: unknown): ProjectUpdate[] {
  if (!Array.isArray(value)) return [];

  return value.slice(0, 100).map((raw) => {
    const record = (raw ?? {}) as Record<string, unknown>;
    return {
      id:
        typeof record.id === "string" && record.id.trim()
          ? record.id.trim().slice(0, 64)
          : randomUUID(),
      date: asDate(record.date) ?? new Date().toISOString().slice(0, 10),
      type: asEnum<UpdateType>(record.type, UPDATE_TYPES, "note"),
      title: asString(record.title, 160) || "به‌روزرسانی کارگاه",
      body: asString(record.body, 1200),
    };
  });
}

export function parseProjectInput(raw: unknown): ParseResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "دادهٔ پروژه معتبر نیست." };
  }

  const record = raw as Record<string, unknown>;
  const code = asString(record.code, 32).toUpperCase();
  const title = asString(record.title, 160);

  if (!/^[A-Z0-9-]{3,32}$/.test(code)) {
    return {
      ok: false,
      error: "شناسهٔ پروژه باید ۳ تا ۳۲ کاراکتر لاتین، رقم یا خط تیره باشد.",
    };
  }

  if (!title) {
    return { ok: false, error: "عنوان پروژه الزامی است." };
  }

  const progress = asNumber(record.progress, 0, 100);
  if (progress === null) {
    return { ok: false, error: "درصد پیشرفت باید بین ۰ تا ۱۰۰ باشد." };
  }

  const amount = asNumber(record.amount, 0, 1_000_000_000_000);
  const paid = asNumber(record.paid, 0, 1_000_000_000_000);
  if (amount === null || paid === null) {
    return { ok: false, error: "مبالغ قرارداد معتبر نیستند." };
  }

  const stagingUrl = asString(record.stagingUrl, 500);
  const repoUrl = asString(record.repoUrl, 500);
  if (!isSafeMediaUrl(stagingUrl) || !isSafeMediaUrl(repoUrl)) {
    return {
      ok: false,
      error: "نشانی پیش‌نمایش یا مخزن باید با http(s) یا / شروع شود.",
    };
  }

  return {
    ok: true,
    value: {
      code,
      title,
      clientName: asString(record.clientName, 120),
      clientOrg: asString(record.clientOrg, 160),
      clientMobile: asString(record.clientMobile, 40),
      clientEmail: asString(record.clientEmail, 160),
      summary: asString(record.summary, 1200),
      status: asEnum<ProjectStatus>(record.status, PROJECT_STATUSES, "active"),
      progress,
      currentPhase: asString(record.currentPhase, 160),
      startDate: asDate(record.startDate),
      dueDate: asDate(record.dueDate),
      amount,
      paid,
      showFinancials: asBoolean(record.showFinancials),
      stagingUrl,
      repoUrl,
      published: asBoolean(record.published),
      steps: parseSteps(record.steps),
      updates: parseUpdates(record.updates),
    },
  };
}
