import { NextResponse } from "next/server";
import { getSubmission } from "@/lib/content";
import { hasDatabaseConfig } from "@/lib/db";

/**
 * Public status probe for the locked track page. Only the status string leaves
 * the server — never the name, the message or the contact. The id is a UUID,
 * so guessing a submission is not practical; keep the answer cache-free.
 */
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id")?.trim() ?? "";

  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { ok: false, error: "پایگاه داده در دسترس نیست." },
      { status: 503 },
    );
  }

  const submission = id ? await getSubmission(id) : null;

  if (!submission) {
    return NextResponse.json(
      { ok: false, error: "درخواست پیدا نشد." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { ok: true, status: submission.status },
    { headers: { "cache-control": "no-store" } },
  );
}
