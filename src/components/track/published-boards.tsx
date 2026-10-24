import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "cn";
import { faNumber } from "@/lib/fa";
import {
  PROJECT_STATUS_META,
  type Project,
  type ProjectStatus,
} from "@/lib/types";

const STATUS_CLASS: Record<ProjectStatus, string> = {
  planning: "border-mustard-deep bg-mustard/25 text-indigo-ink",
  active: "border-coral bg-coral/10 text-coral",
  review: "border-mustard-deep bg-mustard/25 text-indigo-ink",
  delivered: "border-teal-craft bg-teal-craft/10 text-teal-craft",
  paused: "border-indigo-ink/25 bg-paper-dim text-indigo-light",
  archived: "border-indigo-ink/25 bg-paper-dim text-indigo-light",
};

export function PublishedBoards({ projects }: { projects: Project[] }) {
  return (
    <section className='w-full border-b-[2px] border-indigo-ink bg-paper-dim/40 px-4 py-10 sm:px-8 lg:px-12'>
      <div className='mx-auto flex max-w-7xl flex-col gap-5'>
        <div className='flex flex-wrap items-end justify-between gap-2 border-b-[2px] border-indigo-ink pb-3'>
          <div className='flex flex-col gap-1'>
            <span className='font-mono text-[10px] font-bold tracking-widest text-coral uppercase'>
              PUBLISHED BOARDS
            </span>
            <h2 className='text-lg font-black text-indigo-ink'>
              سفارش‌های منتشرشده در تابلو
            </h2>
          </div>
          <span className='text-[11px] font-bold text-indigo-light'>
            {faNumber(projects.length)} پروژه
          </span>
        </div>

        {projects.length === 0 ? (
          <p className='rounded-sm border-[2px] border-dashed border-indigo-ink/30 bg-paper px-4 py-10 text-center text-xs font-bold text-indigo-light'>
            هنوز سفارشی در تابلو عمومی منتشر نشده است. کد رهگیری خود را وارد کنید
            یا با کارگاه تماس بگیرید.
          </p>
        ) : (
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'>
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/track/${project.code}`}
                className='craft-card flex flex-col gap-2 rounded-sm border-[2px] border-indigo-ink bg-paper-light p-3.5'
              >
                <div className='flex items-center justify-between gap-2'>
                  <span className='rounded-sm border border-indigo-ink/30 bg-paper-dim px-1.5 py-0.5 font-mono text-[10px] font-black text-indigo-ink'>
                    {project.code}
                  </span>
                  <span
                    className={cn(
                      "rounded-sm border-[1.5px] px-2 py-0.5 text-[10px] font-bold",
                      STATUS_CLASS[project.status],
                    )}
                  >
                    {PROJECT_STATUS_META[project.status].short}
                  </span>
                </div>
                <span className='text-[13px] font-black text-indigo-ink'>
                  {project.title}
                </span>
                <span className='text-[11px] font-medium text-indigo-light'>
                  {project.clientOrg || project.currentPhase || "—"}
                </span>
                <div className='flex items-center gap-2'>
                  <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-paper-shade'>
                    <div
                      className='h-full rounded-full bg-coral'
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className='font-mono text-[10px] font-bold text-indigo-light'>
                    {faNumber(project.progress)}٪
                  </span>
                </div>
                <span className='flex items-center gap-1 text-[11px] font-black text-coral'>
                  مشاهدهٔ تابلو
                  <ArrowLeft className='size-3.5' />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
