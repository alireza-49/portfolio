import type { Metadata } from "next";
import Link from "next/link";
import { Gauge, Inbox, Layers, Newspaper, Plus } from "lucide-react";
import { getAdminOverview } from "@/lib/content";
import { requireConsolePage } from "@/lib/auth";
import { faNumber } from "@/lib/fa";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  MetricCard,
  PageHeader,
} from "@/components/admin/ui";
import { TrendPanel } from "@/components/admin/overview/trend-panel";
import {
  ActiveProjectsPanel,
  RecentSubmissionsPanel,
} from "@/components/admin/overview/overview-lists";

export const metadata: Metadata = { title: "میز کار" };
export const instant = false;

export default async function AdminOverviewPage() {
  await requireConsolePage();
  const { counts, series, recentSubmissions, activeProjects } =
    await getAdminOverview();

  return (
    <div className='flex flex-col gap-6'>
      <PageHeader
        eyebrow='CODOLOGY STUDIO // INBOUND OPS'
        title='میز کار مدیریت'
        description='تصویر زندهٔ درخواست‌های سفارش، پروژه‌های در جریان و یادداشت‌های منتشرشده. همهٔ اعداد از پایگاه دادهٔ کنسول خوانده می‌شوند.'
        actions={
          <>
            <Link href='/admin/posts/new' className={BTN_PRIMARY}>
              <Plus className='size-3.5' />
              <span>یادداشت تازه</span>
            </Link>
            <Link href='/admin/inbox' className={BTN_SECONDARY}>
              <Inbox className='size-3.5' />
              <span>صندوق درخواست‌ها</span>
            </Link>
          </>
        }
      />

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        <MetricCard
          label='درخواست‌های بررسی‌نشده'
          value={faNumber(counts.submissionsNew)}
          unit='درخواست'
          hint={`${faNumber(counts.submissionsWeek)} درخواست در ۷ روز گذشته`}
          tone='coral'
          icon={<Inbox className='size-3.5' />}
        />
        <MetricCard
          label='پروژه‌های فعال'
          value={faNumber(counts.projectsActive)}
          unit='پروژه'
          hint={`${faNumber(counts.projectsPublished)} پروژه در صفحهٔ رهگیری منتشر شده`}
          tone='ink'
          icon={<Layers className='size-3.5' />}
        />
        <MetricCard
          label='میانگین پیشرفت پروژه‌های فعال'
          value={`${faNumber(counts.projectsAverageProgress)}٪`}
          hint={`${faNumber(counts.projectsDelivered)} پروژه تحویل‌شده`}
          tone='teal'
          icon={<Gauge className='size-3.5' />}
          progress={counts.projectsAverageProgress}
        />
        <MetricCard
          label='یادداشت‌های منتشرشده'
          value={faNumber(counts.postsPublished)}
          unit='مقاله'
          hint={`${faNumber(counts.postsDrafts)} پیش‌نویس در انتظار`}
          tone='mustard'
          icon={<Newspaper className='size-3.5' />}
        />
      </div>

      <TrendPanel series={series} />

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
        <RecentSubmissionsPanel submissions={recentSubmissions} />
        <ActiveProjectsPanel projects={activeProjects} />
      </div>
    </div>
  );
}
