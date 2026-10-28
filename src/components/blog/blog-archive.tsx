"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import type { Post } from "@/lib/types";
import { PostCard } from "./post-card";
import { BlogMasthead } from "./blog-masthead";

export function BlogArchive({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 12),
    [posts],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (tag && !post.tags.includes(tag)) return false;
      if (!needle) return true;
      return [post.title, post.excerpt, post.author, ...post.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [posts, query, tag]);

  const filtering = Boolean(query.trim() || tag);
  const featured = !filtering ? (posts[0] ?? null) : null;
  const rest = featured
    ? filtered.filter((post) => post.id !== featured.id)
    : filtered;

  return (
    <>
      <BlogMasthead
        postsCount={posts.length}
        tags={tags}
        query={query}
        onQuery={setQuery}
        tag={tag}
        onTag={setTag}
      />

      <section className='mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 sm:px-8 lg:px-12'>
        {posts.length === 0 ? (
          <p className='rounded-sm border-[2px] border-dashed border-indigo-ink/30 bg-paper px-4 py-12 text-center text-sm font-bold text-indigo-light'>
            هنوز یادداشتی منتشر نشده است. به‌زودی اولین شمارهٔ روزنامه منتشر
            می‌شود.
          </p>
        ) : null}

        {featured ? (
          <div className='flex flex-col gap-2'>
            <span className='font-mono text-[0.625rem] font-bold tracking-widest text-coral uppercase'>
              Featured manifesto
            </span>
            <PostCard post={featured} featured />
          </div>
        ) : null}

        {filtering && filtered.length === 0 ? (
          <p className='rounded-sm border-[2px] border-dashed border-indigo-ink/30 bg-paper px-4 py-12 text-center text-sm font-bold text-indigo-light'>
            یادداشتی با این عبارت یا موضوع پیدا نشد.
          </p>
        ) : null}

        {rest.length > 0 ? (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : null}
      </section>

      <section className='border-t-[2.5px] border-indigo-ink bg-mustard/20 px-4 py-8 sm:px-8 lg:px-12'>
        <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3'>
          <div className='flex items-start gap-2'>
            <Mail className='mt-0.5 size-5 shrink-0 text-indigo-ink' />
            <div className='flex flex-col gap-0.5'>
              <span className='text-sm font-black text-indigo-ink'>
                می‌خواهید شمارهٔ بعدی را زودتر بخوانید؟
              </span>
              <span className='text-[0.6875rem] font-medium text-indigo-light'>
                یادداشت‌ها بدون خبرنامه و ترکر منتشر می‌شوند؛ برای گفتگو مستقیم
                پیام دهید.
              </span>
            </div>
          </div>
          <Link
            href='/#contact-section'
            className='craft-btn inline-flex items-center gap-1.5 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-3.5 py-2 text-xs font-black text-white'
          >
            گفتگو با کارگاه
            <ArrowLeft className='size-3.5' />
          </Link>
        </div>
      </section>
    </>
  );
}
