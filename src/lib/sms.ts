import { contactRef } from "./contact-pending";
import { readSmsCredentials, recordSmsLog } from "./content";
import { sendAmootSms } from "./amootsms";
import { siteOrigin } from "./site-url";
import {
  buildProjectProgressSms,
  buildProjectStatusSms,
  buildSubmissionSms,
  buildTestSms,
  normalizeMobile,
} from "./sms-text";
import {
  PROJECT_STATUS_META,
  type Project,
  type SmsKind,
  type Submission,
} from "./types";

/**
 * When a text goes out, and what the console is told about it.
 *
 * Every path funnels through `deliver()` so the rules live in one place: a send
 * never throws, never blocks a write, and always leaves exactly one `sms_log`
 * row — including the attempts we skipped because SMS is off, the token is
 * missing or the client gave no mobile number.
 */

export type SmsOutcome = {
  ok: boolean;
  /** Nothing was sent on purpose (SMS off, no key, no mobile). */
  skipped: boolean;
  /** Persian sentence for the action result; "" when silence is the right UX. */
  message: string;
};

const OFF = "ارسال پیامک در تنظیمات خاموش است.";
const NO_TOKEN = "توکن آموت در تنظیمات ثبت نشده است.";
const TOKEN_UNREADABLE =
  "توکن آموت ذخیره‌شده خوانده نمی‌شود؛ آن را در تنظیمات دوباره وارد کنید.";
const NO_MOBILE = "شمارهٔ موبایل معتبری برای این کارفرما ثبت نشده است.";
const NO_PHONE = "درخواست بدون شمارهٔ موبایل ثبت شده است.";

async function log(input: {
  kind: SmsKind;
  receptor: string;
  refId: string | null;
  body: string;
  ok: boolean;
  providerStatus: string | null;
  providerMessage: string;
}): Promise<void> {
  try {
    await recordSmsLog(input);
  } catch (error) {
    // The log is diagnostics, never a reason to fail the caller.
    console.error("[sms] could not write sms_log:", error);
  }
}

/** The one gate: every message in the product passes through here. */
async function deliver(input: {
  kind: SmsKind;
  refId: string | null;
  receptor: string | null;
  body: string;
  /** Prefix for a failure that happens before the provider is called. */
  skipMessage: string;
  timeoutMs?: number;
  /** An explicit test send must explain a switched-off provider, not hide it. */
  silentWhenOff?: boolean;
}): Promise<SmsOutcome> {
  const receptor = input.receptor;
  if (!receptor) {
    await log({
      kind: input.kind,
      receptor: "",
      refId: input.refId,
      body: input.body,
      ok: false,
      providerStatus: null,
      providerMessage: input.skipMessage,
    });
    return {
      ok: false,
      skipped: true,
      message: `پیامک ارسال نشد: ${input.skipMessage}`,
    };
  }

  let credentials;
  try {
    credentials = await readSmsCredentials();
  } catch (error) {
    console.error("[sms] settings read failed:", error);
    return { ok: false, skipped: true, message: "" };
  }

  const skip = async (reason: string, silent = false) => {
    await log({
      kind: input.kind,
      receptor,
      refId: input.refId,
      body: input.body,
      ok: false,
      providerStatus: null,
      providerMessage: reason,
    });
    return {
      ok: false,
      skipped: true,
      message: silent ? "" : `پیامک ارسال نشد: ${reason}`,
    } satisfies SmsOutcome;
  };

  if (!credentials.enabled) return skip(OFF, input.silentWhenOff !== false);
  if (!credentials.hasStoredToken) return skip(NO_TOKEN);
  if (!credentials.token) return skip(TOKEN_UNREADABLE);

  const result = await sendAmootSms({
    token: credentials.token,
    sender: credentials.sender,
    receptor,
    message: input.body,
    timeoutMs: input.timeoutMs,
  });

  await log({
    kind: input.kind,
    receptor,
    refId: input.refId,
    body: input.body,
    ok: result.ok,
    providerStatus: result.status,
    providerMessage: result.message,
  });

  return {
    ok: result.ok,
    skipped: false,
    message: result.ok
      ? "پیامک برای کارفرما ارسال شد."
      : `پیامک ارسال نشد: ${result.message}`,
  };
}

/** `«ذخیره شد؛ پیامک …»` — the save always stands, the text is only appended. */
export function withSmsNote(base: string, outcome: SmsOutcome | null): string {
  if (!outcome?.message) return base;
  return `${base}؛ ${outcome.message}`;
}

/** Fired by `/api/contact` right after the submission row exists. */
export async function notifySubmissionSms(
  submission: Submission,
): Promise<SmsOutcome> {
  const receptor = normalizeMobile(submission.contact);
  const origin = await siteOrigin().catch(() => "");
  const link = `${origin}/track?ref=${submission.id}`;

  const body = buildSubmissionSms({
    createdAt: submission.createdAt,
    reference: contactRef(submission.id),
    link,
  });

  return deliver({
    kind: "submission",
    refId: submission.id,
    receptor,
    body,
    skipMessage: NO_PHONE,
    // A visitor is waiting on the form: do not let a slow provider hold it.
    timeoutMs: 5_000,
  });
}

/**
 * Fired by both project save paths, only when the stored status really moved —
 * so pressing «ذخیره» twice texts once.
 */
export async function notifyProjectStatusSms(
  previous: Project,
  next: Project,
): Promise<SmsOutcome | null> {
  if (previous.status === next.status) return null;

  const receptor = normalizeMobile(next.clientMobile);
  const origin = await siteOrigin().catch(() => "");
  const body = buildProjectStatusSms({
    title: next.title,
    statusLabel: PROJECT_STATUS_META[next.status].label,
    progress: next.progress,
    // An unpublished project has no public ledger yet; never text a 404.
    link: next.published ? `${origin}/track/${encodeURIComponent(next.code)}` : null,
  });

  return deliver({
    kind: "project_status",
    refId: next.id,
    receptor,
    body,
    skipMessage: NO_MOBILE,
  });
}

/** The manual «ارسال پیام پیشرفت» button — same builder, explicit intent. */
export async function notifyProjectProgressSms(
  project: Project,
): Promise<SmsOutcome> {
  const receptor = normalizeMobile(project.clientMobile);
  const origin = await siteOrigin().catch(() => "");
  const body = buildProjectProgressSms({
    title: project.title,
    progress: project.progress,
    phase: project.currentPhase,
    link: project.published
      ? `${origin}/track/${encodeURIComponent(project.code)}`
      : null,
  });

  return deliver({
    kind: "project_progress",
    refId: project.id,
    receptor,
    body,
    skipMessage: NO_MOBILE,
  });
}

/** «ارسال پیام آزمایشی» on the settings page. */
export async function sendTestSms(receptor: string): Promise<SmsOutcome> {
  const body = buildTestSms();
  return deliver({
    kind: "test",
    refId: null,
    receptor,
    body,
    skipMessage: NO_MOBILE,
    silentWhenOff: false,
  });
}
