"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

/** Shared fallback for the public DB-backed pages (blog, tracking). */
export function PublicError({
  title,
  description,
  reset,
}: {
  title: string;
  description: string;
  reset: () => void;
}) {
  return (
    <main
      dir='rtl'
      className='flex min-h-dvh w-full items-center justify-center bg-paper px-4 py-16'
    >
      <div className='paper-pattern w-full max-w-lg rounded-md border-[2px] border-indigo-ink bg-paper-light p-6 shadow-craft-lg sm:p-8'>
        <div className='flex items-center gap-2 text-coral'>
          <AlertTriangle className='size-5' />
          <h1 className='text-lg font-black text-indigo-ink'>{title}</h1>
        </div>
        <p className='mt-3 text-sm leading-relaxed font-medium text-indigo-light'>
          {description}
        </p>
        <div className='mt-5 flex flex-wrap items-center gap-2'>
          <button
            type='button'
            onClick={reset}
            className='craft-btn inline-flex items-center gap-1.5 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-3.5 py-2 text-xs font-black text-white'
          >
            <RefreshCw className='size-3.5' />
            تلاش دوباره
          </button>
          <Link
            href='/'
            className='inline-flex items-center gap-1.5 rounded-sm border-[2px] border-indigo-ink bg-paper px-3 py-2 text-xs font-black text-indigo-ink transition-colors hover:bg-mustard/30'
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </main>
  );
}
