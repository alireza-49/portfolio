import { NextResponse } from "next/server";
import { getPublishedPostRef, togglePostLike } from "@/lib/content";
import { hasDatabaseConfig } from "@/lib/db";
import { ensureReaderId } from "@/lib/reader";
import { readerSalt, visitorHash } from "@/lib/visitor";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "بدنهٔ درخواست معتبر نیست." },
      { status: 400 },
    );
  }

  const liked =
    body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>).liked
      : undefined;
  if (typeof liked !== "boolean") {
    return NextResponse.json(
      { ok: false, error: "وضعیت پسند معتبر نیست." },
      { status: 422 },
    );
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { ok: false, error: "پایگاه داده در دسترس نیست." },
      { status: 503 },
    );
  }

  try {
    const post = await getPublishedPostRef(slug);
    if (!post) {
      return NextResponse.json(
        { ok: false, error: "یادداشت پیدا نشد." },
        { status: 404 },
      );
    }

    const reader = await ensureReaderId();
    const result = await togglePostLike(
      post.id,
      visitorHash(reader, readerSalt()),
      liked,
    );
    if (!result) {
      return NextResponse.json(
        { ok: false, error: "یادداشت پیدا نشد." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[blog] like failed:", error);
    return NextResponse.json(
      { ok: false, error: "ثبت پسند ناموفق بود." },
      { status: 500 },
    );
  }
}
