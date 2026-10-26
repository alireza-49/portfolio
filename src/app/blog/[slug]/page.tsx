import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { PublicPageShell } from "@/components/public-page-shell";
import { PostHero } from "@/components/blog/post-hero";
import { PostBody } from "@/components/blog/post-body";
import { PostCard } from "@/components/blog/post-card";
import { PostEngagement } from "@/components/blog/post-engagement";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { getPostBySlug, isPostLikedBy, listPosts } from "@/lib/content";
import { readReaderId } from "@/lib/reader";
import { deriveExcerpt } from "@/lib/text";
import { readerSalt, visitorHash } from "@/lib/visitor";

export const instant = false;

const loadPost = cache(async (slug: string) => getPostBySlug(slug));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post || post.status !== "published") {
    return { title: "یادداشت پیدا نشد | وب دیزاین فیل" };
  }

  return {
    title: `${post.title} | روزنامهٔ کارگاه`,
    description: post.excerpt || deriveExcerpt(post.contentHtml, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || deriveExcerpt(post.contentHtml, 160),
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post || post.status !== "published") notFound();

  const reader = await readReaderId();
  const liked = reader
    ? await isPostLikedBy(post.id, visitorHash(reader, readerSalt()))
    : false;

  const all = await listPosts({ publishedOnly: true });
  const related = all
    .filter(
      (item) =>
        item.id !== post.id &&
        item.tags.some((tag) => post.tags.includes(tag)),
    )
    .slice(0, 3);

  return (
    <PublicPageShell>
      <ReadingProgress />
      <PostHero post={post} />

      <PostEngagement
        slug={post.slug}
        views={post.views}
        likes={post.likes}
        liked={liked}
        commentCount={post.commentCount}
      />

      <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 lg:px-12'>
        <PostBody html={post.contentHtml} />
      </div>

      {related.length > 0 ? (
        <section className='border-t-[2.5px] border-indigo-ink bg-paper-dim/40 px-4 py-8 sm:px-8 lg:px-12'>
          <div className='mx-auto flex max-w-7xl flex-col gap-4'>
            <div className='flex flex-wrap items-end justify-between gap-2 border-b-[2px] border-indigo-ink pb-3'>
              <div className='flex flex-col gap-1'>
                <span className='font-mono text-[10px] font-bold tracking-widest text-coral uppercase'>
                  Related reading
                </span>
                <h2 className='text-lg font-black text-indigo-ink'>
                  یادداشت‌های مرتبط
                </h2>
              </div>
              <Link
                href='/blog'
                className='inline-flex items-center gap-1 text-[11px] font-black text-coral hover:text-indigo-ink'
              >
                کل آرشیو
                <ArrowLeft className='size-3.5' />
              </Link>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className='border-t-[2.5px] border-indigo-ink bg-mustard/20 px-4 py-8 sm:px-8 lg:px-12'>
        <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3'>
          <p className='text-sm font-black text-indigo-ink'>
            ایده یا سؤالی دربارهٔ این نوشته دارید؟ کارگاه باز است.
          </p>
          <Link
            href='/#contact-section'
            className='craft-btn inline-flex items-center gap-1.5 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-3.5 py-2 text-xs font-black text-white'
          >
            تماس با استودیو
            <ArrowLeft className='size-3.5' />
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
