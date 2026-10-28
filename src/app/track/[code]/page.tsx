import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { connection } from "next/server";
import { PublicPageShell } from "@/components/public-page-shell";
import { ProjectHero } from "@/components/track/project-hero";
import { PhaseStepper } from "@/components/track/phase-stepper";
import { Changelog } from "@/components/track/changelog";
import { FinancePanel } from "@/components/track/finance-panel";
import { ProjectSidebar } from "@/components/track/project-sidebar";
import { getProjectByCode } from "@/lib/content";
import { faDate } from "@/lib/fa";

export const instant = false;

const loadProject = cache(async (code: string) => getProjectByCode(code));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  await connection();
  const { code } = await params;
  const project = await loadProject(code);

  if (!project || !project.published) {
    return { title: "سفارش پیدا نشد | وب دیزاین فیل" };
  }

  return {
    title: `رهگیری ${project.title} | وب دیزاین فیل`,
    description:
      project.summary ||
      `تابلوی زندهٔ پیشرفت پروژهٔ ${project.title} در کارگاه فیل.`,
  };
}

export default async function TrackProjectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  await connection();
  const { code } = await params;
  const project = await loadProject(code);

  if (!project || !project.published) notFound();

  return (
    <PublicPageShell>
      <ProjectHero project={project} />

      <section className='w-full px-4 py-8 sm:px-8 lg:px-12'>
        <div className='mx-auto flex max-w-7xl flex-col gap-4'>
          <div className='flex flex-wrap items-end justify-between gap-2 border-b-[2px] border-indigo-ink pb-3'>
            <div className='flex flex-col gap-1'>
              <span className='font-mono text-[0.625rem] font-bold tracking-widest text-coral uppercase'>
                ROADMAP &amp; PHASES // گام‌های رسمی
              </span>
              <h2 className='text-lg font-black text-indigo-ink'>
                تایم‌لاین گام‌های اجرایی سفارش
              </h2>
            </div>
            <span className='text-[0.6875rem] font-bold text-indigo-light'>
              آخرین به‌روزرسانی: {faDate(project.updatedAt)}
            </span>
          </div>
          <PhaseStepper steps={project.steps} />
        </div>
      </section>

      <div className='mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 pb-10 sm:px-8 lg:grid-cols-12 lg:px-12'>
        <section className='flex flex-col gap-3 rounded-md border-[2px] border-indigo-ink bg-paper-light p-4 shadow-craft sm:p-5 lg:col-span-7'>
          <div className='flex items-center justify-between gap-2 border-b border-dashed border-indigo-ink/20 pb-2'>
            <div className='flex flex-col gap-0.5'>
              <span className='font-mono text-[0.625rem] font-bold tracking-widest text-teal-craft uppercase'>
                Live workshop log
              </span>
              <h2 className='text-sm font-black text-indigo-ink'>
                آخرین اقدامات فنی کارگاه
              </h2>
            </div>
            <span className='rounded-sm border border-indigo-ink/25 bg-paper px-2 py-0.5 font-mono text-[0.5625rem] font-bold text-indigo-light'>
              branch: main
            </span>
          </div>
          <Changelog updates={project.updates} />
        </section>

        <ProjectSidebar project={project} />
      </div>

      {project.showFinancials ? (
        <div className='mx-auto w-full max-w-7xl px-4 pb-10 sm:px-8 lg:px-12'>
          <FinancePanel project={project} />
        </div>
      ) : null}
    </PublicPageShell>
  );
}
