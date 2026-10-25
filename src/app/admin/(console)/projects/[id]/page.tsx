import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/content";
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

  return <ProjectEditor project={project} />;
}
