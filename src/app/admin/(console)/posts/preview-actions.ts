"use server";

import { requireAdmin } from "@/lib/auth";
import {
  clearPostPreviewToken,
  getPost,
  setPostPreviewToken,
} from "@/lib/content";
import {
  issuePreviewToken,
  previewPath,
  PREVIEW_DAYS,
} from "@/lib/preview-token";

export type PreviewLinkResult =
  | {
      ok: true;
      path: string;
      expiresAt: string;
      days: number;
    }
  | { ok: false; message: string };

export async function createPreviewLinkAction(
  postId: string,
): Promise<PreviewLinkResult> {
  await requireAdmin();

  const post = await getPost(postId);
  if (!post) return { ok: false, message: "یادداشت پیدا نشد." };

  try {
    const { token, hash, expiresAt } = issuePreviewToken();
    const saved = await setPostPreviewToken(postId, hash, expiresAt);
    if (!saved) return { ok: false, message: "ساخت لینک پیش‌نمایش ناموفق بود." };
    return {
      ok: true,
      path: previewPath(token),
      expiresAt: expiresAt.toISOString(),
      days: PREVIEW_DAYS,
    };
  } catch (error) {
    console.error("[preview] issue failed:", error);
    return { ok: false, message: "ساخت لینک پیش‌نمایش ناموفق بود." };
  }
}

export async function revokePreviewLinkAction(
  postId: string,
): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  try {
    const cleared = await clearPostPreviewToken(postId);
    if (!cleared) return { ok: false, message: "یادداشت پیدا نشد." };
    return { ok: true, message: "لینک پیش‌نمایش باطل شد." };
  } catch (error) {
    console.error("[preview] revoke failed:", error);
    return { ok: false, message: "باطل‌کردن لینک ناموفق بود." };
  }
}
