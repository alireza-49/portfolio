"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  createPost,
  deletePost,
  getPost,
  setPostStatus,
  slugExists,
  updatePost,
} from "@/lib/content";
import { slugify } from "@/lib/slugs";
import type { PostStatus } from "@/lib/types";
import { parsePostInput } from "./validation";

export type PostActionResult = {
  ok: boolean;
  message: string;
  id?: string;
  slug?: string;
};

function refresh(slug?: string | null) {
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath("/");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createPostAction(
  raw: unknown,
): Promise<PostActionResult> {
  await requireAdmin();

  const parsed = parsePostInput(raw);
  if (!parsed.ok) return { ok: false, message: parsed.error };

  if (await slugExists(parsed.value.slug)) {
    return {
      ok: false,
      message: "این نامک قبلاً استفاده شده است؛ نامک دیگری انتخاب کنید.",
    };
  }

  try {
    const post = await createPost(parsed.value, parsed.readingMinutes);
    refresh(post.slug);
    return {
      ok: true,
      message:
        post.status === "published"
          ? "یادداشت منتشر شد."
          : "پیش‌نویس یادداشت ذخیره شد.",
      id: post.id,
      slug: post.slug,
    };
  } catch (error) {
    console.error("[posts] create failed:", error);
    return { ok: false, message: "ثبت یادداشت در پایگاه داده ناموفق بود." };
  }
}

export async function updatePostAction(
  id: string,
  raw: unknown,
): Promise<PostActionResult> {
  await requireAdmin();

  if (!id) return { ok: false, message: "شناسهٔ یادداشت معتبر نیست." };

  const parsed = parsePostInput(raw);
  if (!parsed.ok) return { ok: false, message: parsed.error };

  if (await slugExists(parsed.value.slug, id)) {
    return {
      ok: false,
      message: "این نامک قبلاً استفاده شده است؛ نامک دیگری انتخاب کنید.",
    };
  }

  const previous = await getPost(id);
  if (!previous) return { ok: false, message: "یادداشت پیدا نشد." };

  try {
    const post = await updatePost(id, parsed.value, parsed.readingMinutes);
    if (!post) return { ok: false, message: "یادداشت پیدا نشد." };

    refresh(post.slug);
    if (previous.slug !== post.slug) refresh(previous.slug);

    return {
      ok: true,
      message:
        post.status === "published"
          ? "تغییرات ذخیره و یادداشت منتشر شد."
          : "پیش‌نویس ذخیره شد.",
      id: post.id,
      slug: post.slug,
    };
  } catch (error) {
    console.error("[posts] update failed:", error);
    return { ok: false, message: "ذخیرهٔ یادداشت ناموفق بود." };
  }
}

export async function setPostStatusAction(
  id: string,
  status: PostStatus,
): Promise<PostActionResult> {
  await requireAdmin();

  if (!id) return { ok: false, message: "شناسهٔ یادداشت معتبر نیست." };

  const post = await setPostStatus(id, status);
  if (!post) return { ok: false, message: "یادداشت پیدا نشد." };

  refresh(post.slug);
  return {
    ok: true,
    message:
      status === "published" ? "یادداشت منتشر شد." : "یادداشت از انتشار خارج شد.",
    id: post.id,
    slug: post.slug,
  };
}

export async function duplicatePostAction(
  id: string,
): Promise<PostActionResult> {
  await requireAdmin();

  const original = await getPost(id);
  if (!original) return { ok: false, message: "یادداشت پیدا نشد." };

  let slug = slugify(`${original.slug}-copy`);
  let attempt = 2;
  while (await slugExists(slug)) {
    slug = slugify(`${original.slug}-copy-${attempt}`);
    attempt += 1;
    if (attempt > 20) break;
  }

  const copy = await createPost(
    {
      slug,
      title: `${original.title} (کپی)`,
      excerpt: original.excerpt,
      contentHtml: original.contentHtml,
      coverUrl: original.coverUrl,
      author: original.author,
      tags: original.tags,
      status: "draft",
      publishedAt: null,
    },
    original.readingMinutes,
  );

  refresh(copy.slug);
  return {
    ok: true,
    message: "یک پیش‌نویس کپی از یادداشت ساخته شد.",
    id: copy.id,
    slug: copy.slug,
  };
}

export async function deletePostAction(id: string): Promise<PostActionResult> {
  await requireAdmin();

  const post = await getPost(id);
  if (!post) return { ok: false, message: "یادداشت پیدا نشد." };

  const deleted = await deletePost(id);
  if (!deleted) return { ok: false, message: "حذف یادداشت ناموفق بود." };

  refresh(post.slug);
  return { ok: true, message: "یادداشت حذف شد." };
}
