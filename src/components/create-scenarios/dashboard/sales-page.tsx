"use client";

import {
  Badge,
  BarSeries,
  Button,
  ChartFrame,
  ChartLegend,
  DonutBreakdown,
  FunnelChart,
  Icon,
  LineTrend,
  useChartTheme,
} from "@/components/create-components";
import {
  CHANNELS,
  FUNNEL_STAGES,
  KPI_SERIES,
  PLAN_MIX,
  SIGNUP_WEEKS,
  jitter,
} from "../data/dashboard";
import { formatNumber, formatPercent, formatToman } from "../format";
import { SALES_PAGE } from "./pages";
import { DashboardPage } from "./section-heading";
import type { DashboardData } from "./use-dashboard-data";

const PLAN_TOTAL = PLAN_MIX.reduce((sum, plan) => sum + plan.value, 0);

/** Forecast uplift and its stated accuracy live together, once. */
const FORECAST_UPLIFT = 0.12;
const FORECAST_ACCURACY = 86;

export function SalesPage({
  data,
  tick,
  onRefresh,
}: {
  data: DashboardData;
  tick: number;
  onRefresh: () => void;
}) {
  const theme = useChartTheme();

  const forecastRows = data.trendRows.map((row, index) => {
    const actual = jitter(
      KPI_SERIES.users[index % KPI_SERIES.users.length],
      tick + index,
    );
    return {
      label: row.label,
      actual,
      forecast: Math.round(actual * (1 + FORECAST_UPLIFT)),
    };
  });

  return (
    <DashboardPage
      page={SALES_PAGE}
      trailing={
        <Badge variant='outline' className='gap-1'>
          <Icon name='filter' className='size-3' />
          {formatNumber(SIGNUP_WEEKS.length)} روز
        </Badge>
      }
    >
      <div className='grid gap-3 @2xl:grid-cols-[1.1fr_0.9fr]'>
        <ChartFrame
          eyebrow='قیف تبدیل'
          title='از بازدید تا خرید دوم'
          footer={<span>بیشترین ریزش: افزودن به سبد ← شروع پرداخت</span>}
        >
          <FunnelChart
            stages={FUNNEL_STAGES}
            formatValue={(value) => formatNumber(value)}
          />
        </ChartFrame>

        <ChartFrame
          eyebrow='ترکیب درآمد'
          title='درآمد به تفکیک پلن'
          footer={<span>مجموع {formatToman(PLAN_TOTAL)}</span>}
        >
          <DonutBreakdown
            data={PLAN_MIX}
            height={168}
            centerValue={formatNumber(PLAN_TOTAL)}
            centerLabel='تومان'
            formatValue={(value) => formatNumber(value)}
          />
          <ChartLegend
            className='mt-2 justify-center'
            items={PLAN_MIX.map((plan, index) => ({
              label: plan.label,
              color: theme.series[index],
            }))}
          />
        </ChartFrame>
      </div>

      <div className='grid gap-3 @2xl:grid-cols-[1.15fr_0.85fr]'>
        <ChartFrame
          eyebrow='ثبت‌نام'
          title='ثبت‌نام هفتگی به تفکیک کانال'
          legend={
            <ChartLegend
              items={CHANNELS.map((channel, index) => ({
                label: channel.label,
                color: theme.series[index],
              }))}
            />
          }
          contentClassName='pt-1'
        >
          <BarSeries
            data={SIGNUP_WEEKS}
            xKey='label'
            stacked
            height={236}
            series={CHANNELS.map((channel) => ({
              key: channel.key,
              label: channel.label,
            }))}
            formatValue={(value) => formatNumber(value)}
          />
        </ChartFrame>

        <ChartFrame
          eyebrow='پیش‌بینی'
          title='کاربران فعال در برابر سفارش‌ها'
          description='میانگین متحرک ۷ روزه'
          actions={
            <Badge variant='soft' className='gap-1'>
              <Icon name='activity' className='size-3' />
              دقت {formatPercent(FORECAST_ACCURACY)}
            </Badge>
          }
          legend={
            <ChartLegend
              items={[
                { label: "کاربران فعال", color: theme.series[3] },
                {
                  label: "پیش‌بینی",
                  color: theme.series[4],
                  dashed: true,
                },
              ]}
            />
          }
          footer={
            <Button size='sm' variant='outline' onClick={onRefresh}>
              <Icon name='refresh' className='size-3' />
              بازخوانی
            </Button>
          }
        >
          <LineTrend
            data={forecastRows}
            xKey='label'
            height={224}
            showDots
            dashedKeys={["forecast"]}
            series={[
              { key: "actual", label: "کاربران فعال (هزار)" },
              { key: "forecast", label: "پیش‌بینی هفتهٔ بعد" },
            ]}
            formatValue={(value) => formatNumber(value)}
          />
        </ChartFrame>
      </div>
    </DashboardPage>
  );
}

