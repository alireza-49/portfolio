import type { Metadata } from "next";
import { listProjects } from "@/lib/content";
import { requireConsolePage } from "@/lib/auth";
import { ProjectList } from "@/components/admin/projects/project-list";

export const metadata: Metadata = { title: "مدیریت پروژه‌ها" };
export const instant = false;

export default async function ProjectsPage() {
  await requireConsolePage();
  const projects = await listProjects();
  return <ProjectList projects={projects} />;
}
