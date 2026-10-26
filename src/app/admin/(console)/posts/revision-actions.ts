"use server";

import { readingMinutes } from "@/lib/fa";
import { requireAdmin } from "@/lib/auth";
import {
  getPostRevision,
  listPostRevisions,
  restorePostRevision,
} from "@/lib/content";
import { validateEmbeddedBlocks } from "@/lib/richtext";
import { sanitizePostHtml, stripHtml } from "@/lib/sanitize";
import type { PostRevisionDetail, PostRevisionSummary } from "@/lib/types";

export type RevisionListResult =
  | { ok: true; revisions: PostRevisionSummary[] }
  | { ok: false; message: string };

export type RevisionDetailResult =
  | { ok: true; revision: PostRevisionDetail }
  | { ok: false; message: string };

export type RestoreResult =
  | { ok: true; contentHtml: string; message: string }
  | { ok: false; message: string };

export async function listPostRevisionsAction(
  postId: string,
): Promise<RevisionListResult> {
  await requireAdmin();
  try {
    return { ok: true, revisions: await listPostRevisions(postId) };
  } catch (error) {
    console.error("[revisions] list failed:", error);
    return { ok: false, message: "خواندن تاریخچه ناموفق بود." };
  }
}

export async function getPostRevisionAction(
  postId: string,
  revisionId: string,
): Promise<RevisionDetailResult> {
  await requireAdmin();
  try {
    const revision = await getPostRevision(postId, revisionId);
    if (!revision) return { ok: false, message: "نسخه پیدا نشد." };
    return { ok: true, revision };
  } catch (error) {
    console.error("[revisions] read failed:", error);
    return { ok: false, message: "خواندن نسخه ناموفق بود." };
  }
}

export async function restorePostRevisionAction(
  postId: string,
  revisionId: string,
): Promise<RestoreResult> {
  await requireAdmin();

  const revisionResult = await getPostRevisionAction(postId, revisionId);
  if (!revisionResult.ok) return revisionResult;

  const contentHtml = sanitizePostHtml(
    revisionResult.revision.contentHtml,
  );
  const embeddedError = validateEmbeddedBlocks(contentHtml);
  if (embeddedError) return { ok: false, message: embeddedError };

  try {
    const plain = stripHtml(contentHtml);
    const post = await restorePostRevision(
      postId,
      revisionId,
      Math.min(240, readingMinutes(plain || revisionResult.revision.title)),
      contentHtml,
    );
    if (!post) return { ok: false, message: "بازگردانی نسخه ناموفق بود." };
    return {
      ok: true,
      contentHtml,
      message: "نسخهٔ انتخاب‌شده بازگردانی شد.",
    };
  } catch (error) {
    console.error("[revisions] restore failed:", error);
    return { ok: false, message: "بازگردانی نسخه ناموفق بود." };
  }
}
