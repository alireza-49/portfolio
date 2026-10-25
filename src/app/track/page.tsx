import type { Metadata } from "next";
import { connection } from "next/server";
import { PublicPageShell } from "@/components/public-page-shell";
import { TrackSearchForm } from "@/components/track/track-search";
import {
  PublishedBoards,
} from "@/components/track/published-boards";
import { TrackGuide } from "@/components/track/track-guide";
import { listProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "رهگیری زندهٔ پیشرفت پروژه | استودیو کدولوژی",
  description:
    "با کد رهگیری سفارش، فازهای اجرایی، درصد پیشرفت، لاگ مهندسی و وضعیت تحویل پروژهٔ خود را شفاف ببینید.",
};

export const instant = false;

export default async function TrackIndexPage() {
  await connection();
  const projects = await listProjects({ publishedOnly: true });

  return (
    <PublicPageShell>
      <section className='border-b-[2.5px] border-indigo-ink bg-paper px-4 py-10 sm:px-8 lg:px-12'>
        <div className='mx-auto grid max-w-7xl items-end gap-8 lg:grid-cols-12'>
          <div className='flex flex-col gap-4 lg:col-span-7'>
            <span className='riso-stamp w-fit text-[10px]'>
              Live Editorial Ledger // رصد بی‌پرده
            </span>
            <h1 className='font-display text-3xl leading-tight font-black text-indigo-ink sm:text-4xl'>
              رهگیری زنده و شفاف پیشرفت پروژه
              <span className='mt-1 block text-xl text-coral sm:text-2xl'>
                کارگاه دیجیتال کُدولوژی
              </span>
            </h1>
            <p className='max-w-2xl text-sm leading-relaxed font-medium text-indigo-light sm:text-base'>
              تمام مراحل توسعه، خروجی‌های موقت استیجینگ و وضعیت تحویل سفارش شما
              در این تابلو به‌صورت آنی مستند می‌شود؛ بدون ابهام و بدون تأخیر در
              گزارش‌دهی.
            </p>
          </div>

          <div className='lg:col-span-5'>
            <div className='craft-card rounded-sm border-[2.5px] border-indigo-ink bg-paper-light p-4 shadow-craft'>
              <TrackSearchForm />
            </div>
          </div>
        </div>
      </section>

      <PublishedBoards projects={projects} />
      <TrackGuide />
    </PublicPageShell>
  );
}
