"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { saveSmsSettings } from "@/lib/content";
import { sendTestSms } from "@/lib/sms";
import { normalizeMobile } from "@/lib/sms-text";

export type SmsActionResult = { ok: boolean; message: string };

/**
 * AmootSMS tokens are opaque strings (we have never seen a fixed format), so the
 * only honest rule is: no whitespace, not empty, not absurdly long.
 */
const TOKEN_SHAPE = /^\S{8,200}$/;
/** A sender line is `10004346`, `+9810004346` or empty (the public line). */
const SENDER_SHAPE = /^\+?\d{3,14}$/;

export async function saveSmsSettingsAction(input: {
  enabled: boolean;
  sender: string;
  notifyMobile: string;
  token: string;
  clearToken?: boolean;
}): Promise<SmsActionResult> {
  await requireAdmin();

  const sender = typeof input?.sender === "string" ? input.sender.trim() : "";
  if (sender && !SENDER_SHAPE.test(sender)) {
    return {
      ok: false,
      message:
        "خط فرستنده فقط رقم است (مثلاً 10004346)؛ برای ارسال از خط عمومی («public») آن را خالی بگذارید.",
    };
  }

  const rawNotify =
    typeof input?.notifyMobile === "string" ? input.notifyMobile.trim() : "";
  const notifyMobile = rawNotify ? (normalizeMobile(rawNotify) ?? "") : "";
  if (!notifyMobile && rawNotify) {
    return {
      ok: false,
      message: "شمارهٔ دریافت پیامک سفارش معتبر نیست؛ نمونه: ۰۹۱۲۱۲۳۴۵۶۷.",
    };
  }

  const token = typeof input?.token === "string" ? input.token.trim() : "";
  if (token && !TOKEN_SHAPE.test(token)) {
    return {
      ok: false,
      message: "توکن آموت رشته‌ای بدون فاصله و بین ۸ تا ۲۰۰ کاراکتر است.",
    };
  }

  await saveSmsSettings({
    enabled: Boolean(input?.enabled),
    sender,
    notifyMobile,
    token,
    clearToken: Boolean(input?.clearToken),
  });

  revalidatePath("/admin/settings");
  return {
    ok: true,
    message: token
      ? "تنظیمات ذخیره شد و توکن جدید رمزنگاری‌شده در پایگاه داده نشست."
      : "تنظیمات پیامک ذخیره شد.",
  };
}

export async function sendTestSmsAction(
  receptor: string,
): Promise<SmsActionResult> {
  await requireAdmin();

  const phone = normalizeMobile(receptor);
  if (!phone) {
    return {
      ok: false,
      message: "شمارهٔ موبایل معتبر نیست؛ نمونه: ۰۹۱۲۱۲۳۴۵۶۷.",
    };
  }

  const outcome = await sendTestSms(phone);
  revalidatePath("/admin/settings");
  return {
    ok: outcome.ok,
    message: outcome.message || "پیام آزمایشی ارسال نشد.",
  };
}
