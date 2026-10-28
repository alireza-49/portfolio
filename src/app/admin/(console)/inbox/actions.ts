"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  deleteSubmission,
  deleteSubmissions,
  updateSubmissionStatus,
} from "@/lib/content";
import { SUBMISSION_STATUSES, type SubmissionStatus } from "@/lib/types";

export type ActionResult = { ok: boolean; message: string };

function isStatus(value: string): value is SubmissionStatus {
  return (SUBMISSION_STATUSES as readonly string[]).includes(value);
}

function refresh() {
  revalidatePath("/admin/inbox");
  revalidatePath("/admin");
}

export async function setSubmissionStatusAction(
  id: string,
  status: string,
): Promise<ActionResult> {
  await requireAdmin();

  if (!id || !isStatus(status)) {
    return { ok: false, message: "وضعیت انتخاب‌شده معتبر نیست." };
  }

  const updated = await updateSubmissionStatus(id, status);
  if (!updated) {
    return { ok: false, message: "درخواست پیدا نشد." };
  }

  refresh();
  return { ok: true, message: "وضعیت درخواست به‌روزرسانی شد." };
}

export async function bulkSetSubmissionStatusAction(
  ids: string[],
  status: string,
): Promise<ActionResult> {
  await requireAdmin();

  if (!isStatus(status) || ids.length === 0) {
    return { ok: false, message: "انتخاب یا وضعیت معتبر نیست." };
  }

  let updated = 0;
  for (const id of ids) {
    const row = await updateSubmissionStatus(id, status);
    if (row) updated += 1;
  }

  refresh();
  return {
    ok: updated > 0,
    message:
      updated > 0
        ? `وضعیت ${updated} درخواست به‌روزرسانی شد.`
        : "هیچ درخواستی به‌روزرسانی نشد.",
  };
}

export async function deleteSubmissionAction(
  id: string,
): Promise<ActionResult> {
  await requireAdmin();

  if (!id) return { ok: false, message: "شناسهٔ درخواست معتبر نیست." };

  const deleted = await deleteSubmission(id);
  if (!deleted) return { ok: false, message: "درخواست پیدا نشد." };

  refresh();
  return { ok: true, message: "درخواست از صندوق حذف شد." };
}

export async function bulkDeleteSubmissionAction(
  ids: string[],
): Promise<ActionResult> {
  await requireAdmin();

  if (!Array.isArray(ids) || ids.length === 0) {
    return { ok: false, message: "هیچ درخواستی انتخاب نشده است." };
  }

  const deleted = await deleteSubmissions(ids);
  if (deleted === 0) return { ok: false, message: "درخواستی حذف نشد." };

  refresh();
  return { ok: true, message: `${deleted} درخواست از صندوق حذف شد.` };
}
