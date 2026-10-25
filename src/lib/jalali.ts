/**
 * Minimal Jalali ⇄ Gregorian conversion (the jalaali algorithm).
 *
 * The studio needs a Persian calendar that is deterministic on both the server
 * and the client, so nothing here reads the current clock — callers pass an
 * anchor date instead.
 */

const div = (a: number, b: number) => Math.trunc(a / b);
const mod = (a: number, b: number) => a - Math.floor(a / b) * b;

const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192,
  2262, 2324, 2394, 2456, 3178,
];

type JalCal = { leap: number; gy: number; march: number };

function jalCal(jy: number): JalCal {
  const gy = jy + 621;
  let leapJ = -14;
  let jp = BREAKS[0];
  let jump = 0;

  for (let index = 1; index < BREAKS.length; index += 1) {
    const jm = BREAKS[index];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }

  let n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number): number {
  let day =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  day = day - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return day;
}

function d2g(jdn: number): { gy: number; gm: number; gd: number } {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number): number {
  const { gy, march } = jalCal(jy);
  return g2d(gy, 3, march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

export type JalaliDate = { jy: number; jm: number; jd: number };

export function toJalali(gy: number, gm: number, gd: number): JalaliDate {
  const jdn = g2d(gy, gm, gd);
  const gregorianYear = d2g(jdn).gy;
  let jy = gregorianYear - 621;
  const { march } = jalCal(jy);
  const jdn1f = g2d(gregorianYear, 3, march);
  let k = jdn - jdn1f;

  if (k >= 0) {
    if (k <= 185) {
      return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (jalCal(jy).leap === 1) k += 1;
  }

  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 };
}

export function toGregorian(jy: number, jm: number, jd: number): {
  gy: number;
  gm: number;
  gd: number;
} {
  return d2g(j2d(jy, jm, jd));
}

export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return jalCal(jy).leap === 0 ? 30 : 29;
}

export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const PERSIAN_WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

/** ISO (yyyy-mm-dd) → { gy, gm, gd }. */
export function parseIso(iso: string): { gy: number; gm: number; gd: number } {
  const [gy, gm, gd] = iso.split("-").map((part) => Number(part));
  return { gy, gm, gd };
}

/** { g*, } → ISO (yyyy-mm-dd). */
export function toIso(gy: number, gm: number, gd: number): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${gy}-${pad(gm)}-${pad(gd)}`;
}

/** Jalali date parts for an ISO date. */
export function isoToJalali(iso: string): JalaliDate {
  const { gy, gm, gd } = parseIso(iso);
  return toJalali(gy, gm, gd);
}

/** e.g. `۱۲ آبان ۱۴۰۴`. */
export function formatJalali(iso: string, options?: { withYear?: boolean }) {
  const { jy, jm, jd } = isoToJalali(iso);
  const month = JALALI_MONTHS[jm - 1] ?? "";
  return options?.withYear === false
    ? `${jd} ${month}`
    : `${jd} ${month} ${jy}`;
}

/** Persian weekday name for an ISO date (`جمعه`, …). */
export function formatWeekday(iso: string): string {
  const { gy, gm, gd } = parseIso(iso);
  const names = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
    "شنبه",
  ];
  const dow = new Date(Date.UTC(gy, gm - 1, gd)).getUTCDay();
  return names[dow];
}

/** Persian digit rendering for a plain number. */
export function toPersianDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}
