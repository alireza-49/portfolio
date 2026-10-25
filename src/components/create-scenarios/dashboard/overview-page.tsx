"use client";

import { useState } from "react";
import {
  Alert,
  AreaTrend,
  Badge,
  ChartFrame,
  ChartLegend,
  DonutBreakdown,
  Icon,
  MiniBars,
  RadialGauge,
  Sparkline,
  Stat,
  Tabs,
  TabsList,
  TabsTrigger,
  monoType,
  useChartTheme,
  type IconName,
} from "@/components/create-components";
import { ALERTS, GAUGES, KPI_SERIES, SIGNUP_WEEKS, TRAFFIC_SOURCES } from "../data/dashboard";
import { formatNumber, formatPercent } from "../format";
import { OVERVIEW_PAGE } from "./pages";
import { DashboardPage } from "./section-heading";
import type { DashboardData } from "./use-dashboard-data";

type Metric = "revenue" | "orders";

const ALERT_ICONS: Record<string, IconName> = {
  danger: "alert-circle",
  warning: "alert-triangle",
  info: "info",
};

const TRAFFIC_TOTAL = TRAFFIC_SOURCES.reduce(
  (sum, source) => sum + source.value,
  0,
);

/** Organic share of new signups, derived from the weekly series. */
const ORGANIC_SHARE = (() => {
  const total = SIGNUP_WEEKS.reduce(
    (sum, week) => sum + week.organic + week.paid + week.email,
    0,
  );
  const organic = SIGNUP_WEEKS.reduce((sum, week) => sum + week.organic, 0);
  return total === 0 ? 0 : (organic / total) * 100;
})();

function directionOf(value: number): "up" | "down" | "flat" {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "flat";
}

export function OverviewPage({ data }: { data: DashboardData }) {
  const theme = useChartTheme();
  const [metric, setMetric] = useState<Metric>("revenue");

  return (
    <DashboardPage
      page={OVERVIEW_PAGE}
      trailing={<Badge variant='soft'>{data.dataset.label}</Badge>}
    >
      <div className='grid grid-cols-2 gap-3 @xl:grid-cols-4'>
        <Stat
          label='درآمد دوره'
          value={`${formatNumber(data.totals.revenue)} م`}
          delta={{
            value: formatPercent(Math.abs(data.revenueGrowth)),
            direction: directionOf(data.revenueGrowth),
          }}
          hint={`دورهٔ قبل: ${formatNumber(data.totals.previous)} میلیون`}
          icon={<Icon name='chart-area' className='size-3.5' />}
        >
          <Sparkline points={KPI_SERIES.revenue} />
        </Stat>
        <Stat
          label='سفارش‌ها'
          value={formatNumber(data.totals.orders)}
          delta={{
            value: formatPercent(Math.abs(data.ordersGrowth)),
            direction: directionOf(data.ordersGrowth),
          }}
          hint={`${formatPercent(ORGANIC_SHARE)} از کانال ارگانیک`}
          icon={<Icon name='shopping-bag' className='size-3.5' />}
        >
          <MiniBars points={KPI_SERIES.users} />
        </Stat>
        <Stat
          label='نرخ تبدیل'
          value={`${formatNumber(data.dataset.summary.conversion)}٪`}
          delta={{
            value: formatPercent(Math.abs(data.conversionDelta)),
            direction: directionOf(data.conversionDelta),
          }}
          hint={`${formatNumber(data.dataset.summary.visitors)} بازدید یکتا`}
          icon={<Icon name='gauge' className='size-3.5' />}
        >
          <MiniBars points={KPI_SERIES.conversion} />
        </Stat>
        <Stat
          label='ریزش مشتری'
          value={`${formatNumber(data.dataset.summary.churn)}٪`}
          delta={{
            value: formatPercent(Math.abs(data.churnDelta)),
            direction: directionOf(data.churnDelta),
            good: "down",
          }}
          hint='کاهش، خبر خوب است'
          icon={<Icon name='activity' className='size-3.5' />}
        >
          <Sparkline points={KPI_SERIES.churn} tone='success' />
        </Stat>
      </div>

      <div className='grid gap-2 @2xl:grid-cols-3'>
        {ALERTS.map((alert) => (
          <Alert
            key={alert.title}
            variant={alert.tone}
            title={alert.title}
            icon={
              <Icon name={ALERT_ICONS[alert.tone] ?? "info"} className='size-4' />
            }
          >
            <span className='flex flex-col gap-0.5'>
              {alert.detail}
              <span className='text-[9px] opacity-70'>{alert.time}</span>
            </span>
          </Alert>
        ))}
      </div>


      <div className='grid gap-3 @3xl:grid-cols-[1.55fr_1fr]'>
        <ChartFrame
          eyebrow='روند درآمد'
          title='درآمد در برابر دورهٔ قبل'
          description={data.dataset.label}
          actions={
            <Tabs
              value={metric}
              onValueChange={(value) => setMetric(value as Metric)}
            >
              <TabsList className='text-[10px]'>
                <TabsTrigger value='revenue'>درآمد</TabsTrigger>
                <TabsTrigger value='orders'>سفارش</TabsTrigger>
              </TabsList>
            </Tabs>
          }
          legend={
            <ChartLegend
              items={[
                {
                  label:
                    metric === "revenue" ? "درآمد (میلیون تومان)" : "سفارش",
                  color: theme.series[0],
                },
                {
                  label: "دورهٔ قبل",
                  color: theme.series[1],
                  dashed: true,
                },
              ]}
            />
          }
          footer={
            <>
              <span>اوج: {formatNumber(data.peakRevenue)} میلیون تومان</span>
              <Badge
                variant={data.revenueGrowth >= 0 ? "success" : "danger"}
                className={monoType}
              >
                {data.revenueGrowth >= 0 ? "▲" : "▼"}
                {formatPercent(Math.abs(data.revenueGrowth))}
              </Badge>
            </>
          }
        >
          <AreaTrend
            data={data.trendRows}
            xKey='label'
            height={258}
            series={
              metric === "revenue"
                ? [
                    { key: "revenue", label: "درآمد" },
                    { key: "previous", label: "دورهٔ قبل" },
                  ]
                : [{ key: "orders", label: "سفارش" }]
            }
            dashedKeys={metric === "revenue" ? ["previous"] : []}
            formatValue={(value) => formatNumber(value)}
          />
        </ChartFrame>

        <div className='flex flex-col gap-3'>
          <ChartFrame
            eyebrow='ترافیک'
            title='منبع بازدیدها'
            footer={<span>مجموع {formatNumber(TRAFFIC_TOTAL)} نشست</span>}
          >
            <DonutBreakdown
              data={TRAFFIC_SOURCES}
              height={168}
              centerValue={formatNumber(TRAFFIC_TOTAL)}
              centerLabel='نشست'
              formatValue={(value) => formatNumber(value)}
            />
            <ChartLegend
              className='mt-2 justify-center'
              items={TRAFFIC_SOURCES.slice(0, 3).map((source, index) => ({
                label: source.label,
                color: theme.series[index],
              }))}
            />
          </ChartFrame>

          <ChartFrame eyebrow='هدف' title='شاخص کلیدی ماه'>
            <div className='flex items-center justify-center'>
              <RadialGauge
                value={GAUGES.monthlyGoal.value}
                label={GAUGES.monthlyGoal.label}
                hint={GAUGES.monthlyGoal.hint}
                footnote={GAUGES.monthlyGoal.footnote}
                size={120}
                thickness={10}
              />
            </div>
          </ChartFrame>
        </div>
      </div>
    </DashboardPage>
  );
}

