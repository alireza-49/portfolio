import { faNumber } from "./fa";
import {
  isoToJalali,
  jalaliMonthLength,
  parseIso,
  toGregorian,
  toIso,
} from "./jalali";

/**
 * Timezone + Jalali-grid math for the planning screen.
 *
 * Everything here is pure and deterministic: no `Date.now()`, no `Math.random()`,
 * so a server render and the client hydration always agree. The console stores
 * times as UTC instants and shows them in Tehran wall time — this module is the
 * only place that converts between the two.
 */

export const TEHRAN_TZ = "Asia/Tehran";

const DAY_MS = 86_400_000;

const wallFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TEHRAN_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function wallParts(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const parts = wallFormatter.formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? "00";
  return {
    date: `${pick("year")}-${pick("month")}-${pick("day")}`,
    hour: pick("hour"),
    minute: pick("minute"),
    second: pick("second"),
  };
}

/**
 * Tehran wall clock for an instant: `{ date: '2026-10-26', time: '15:00', seconds: '42' }`.
 * `seconds` exists for providers that want a full timestamp (AmootSMS); the UI
 * only ever reads `date` and `time`.
 */
export function tehranWall(iso: string): { date: string; time: string; seconds: string } {
  const parts = wallParts(iso);
  if (!parts) return { date: "1970-01-01", time: "00:00", seconds: "00" };
  return {
    date: parts.date,
    time: `${parts.hour}:${parts.minute}`,
    seconds: parts.second,
  };
}

/**
 * Iran has had no DST since 2022, but the offset is still derived from `Intl`
 * instead of a `+03:30` constant so a future rule change cannot silently shift
 * every stored instant by an hour.
 */
export function tehranOffsetMinutes(iso: string): number {
  const parts = wallParts(iso);
  const instant = Date.parse(iso);
  if (!parts || Number.isNaN(instant)) return 210;
  const asUtc = Date.parse(
    `${parts.date}T${parts.hour}:${parts.minute}:${parts.second}Z`,
  );
  if (Number.isNaN(asUtc)) return 210;
  return Math.round((asUtc - instant) / 60_000);
}

/** `+03:30` — the offset Google should receive with a `dateTime`. */
export function tehranOffsetLabel(iso: string): string {
  const minutes = tehranOffsetMinutes(iso);
  const sign = minutes < 0 ? "-" : "+";
  const absolute = Math.abs(minutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const rest = String(absolute % 60).padStart(2, "0");
  return `${sign}${hours}:${rest}`;
}

/**
 * Tehran wall time → UTC instant. Two passes converge even when the guessed
 * instant and the real one sit on different sides of an offset change.
 */
export function tehranInstant(date: string, time: string): string {
  const [gy, gm, gd] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (![gy, gm, gd, hour, minute].every((value) => Number.isFinite(value))) {
    return new Date(0).toISOString();
  }
  const guess = Date.UTC(gy, gm - 1, gd, hour, minute, 0);
  let real = guess - tehranOffsetMinutes(new Date(guess).toISOString()) * 60_000;
  real = guess - tehranOffsetMinutes(new Date(real).toISOString()) * 60_000;
  return new Date(real).toISOString();
}

/** Tehran calendar day (`YYYY-MM-DD`) for “now”, or for a supplied instant. */
export function tehranToday(nowIso: string = new Date().toISOString()): string {
  return tehranWall(nowIso).date;
}

export function addDays(day: string, days: number): string {
  const { gy, gm, gd } = parseIso(day);
  const base = Date.UTC(gy, gm - 1, gd) + days * DAY_MS;
  const next = new Date(base);
  return toIso(
    next.getUTCFullYear(),
    next.getUTCMonth() + 1,
    next.getUTCDate(),
  );
}

/** 00:00 of a Tehran day, as the instant a range query starts at. */
export function dayStartInstant(day: string): string {
  return tehranInstant(day, "00:00");
}

/** 00:00 of the day after, so ranges are half-open. */
export function dayEndInstant(day: string): string {
  return tehranInstant(addDays(day, 1), "00:00");
}

/* -------------------------------------------------------------------------- */
/*                                  Jalali                                    */
/* -------------------------------------------------------------------------- */

export type JalaliMonth = { jy: number; jm: number };

export type GridDay = {
  /** Gregorian `YYYY-MM-DD` — the canonical day key everywhere else. */
  day: string;
  jd: number;
  jy: number;
  jm: number;
  inMonth: boolean;
  /** 0 = Saturday … 6 = Friday, matching `PERSIAN_WEEKDAYS`. */
  weekday: number;
};

export function jalaliMonthOf(day: string): JalaliMonth {
  const { jy, jm } = isoToJalali(day);
  return { jy, jm };
}

export function addJalaliMonths(
  month: JalaliMonth,
  delta: number,
): JalaliMonth {
  const index = month.jy * 12 + (month.jm - 1) + delta;
  return { jy: Math.floor(index / 12), jm: (((index % 12) + 12) % 12) + 1 };
}

/** Saturday-first index of a Tehran day (Iranian weeks start on Saturday). */
export function weekdayIndexOf(day: string): number {
  const { gy, gm, gd } = parseIso(day);
  return (new Date(Date.UTC(gy, gm - 1, gd)).getUTCDay() + 1) % 7;
}

/** Fixed 6×7 grid: the month plus enough leading/trailing days to fill weeks. */
export function monthGrid(month: JalaliMonth): GridDay[] {
  const length = jalaliMonthLength(month.jy, month.jm);
  const first = toGregorian(month.jy, month.jm, 1);
  const leading = weekdayIndexOf(toIso(first.gy, first.gm, first.gd));
  const previous = addJalaliMonths(month, -1);
  const previousLength = jalaliMonthLength(previous.jy, previous.jm);
  const next = addJalaliMonths(month, 1);

  const cells: GridDay[] = [];
  for (let index = 0; index < 42; index += 1) {
    const offset = index - leading;
    let jy = month.jy;
    let jm = month.jm;
    let jd = offset + 1;
    let inMonth = true;

    if (offset < 0) {
      jy = previous.jy;
      jm = previous.jm;
      jd = previousLength + offset + 1;
      inMonth = false;
    } else if (offset >= length) {
      jy = next.jy;
      jm = next.jm;
      jd = offset - length + 1;
      inMonth = false;
    }

    const g = toGregorian(jy, jm, jd);
    cells.push({
      day: toIso(g.gy, g.gm, g.gd),
      jd,
      jy,
      jm,
      inMonth,
      weekday: index % 7,
    });
  }

  return cells;
}

/** Half-open instant range covering a 42-day grid, for the plan page query. */
export function gridRange(month: JalaliMonth): {
  fromIso: string;
  toIso: string;
} {
  const cells = monthGrid(month);
  return {
    fromIso: dayStartInstant(cells[0].day),
    toIso: dayEndInstant(cells[cells.length - 1].day),
  };
}

/* -------------------------------------------------------------------------- */
/*                              Timeline geometry                             */
/* -------------------------------------------------------------------------- */

export type WindowPosition = { startPct: number; widthPct: number };

/**
 * Percentage span of `[startIso, endIso)` inside `[fromIso, toIso)`, clamped to
 * the window and never thinner than `minimumPct` so a 15-minute task stays
 * clickable on a 31-day axis.
 */
export function windowPosition(
  startIso: string,
  endIso: string,
  fromIso: string,
  toIso: string,
  minimumPct = 1.5,
): WindowPosition {
  const from = Date.parse(fromIso);
  const total = Date.parse(toIso) - from;
  if (!Number.isFinite(total) || total <= 0) {
    return { startPct: 0, widthPct: 0 };
  }

  const clamp = (value: number) => Math.min(total, Math.max(0, value));
  const start = clamp(Date.parse(startIso) - from);
  const end = clamp(Date.parse(endIso) - from);
  const startPct = (start / total) * 100;
  const widthPct = Math.min(
    100 - startPct,
    Math.max(minimumPct, ((end - start) / total) * 100),
  );

  return { startPct, widthPct: Math.max(0, widthPct) };
}

/* -------------------------------------------------------------------------- */
/*                              Task collections                              */
/* -------------------------------------------------------------------------- */

export type TaskSpan = { startsAt: string; endsAt: string };

export function taskOverlaps(a: TaskSpan, b: TaskSpan): boolean {
  return (
    Date.parse(a.startsAt) < Date.parse(b.endsAt) &&
    Date.parse(b.startsAt) < Date.parse(a.endsAt)
  );
}

export function overlapsAny<T extends TaskSpan>(
  candidate: TaskSpan,
  others: T[],
): T | null {
  return others.find((other) => taskOverlaps(candidate, other)) ?? null;
}

export function shiftInstant(iso: string, minutes: number): string {
  const instant = Date.parse(iso);
  if (Number.isNaN(instant)) return iso;
  return new Date(instant + minutes * 60_000).toISOString();
}

export function sumMinutes(tasks: TaskSpan[]): number {
  return tasks.reduce(
    (total, task) =>
      total + Math.max(0, (Date.parse(task.endsAt) - Date.parse(task.startsAt)) / 60_000),
    0,
  );
}

/** `۹۰` → «۱ ساعت و ۳۰ دقیقه». */
export function faDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  if (hours === 0) return `${faNumber(rest)} دقیقه`;
  if (rest === 0) return `${faNumber(hours)} ساعت`;
  return `${faNumber(hours)} ساعت و ${faNumber(rest)} دقیقه`;
}

export type TaskSort = "start" | "end" | "title" | "done" | "project";

export function sortTasks<T extends TaskSpan & { title: string; done: boolean; projectId: string }>(
  tasks: T[],
  sort: TaskSort,
  projectTitle?: (projectId: string) => string,
): T[] {
  const byStart = (a: T, b: T) => Date.parse(a.startsAt) - Date.parse(b.startsAt);
  const copy = [...tasks];

  switch (sort) {
    case "end":
      return copy.sort(
        (a, b) => Date.parse(a.endsAt) - Date.parse(b.endsAt) || byStart(a, b),
      );
    case "title":
      return copy.sort(
        (a, b) => a.title.localeCompare(b.title, "fa") || byStart(a, b),
      );
    case "done":
      return copy.sort(
        (a, b) => Number(a.done) - Number(b.done) || byStart(a, b),
      );
    case "project":
      return copy.sort(
        (a, b) =>
          (projectTitle?.(a.projectId) ?? "").localeCompare(
            projectTitle?.(b.projectId) ?? "",
            "fa",
          ) || byStart(a, b),
      );
    case "start":
    default:
      return copy.sort(byStart);
  }
}

export function groupByProject<T extends { projectId: string }>(
  tasks: T[],
): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const task of tasks) {
    const bucket = groups.get(task.projectId);
    if (bucket) bucket.push(task);
    else groups.set(task.projectId, [task]);
  }
  return groups;
}
