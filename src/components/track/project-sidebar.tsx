import Link from "next/link";
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  MessageSquare,
  MonitorPlay,
} from "lucide-react";
import type { Project } from "@/lib/types";
import { TrackSearchForm } from "./track-search";

export function ProjectSidebar({ project }: { project: Project }) {
  return (
    <aside className='flex flex-col gap-3 lg:col-span-5'>
      <section className='flex flex-col gap-2 rounded-md border-[2px] border-indigo-ink bg-paper-light p-4 shadow-craft'>
        <span className='flex items-center gap-1.5 text-[0.75rem] font-black text-indigo-ink'>
          <MonitorPlay className='size-4 text-coral' />
          پیش‌نمایش استیجینگ
        </span>
        {project.stagingUrl ? (
          <a
            href={project.stagingUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex w-fit items-center gap-1.5 rounded-sm border-[2px] border-indigo-ink bg-paper px-2.5 py-1.5 text-[0.6875rem] font-black text-indigo-ink transition-colors hover:bg-mustard/30'
          >
            <ExternalLink className='size-3.5' />
            باز کردن نسخهٔ آزمایشی
          </a>
        ) : (
          <p className='text-[0.6875rem] leading-relaxed font-medium text-indigo-light'>
            نسخهٔ استیجینگ هنوز منتشر نشده است؛ هر زمان آماده شود لینک آن در
            همین کارت قرار می‌گیرد.
          </p>
        )}
        {project.repoUrl ? (
          <a
            href={project.repoUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex w-fit items-center gap-1.5 text-[0.6875rem] font-bold text-indigo-light hover:text-coral'
          >
            <Code2 className='size-3.5' />
            مخزن کد پروژه
          </a>
        ) : null}
      </section>

      <section className='flex flex-col gap-2 rounded-md border-[2px] border-indigo-ink bg-paper-light p-4 shadow-craft'>
        <span className='flex items-center gap-1.5 text-[0.75rem] font-black text-indigo-ink'>
          <MessageSquare className='size-4 text-coral' />
          پیگیری سفارش دیگری دارید؟
        </span>
        <TrackSearchForm compact />
      </section>

      <section className='flex flex-col gap-2 rounded-md border-[2px] border-indigo-ink bg-mustard/25 p-4 shadow-craft'>
        <p className='text-[0.75rem] leading-relaxed font-black text-indigo-ink'>
          سؤالی دربارهٔ این فاز دارید؟ پاسخ رسمی کارگاه را از فرم تماس بگیرید.
        </p>
        <Link
          href='/#contact-section'
          className='craft-btn inline-flex w-fit items-center gap-1.5 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-3 py-1.5 text-[0.6875rem] font-black text-white'
        >
          تماس با کارگاه
          <ArrowLeft className='size-3.5' />
        </Link>
      </section>
    </aside>
  );
}
