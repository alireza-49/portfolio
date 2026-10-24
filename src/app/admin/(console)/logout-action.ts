"use server";

import { redirect } from "next/navigation";
import { endAdminSession } from "@/lib/auth";

/** Clears the session cookie and returns to the login card. */
export async function logoutAction(): Promise<void> {
  await endAdminSession();
  redirect("/admin/login");
}
