import { cn } from "cn";

function Bar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block animate-pulse rounded-sm bg-indigo-ink/10", className)}
    />
  );
}

/** Streamed-in fallback for the like/view strip. */
export function PostEngagementSkeleton() {
  return (
    <section className='border-b-[2px] border-indigo-ink bg-paper-dim/40 px-4 py-3 sm:px-8 lg:px-12'>
      <div className='mx-auto flex max-w-7xl flex-wrap items-center gap-2'>
        {Array.from({ length: 3 }).map((_, index) => (
          <Bar key={index} className='h-7 w-24' />
        ))}
      </div>
    </section>
  );
}

/** Streamed-in fallback for the reader conversation. */
export function PostCommentsSkeleton() {
  return (
    <section className='border-t-[2.5px] border-indigo-ink bg-paper px-4 py-8 sm:px-8 lg:px-12'>
      <div className='mx-auto flex max-w-7xl flex-col gap-4'>
        <div className='flex items-center justify-between border-b-[2px] border-indigo-ink/20 pb-3'>
          <Bar className='h-5 w-32' />
          <Bar className='h-4 w-16' />
        </div>
        <Bar className='h-9 w-full' />
        <Bar className='h-24 w-full' />
        <Bar className='h-14 w-full' />
      </div>
    </section>
  );
}
