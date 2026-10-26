import { NextResponse } from "next/server";
import { createPostComment, getPublishedPostRef } from "@/lib/content";
import { hasDatabaseConfig } from "@/lib/db";
import { isHoneypot, parseCommentInput } from "@/lib/comment-input";

/** 5 comments per IP per 10 minutes, in memory like the contact endpoint. */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const key = clientKey(request);
  const now = Date.now();
  const entry = hits.get(key);

  if (entry && entry.resetAt > now && entry.count >= RATE_MAX) {
    return fail(
      "تعداد نظرهای ارسالی از این دستگاه زیاد بوده است؛ چند دقیقه بعد دوباره تلاش کنید.",
      429,
    );
  }
  if (entry && entry.resetAt > now) entry.count += 1;
  else hits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("بدنهٔ درخواست معتبر نیست.", 400);
  }

  // Silent success: the bot sees nothing unusual and no row is written.
  if (isHoneypot(body)) return NextResponse.json({ ok: true });

  const parsed = parseCommentInput(body);
  if (!parsed.ok) return fail(parsed.error, 422);

  if (!hasDatabaseConfig()) {
    return fail("پایگاه داده در دسترس نیست.", 503);
  }

  try {
    const post = await getPublishedPostRef(slug);
    if (!post) return fail("یادداشت پیدا نشد.", 404);

    const comment = await createPostComment({ postId: post.id, ...parsed.value });
    return NextResponse.json({ ok: true, comment }, { status: 201 });
  } catch (error) {
    console.error("[blog] comment failed:", error);
    return fail("ثبت نظر ناموفق بود؛ لطفاً دوباره تلاش کنید.", 500);
  }
}
