"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, Settings2 } from "lucide-react";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/components/admin/ui";

/**
 * The console's error boundary. A missing `DATABASE_URL` is the most common
 * failure, so the message points at the two commands that fix it instead of
 * dumping a connection string on screen.
 */
export default function ConsoleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      dir='rtl'
      className='mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-md border-[2px] border-indigo-ink bg-paper-light p-6 shadow-craft'
    >
      <div className='flex items-center gap-2 text-coral'>
        <AlertTriangle className='size-5' />
        <h1 className='text-lg font-black text-indigo-ink'>
          بارگذاری این بخش ممکن نشد
        </h1>
      </div>

      <p className='text-sm leading-relaxed font-medium text-indigo-light'>
        اگر تازه پروژه را راه‌اندازی کرده‌اید، احتمالاً اتصال پایگاه داده تنظیم
        نشده است. فایل <code className='font-mono'>.env.local</code> را از{" "}
        <code className='font-mono'>.env.example</code> بسازید،{" "}
        <code className='font-mono'>DATABASE_URL</code> را مقدار بدهید و سپس
        دستور زیر را اجرا کنید:
      </p>

      <pre
        dir='ltr'
        className='overflow-x-auto rounded-sm border border-indigo-ink/20 bg-paper-dim p-3 font-mono text-[12px] text-indigo-ink'
      >
        npm run db:setup
      </pre>

      {error.digest ? (
        <p className='font-mono text-[10px] text-indigo-light'>
          digest: {error.digest}
        </p>
      ) : null}

      <div className='flex flex-wrap items-center gap-2 border-t-[2px] border-dashed border-indigo-ink/20 pt-3'>
        <button type='button' onClick={reset} className={BTN_PRIMARY}>
          <RefreshCw className='size-3.5' />
          <span>تلاش دوباره</span>
        </button>
        <Link href='/admin/posts' className={BTN_SECONDARY}>
          <Settings2 className='size-3.5' />
          <span>بخش یادداشت‌ها</span>
        </Link>
      </div>
    </div>
  );
}
