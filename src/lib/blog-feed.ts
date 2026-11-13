import { cacheLife, cacheTag } from "next/cache";
import { COURSE_POSTS } from "./course-posts";
import { getPostBySlug, listPosts } from "./content";
import { hasDatabaseConfig } from "./db";
import type { Post } from "./types";

/**
 * The public reading feed.
 *
 * The archive and the article bodies change when an editor saves, not when a
 * reader arrives, so they are cached once and revalidated at most once a day
 * (and immediately after a save through the `posts` tag). Everything that is
 * per-reader or per-minute — likes, comments, view counts — stays outside this
 * module and streams in from the page.
 *
 * A build without `DATABASE_URL` still has to produce a readable blog, so the
 * workshop posts that ship in the codebase are the fallback. A healthy database
 * always wins.
 */

const DAY_SECONDS = 86_400;

const FEED_LIFE = {
  stale: 300,
  revalidate: DAY_SECONDS,
  expire: 7 * DAY_SECONDS,
};

function readingMinutes(html: string): number {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function bundledPosts(): Post[] {
  return COURSE_POSTS.map((post) => {
    const publishedAt = new Date(post.publishedAt).toISOString();
    return {
      id: `course:${post.slug}`,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      contentHtml: post.contentHtml,
      coverUrl: post.coverUrl,
      author: post.author,
      tags: post.tags,
      status: "published",
      publishedAt,
      readingMinutes: readingMinutes(post.contentHtml),
      baseViews: 0,
      baseLikes: 0,
      views: 0,
      likes: 0,
      commentCount: 0,
      createdAt: publishedAt,
      updatedAt: publishedAt,
    } satisfies Post;
  }).sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

/** Every published post, newest first — the archive and the related strip. */
export async function blogPosts(): Promise<Post[]> {
  "use cache";
  cacheLife(FEED_LIFE);
  cacheTag("posts");

  if (!hasDatabaseConfig()) return bundledPosts();

  try {
    const posts = await listPosts({ publishedOnly: true });
    return posts.sort((a, b) =>
      (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
    );
  } catch (error) {
    // A cold or unreachable database must not take the archive down with it.
    console.error("[blog] post list failed; serving bundled posts:", error);
    return bundledPosts();
  }
}

/** One published post by slug, or null when it is missing or still a draft. */
export async function blogPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife(FEED_LIFE);
  cacheTag("posts");

  if (hasDatabaseConfig()) {
    try {
      const post = await getPostBySlug(slug);
      if (post) return post.status === "published" ? post : null;
    } catch (error) {
      console.error("[blog] post lookup failed; checking bundled posts:", error);
    }
  }

  return bundledPosts().find((post) => post.slug === slug) ?? null;
}
