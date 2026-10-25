"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearFailures,
  credentialsMatch,
  getAdminConfig,
  isRateLimited,
  registerFailure,
  startAdminSession,
} from "@/lib/auth";

export type LoginState = { error: string | null; username: string };

async function clientKey(): Promise<string> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "local"
  );
}

/**
 * Server-side login: the credentials never leave the server, the session is an
 * HttpOnly cookie and repeated failures are throttled per client.
 */
export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";

  const config = getAdminConfig();
  if (!config) {
    return {
      username,
      error:
        "ورود مدیر هنوز پیکربندی نشده است. متغیرهای ADMIN_USERNAME، ADMIN_PASSWORD و ADMIN_SESSION_SECRET را تنظیم کنید.",
    };
  }

  if (!username || !password) {
    return { username, error: "شناسه کاربری و گذرواژه را کامل وارد کنید." };
  }

  const key = await clientKey();
  if (isRateLimited(key)) {
    return {
      username,
      error:
        "تلاش‌های ناموفق بیش از حد مجاز شده است. چند دقیقه صبر کنید و دوباره امتحان کنید.",
    };
  }

  if (!credentialsMatch(config, username, password)) {
    registerFailure(key);
    return { username, error: "شناسه کاربری یا گذرواژه درست نیست." };
  }

  clearFailures(key);
  const started = await startAdminSession(config.username, remember);
  if (!started) {
    return {
      username,
      error: "ایجاد نشست ممکن نشد؛ پیکربندی محیطی را بررسی کنید.",
    };
  }

  redirect("/admin");
}
