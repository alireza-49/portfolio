import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, listTasks } from "@/lib/content";
import { ProjectEditor } from "@/components/admin/projects/project-editor";
import { requireConsolePage } from "@/lib/auth";

export const metadata: Metadata = { title: "ویرایش پیشرفت پروژه" };
export const instant = false;

export default async function ProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireConsolePage();
  const { id } = await params;
  const project = await getProject(id);

  if (!project) notFound();

  const tasks = await listTasks({ projectId: project.id });
  const now = new Date().toISOString();

  return <ProjectEditor project={project} tasks={tasks} now={now} />;
}
