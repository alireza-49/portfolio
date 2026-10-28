import type { Metadata } from "next";
import { connection } from "next/server";
import { PublicPageShell } from "@/components/public-page-shell";
import { BlogArchive } from "@/components/blog/blog-archive";
import { listPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "روزنامهٔ کارگاه | وبلاگ فیل",
  description:
    "یادداشت‌های مهندسی، تایپوگرافی فارسی، وب پایدار و طراحی ریسوگراف؛ آرشیو رسمی کارگاه فیل.",
  keywords: ["وبلاگ", "ریسوگراف", "تایپوگرافی فارسی", "وب پایدار", "فیل"],
};

export const instant = false;

export default async function BlogPage() {
  await connection();
  const posts = await listPosts({ publishedOnly: true });

  return (
    <PublicPageShell>
      <BlogArchive posts={posts} />
    </PublicPageShell>
  );
}
