import type { ReactNode } from "react";
import { CalendarClock, CircleDot, UserRound } from "lucide-react";
import { cn } from "cn";
import { faDate, faNumber } from "@/lib/fa";
import {
  PROJECT_STATUS_META,
  type Project,
  type ProjectStatus,
} from "@/lib/types";

const STATUS_TONE: Record<ProjectStatus, string> = {
  planning: "border-mustard-deep bg-mustard/25 text-indigo-ink",
  active: "border-coral bg-coral/10 text-coral",
  review: "border-mustard-deep bg-mustard/25 text-indigo-ink",
  delivered: "border-teal-craft bg-teal-craft/10 text-teal-craft",
  paused: "border-indigo-ink/25 bg-paper-dim text-indigo-light",
  archived: "border-indigo-ink/25 bg-paper-dim text-indigo-light",
};

function MetaCell({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className='flex flex-col gap-0.5 rounded-sm border border-indigo-ink/20 bg-paper p-2.5'>
      <span className='flex items-center gap-1 text-[10px] font-bold text-indigo-light'>
        {icon}
        {label}
      </span>
      <span className='truncate text-[12px] font-black text-indigo-ink'>
        {value}
      </span>
    </div>
  );
}

export function ProjectHero({ project }: { project: Project }) {
  const meta = PROJECT_STATUS_META[project.status];
  const doneSteps = project.steps.filter((step) => step.status === "done").length;

  return (
    <>
      <div className='w-full overflow-x-auto border-b-[2px] border-indigo-ink bg-paper-dim px-4 py-1.5 sm:px-6 lg:px-10'>
        <div className='mx-auto flex max-w-7xl items-center gap-3 text-[10px] font-bold whitespace-nowrap text-indigo-light'>
          <span className='flex items-center gap-1.5 text-coral'>
            <span className='size-2 animate-pulse rounded-full bg-coral' />
            پایگاه زندهٔ رهگیری استودیو کدولوژی
          </span>
          <span className='text-indigo-ink/20'>|</span>
          <span>آخرین به‌روزرسانی: {faDate(project.updatedAt)}</span>
          <span className='text-indigo-ink/20'>|</span>
          <span className='font-mono'>REF: {project.code}</span>
          <span className='ms-auto hidden font-mono sm:inline'>
            SOY-INK DIGITAL LEDGER
          </span>
        </div>
      </div>

      <section className='w-full px-4 pt-8 pb-6 sm:px-8 lg:px-12'>
        <div className='mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 lg:grid-cols-12'>
          <div className='flex flex-col gap-4 lg:col-span-7'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='riso-stamp text-[10px]'>{project.code}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-sm border-[1.5px] px-2 py-0.5 text-[11px] font-bold",
                  STATUS_TONE[project.status],
                )}
              >
                <CircleDot className='size-3' />
                {meta.label}
              </span>
              <span className='font-mono text-[10px] font-bold text-indigo-light'>
                گام‌های تکمیل‌شده: {faNumber(doneSteps)} از{" "}
                {faNumber(project.steps.length)}
              </span>
            </div>

            <h1 className='font-display text-2xl leading-tight font-black text-indigo-ink sm:text-4xl'>
              {project.title}
            </h1>
            <p className='max-w-2xl text-sm leading-relaxed font-medium text-indigo-light sm:text-base'>
              {project.summary ||
                "این پروژه در کارگاه کدولوژی در حال اجراست؛ وضعیت هر فاز در همین تابلو به‌روز می‌شود."}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-2 lg:col-span-5'>
            <MetaCell
              label='کارفرما'
              value={project.clientOrg || project.clientName || "—"}
              icon={<UserRound className='size-3' />}
            />
            <MetaCell
              label='فاز فعال'
              value={project.currentPhase || "—"}
              icon={<CircleDot className='size-3' />}
            />
            <MetaCell
              label='شروع'
              value={faDate(project.startDate)}
              icon={<CalendarClock className='size-3' />}
            />
            <MetaCell
              label='موعد تحویل'
              value={faDate(project.dueDate)}
              icon={<CalendarClock className='size-3' />}
            />
          </div>
        </div>

        <div className='mx-auto mt-6 max-w-7xl rounded-md border-[2px] border-indigo-ink bg-paper-light p-4 shadow-craft sm:p-5'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <span className='flex items-center gap-2 text-[12px] font-black text-indigo-ink'>
              میزان پیشرفت کلی اجرای پروژه
              <span className='font-display text-xl font-black text-coral'>
                {faNumber(project.progress)}٪
              </span>
            </span>
            <span className='text-[11px] font-bold text-indigo-light'>
              {project.currentPhase || "بدون فاز فعال"}
            </span>
          </div>
          <div className='mt-2 h-4 w-full overflow-hidden rounded-full border border-indigo-ink/20 bg-paper-shade p-0.5'>
            <div
              className='h-full rounded-full bg-coral transition-all duration-700'
              style={{ width: `${Math.max(0, Math.min(100, project.progress))}%` }}
            />
          </div>
          <div className='mt-1.5 flex items-center justify-between text-[10px] font-bold text-indigo-light'>
            <span>شروع: {faDate(project.startDate)}</span>
            <span className='text-coral'>
              در حال اجرا: {project.currentPhase || "—"}
            </span>
            <span>تحویل: {faDate(project.dueDate)}</span>
          </div>
        </div>
      </section>
    </>
  );
}
