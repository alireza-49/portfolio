import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { pullCalendar } from "@/lib/calendar-sync";

/**
 * Pull endpoint: the plan screen calls it with the admin cookie, and a cron
 * (or `curl`) can call it with `Authorization: Bearer $CRON_SECRET`. Without
 * either, it fails closed — it never touches Google anonymously.
 */
async function handle(request: NextRequest) {
  const session = await getAdminSession();
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization") ?? "";
  const byCron = Boolean(secret) && authorization === `Bearer ${secret}`;

  if (!session && !byCron) {
    return NextResponse.json(
      { ok: false, error: "دسترسی مجاز نیست." },
      { status: 401 },
    );
  }

  try {
    const summary = await pullCalendar();
    return NextResponse.json(summary, { status: summary.ok ? 200 : 409 });
  } catch (error) {
    console.error("[google] pull failed:", error);
    return NextResponse.json(
      { ok: false, error: "همگام‌سازی تقویم ناموفق بود." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
