/**
 * The visitor's own memory of a just-sent contact form.
 *
 * The 10-minute send lock is per browser, not per IP: two people behind one
 * office NAT can each send, and clearing the throttle server-side never
 * unlocks somebody's button early. Only the submission id and the send time
 * are stored — never the message itself.
 */

export const CONTACT_PENDING_KEY = "cc-contact-pending-v1";

/** Length of the send-button lock, and of the locked (pending) track page. */
export const CONTACT_SEND_WINDOW_MS = 10 * 60 * 1000;

export type PendingContact = {
  /** Submission id returned by `/api/contact`. */
  id: string;
  /** `Date.now()` when the form was accepted. */
  sentAt: number;
};

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Persian/Arabic digits to ASCII, so one regex can read both. */
export function latinDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const fa = FA_DIGITS.indexOf(digit);
    if (fa !== -1) return String(fa);
    return String(AR_DIGITS.indexOf(digit));
  });
}

function isPendingContact(value: unknown): value is PendingContact {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<PendingContact>;
  return (
    typeof candidate.id === "string" &&
    UUID.test(candidate.id) &&
    typeof candidate.sentAt === "number" &&
    Number.isFinite(candidate.sentAt)
  );
}

/** The pending request this browser remembers, or `null`. */
export function readPendingContact(): PendingContact | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONTACT_PENDING_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isPendingContact(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writePendingContact(
  id: string,
  sentAt: number = Date.now(),
): PendingContact | null {
  if (!UUID.test(id)) return null;
  const pending: PendingContact = { id, sentAt };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CONTACT_PENDING_KEY, JSON.stringify(pending));
    } catch {
      /* private mode or a full quota — the redirect still works */
    }
  }
  return pending;
}

export function clearPendingContact(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONTACT_PENDING_KEY);
  } catch {
    /* nothing to clear */
  }
}

/** Milliseconds left on the send lock (0 = free to send). */
export function sendLockRemaining(
  pending: PendingContact | null,
  now: number = Date.now(),
): number {
  if (!pending) return 0;
  return Math.max(0, pending.sentAt + CONTACT_SEND_WINDOW_MS - now);
}

/**
 * The visitor-facing reference for a submission. Short and stable, derived
 * from the real id — the URL and storage keep the full UUID, so nothing in
 * the console is guessed.
 */
export function contactRef(id: string): string {
  const compact = id.replace(/-/g, "").toUpperCase();
  return `REQ-${compact.slice(0, 8)}`;
}

/**
 * True for an Iranian mobile number written with Persian or Latin digits,
 * with or without `+98` / `0098` / separators. Only then do we claim an SMS
 * went out (uk / landline numbers get no line).
 */
export function looksLikePhone(value: string): boolean {
  const digits = latinDigits(value).replace(/[\s().-]/g, "");
  return /^(?:\+98|0098|98|0)?9\d{9}$/.test(digits);
}

/**
 * A phone number is shown back to the visitor on the locked page, so mask the
 * middle — the URL (and therefore the page) can be shared or leak via
 * referrers, and it should never carry the whole number.
 */
export function maskPhone(value: string): string {
  let digits = latinDigits(value).replace(/\D/g, "");
  if (digits.startsWith("0098")) digits = `0${digits.slice(4)}`;
  else if (digits.startsWith("98") && digits.length === 12) {
    digits = `0${digits.slice(2)}`;
  }
  if (digits.length < 8) return digits;
  return `${digits.slice(0, 4)}•••${digits.slice(-4)}`;
}
