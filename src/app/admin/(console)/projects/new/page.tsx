import type { Metadata } from "next";
import { ProjectCreateForm } from "@/components/admin/projects/project-create-form";
import { requireConsolePage } from "@/lib/auth";

export const metadata: Metadata = { title: "پروژهٔ تازه" };
export const instant = false;

export default async function NewProjectPage() {
  await requireConsolePage();
  return <ProjectCreateForm />;
}
