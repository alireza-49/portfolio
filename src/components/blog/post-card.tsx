import Link from "next/link";
import { ArrowLeft, Clock3, Eye, Heart } from "lucide-react";
import { cn } from "cn";
import { faDate, faNumber } from "@/lib/fa";
import { deriveExcerpt } from "@/lib/text";
import type { Post } from "@/lib/types";

function Cover({ post, featured }: { post: Post; featured: boolean }) {
  if (post.coverUrl) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={post.coverUrl}
        alt={`کاور یادداشت ${post.title}`}
        loading='lazy'
        className={cn(
          "w-full border-b-[2px] border-indigo-ink object-cover",
          featured ? "h-56 sm:h-72" : "h-40",
        )}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "dot-grid flex w-full items-center justify-center border-b-[2px] border-indigo-ink bg-paper-dim",
        featured ? "h-56 sm:h-72" : "h-40",
      )}
    >
      <span className='font-display text-4xl font-black text-indigo-ink/20'>
        {post.title.slice(0, 1)}
      </span>
    </div>
  );
}

export function PostCard({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "craft-card flex flex-col overflow-hidden rounded-sm border-[2px] border-indigo-ink bg-paper-light",
        featured && "sm:flex-row",
      )}
    >
      <div className={cn(featured && "sm:w-1/2")}>
        <Cover post={post} featured={featured} />
      </div>

      <div className='flex flex-1 flex-col gap-2 p-4'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='flex flex-wrap gap-1'>
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className='rounded-sm border border-indigo-ink/25 bg-paper-dim px-1.5 py-0.5 text-[0.5625rem] font-bold text-indigo-ink'
              >
                {tag}
              </span>
            ))}
          </div>
          <span className='font-mono text-[0.625rem] font-bold text-indigo-light'>
            {faDate(post.publishedAt)}
          </span>
        </div>

        <h3
          className={cn(
            "font-display leading-tight font-black text-indigo-ink",
            featured ? "text-xl sm:text-2xl" : "text-base",
          )}
        >
          {post.title}
        </h3>

        <p className='line-clamp-3 text-[0.75rem] leading-relaxed font-medium text-indigo-light'>
          {post.excerpt || deriveExcerpt(post.contentHtml, featured ? 220 : 130)}
        </p>

        <span className='flex items-center gap-3 text-[0.625rem] font-bold text-indigo-light'>
          <span className='inline-flex items-center gap-1'>
            <Eye className='size-3' />
            {faNumber(post.views)}
          </span>
          <span className='inline-flex items-center gap-1'>
            <Heart className='size-3' />
            {faNumber(post.likes)}
          </span>
        </span>

        <div className='mt-auto flex items-center justify-between border-t border-dashed border-indigo-ink/20 pt-2'>
          <span className='flex items-center gap-2 text-[0.625rem] font-bold text-indigo-light'>
            <span className='font-black text-indigo-ink'>{post.author}</span>
            <span className='flex items-center gap-1'>
              <Clock3 className='size-3' />
              {faNumber(post.readingMinutes)} دقیقه
            </span>
          </span>
          <span className='flex items-center gap-1 text-[0.6875rem] font-black text-coral'>
            مطالعه
            <ArrowLeft className='size-3.5' />
          </span>
        </div>
      </div>
    </Link>
  );
}
