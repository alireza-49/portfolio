"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, Send } from "lucide-react";
import { faDate, faNumber, faTime } from "@/lib/fa";
import type { PublicComment } from "@/lib/types";

const NAME_KEY = "cc-comment-name";

const INPUT_CLASS =
  "w-full rounded-sm border-[2px] border-indigo-ink bg-paper px-3 py-2 text-sm font-medium text-indigo-ink placeholder:text-indigo-ink/35 focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/25";
const LABEL_CLASS = "text-[12px] font-bold text-indigo-ink";

export function PostComments({
  slug,
  initialComments,
}: {
  slug: string;
  initialComments: PublicComment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<
    { ok: boolean; message: string } | null
  >(null);
  const honey = useRef<HTMLInputElement>(null);

  // The name is the only thing remembered between visits; email never is.
  // Mount-only: localStorage does not exist during SSR, so the saved name
  // cannot be part of the initial render.
  useEffect(() => {
    const saved = localStorage.getItem(NAME_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setName((current) => current || saved);
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setNotice(null);
    try {
      const response = await fetch(
        `/api/posts/${encodeURIComponent(slug)}/comments`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            body,
            website: honey.current?.value ?? "",
          }),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? "ثبت نظر ناموفق بود.");
      }
      const trimmed = name.trim();
      if (trimmed) localStorage.setItem(NAME_KEY, trimmed);
      if (data.comment) {
        setComments((list) => [data.comment as PublicComment, ...list]);
      }
      setBody("");
      setNotice({ ok: true, message: "نظر شما ثبت شد؛ ممنون که نوشتید." });
    } catch (cause) {
      setNotice({
        ok: false,
        message: cause instanceof Error ? cause.message : "ثبت نظر ناموفق بود.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <section
      id='comments'
      className='scroll-mt-6 border-t-[2.5px] border-indigo-ink bg-paper px-4 py-8 sm:px-8 lg:px-12'
    >
      <div className='mx-auto flex max-w-7xl flex-col gap-5'>
        <div className='flex flex-wrap items-end justify-between gap-2 border-b-[2px] border-indigo-ink pb-3'>
          <div className='flex flex-col gap-1'>
            <span className='font-mono text-[10px] font-bold tracking-widest text-coral uppercase'>
              Readers
            </span>
            <h2 className='flex items-center gap-2 text-lg font-black text-indigo-ink'>
              <MessageCircle className='size-4' />
              گفت‌وگو
            </h2>
          </div>
          <span className='rounded-sm border border-indigo-ink/25 bg-paper-dim px-2 py-0.5 text-[10px] font-bold text-indigo-light'>
            {faNumber(comments.length)} نظر
          </span>
        </div>

        <form onSubmit={submit} className='flex flex-col gap-3'>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <label className='flex flex-col gap-1.5'>
              <span className={LABEL_CLASS}>نام</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                required
                autoComplete='name'
                className={INPUT_CLASS}
              />
            </label>
            <label className='flex flex-col gap-1.5'>
              <span className={LABEL_CLASS}>ایمیل</span>
              <input
                type='email'
                dir='ltr'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={160}
                required
                autoComplete='email'
                className={`${INPUT_CLASS} text-left`}
              />
              <span className='text-[10px] font-medium text-indigo-light'>
                ایمیل فقط برای مدیر است و هیچ‌جا منتشر نمی‌شود.
              </span>
            </label>
          </div>

          <label className='flex flex-col gap-1.5'>
            <span className={LABEL_CLASS}>نظر شما</span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={3000}
              required
              rows={4}
              className={`${INPUT_CLASS} min-h-24 leading-relaxed`}
            />
          </label>

          {/* Honeypot: hidden from people, irresistible to bots. */}
          <input
            ref={honey}
            type='text'
            name='website'
            tabIndex={-1}
            autoComplete='off'
            aria-hidden='true'
            className='absolute h-0 w-0 opacity-0'
            style={{ left: "-9999px" }}
          />

          <div className='flex flex-wrap items-center justify-between gap-2'>
            <span className='text-[10px] font-medium text-indigo-light'>
              نظرها بی‌درنگ منتشر می‌شوند.
            </span>
            <button
              type='submit'
              disabled={pending}
              className='craft-btn inline-flex items-center gap-1.5 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-3.5 py-2 text-xs font-black text-white disabled:opacity-60'
            >
              <Send className='size-3.5' />
              {pending ? "در حال ارسال…" : "ارسال نظر"}
            </button>
          </div>

          {notice ? (
            <p
              role={notice.ok ? "status" : "alert"}
              className={
                notice.ok
                  ? "text-[11px] font-bold text-teal-craft"
                  : "text-[11px] font-bold text-coral"
              }
            >
              {notice.message}
            </p>
          ) : null}
        </form>

        {comments.length === 0 ? (
          <p className='rounded-md border border-dashed border-indigo-ink/30 bg-paper-dim p-4 text-[12px] font-medium text-indigo-light'>
            هنوز نظری ثبت نشده؛ اولین نفر باشید.
          </p>
        ) : (
          <ul className='flex flex-col gap-2'>
            {comments.map((comment) => (
              <li
                key={comment.id}
                className='rounded-md border-[2px] border-indigo-ink/20 bg-paper-dim/60 p-3'
              >
                <div className='flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-indigo-ink/20 pb-1.5'>
                  <span className='flex items-center gap-2'>
                    <span
                      aria-hidden
                      className='flex size-6 items-center justify-center rounded-sm border border-indigo-ink/30 bg-paper font-mono text-[10px] font-black text-indigo-ink'
                    >
                      {comment.name.slice(0, 1)}
                    </span>
                    <span className='text-[12px] font-black text-indigo-ink'>
                      {comment.name}
                    </span>
                  </span>
                  <span className='font-mono text-[10px] font-bold text-indigo-light'>
                    {faDate(comment.createdAt)} · {faTime(comment.createdAt)}
                  </span>
                </div>
                <p className='pt-2 text-[12px] leading-relaxed font-medium whitespace-pre-line break-words text-indigo-ink'>
                  {comment.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
