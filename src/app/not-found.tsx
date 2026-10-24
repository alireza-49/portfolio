import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { PublicPageShell } from "@/components/public-page-shell";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد | استودیو کدولوژی",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <PublicPageShell>
      <section className='flex flex-1 items-center justify-center px-4 py-16 sm:px-8'>
        <div className='paper-pattern w-full max-w-xl rounded-md border-[2px] border-indigo-ink bg-paper-light p-8 text-center shadow-craft-lg'>
          <FileQuestion className='mx-auto size-10 text-coral' />
          <span className='mt-3 block font-mono text-[10px] font-bold tracking-widest text-indigo-light uppercase'>
            404 / MISSING SHEET
          </span>
          <h1 className='mt-1 font-display text-2xl font-black text-indigo-ink'>
            این برگه در آرشیو چاپ نشده است
          </h1>
          <p className='mx-auto mt-2 max-w-md text-sm leading-relaxed font-medium text-indigo-light'>
            ممکن است نشانی اشتباه باشد، یادداشت حذف شده باشد یا صفحهٔ رهگیری هنوز
            منتشر نشده باشد. از مسیرهای زیر ادامه دهید.
          </p>
          <div className='mt-5 flex flex-wrap items-center justify-center gap-2'>
            <Link
              href='/'
              className='craft-btn inline-flex items-center gap-1.5 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-3.5 py-2 text-xs font-black text-white'
            >
              صفحهٔ اصلی
              <ArrowLeft className='size-3.5' />
            </Link>
            <Link
              href='/blog'
              className='inline-flex items-center gap-1.5 rounded-sm border-[2px] border-indigo-ink bg-paper px-3 py-2 text-xs font-black text-indigo-ink transition-colors hover:bg-mustard/30'
            >
              روزنامهٔ کارگاه
            </Link>
            <Link
              href='/track'
              className='inline-flex items-center gap-1.5 rounded-sm border-[2px] border-indigo-ink bg-paper px-3 py-2 text-xs font-black text-indigo-ink transition-colors hover:bg-mustard/30'
            >
              رهگیری پروژه
            </Link>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
