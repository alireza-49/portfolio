import {
  JALALI_MONTHS,
  formatJalali,
  isoToJalali,
  parseIso,
  toIso,
  toPersianDigits,
} from "./jalali";
import { tehranDay } from "./fa";
import type { Project, Submission } from "./types";

/**
 * Income is derived, never invented.
 *
 * The console stores one contract value (`amount`) and one cumulative cash
 * figure (`paid`) per project, and no per-payment history. So a project's money
 * is attributed to the Persian month (or Persian week, Saturday → Friday) of
 * its start date, falling back to the day the project was entered. Every number
 * here sums real columns; the page says this in words.
 */

export const INCOME_MONTH_WINDOW = 6;
export const INCOME_WEEK_WINDOW = 8;

const DAY = 86_400_000;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

const ONGOING_STATUSES = new Set<Project["status"]>([
  "planning",
  "active",
  "review",
]);

const OPEN_STATUSES = new Set<Submission["status"]>([
  "new",
  "reviewing",
  "meeting",
]);

export type IncomeBucket = {
  key: string;
  /** Full label, e.g. `آبان ۱۴۰۴` or `۲ آبان تا ۸ آبان`. */
  label: string;
  /** Axis label, e.g. `آبان` or `۲ آبان`. */
  short: string;
  contracted: number;
  received: number;
  projects: number;
};

export type IncomeOffers = {
  count: number;
  /** How many of those offers carried a numeric form estimate. */
  priced: number;
  /** Σ upper estimate of the open offers, in toman. */
  ceiling: number;
};

export type IncomeSummary = {
  contractedTotal: number;
  receivedTotal: number;
  remainingTotal: number;
  /** Share of the contracted value already settled, 0–100. */
  receivedRatio: number;
  pipelineContracted: number;
  pipelineOutstanding: number;
  pipelineCount: number;
  months: IncomeBucket[];
  weeks: IncomeBucket[];
  monthlyAverage: number;
  weeklyAverage: number;
  offers: IncomeOffers;
};

function addDays(iso: string, days: number): string {
  const { gy, gm, gd } = parseIso(iso);
  const date = new Date(Date.UTC(gy, gm - 1, gd) + days * DAY);
  return toIso(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

/** Saturday → Friday index (`شنبه` = 0 … `جمعه` = 6). */
function weekDayIndex(iso: string): number {
  const { gy, gm, gd } = parseIso(iso);
  return (new Date(Date.UTC(gy, gm - 1, gd)).getUTCDay() + 1) % 7;
}

/** `۲ آبان` — a Jalali day without its year, for axis ticks. */
function shortJalali(iso: string): string {
  return toPersianDigits(formatJalali(iso, { withYear: false }));
}

function monthBuckets(anchor: string, count: number): IncomeBucket[] {
  const { jy, jm } = isoToJalali(anchor);
  const buckets: IncomeBucket[] = [];
  for (let step = count - 1; step >= 0; step -= 1) {
    const index = jy * 12 + (jm - 1) - step;
    const year = Math.floor(index / 12);
    const month = (index % 12) + 1;
    buckets.push({
      key: `${year}-${month}`,
      label: `${JALALI_MONTHS[month - 1]} ${toPersianDigits(year)}`,
      short: JALALI_MONTHS[month - 1],
      contracted: 0,
      received: 0,
      projects: 0,
    });
  }
  return buckets;
}

function weekBuckets(anchor: string, count: number): IncomeBucket[] {
  const saturday = addDays(anchor, -weekDayIndex(anchor));
  const buckets: IncomeBucket[] = [];
  for (let step = count - 1; step >= 0; step -= 1) {
    const from = addDays(saturday, -7 * step);
    const to = addDays(from, 6);
    buckets.push({
      key: from,
      label: `${shortJalali(from)} تا ${shortJalali(to)}`,
      short: shortJalali(from),
      contracted: 0,
      received: 0,
      projects: 0,
    });
  }
  return buckets;
}

/** The day a project's money is attributed to: its start, else its entry. */
function attributionDay(project: Project): string {
  if (project.startDate && ISO_DAY.test(project.startDate)) {
    return project.startDate;
  }
  return tehranDay(project.createdAt);
}

/** A positive, finite number or `null` — the form's estimate is untrusted JSON. */
function money(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function buildIncomeSummary(
  projects: Project[],
  submissions: Submission[],
  now: Date = new Date(),
): IncomeSummary {
  const today = tehranDay(now.toISOString());
  const months = monthBuckets(today, INCOME_MONTH_WINDOW);
  const weeks = weekBuckets(today, INCOME_WEEK_WINDOW);
  const byMonth = new Map(months.map((bucket) => [bucket.key, bucket]));
  const byWeek = new Map(weeks.map((bucket) => [bucket.key, bucket]));

  let contractedTotal = 0;
  let receivedTotal = 0;
  let remainingTotal = 0;
  let pipelineContracted = 0;
  let pipelineOutstanding = 0;
  let pipelineCount = 0;

  for (const project of projects) {
    contractedTotal += project.amount;
    receivedTotal += project.paid;
    remainingTotal += Math.max(0, project.amount - project.paid);

    if (ONGOING_STATUSES.has(project.status)) {
      pipelineCount += 1;
      pipelineContracted += project.amount;
      pipelineOutstanding += Math.max(0, project.amount - project.paid);
    }

    const day = attributionDay(project);
    if (!ISO_DAY.test(day)) continue;

    const { jy, jm } = isoToJalali(day);
    const month = byMonth.get(`${jy}-${jm}`);
    if (month) {
      month.contracted += project.amount;
      month.received += project.paid;
      month.projects += 1;
    }

    const week = byWeek.get(addDays(day, -weekDayIndex(day)));
    if (week) {
      week.contracted += project.amount;
      week.received += project.paid;
      week.projects += 1;
    }
  }

  const openOffers = submissions.filter((submission) =>
    OPEN_STATUSES.has(submission.status),
  );
  let ceiling = 0;
  let priced = 0;
  for (const offer of openOffers) {
    // The contact form's estimate is in million toman.
    const top = money(offer.estimate?.max);
    if (top !== null) {
      ceiling += top * 1_000_000;
      priced += 1;
    }
  }

  const received = (buckets: IncomeBucket[]) =>
    buckets.reduce((sum, bucket) => sum + bucket.received, 0);

  return {
    contractedTotal,
    receivedTotal,
    remainingTotal,
    receivedRatio:
      contractedTotal > 0
        ? Math.min(100, Math.round((receivedTotal / contractedTotal) * 100))
        : 0,
    pipelineContracted,
    pipelineOutstanding,
    pipelineCount,
    months,
    weeks,
    monthlyAverage: Math.round(received(months) / INCOME_MONTH_WINDOW),
    weeklyAverage: Math.round(received(weeks) / INCOME_WEEK_WINDOW),
    offers: { count: openOffers.length, priced, ceiling },
  };
}
