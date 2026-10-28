import { formatJalali, toPersianDigits } from "./jalali";

/**
 * Persian presentation helpers shared by the console, the blog and the public
 * tracking pages. Every number that reaches the screen goes through here so the
 * whole site keeps one numeral system and one calendar.
 */

const numberFormatter = new Intl.NumberFormat("fa-IR");
const decimalFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 1,
});
const timeFormatter = new Intl.DateTimeFormat("fa-IR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Tehran",
  hour12: false,
});

/** Tehran calendar day (`YYYY-MM-DD`) for a date or an ISO timestamp. */
export function tehranDay(value: string): string {
  if (value.length <= 10) return value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function faDigits(value: string | number): string {
  return toPersianDigits(value);
}

export function faNumber(value: number): string {
  return numberFormatter.format(value);
}

export function faDecimal(value: number): string {
  return decimalFormatter.format(value);
}

export function faPercent(value: number): string {
  return `${decimalFormatter.format(value)}٪`;
}

export function faMoney(value: number): string {
  return `${numberFormatter.format(value)} تومان`;
}

/** `1404-08-02` → `۲ آبان ۱۴۰۴`. Dates are stored as plain ISO strings. */
export function faDate(
  iso: string | null | undefined,
  options?: { withYear?: boolean },
): string {
  if (!iso) return "—";
  return toPersianDigits(formatJalali(tehranDay(iso), options));
}

/** `2026-10-24T11:30:00Z` → `۲ آبان ۱۴۰۴ • ۱۵:۰۰` (Tehran time). */
export function faDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return `${toPersianDigits(formatJalali(tehranDay(iso)))} • ${timeFormatter.format(date)}`;
}

/** Time of day only, in Tehran: `2026-10-26T11:30:00Z` → `۱۵:۰۰`. */
export function faTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return timeFormatter.format(date);
}

/** `۱۵:۰۰ – ۱۶:۳۰`. */
export function faTimeRange(
  startIso: string | null | undefined,
  endIso: string | null | undefined,
): string {
  if (!startIso || !endIso) return "—";
  return `${faTime(startIso)} – ${faTime(endIso)}`;
}

/** Human distance from now, e.g. `۳ روز پیش`. */
export function faRelative(
  iso: string | null | undefined,
  now: number = Date.now(),
): string {
  if (!iso) return "—";
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "—";

  const minutes = Math.max(0, Math.round((now - time) / 60_000));
  if (minutes < 1) return "همین حالا";
  if (minutes < 60) return `${faNumber(minutes)} دقیقه پیش`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${faNumber(hours)} ساعت پیش`;

  const days = Math.round(hours / 24);
  if (days < 31) return `${faNumber(days)} روز پیش`;

  const months = Math.round(days / 30);
  if (months < 12) return `${faNumber(months)} ماه پیش`;

  return `${faNumber(Math.round(months / 12))} سال پیش`;
}

/** Average Persian reading speed, ~220 words per minute. */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
