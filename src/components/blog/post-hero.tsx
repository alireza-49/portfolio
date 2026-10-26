import { Clock3, FileText, UserRound } from "lucide-react";
import { faDate, faNumber } from "@/lib/fa";
import { deriveExcerpt } from "@/lib/text";
import type { Post } from "@/lib/types";
import { ShareRow } from "./share-row";

export function PostHero({ post }: { post: Post }) {
  return (
    <section className='border-b-[2px] border-indigo-ink bg-paper px-4 pt-8 pb-6 sm:px-8 lg:px-12'>
      <div className='mx-auto flex max-w-7xl flex-col gap-4'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-12'>
          <div className='relative flex flex-col gap-3 overflow-hidden rounded-md border-[2px] border-indigo-ink bg-paper-dim p-5 shadow-craft sm:p-7 lg:col-span-8'>
            <div className='flex flex-wrap items-center gap-2 border-b border-indigo-ink/20 pb-2'>
              <span className='rounded-sm border-[1.5px] border-indigo-ink bg-coral px-2 py-0.5 text-[9px] font-black tracking-wider text-white uppercase'>
                Dossier
              </span>
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className='rounded-sm border border-indigo-ink/25 bg-paper px-1.5 py-0.5 text-[9px] font-bold text-indigo-ink'
                >
                  {tag}
                </span>
              ))}
              <span className='ms-auto font-mono text-[9px] font-bold text-indigo-light'>
                پیکربندی زندهٔ ریسو
              </span>
            </div>

            <h1 className='font-display text-2xl leading-tight font-black text-indigo-ink sm:text-4xl'>
              {post.title}
            </h1>

            <p className='max-w-2xl text-[13px] leading-relaxed font-medium text-indigo-light sm:text-sm'>
              {post.excerpt || deriveExcerpt(post.contentHtml, 260)}
            </p>

            <div className='flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-indigo-ink/20 pt-2 text-[10px] font-bold text-indigo-light'>
              <span className='flex items-center gap-1'>
                <FileText className='size-3.5' />
                یادداشت شمارهٔ {faNumber(post.readingMinutes)}
              </span>
              <span className='font-mono'>ISSN: 2984-9021</span>
            </div>
          </div>

          <aside className='flex flex-col gap-3 lg:col-span-4'>
            <div className='flex flex-1 flex-col justify-between gap-3 rounded-md border-[2px] border-indigo-ink bg-indigo-ink p-4 text-paper shadow-craft'>
              <div className='flex items-center gap-3'>
                <span className='flex size-11 items-center justify-center rounded-sm border border-paper/30 bg-coral font-mono text-sm font-black text-white'>
                  {post.author.slice(0, 1)}
                </span>
                <div className='flex min-w-0 flex-col'>
                  <span className='truncate text-sm font-black'>
                    {post.author}
                  </span>
                  <span className='text-[10px] font-medium text-paper/60'>
                    نویسندهٔ کارگاه فیل وب
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-2 rounded-sm border border-paper/15 bg-paper/5 p-2 text-[10px] font-bold'>
                <span className='flex items-center gap-1 text-paper/70'>
                  <Clock3 className='size-3.5 text-mustard' />
                  {faNumber(post.readingMinutes)} دقیقه مطالعه
                </span>
                <span className='flex items-center gap-1 text-paper/70'>
                  <UserRound className='size-3.5 text-teal-light' />
                  {faDate(post.publishedAt)}
                </span>
              </div>

              <p className='text-[10px] leading-relaxed font-medium text-paper/60'>
                این یادداشت بخشی از آرشیو رسمی کارگاه است؛ بازنشر با ذکر منبع
                آزاد است.
              </p>
            </div>
          </aside>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-indigo-light'>
            <span className='rounded-sm border border-indigo-ink/25 bg-paper-dim px-2 py-0.5'>
              {faNumber(post.tags.length)} موضوع
            </span>
            <span className='rounded-sm border border-indigo-ink/25 bg-paper-dim px-2 py-0.5 font-mono'>
              /blog/{post.slug}
            </span>
          </div>
          <ShareRow title={post.title} />
        </div>

        {post.coverUrl ? (
          <div className='overflow-hidden rounded-md border-[2px] border-indigo-ink bg-paper-light p-2 shadow-craft'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverUrl}
              alt={`کاور یادداشت ${post.title}`}
              className='max-h-80 w-full rounded-sm object-cover'
            />
            <p className='px-1 pt-1.5 text-[10px] font-medium text-indigo-light'>
              تصویر کاور یادداشت — آرشیو چاپ دیجیتال فیل وب
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
