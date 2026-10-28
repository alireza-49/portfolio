import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, listSmsLogForRef, listTasks } from "@/lib/content";
import { siteOrigin } from "@/lib/site-url";
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

  const [tasks, smsLog, origin] = await Promise.all([
    listTasks({ projectId: project.id }),
    listSmsLogForRef(project.id, 4),
    siteOrigin(),
  ]);
  const now = new Date().toISOString();

  return (
    <ProjectEditor
      project={project}
      tasks={tasks}
      now={now}
      origin={origin}
      smsLog={smsLog}
    />
  );
}
