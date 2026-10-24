import type { Metadata } from "next";
import { PostEditor } from "@/components/admin/posts/post-editor";
import { requireConsolePage } from "@/lib/auth";

export const metadata: Metadata = { title: "یادداشت تازه" };
export const instant = false;

export default async function NewPostPage() {
  await requireConsolePage();
  return <PostEditor post={null} />;
}
