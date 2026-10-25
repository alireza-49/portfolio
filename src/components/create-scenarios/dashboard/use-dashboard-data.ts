import { useMemo } from "react";
import {
  DASHBOARD_RANGES,
  jitter,
  type DashboardRange,
  type RangeId,
} from "../data/dashboard";

export type DashboardTrendRow = {
  label: string;
  revenue: number;
  previous: number;
  orders: number;
};

/**
 * Everything the pages read from the dataset: the active range, the summed
 * totals, the jittered trend rows and the growth deltas. It lives in one hook
 * so the shell can own `range` / `live` / `tick` while each page stays a pure
 * view and no page has to re-derive a KPI.
 */
export type DashboardData = {
  dataset: DashboardRange;
  totals: { revenue: number; previous: number; orders: number };
  trendRows: DashboardTrendRow[];
  revenueGrowth: number;
  ordersGrowth: number;
  conversionDelta: number;
  churnDelta: number;
  peakRevenue: number;
};

/** Signed percentage change, used by every KPI delta on the dashboard. */
function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function useDashboardData(
  range: RangeId,
  live: boolean,
  tick: number,
): DashboardData {
  return useMemo(() => {
    const dataset = DASHBOARD_RANGES[range];
    const spread = live ? 0.04 : 0;

    const totals = {
      revenue: jitter(
        dataset.revenue.reduce((sum, row) => sum + row.revenue, 0),
        tick,
        live ? 0.05 : 0,
      ),
      previous: jitter(
        dataset.revenue.reduce((sum, row) => sum + row.previous, 0),
        tick + 1,
        live ? 0.05 : 0,
      ),
      orders: jitter(
        dataset.revenue.reduce((sum, row) => sum + row.orders, 0),
        tick + 2,
        live ? 0.05 : 0,
      ),
    };

    const trendRows = dataset.revenue.map((row) => ({
      label: row.label,
      revenue: jitter(row.revenue, tick, spread),
      previous: jitter(row.previous, tick + 7, spread),
      orders: jitter(row.orders, tick + 3, spread),
    }));

    return {
      dataset,
      totals,
      trendRows,
      revenueGrowth: pctChange(totals.revenue, totals.previous),
      ordersGrowth: pctChange(totals.orders, dataset.summary.previousOrders),
      conversionDelta:
        dataset.summary.conversion - dataset.summary.previousConversion,
      churnDelta: dataset.summary.churn - dataset.summary.previousChurn,
      peakRevenue: Math.max(...trendRows.map((row) => row.revenue)),
    };
  }, [range, live, tick]);
}
