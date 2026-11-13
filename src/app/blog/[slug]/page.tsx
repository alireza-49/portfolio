import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { PublicPageShell } from "@/components/public-page-shell";
import { PostHero } from "@/components/blog/post-hero";
import { PostBody } from "@/components/blog/post-body";
import { PostCard } from "@/components/blog/post-card";
import { PostComments } from "@/components/blog/post-comments";
import { PostEngagement } from "@/components/blog/post-engagement";
import { ReadingProgress } from "@/components/blog/reading-progress";
import {
  PostCommentsSkeleton,
  PostEngagementSkeleton,
} from "@/components/blog/blog-skeleton";
import { isPostLikedBy, listPostComments } from "@/lib/content";
import { blogPost, blogPosts } from "@/lib/blog-feed";
import { readReaderId } from "@/lib/reader";
import { deriveExcerpt } from "@/lib/text";
import type { Post } from "@/lib/types";
import { readerSalt, visitorHash } from "@/lib/visitor";

/** Next 16.4 hands the page the raw URL segment while metadata gets it decoded. */
function decodeSlug(value: string): string {
  if (!value.includes("%")) return value;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Every published slug is prerendered at build (and upgraded by the daily
 * cache), so a direct visit gets the finished article from the shell.
 */
/**
 * The article reads the slug (and its cached post) at page level on purpose: a
 * page-level `<Suspense>` or `loading.tsx` turns this route into a deferred
 * segment that never hydrates here. That makes the segment a blocking one, so
 * it opts out of instant-navigation validation — otherwise the dev overlay
 * flags the `params` read and a dependency's `crypto.getRandomValues()` call
 * during its simulated prerender.
 */
export const instant = false;

export async function generateStaticParams() {
  const posts = await blogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const post = await blogPost(decodeSlug(rawSlug));

  if (!post) {
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

/** Per-reader and per-minute data: never cached, streams into its own hole. */
async function ReaderEngagement({ post }: { post: Post }) {
  const reader = await readReaderId();
  const liked = reader
    ? await isPostLikedBy(post.id, visitorHash(reader, readerSalt()))
    : false;

  return (
    <PostEngagement
      slug={post.slug}
      views={post.views}
      likes={post.likes}
      liked={liked}
      commentCount={post.commentCount}
    />
  );
}

async function ReaderComments({ post }: { post: Post }) {
  const comments = await listPostComments(post.id);
  return <PostComments slug={post.slug} initialComments={comments} />;
}

/**
 * The article and its related strip are cached, so they are read at the page
 * level: a `loading.tsx` here (or a page-level `<Suspense>`) turns the route
 * into a deferred segment that never hydrates in this app — no like button, no
 * comments, no file cards, no video island. Only the per-request sections keep
 * their own boundaries.
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const post = await blogPost(decodeSlug(rawSlug));

  if (!post) notFound();

  const all = await blogPosts();
  const related = all
    .filter(
      (item) =>
        item.id !== post.id && item.tags.some((tag) => post.tags.includes(tag)),
    )
    .slice(0, 3);

  return (
    <PublicPageShell>
      <ReadingProgress />
      <PostHero post={post} />

      <Suspense fallback={<PostEngagementSkeleton />}>
        <ReaderEngagement post={post} />
      </Suspense>

      <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 lg:px-12'>
        <PostBody html={post.contentHtml} />
      </div>

      <Suspense fallback={<PostCommentsSkeleton />}>
        <ReaderComments post={post} />
      </Suspense>

      {related.length > 0 ? (
        <section className='border-t-[2.5px] border-indigo-ink bg-paper-dim/40 px-4 py-8 sm:px-8 lg:px-12'>
          <div className='mx-auto flex max-w-7xl flex-col gap-4'>
            <div className='flex flex-wrap items-end justify-between gap-2 border-b-[2px] border-indigo-ink pb-3'>
              <div className='flex flex-col gap-1'>
                <span className='font-mono text-[0.625rem] font-bold tracking-widest text-coral uppercase'>
                  Related reading
                </span>
                <h2 className='text-lg font-black text-indigo-ink'>
                  یادداشت‌های مرتبط
                </h2>
              </div>
              <Link
                href='/blog'
                className='inline-flex items-center gap-1 text-[0.6875rem] font-black text-coral hover:text-indigo-ink'
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
