import { getMediaAsset } from "@/lib/content";
import { isTextLike } from "@/lib/media-url";
import { isAllowedPreviewHost } from "@/lib/storage";

const MAX_TEXT_BYTES = 1024 * 1024;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const asset = await getMediaAsset(id);
  if (!asset) {
    return Response.json({ ok: false, message: "رسانه پیدا نشد." }, { status: 404 });
  }

  if (!isTextLike(asset.mime, asset.filename)) {
    return Response.json(
      { ok: false, message: "این فایل متن نیست." },
      { status: 415 },
    );
  }

  let target: URL;
  try {
    target = new URL(asset.url, request.url);
  } catch {
    return Response.json({ ok: false, message: "نشانی معتبر نیست." }, { status: 400 });
  }

  const sameOrigin = target.origin === new URL(request.url).origin;
  if (!sameOrigin && !isAllowedPreviewHost(target.toString())) {
    return Response.json(
      { ok: false, message: "میزبان این فایل برای پیش‌نمایش مجاز نیست." },
      { status: 403 },
    );
  }

  try {
    const response = await fetch(target, {
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    if (!response.ok) {
      return Response.json(
        { ok: false, message: "دریافت فایل ناموفق بود." },
        { status: 502 },
      );
    }

    const declared = Number(response.headers.get("content-length") ?? "0");
    if (declared > MAX_TEXT_BYTES) {
      return Response.json(
        { ok: false, message: "فایل برای پیش‌نمایش بیش از حد بزرگ است." },
        { status: 413 },
      );
    }

    const text = await response.text();
    return Response.json({
      ok: true,
      text: text.length > MAX_TEXT_BYTES ? text.slice(0, MAX_TEXT_BYTES) : text,
      truncated: text.length > MAX_TEXT_BYTES,
    });
  } catch {
    return Response.json(
      { ok: false, message: "دریافت فایل ناموفق بود." },
      { status: 502 },
    );
  }
}
