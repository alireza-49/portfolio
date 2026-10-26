"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  clearGoogleAccount,
  createTask,
  deleteTask,
  getGoogleAccount,
  getTask,
  saveGoogleAccount,
  setTaskDone,
  updateTask,
} from "@/lib/content";
import {
  deleteTaskEvent,
  moveEventsToCalendar,
  pullCalendar,
  pushAllTasks,
  pushTask,
} from "@/lib/calendar-sync";
import { revokeToken } from "@/lib/google-calendar";
import { decryptSecret } from "@/lib/secrets";
import type { ProjectTask } from "@/lib/types";
import { isTaskId, parseCalendarSettings, parseTaskInput } from "./validation";

export type TaskActionResult = {
  ok: boolean;
  message: string;
  task?: ProjectTask | null;
};

function refresh(projectId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/plan");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/progress");
  if (projectId) revalidatePath(`/admin/projects/${projectId}`);
}

export async function createTaskAction(raw: unknown): Promise<TaskActionResult> {
  await requireAdmin();

  const parsed = parseTaskInput(raw);
  if (!parsed.ok) return { ok: false, message: parsed.error };

  try {
    const task = await createTask(parsed.value);
    // The Google write happens after the row exists, so a failed API call leaves
    // a normal task with `google_sync_state = error` instead of losing the input.
    const outcome = await pushTask(task.id);
    refresh(task.projectId);
    return {
      ok: true,
      message:
        outcome.state === "synced"
          ? "کار ثبت و در تقویم گوگل ساخته شد."
          : outcome.message,
      task: outcome.task ?? task,
    };
  } catch (error) {
    console.error("[plan] create failed:", error);
    return { ok: false, message: "ثبت کار در پایگاه داده ناموفق بود." };
  }
}

export async function updateTaskAction(
  id: string,
  raw: unknown,
): Promise<TaskActionResult> {
  await requireAdmin();

  if (!isTaskId(id)) return { ok: false, message: "شناسهٔ کار معتبر نیست." };

  const parsed = parseTaskInput(raw);
  if (!parsed.ok) return { ok: false, message: parsed.error };

  try {
    const saved = await updateTask(id, parsed.value);
    if (!saved) return { ok: false, message: "کار پیدا نشد." };

    const outcome = await pushTask(saved.id);
    refresh(saved.projectId);
    return {
      ok: true,
      message:
        outcome.state === "synced"
          ? "کار به‌روزرسانی و به تقویم گوگل ارسال شد."
          : outcome.message,
      task: outcome.task ?? saved,
    };
  } catch (error) {
    console.error("[plan] update failed:", error);
    return { ok: false, message: "ذخیرهٔ تغییرات کار ناموفق بود." };
  }
}

export async function setTaskDoneAction(
  id: string,
  done: boolean,
): Promise<TaskActionResult> {
  await requireAdmin();

  if (!isTaskId(id)) return { ok: false, message: "شناسهٔ کار معتبر نیست." };

  const task = await setTaskDone(id, done === true);
  if (!task) return { ok: false, message: "کار پیدا نشد." };

  const outcome = await pushTask(task.id);
  refresh(task.projectId);
  return {
    ok: true,
    message: done ? "کار انجام‌شده علامت خورد." : "علامت انجام‌شدن برداشته شد.",
    task: outcome.task ?? task,
  };
}

export async function deleteTaskAction(id: string): Promise<TaskActionResult> {
  await requireAdmin();

  if (!isTaskId(id)) return { ok: false, message: "شناسهٔ کار معتبر نیست." };

  const task = await getTask(id);
  if (!task) return { ok: false, message: "کار پیدا نشد." };

  // Remove the Google event first: once the row is gone we lose the event id.
  await deleteTaskEvent(task);

  const deleted = await deleteTask(id);
  if (!deleted) return { ok: false, message: "حذف کار ناموفق بود." };

  refresh(deleted.projectId);
  return { ok: true, message: "کار و رویداد تقویم حذف شد." };
}

export async function pushTaskAction(id: string): Promise<TaskActionResult> {
  await requireAdmin();

  if (!isTaskId(id)) return { ok: false, message: "شناسهٔ کار معتبر نیست." };

  try {
    const outcome = await pushTask(id);
    refresh(outcome.task?.projectId);
    return {
      ok: outcome.state !== "error",
      message: outcome.message,
      task: outcome.task,
    };
  } catch (error) {
    console.error("[plan] push failed:", error);
    return { ok: false, message: "ارسال به تقویم گوگل ناموفق بود." };
  }
}

export async function pushAllTasksAction(): Promise<TaskActionResult> {
  await requireAdmin();

  try {
    const summary = await pushAllTasks();
    refresh();
    return { ok: summary.failed === 0, message: summary.message };
  } catch (error) {
    console.error("[plan] bulk push failed:", error);
    return { ok: false, message: "ارسال گروهی به تقویم ناموفق بود." };
  }
}

export async function pullCalendarAction(): Promise<TaskActionResult> {
  await requireAdmin();

  try {
    const summary = await pullCalendar();
    refresh();
    return { ok: summary.ok, message: summary.message };
  } catch (error) {
    console.error("[plan] pull failed:", error);
    return { ok: false, message: "دریافت تغییرات تقویم ناموفق بود." };
  }
}

export async function saveCalendarSettingsAction(
  raw: unknown,
): Promise<TaskActionResult> {
  await requireAdmin();

  const parsed = parseCalendarSettings(raw);
  if (!parsed.ok) return { ok: false, message: parsed.error };

  const account = await getGoogleAccount();
  if (!account) {
    return { ok: false, message: "ابتدا حساب گوگل را وصل کنید." };
  }

  const previous = account.calendarId || "primary";
  const next = parsed.value.calendarId;

  try {
    // A sync token is bound to one calendar, so a switch starts a full pull.
    await saveGoogleAccount({
      calendarId: next,
      syncToken: previous === next ? account.syncToken : "",
    });

    if (previous === next) {
      refresh();
      return { ok: true, message: "تقویم مقصد بدون تغییر ماند." };
    }

    const moved = await moveEventsToCalendar(next);
    refresh();

    const parts = ["تقویم مقصد ذخیره شد."];
    if (moved.moved > 0) parts.push(`${moved.moved} رویداد به تقویم تازه منتقل شد.`);
    if (moved.failed > 0) parts.push(`${moved.failed} رویداد در تقویم قبلی ماند.`);

    return { ok: moved.failed === 0, message: parts.join(" ") };
  } catch (error) {
    console.error("[plan] calendar settings failed:", error);
    return { ok: false, message: "ذخیرهٔ تنظیمات تقویم ناموفق بود." };
  }
}

export async function disconnectGoogleAction(): Promise<TaskActionResult> {
  await requireAdmin();

  const account = await getGoogleAccount();

  // Best effort: revoke at Google so the grant does not linger, then forget it.
  if (account) {
    const refreshToken = decryptSecret(account.refreshToken);
    if (refreshToken) await revokeToken(refreshToken);
  }

  await clearGoogleAccount();
  refresh();

  return {
    ok: true,
    message: "اتصال گوگل قطع شد؛ رویدادهای ساخته‌شده در تقویم باقی ماندند.",
  };
}
