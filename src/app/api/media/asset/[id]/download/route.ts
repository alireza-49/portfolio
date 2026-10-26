import { getMediaAsset } from "@/lib/content";
import { isAllowedPreviewHost, presignedDownload } from "@/lib/storage";

const MAX_DOWNLOAD_BYTES = 20 * 1024 * 1024;

function disposition(filename: string): string {
  const safe = filename.replace(/["\\\r\n]/g, "").slice(0, 120);
  return `attachment; filename="${safe}"; filename*=UTF-8''${encodeURIComponent(
    safe,
  )}`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const asset = await getMediaAsset(id);
  if (!asset) return new Response("رسانه پیدا نشد.", { status: 404 });

  if (asset.storageKey) {
    try {
      const signed = await presignedDownload(asset.storageKey, asset.filename);
      if (signed) {
        return Response.redirect(signed, 302);
      }
    } catch {
      /* fall through to the proxy */
    }
  }

  let target: URL;
  try {
    target = new URL(asset.url, request.url);
  } catch {
    return new Response("نشانی رسانه معتبر نیست.", { status: 400 });
  }

  const sameOrigin = target.origin === new URL(request.url).origin;
  if (!sameOrigin && !isAllowedPreviewHost(target.toString())) {
    return new Response("میزبان این رسانه برای دانلود مجاز نیست.", {
      status: 403,
    });
  }

  let response: Response;
  try {
    response = await fetch(target, {
      signal: AbortSignal.timeout(15000),
      redirect: "follow",
    });
  } catch {
    return new Response("دریافت رسانه ناموفق بود.", { status: 502 });
  }

  if (!response.ok) {
    return new Response("دریافت رسانه ناموفق بود.", { status: 502 });
  }

  const declared = Number(response.headers.get("content-length") ?? "0");
  if (declared > MAX_DOWNLOAD_BYTES) {
    return new Response("فایل برای دانلود مستقیم بیش از حد بزرگ است.", {
      status: 413,
    });
  }

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > MAX_DOWNLOAD_BYTES) {
    return new Response("فایل برای دانلود مستقیم بیش از حد بزرگ است.", {
      status: 413,
    });
  }

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": asset.mime || "application/octet-stream",
      "Content-Length": String(buffer.byteLength),
      "Content-Disposition": disposition(asset.filename),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
