"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { deletePostComments } from "@/lib/content";
import { faNumber } from "@/lib/fa";
import { uniqueUuids } from "@/lib/ids";

export type CommentActionResult = {
  ok: boolean;
  message: string;
  deleted?: number;
};

export async function deleteCommentsAction(
  ids: unknown,
): Promise<CommentActionResult> {
  await requireAdmin();

  const clean = uniqueUuids(ids);
  if (clean.length === 0) {
    return { ok: false, message: "نظری برای حذف انتخاب نشده است." };
  }

  try {
    const deleted = await deletePostComments(clean);
    if (deleted === 0) {
      return { ok: false, message: "نظر پیدا نشد؛ ممکن است قبلاً حذف شده باشد." };
    }
    revalidatePath("/admin/comments");
    revalidatePath("/admin/posts");
    // The public post page is dynamic (`instant = false`), so there is no route
    // cache to purge; `/admin` follows the inbox revalidation convention.
    revalidatePath("/admin");
    return {
      ok: true,
      message: `${faNumber(deleted)} نظر حذف شد.`,
      deleted,
    };
  } catch (error) {
    console.error("[comments] delete failed:", error);
    return { ok: false, message: "حذف نظر ناموفق بود." };
  }
}
