import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { connection } from "next/server";
import { Eye } from "lucide-react";
import { PublicPageShell } from "@/components/public-page-shell";
import { PostHero } from "@/components/blog/post-hero";
import { PostBody } from "@/components/blog/post-body";
import { getPostByPreviewHash } from "@/lib/content";
import { hashPreviewToken } from "@/lib/preview-token";

export const instant = false;

const loadPreview = cache(async (token: string) =>
  getPostByPreviewHash(hashPreviewToken(token)),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  await connection();
  const { token } = await params;
  const post = await loadPreview(token);

  return {
    title: post ? `پیش‌نمایش: ${post.title}` : "پیش‌نمایش پیدا نشد",
    robots: { index: false, follow: false },
  };
}

export default async function PostPreviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  await connection();
  const { token } = await params;
  const post = await loadPreview(token);

  if (!post) notFound();

  return (
    <PublicPageShell>
      <div className='border-b-[2px] border-indigo-ink bg-mustard px-4 py-2 text-indigo-ink sm:px-8 lg:px-12'>
        <div className='mx-auto flex max-w-7xl items-center gap-2 text-[0.6875rem] font-black'>
          <Eye className='size-4' />
          پیش‌نمایش خصوصی؛ این نشانی موقتی است و در موتورهای جستجو فهرست نمی‌شود.
          <span className='ms-auto rounded-sm border border-indigo-ink/30 bg-paper/60 px-1.5 py-0.5 text-[0.5625rem]'>
            {post.status === "published" ? "منتشرشده" : "پیش‌نویس"}
          </span>
        </div>
      </div>

      <PostHero post={post} />

      <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 lg:px-12'>
        <PostBody html={post.contentHtml} />
      </div>
    </PublicPageShell>
  );
}
