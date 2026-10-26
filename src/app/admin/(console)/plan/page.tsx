import type { Metadata } from "next";
import { PlanWorkspace } from "@/components/admin/plan/plan-workspace";
import { requireConsolePage } from "@/lib/auth";
import { connectionState } from "@/lib/calendar-sync";
import { getPlanOverview } from "@/lib/content";
import { gridRange, jalaliMonthOf, tehranToday } from "@/lib/schedule";

export const metadata: Metadata = { title: "برنامه‌ریزی و تقویم" };
export const instant = false;

const NOTICES: Record<string, string> = {
  connected: "حساب گوگل وصل شد؛ از این پس هر کار در تقویم ساخته می‌شود.",
  denied: "اجازهٔ دسترسی به تقویم گوگل داده نشد.",
  state: "درخواست اتصال منقضی یا نامعتبر بود؛ دوباره تلاش کنید.",
  missing: "کلیدهای گوگل در محیط تنظیم نشده‌اند.",
  error: "اتصال به گوگل ناموفق بود؛ دوباره تلاش کنید.",
};

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireConsolePage();

  const params = await searchParams;
  const today = tehranToday();
  const month = jalaliMonthOf(today);
  // Imported events are context around the visible month; tasks come whole.
  const { fromIso, toIso } = gridRange(month);

  const [overview, connection] = await Promise.all([
    getPlanOverview({ fromIso, toIso }),
    connectionState(),
  ]);

  const google = typeof params.google === "string" ? params.google : "";
  const projectId =
    typeof params.project === "string" ? params.project : null;

  return (
    <PlanWorkspace
      projects={overview.projects}
      tasks={overview.tasks}
      imported={overview.imported}
      connection={connection}
      today={today}
      initialMonth={month}
      initialProjectId={projectId}
      notice={NOTICES[google] ?? null}
    />
  );
}
