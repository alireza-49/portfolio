import { faDate, faNumber, faTime } from "./fa";
import { latinDigits } from "./contact-pending";

/**
 * The words that go out as SMS, and nothing else.
 *
 * This module is deliberately client-safe: the console renders the exact text
 * and its segment count before anything is sent, so the preview cannot drift
 * from what AmootSMS receives. The network call lives in `amootsms.ts` and
 * the settings/log wiring in `sms.ts`.
 */

/** Sender identity at the head of every message. */
export const SMS_BRAND = "فیل وب دیزاین";

/** Persian and Latin text keep the same budget in characters, not bytes. */
const GSM7 =
  /^[\n\r A-Za-z0-9@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ!"#¤%&'()*+,\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}[\]~|€]*$/;

/**
 * Approximate billed parts for one body, following the carrier rules AmootSMS
 * itself documents: 160/153 characters in the GSM alphabet, 70/67 for anything
 * that needs UCS-2 (which is every Persian message).
 */
export function smsSegments(body: string): number {
  if (!body) return 0;
  const latin = GSM7.test(body);
  const single = latin ? 160 : 70;
  const multipart = latin ? 153 : 67;
  if (body.length <= single) return 1;
  return Math.ceil(body.length / multipart);
}

/** Cuts a project title so one long name cannot eat the whole message. */
export function truncateForSms(value: string, max = 40): string {
  const text = value.trim().replace(/\s+/g, " ");
  if (text.length <= max) return text;
  // `max` is the whole budget, ellipsis included, so a truncated title still
  // fits the same number of SMS parts as the untruncated one would promise.
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max / 2 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

/**
 * `+98 912 123 4567`, `00989121234567`, `9121234567` and `۰۹۱۲…` all become
 * `09121234567`. Landlines and anything shorter are rejected, so the console
 * never spends credit on a number that cannot receive.
 */
export function normalizeMobile(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = latinDigits(raw).replace(/[^\d+]/g, "");

  if (digits.startsWith("+98")) digits = `0${digits.slice(3)}`;
  else if (digits.startsWith("0098")) digits = `0${digits.slice(4)}`;
  else if (digits.startsWith("98") && digits.length === 12) {
    digits = `0${digits.slice(2)}`;
  }

  if (/^9\d{9}$/.test(digits)) return `0${digits}`;
  if (/^09\d{9}$/.test(digits)) return digits;
  return null;
}

function withLink(body: string, link: string | null): string {
  return link ? `${body} — مشاهده: ${link}` : body;
}

/** "Your request was received on <Jalali date> at <time>", plus the reference. */
export function buildSubmissionSms(input: {
  createdAt: string;
  reference: string;
  link: string;
}): string {
  const when = `${faDate(input.createdAt)} ساعت ${faTime(input.createdAt)}`;
  return `${SMS_BRAND}: درخواست شما در ${when} ثبت شد. کد پیگیری ${input.reference} — پیگیری: ${input.link}`;
}

/** Sent automatically, once, when a project's status really changes. */
export function buildProjectStatusSms(input: {
  title: string;
  statusLabel: string;
  progress: number;
  link: string | null;
}): string {
  const head = `${SMS_BRAND}: وضعیت پروژه «${truncateForSms(input.title)}» به «${input.statusLabel}» تغییر کرد.`;
  return withLink(
    `${head} پیشرفت: ${faNumber(input.progress)}٪`,
    input.link,
  );
}

/** The manual «ارسال پیام پیشرفت» text: same body builder, different event. */
export function buildProjectProgressSms(input: {
  title: string;
  progress: number;
  phase: string;
  link: string | null;
}): string {
  const head = `${SMS_BRAND}: پیشرفت پروژه «${truncateForSms(input.title)}» به ${faNumber(input.progress)}٪ رسید`;
  const phase = input.phase.trim()
    ? ` — مرحله: ${truncateForSms(input.phase, 40)}`
    : "";
  return withLink(`${head}${phase}.`, input.link);
}

export const buildTestSms = (): string =>
  `${SMS_BRAND}: پیام آزمایشی از کنسول. اگر این پیام را می‌بینید، اتصال آموت درست است.`;
