import type { Metadata } from "next";
import { connection } from "next/server";
import { PublicPageShell } from "@/components/public-page-shell";
import { TrackSearchForm } from "@/components/track/track-search";
import { PublishedBoards } from "@/components/track/published-boards";
import { TrackGuide } from "@/components/track/track-guide";
import { PendingNotice } from "@/components/track/pending-notice";
import { PendingWatcher } from "@/components/track/pending-watcher";
import { TrackLockSync } from "@/components/track/track-lock-sync";
import { getSubmission, listProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "رهگیری زندهٔ پیشرفت پروژه | وب دیزاین فیل",
  description:
    "با کد رهگیری سفارش، فازهای اجرایی، درصد پیشرفت، لاگ مهندسی و وضعیت تحویل پروژهٔ خود را شفاف ببینید.",
};

export const instant = false;

type TrackIndexProps = {
  searchParams: Promise<{ ref?: string | string[] }>;
};

export default async function TrackIndexPage({ searchParams }: TrackIndexProps) {
  await connection();

  const params = await searchParams;
  const rawRef = Array.isArray(params.ref) ? params.ref[0] : params.ref;
  const ref = rawRef?.trim() ?? "";
  const submission = ref ? await getSubmission(ref) : null;

  /*
   * A request stays locked while it is `new`, i.e. until the workshop opens it
   * in the console and moves it on. The whole page is grayed out and inert;
   * the notice above it is the only thing that is readable.
   */
  const locked = submission?.status === "new";

  const projects = await listProjects({ publishedOnly: true });

  return (
    <PublicPageShell>
      {locked && submission ? <PendingNotice submission={submission} /> : null}

      <div
        inert={locked || undefined}
        aria-busy={locked || undefined}
        className={
          locked
            ? "pointer-events-none select-none opacity-40 grayscale"
            : undefined
        }
      >
        <section className='border-b-[2.5px] border-indigo-ink bg-paper px-4 py-10 sm:px-8 lg:px-12'>
          <div className='mx-auto grid max-w-7xl items-end gap-8 lg:grid-cols-12'>
            <div className='flex flex-col gap-4 lg:col-span-7'>
              <span className='riso-stamp w-fit text-[0.625rem]'>
                Live Editorial Ledger // رصد بی‌پرده
              </span>
              <h1 className='font-display text-3xl leading-tight font-black text-indigo-ink sm:text-4xl'>
                رهگیری زنده و شفاف پیشرفت پروژه
                <span className='mt-1 block text-xl text-coral sm:text-2xl'>
                  کارگاه دیجیتال فیل وب
                </span>
              </h1>
              <p className='max-w-2xl text-sm leading-relaxed font-medium text-indigo-light sm:text-base'>
                تمام مراحل توسعه، خروجی‌های موقت استیجینگ و وضعیت تحویل سفارش
                شما در این تابلو به‌صورت آنی مستند می‌شود؛ بدون ابهام و بدون
                تأخیر در گزارش‌دهی.
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
      </div>

      {locked && submission ? (
        <PendingWatcher submissionId={submission.id} />
      ) : null}
      <TrackLockSync hasRef={Boolean(ref)} />
    </PublicPageShell>
  );
}
