import type { Metadata } from "next";
import { listPosts } from "@/lib/content";
import { PostList } from "@/components/admin/posts/post-list";
import { requireConsolePage } from "@/lib/auth";

export const metadata: Metadata = { title: "نشر یادداشت‌ها" };
export const instant = false;

export default async function PostsPage() {
  await requireConsolePage();
  const posts = await listPosts();
  return <PostList posts={posts} />;
}
