"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, Save, Send } from "lucide-react";
import { BTN_PRIMARY, BTN_SECONDARY, PageHeader } from "@/components/admin/ui";
import { faDate } from "@/lib/fa";
import type { Post, PostInput, PostStatus } from "@/lib/types";
import {
  createPostAction,
  updatePostAction,
} from "@/app/admin/(console)/posts/actions";
import type { OutlineItem } from "./rich-text-editor";
import { PostWorkspace } from "./post-workspace";

const EMPTY_DRAFT: PostInput = {
  slug: "",
  title: "",
  excerpt: "",
  contentHtml: "",
  coverUrl: "",
  author: "وب دیزاین فیل",
  tags: [],
  status: "draft",
  publishedAt: null,
};

function toDraft(post: Post): PostInput {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    contentHtml: post.contentHtml,
    coverUrl: post.coverUrl,
    author: post.author,
    tags: [...post.tags],
    status: post.status,
    publishedAt: post.publishedAt,
  };
}

export function PostEditor({ post }: { post: Post | null }) {
  const router = useRouter();
  const [postId, setPostId] = useState<string | null>(post?.id ?? null);
  const [draft, setDraft] = useState<PostInput>(() =>
    post ? toDraft(post) : EMPTY_DRAFT,
  );
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();
  const autosaving = useRef(false);

  const patch = (values: Partial<PostInput>) => {
    setDraft((current) => ({ ...current, ...values }));
    setDirty(true);
    setNotice(null);
  };

  const save = (status: PostStatus) => {
    const payload: PostInput = { ...draft, status };

    startTransition(async () => {
      const result = postId
        ? await updatePostAction(postId, payload)
        : await createPostAction(payload);

      if (!result.ok) {
        setNotice({ ok: false, message: result.message });
        return;
      }

      setDirty(false);
      setDraft((current) => ({
        ...current,
        status,
        slug: result.slug ?? current.slug,
        publishedAt:
          status === "published"
            ? (current.publishedAt ?? new Date().toISOString())
            : null,
      }));
      setNotice({ ok: true, message: result.message });

      if (!postId && result.id) {
        setPostId(result.id);
        router.replace(`/admin/posts/${result.id}`);
      }
      router.refresh();
    });
  };

  useEffect(() => {
    if (!postId || !dirty || !draft.title.trim()) return;

    const timer = window.setTimeout(() => {
      if (autosaving.current) return;
      autosaving.current = true;
      updatePostAction(postId, draft)
        .then((result) => {
          if (result.ok) {
            setDirty(false);
            setNotice({ ok: true, message: "ذخیرهٔ خودکار انجام شد." });
            router.refresh();
          }
        })
        .catch(() => {
          /* keep the dirty flag; the next edit retries */
        })
        .finally(() => {
          autosaving.current = false;
        });
    }, 20_000);

    return () => window.clearTimeout(timer);
  }, [draft, dirty, postId, router]);

  const published = draft.status === "published";

  return (
    <div className='flex flex-col gap-5'>
      <PageHeader
        eyebrow={`EDITORIAL DESK // ${postId ? "EDIT" : "NEW"}`}
        title={draft.title || "یادداشت تازه"}
        description={
          post
            ? `آخرین ذخیره: ${faDate(post.updatedAt)} • مطالعه: ${post.readingMinutes} دقیقه`
            : "تیتر، متن و متادیتا را کامل کنید؛ اولین ذخیره با دکمه انجام می‌شود."
        }
        actions={
          <>
            <Link href='/admin/posts' className={BTN_SECONDARY}>
              <ArrowRight className='size-3.5' />
              <span>فهرست یادداشت‌ها</span>
            </Link>
            <button
              type='button'
              onClick={() => save(draft.status)}
              disabled={pending || !draft.title.trim()}
              className={BTN_PRIMARY}
            >
              {pending ? (
                <LoaderCircle className='size-3.5 animate-spin' />
              ) : (
                <Save className='size-3.5' />
              )}
              <span>
                {pending ? "در حال ذخیره…" : dirty ? "ذخیره" : "ذخیره‌شده"}
              </span>
            </button>
            <button
              type='button'
              onClick={() => save(published ? "draft" : "published")}
              disabled={pending || !draft.title.trim()}
              className='craft-btn inline-flex h-auto items-center justify-center gap-1.5 rounded-sm border-[2.5px] border-indigo-ink bg-teal-craft px-3.5 py-2 text-xs font-black text-white disabled:opacity-60'
            >
              {published ? (
                <span>لغو انتشار</span>
              ) : (
                <>
                  <Send className='size-3.5' />
                  <span>انتشار</span>
                </>
              )}
            </button>
          </>
        }
      />

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

      <PostWorkspace
        draft={draft}
        patch={patch}
        outline={outline}
        onOutlineChange={setOutline}
        postId={postId}
        dirty={dirty}
        pending={pending}
        onSave={save}
        published={published}
      />
    </div>
  );
}
