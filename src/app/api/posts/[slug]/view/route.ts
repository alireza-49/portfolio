import { NextResponse } from "next/server";
import { getPublishedPostRef, recordPostView } from "@/lib/content";
import { hasDatabaseConfig } from "@/lib/db";
import { ensureReaderId } from "@/lib/reader";
import { readerSalt, visitorHash } from "@/lib/visitor";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

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
    const views = await recordPostView(
      post.id,
      visitorHash(reader, readerSalt()),
    );
    return NextResponse.json({ ok: true, views });
  } catch (error) {
    console.error("[blog] view failed:", error);
    return NextResponse.json(
      { ok: false, error: "ثبت بازدید ناموفق بود." },
      { status: 500 },
    );
  }
}
