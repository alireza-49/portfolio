"use client";

import {
  Badge,
  ChartFrame,
  Heatmap,
  Icon,
  Progress,
  RadialGauge,
  monoType,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import {
  GAUGES,
  HEATMAP_CELLS,
  HEATMAP_DAYS,
  HEATMAP_HOURS,
  TOP_PAGES,
} from "../data/dashboard";
import { formatNumber, formatPercent } from "../format";
import { CUSTOMERS_PAGE } from "./pages";
import { DashboardPage } from "./section-heading";
import type { DashboardData } from "./use-dashboard-data";

export function CustomersPage({ data }: { data: DashboardData }) {
  return (
    <DashboardPage
      page={CUSTOMERS_PAGE}
      trailing={
        <Badge variant='outline' className='gap-1'>
          <Icon name='users' className='size-3' />
          {formatNumber(data.dataset.summary.visitors)} بازدید یکتا
        </Badge>
      }
    >
      <div className='grid gap-3 @2xl:grid-cols-[1.15fr_0.85fr]'>
        <ChartFrame
          eyebrow='الگوی فعالیت'
          title='بازدید بر اساس روز و ساعت'
          description='تیره‌تر یعنی ترافیک بیشتر'
        >
          <Heatmap
            rows={HEATMAP_DAYS}
            columns={HEATMAP_HOURS}
            cells={HEATMAP_CELLS}
            lowLabel='آرام'
            highLabel='شلوغ'
          />
        </ChartFrame>

        <ChartFrame
          eyebrow='رضایت'
          title='امتیاز مشتریان'
          footer={<span>منبع: نظرسنجی پس از خرید</span>}
        >
          <div className='flex items-center justify-center py-2'>
            <RadialGauge
              value={GAUGES.satisfaction.value}
              label={GAUGES.satisfaction.label}
              hint={GAUGES.satisfaction.hint}
              footnote={GAUGES.satisfaction.footnote}
              size={132}
              thickness={11}
              tone='success'
            />
          </div>
        </ChartFrame>
      </div>

      <ChartFrame
        eyebrow='محتوا'
        title='پربازدیدترین صفحه‌ها'
        footer={<span>سهم از کل بازدید · روند هفتگی</span>}
      >
        <div className='flex flex-col gap-2'>
          {TOP_PAGES.map((page) => (
            <div key={page.path} className='flex flex-col gap-1'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <span
                  dir='ltr'
                  className={cn(
                    "text-[10px] text-[color:var(--cc-surface-foreground)]",
                    monoType,
                  )}
                >
                  {page.path}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] text-[color:var(--cc-muted-foreground)]",
                    monoType,
                  )}
                >
                  {formatNumber(page.visits)}
                  <span
                    className={cn(
                      "flex items-center gap-0.5 font-bold",
                      page.trend > 0
                        ? "text-[color:var(--cc-success)]"
                        : "text-[color:var(--cc-danger)]",
                    )}
                  >
                    <Icon
                      name={page.trend > 0 ? "arrow-up" : "arrow-down"}
                      className='size-2.5'
                    />
                    {formatPercent(Math.abs(page.trend))}
                  </span>
                </span>
              </div>
              <Progress value={page.share} />
            </div>
          ))}
        </div>
      </ChartFrame>
    </DashboardPage>
  );
}
