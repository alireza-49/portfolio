"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { deleteTaskEvent } from "@/lib/calendar-sync";
import {
  createProject,
  deleteProject,
  getProject,
  getProjectByCode,
  listTasks,
  patchProjectProgress,
  setProjectPublished,
  updateProject,
} from "@/lib/content";
import {
  notifyProjectProgressSms,
  notifyProjectStatusSms,
  withSmsNote,
} from "@/lib/sms";
import { PROJECT_STATUSES, type ProjectStatus } from "@/lib/types";
import { parseProjectInput } from "./validation";

export type ProjectActionResult = {
  ok: boolean;
  message: string;
  id?: string;
};

function refresh(code?: string | null) {
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/progress");
  revalidatePath("/track");
  revalidatePath("/");
  if (code) revalidatePath(`/track/${code}`);
}

async function uniqueCodeError(
  code: string,
  exceptId?: string,
): Promise<string | null> {
  const existing = await getProjectByCode(code);
  if (existing && existing.id !== exceptId) {
    return "این شناسهٔ پروژه قبلاً ثبت شده است؛ شناسهٔ دیگری انتخاب کنید.";
  }
  return null;
}

export async function createProjectAction(
  raw: unknown,
): Promise<ProjectActionResult> {
  await requireAdmin();

  const parsed = parseProjectInput(raw);
  if (!parsed.ok) return { ok: false, message: parsed.error };

  const duplicate = await uniqueCodeError(parsed.value.code);
  if (duplicate) return { ok: false, message: duplicate };

  try {
    const project = await createProject(parsed.value);
    refresh(project.code);
    return { ok: true, message: "پروژه ثبت شد.", id: project.id };
  } catch (error) {
    console.error("[projects] create failed:", error);
    return { ok: false, message: "ثبت پروژه در پایگاه داده ناموفق بود." };
  }
}

export async function updateProjectAction(
  id: string,
  raw: unknown,
): Promise<ProjectActionResult> {
  await requireAdmin();

  if (!id) return { ok: false, message: "شناسهٔ پروژه معتبر نیست." };

  const parsed = parseProjectInput(raw);
  if (!parsed.ok) return { ok: false, message: parsed.error };

  const duplicate = await uniqueCodeError(parsed.value.code, id);
  if (duplicate) return { ok: false, message: duplicate };

  const previous = await getProject(id);
  if (!previous) return { ok: false, message: "پروژه پیدا نشد." };

  try {
    const project = await updateProject(id, parsed.value);
    if (!project) return { ok: false, message: "پروژه پیدا نشد." };

    refresh(project.code);
    if (previous.code !== project.code) refresh(previous.code);

    const sms = await notifyProjectStatusSms(previous, project);
    return {
      ok: true,
      message: withSmsNote("تغییرات پروژه ذخیره شد.", sms),
      id,
    };
  } catch (error) {
    console.error("[projects] update failed:", error);
    return { ok: false, message: "ذخیرهٔ تغییرات ناموفق بود." };
  }
}

export async function patchProgressAction(
  id: string,
  values: { progress?: number; currentPhase?: string; status?: string },
): Promise<ProjectActionResult> {
  await requireAdmin();

  if (!id) return { ok: false, message: "شناسهٔ پروژه معتبر نیست." };

  const progress =
    typeof values.progress === "number" &&
    Number.isFinite(values.progress) &&
    values.progress >= 0 &&
    values.progress <= 100
      ? Math.round(values.progress)
      : undefined;

  const status =
    typeof values.status === "string" &&
    (PROJECT_STATUSES as readonly string[]).includes(values.status)
      ? (values.status as ProjectStatus)
      : undefined;

  const currentPhase =
    typeof values.currentPhase === "string"
      ? values.currentPhase.trim().slice(0, 160)
      : undefined;

  if (
    progress === undefined &&
    status === undefined &&
    currentPhase === undefined
  ) {
    return { ok: false, message: "هیچ تغییری برای ذخیره وجود ندارد." };
  }

  const previous = await getProject(id);
  if (!previous) return { ok: false, message: "پروژه پیدا نشد." };

  const project = await patchProjectProgress(id, {
    progress,
    status,
    currentPhase,
  });

  if (!project) return { ok: false, message: "پروژه پیدا نشد." };

  refresh(project.code);

  // Only a real transition texts the client; moving the slider stays silent.
  const sms = await notifyProjectStatusSms(previous, project);
  return {
    ok: true,
    message: withSmsNote("پیشرفت پروژه به‌روزرسانی شد.", sms),
    id,
  };
}

/**
 * The manual «ارسال پیام پیشرفت» button on the project page. It re-reads the
 * stored row instead of trusting the form, so an unsaved draft can never be
 * texted to a client.
 */
export async function sendProjectProgressSmsAction(
  id: string,
): Promise<ProjectActionResult> {
  await requireAdmin();

  if (!id) return { ok: false, message: "شناسهٔ پروژه معتبر نیست." };

  const project = await getProject(id);
  if (!project) return { ok: false, message: "پروژه پیدا نشد." };

  const outcome = await notifyProjectProgressSms(project);
  revalidatePath("/admin/settings");

  return {
    ok: outcome.ok,
    message: outcome.message || "پیامکی ارسال نشد.",
    id,
  };
}

export async function setProjectPublishedAction(
  id: string,
  published: boolean,
): Promise<ProjectActionResult> {
  await requireAdmin();

  if (!id) return { ok: false, message: "شناسهٔ پروژه معتبر نیست." };

  const done = await setProjectPublished(id, published);
  if (!done) return { ok: false, message: "پروژه پیدا نشد." };

  const project = await getProject(id);
  refresh(project?.code);
  return {
    ok: true,
    message: published
      ? "صفحهٔ رهگیری پروژه منتشر شد."
      : "صفحهٔ رهگیری پروژه از دسترس خارج شد.",
  };
}

export async function deleteProjectAction(
  id: string,
): Promise<ProjectActionResult> {
  await requireAdmin();

  if (!id) return { ok: false, message: "شناسهٔ پروژه معتبر نیست." };

  const project = await getProject(id);
  if (!project) return { ok: false, message: "پروژه پیدا نشد." };

  // The DB cascade drops the task rows, so their calendar events must go first —
  // afterwards there is no stored event id left to delete with.
  const tasks = await listTasks({ projectId: id });
  await Promise.all(tasks.map((task) => deleteTaskEvent(task)));

  const deleted = await deleteProject(id);
  if (!deleted) return { ok: false, message: "حذف پروژه ناموفق بود." };

  refresh(project.code);
  return { ok: true, message: "پروژه حذف شد." };
}
