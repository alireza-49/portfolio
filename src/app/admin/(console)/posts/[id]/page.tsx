import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/content";
import { PostEditor } from "@/components/admin/posts/post-editor";
import { requireConsolePage } from "@/lib/auth";

export const metadata: Metadata = { title: "ویرایش یادداشت" };
export const instant = false;

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireConsolePage();
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  return <PostEditor post={post} />;
}
