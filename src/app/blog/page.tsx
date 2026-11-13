import type { Metadata } from "next";
import { PublicPageShell } from "@/components/public-page-shell";
import { BlogArchive } from "@/components/blog/blog-archive";
import { blogPosts } from "@/lib/blog-feed";

export const metadata: Metadata = {
  title: "روزنامهٔ کارگاه | وبلاگ فیل",
  description:
    "یادداشت‌های مهندسی، تایپوگرافی فارسی، وب پایدار و طراحی ریسوگراف؛ آرشیو رسمی کارگاه فیل.",
  keywords: ["وبلاگ", "ریسوگراف", "تایپوگرافی فارسی", "وب پایدار", "فیل"],
};

/** The archive reads its cached posts at page level, so it may block. */
export const instant = false;

/**
 * Cached once and revalidated daily (or on save), so the archive is part of the
 * prerendered shell instead of waiting on a cold database connection.
 *
 * The read stays at the page level on purpose: wrapping this route's data in a
 * `loading.tsx` or a page-level `<Suspense>` turns it into a deferred segment
 * that renders its shell hidden and never hydrates (dead search box, dead
 * like button, no file cards or video islands). Streamed per-request sections
 * on the article page keep their own `Suspense` boundaries.
 */
export default async function BlogPage() {
  const posts = await blogPosts();

  return (
    <PublicPageShell>
      <BlogArchive posts={posts} />
    </PublicPageShell>
  );
}
