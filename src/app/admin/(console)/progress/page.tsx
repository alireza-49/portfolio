import type { Metadata } from "next";
import { listProjects } from "@/lib/content";
import { ProgressBoard } from "@/components/admin/projects/progress-board";
import { requireConsolePage } from "@/lib/auth";

export const metadata: Metadata = { title: "پیشرفت پروژه‌ها" };
export const instant = false;

export default async function ProgressPage() {
  await requireConsolePage();
  const projects = await listProjects();
  const active = projects.filter((project) =>
    ["planning", "active", "review"].includes(project.status),
  );

  return <ProgressBoard projects={active} />;
}
