"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Heart, MessageCircle } from "lucide-react";
import { faNumber } from "@/lib/fa";

/**
 * The only interactive part of a published post. Mounting records the visit;
 * the route dedupes to one per reader per hour and answers with the new total.
 */
export function PostEngagement({
  slug,
  views: initialViews,
  likes: initialLikes,
  liked: initialLiked,
  commentCount,
}: {
  slug: string;
  views: number;
  likes: number;
  liked: boolean;
  commentCount: number;
}) {
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [pending, setPending] = useState(false);
  const [pop, setPop] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    fetch(`/api/posts/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      keepalive: true,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (typeof data?.views === "number") setViews(data.views);
      })
      .catch(() => undefined);
  }, [slug]);

  const toggleLike = async () => {
    if (pending) return;
    const next = !liked;
    const before = { liked, likes };
    setPending(true);
    setError(null);
    // Optimistic: the heart fills immediately and reverts if the write fails.
    setLiked(next);
    setLikes(likes + (next ? 1 : -1));
    setPop(true);
    window.setTimeout(() => setPop(false), 180);
    try {
      const response = await fetch(
        `/api/posts/${encodeURIComponent(slug)}/like`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ liked: next }),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? "ثبت پسند ناموفق بود.");
      }
      setLiked(Boolean(data.liked));
      setLikes(Number(data.likes));
    } catch (cause) {
      setLiked(before.liked);
      setLikes(before.likes);
      setError(cause instanceof Error ? cause.message : "ثبت پسند ناموفق بود.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className='border-b-[2px] border-indigo-ink bg-paper-dim/40 px-4 py-3 sm:px-8 lg:px-12'>
      <div className='mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-[0.6875rem] font-black text-indigo-ink'>
        <button
          type='button'
          onClick={toggleLike}
          disabled={pending}
          aria-pressed={liked}
          aria-label={liked ? "پسند را بردار" : "این یادداشت را بپسند"}
          className={`craft-btn inline-flex items-center gap-1.5 rounded-sm border-[2px] border-indigo-ink px-2.5 py-1 transition-transform duration-150 disabled:opacity-70 ${
            liked ? "bg-coral text-white" : "bg-paper text-indigo-ink hover:bg-mustard/30"
          } ${pop ? "motion-safe:scale-110" : ""}`}
        >
          <Heart className='size-4' fill={liked ? "currentColor" : "none"} />
          {faNumber(likes)} پسند
        </button>

        <span className='inline-flex items-center gap-1.5 rounded-sm border border-indigo-ink/25 bg-paper px-2.5 py-1'>
          <Eye className='size-4 text-coral' />
          {faNumber(views)} بازدید
        </span>

        <a
          href='#comments'
          className='inline-flex items-center gap-1.5 rounded-sm border border-indigo-ink/25 bg-paper px-2.5 py-1 hover:bg-mustard/30'
        >
          <MessageCircle className='size-4 text-teal-craft' />
          {faNumber(commentCount)} نظر
        </a>

        {error ? (
          <span role='alert' className='text-[0.625rem] font-bold text-coral'>
            {error}
          </span>
        ) : null}
      </div>
    </section>
  );
}
