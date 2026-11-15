"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { saveEstimatorConfig } from "@/lib/content";
import {
  sanitizeEstimatorConfig,
  validateEstimatorDraft,
} from "@/lib/estimator";

export type EstimatorActionResult = { ok: boolean; message: string };

/**
 * The console posts the whole draft. It is re-validated here (never trusted from
 * the browser), then sanitized before it is stored, so the home page can never
 * render a broken catalogue and the contact form can never post a price the
 * console would not show.
 */
export async function saveEstimatorConfigAction(
  input: unknown,
): Promise<EstimatorActionResult> {
  await requireAdmin();

  const problems = validateEstimatorDraft(input);
  if (problems.length > 0) {
    return { ok: false, message: problems[0] };
  }

  await saveEstimatorConfig(sanitizeEstimatorConfig(input));

  // The home page renders this config per request, and the console summary
  // below it must show the saved values on the next render.
  revalidatePath("/");
  revalidatePath("/admin/estimator");

  return {
    ok: true,
    message: "برآوردگر ذخیره شد و از همین حالا در صفحهٔ اصلی اعمال می‌شود.",
  };
}
