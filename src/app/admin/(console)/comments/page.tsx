import type { Metadata } from "next";
import { requireConsolePage } from "@/lib/auth";
import { listComments } from "@/lib/content";
import { CommentsPanel } from "@/components/admin/comments/comments-panel";

export const metadata: Metadata = { title: "نظرات یادداشت‌ها" };
export const instant = false;

export default async function CommentsPage() {
  await requireConsolePage();
  const comments = await listComments();
  return <CommentsPanel comments={comments} />;
}
