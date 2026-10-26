import { getMediaAsset } from "@/lib/content";
import { isTextLike } from "@/lib/media-url";
import { isAllowedPreviewHost } from "@/lib/storage";

const MAX_PREVIEW_BYTES = 5 * 1024 * 1024;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const asset = await getMediaAsset(id);
  if (!asset) return new Response("رسانه پیدا نشد.", { status: 404 });

  let target: URL;
  try {
    target = new URL(asset.url, request.url);
  } catch {
    return new Response("نشانی رسانه معتبر نیست.", { status: 400 });
  }

  const sameOrigin = target.origin === new URL(request.url).origin;
  if (!sameOrigin && !isAllowedPreviewHost(target.toString())) {
    return new Response("میزبان این رسانه برای پیش‌نمایش مجاز نیست.", {
      status: 403,
    });
  }

  let response: Response;
  try {
    response = await fetch(target, {
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
      headers: { Accept: "*/*" },
    });
  } catch {
    return new Response("دریافت رسانه ناموفق بود.", { status: 502 });
  }

  if (!response.ok) {
    return new Response("دریافت رسانه ناموفق بود.", { status: 502 });
  }

  const declared = Number(response.headers.get("content-length") ?? "0");
  if (declared > MAX_PREVIEW_BYTES) {
    return new Response("فایل برای پیش‌نمایش بیش از حد بزرگ است.", {
      status: 413,
    });
  }

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > MAX_PREVIEW_BYTES) {
    return new Response("فایل برای پیش‌نمایش بیش از حد بزرگ است.", {
      status: 413,
    });
  }

  const isText = isTextLike(asset.mime, asset.filename);
  const type = isText
    ? "text/plain; charset=utf-8"
    : asset.mime === "image/svg+xml"
      ? "image/svg+xml"
      : asset.mime === "application/pdf"
        ? "application/pdf"
        : asset.kind === "image"
          ? asset.mime || "application/octet-stream"
          : "application/octet-stream";

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": type,
      "Content-Length": String(buffer.byteLength),
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(
        asset.filename,
      )}`,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "sandbox; default-src 'none'",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
