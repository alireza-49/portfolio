import Link from "next/link";
import {
  BTN_SECONDARY,
  PageHeader,
  Panel,
  PanelHeading,
} from "@/components/admin/ui";
import type { Project } from "@/lib/types";
import { ProgressCard } from "./progress-card";

export function ProgressBoard({ projects }: { projects: Project[] }) {
  return (
    <div className='flex flex-col gap-5'>
      <PageHeader
        eyebrow='LIVE WORKSHOP // PHASE CONTROL'
        title='تابلوی پیشرفت پروژه‌ها'
        description='درصد پیشرفت، فاز فعال و وضعیت هر پروژه را از همین‌جا به‌روز کنید؛ تغییرات بلافاصله در صفحهٔ رهگیری کارفرما دیده می‌شوند.'
        actions={
          <Link href='/admin/projects' className={BTN_SECONDARY}>
            فهرست کامل پروژه‌ها
          </Link>
        }
      />

      <Panel>
        <PanelHeading
          eyebrow='ACTIVE ORDERS'
          title='پروژه‌های در جریان'
          description='فقط پروژه‌های برنامه‌ریزی، فعال و در بازبینی در این تابلو آمده‌اند.'
        />
        <div className='flex flex-col gap-3 p-3 sm:p-4'>
          {projects.length === 0 ? (
            <p className='rounded-sm border-[2px] border-dashed border-indigo-ink/25 bg-paper px-3 py-8 text-center text-xs font-bold text-indigo-light'>
              پروژهٔ در جریانی وجود ندارد؛ از بخش مدیریت پروژه‌ها یک سفارش را
              فعال کنید.
            </p>
          ) : (
            projects.map((project) => (
              <ProgressCard key={project.id} project={project} />
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}
