"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Plus } from "lucide-react";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  MetricCard,
  PageHeader,
} from "@/components/admin/ui";
import { faNumber } from "@/lib/fa";
import type { Post } from "@/lib/types";
import {
  deletePostAction,
  duplicatePostAction,
  setPostStatusAction,
} from "@/app/admin/(console)/posts/actions";
import {
  PostListTable,
  type PostFilter,
} from "./post-list-table";

export function PostList({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PostFilter>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const [, startTransition] = useTransition();

  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((post) => post.status === "published").length,
      draft: posts.filter((post) => post.status === "draft").length,
    }),
    [posts],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (filter !== "all" && post.status !== filter) return false;
      if (!needle) return true;
      return [post.title, post.slug, post.excerpt, ...post.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [posts, filter, query]);

  const run = (
    post: Post,
    action: () => Promise<{ ok: boolean; message: string }>,
  ) => {
    setPendingId(post.id);
    setNotice(null);
    startTransition(async () => {
      const result = await action();
      setNotice({ ok: result.ok, message: result.message });
      setPendingId(null);
      if (result.ok) router.refresh();
    });
  };

  return (
    <div className='flex flex-col gap-5'>
      <PageHeader
        eyebrow='EDITORIAL DESK // PUBLISHED NOTES'
        title='مدیریت و نشر یادداشت‌ها'
        description='پیش‌نویس بنویسید، ویرایش کنید، منتشر کنید یا از انتشار خارج کنید. هر یادداشت منتشرشده بلافاصله در وبلاگ عمومی دیده می‌شود.'
        actions={
          <>
            <Link href='/blog' target='_blank' className={BTN_SECONDARY}>
              <ExternalLink className='size-3.5' />
              <span>وبلاگ عمومی</span>
            </Link>
            <Link href='/admin/posts/new' className={BTN_PRIMARY}>
              <Plus className='size-3.5' />
              <span>یادداشت تازه</span>
            </Link>
          </>
        }
      />

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
        <MetricCard
          label='کل یادداشت‌ها'
          value={faNumber(counts.all)}
          tone='ink'
          hint='شامل پیش‌نویس‌ها'
        />
        <MetricCard
          label='منتشرشده'
          value={faNumber(counts.published)}
          tone='teal'
          hint='قابل مشاهده در وبلاگ'
        />
        <MetricCard
          label='پیش‌نویس'
          value={faNumber(counts.draft)}
          tone='mustard'
          hint='فقط در کنسول دیده می‌شود'
        />
      </div>

      {notice ? (
        <p
          role='status'
          aria-live='polite'
          className={
            notice.ok
              ? "rounded-sm border-[1.5px] border-teal-craft bg-teal-craft/10 px-3 py-2 text-xs font-bold text-teal-craft"
              : "rounded-sm border-[1.5px] border-coral bg-coral/10 px-3 py-2 text-xs font-bold text-coral-dark"
          }
        >
          {notice.message}
        </p>
      ) : null}

      <PostListTable
        posts={posts}
        filtered={filtered}
        counts={counts}
        query={query}
        onQuery={setQuery}
        filter={filter}
        onFilter={setFilter}
        pendingId={pendingId}
        onTogglePublish={(post) =>
          run(post, () =>
            setPostStatusAction(
              post.id,
              post.status === "published" ? "draft" : "published",
            ),
          )
        }
        onDuplicate={(post) => run(post, () => duplicatePostAction(post.id))}
        onDelete={(post) => run(post, () => deletePostAction(post.id))}
      />
    </div>
  );
}
