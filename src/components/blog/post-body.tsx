import { ListTree } from "lucide-react";
import { addHeadingIds, enhancePostHtml } from "@/lib/post-html";
import { PostRuntime } from "./post-runtime";

/**
 * Renders the saved article body. Anchor ids are added here (never stored), so a
 * heading can be renamed without leaving broken links in the database.
 */
export function PostBody({ html }: { html: string }) {
  const { html: withIds, headings } = addHeadingIds(enhancePostHtml(html));

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-12'>
      <article className='min-w-0 lg:col-span-8'>
        <PostRuntime
          html={withIds}
          className='post-body rounded-md border-[2px] border-indigo-ink bg-paper-light p-5 shadow-craft sm:p-7'
        />
      </article>

      {headings.length > 0 ? (
        <aside className='lg:col-span-4'>
          <nav
            aria-label='فهرست سرفصل‌های یادداشت'
            className='sticky top-20 rounded-md border-[2px] border-indigo-ink bg-paper-light p-4 shadow-craft'
          >
            <span className='flex items-center gap-1.5 border-b border-dashed border-indigo-ink/20 pb-2 text-[11px] font-black text-indigo-ink'>
              <ListTree className='size-4 text-coral' />
              در این یادداشت
            </span>
            <ol className='mt-2 flex flex-col gap-1.5'>
              {headings.map((heading, index) => (
                <li
                  key={heading.id}
                  style={{
                    paddingInlineStart: `${(heading.level - 2) * 12}px`,
                  }}
                >
                  <a
                    href={`#${heading.id}`}
                    className='flex items-start gap-1.5 text-[11px] leading-snug font-bold text-indigo-light transition-colors hover:text-coral'
                  >
                    <span className='font-mono text-[9px] text-coral/70'>
                      {index + 1}
                    </span>
                    <span>{heading.text}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      ) : null}
    </div>
  );
}
