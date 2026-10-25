import type { ReactNode } from "react";
import { connection } from "next/server";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminConfig, requireAdmin } from "@/lib/auth";

/**
 * Every console page reads request state (session + Postgres), so the segment
 * opts out of Instant Navigation validation instead of pretending to prerender.
 */
export const instant = false;

export default async function ConsoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  const session = await requireAdmin();
  const config = getAdminConfig();

  return (
    <AdminShell
      username={session.username}
      usingFallback={Boolean(config?.usingFallback)}
    >
      {children}
    </AdminShell>
  );
}
