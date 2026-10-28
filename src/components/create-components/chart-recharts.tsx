"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { labelType, monoType } from "./styles";
import { type ChartSeries, seriesColor, useChartTheme } from "./chart";

/**
 * Themed recharts wrappers.
 *
 * Consumers never import recharts directly: every axis, grid, tooltip and
 * gradient is derived from the resolved `--cc-*` theme, so switching a design
 * preset re-skins the charts along with the rest of the kit.
 */

type Row = Record<string, string | number>;

type TooltipItem = {
  name?: string | number;
  value?: string | number;
  color?: string;
  dataKey?: string | number;
};

type TooltipBoxProps = {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string | number;
  formatValue?: (value: number) => string;
  formatLabel?: (label: string | number) => string;
};

function ChartTooltipBox({
  active,
  payload,
  label,
  formatValue,
  formatLabel,
}: TooltipBoxProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      dir='rtl'
      className={cn(
        "flex min-w-32 flex-col gap-1 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-2",
        "[box-shadow:var(--cc-shadow)]",
      )}
    >
      {label === undefined ? null : (
        <span
          className={cn(
            "text-[length:calc(var(--cc-font-size)*0.66)] text-[color:var(--cc-muted-foreground)]",
            labelType,
          )}
        >
          {formatLabel ? formatLabel(label) : label}
        </span>
      )}
      {payload.map((item, index) => {
        const numeric =
          typeof item.value === "number" ? item.value : Number(item.value ?? 0);
        return (
          <span
            key={`${item.dataKey ?? index}`}
            className='flex items-center justify-between gap-3 text-[length:calc(var(--cc-font-size)*0.72)] text-[color:var(--cc-surface-foreground)]'
          >
            <span className='flex items-center gap-1.5'>
              <span
                aria-hidden='true'
                className='size-2 rounded-[0.125rem]'
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className={`${monoType} font-bold`}>
              {formatValue
                ? formatValue(numeric)
                : numeric.toLocaleString("fa-IR")}
            </span>
          </span>
        );
      })}
    </div>
  );
}

function useAxisTheme() {
  const theme = useChartTheme();
  return {
    theme,
    axisProps: {
      stroke: theme.border,
      tick: { fill: theme.axis, fontSize: theme.fontSize },
      tickLine: false,
      axisLine: { stroke: theme.border },
    },
  };
}

export type TrendChartProps = {
  data: Row[];
  series: ChartSeries[];
  xKey: string;
  height?: number;
  formatX?: (value: string | number) => string;
  formatValue?: (value: number) => string;
  formatLabel?: (label: string | number) => string;
  /** Extra series rendered as a dashed reference line. */
  dashedKeys?: string[];
  /** Series measured on the opposite axis (mixed-scale comparisons). */
  secondaryKeys?: string[];
  className?: string;
};

/* --------------------------------------------------------------------- area */

export function AreaTrend({
  data,
  series,
  xKey,
  height = 240,
  formatX,
  formatValue,
  formatLabel,
  dashedKeys = [],
  secondaryKeys = [],
  className,
}: TrendChartProps) {
  const { theme, axisProps } = useAxisTheme();

  return (
    <div className={cn("w-full", className)} style={{ height }} dir='ltr'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid
            stroke={theme.grid}
            strokeDasharray='3 4'
            vertical={false}
          />
          <XAxis
            dataKey={xKey}
            reversed
            {...axisProps}
            tickFormatter={formatX}
            minTickGap={12}
          />
          <YAxis
            yAxisId='primary'
            orientation='right'
            width={44}
            {...axisProps}
            tickFormatter={formatValue}
          />
          {secondaryKeys.length > 0 ? (
            <YAxis
              yAxisId='secondary'
              orientation='left'
              width={44}
              {...axisProps}
              tickFormatter={formatValue}
            />
          ) : null}
          <Tooltip
            cursor={{ stroke: theme.border, strokeDasharray: "4 4" }}
            content={
              <ChartTooltipBox
                formatValue={formatValue}
                formatLabel={formatLabel}
              />
            }
          />
          {series.map((item, index) => {
            const color = seriesColor(index, theme.series, item.color);
            const dashed = dashedKeys.includes(item.key);
            return (
              <Area
                key={item.key}
                yAxisId={
                  secondaryKeys.includes(item.key) ? "secondary" : "primary"
                }
                type='monotone'
                dataKey={item.key}
                name={item.label}
                stroke={color}
                strokeWidth={dashed ? 1.5 : 2.4}
                strokeDasharray={dashed ? "5 4" : undefined}
                fill={color}
                fillOpacity={dashed ? 0 : 0.16}
                activeDot={{ r: 4, strokeWidth: 2, stroke: theme.surface }}
                isAnimationActive={false}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* -------------------------------------------------------------------- lines */

export function LineTrend({
  data,
  series,
  xKey,
  height = 220,
  formatX,
  formatValue,
  formatLabel,
  dashedKeys = [],
  secondaryKeys = [],
  showDots = false,
  className,
}: TrendChartProps & { showDots?: boolean }) {
  const { theme, axisProps } = useAxisTheme();

  return (
    <div className={cn("w-full", className)} style={{ height }} dir='ltr'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid
            stroke={theme.grid}
            strokeDasharray='3 4'
            vertical={false}
          />
          <XAxis
            dataKey={xKey}
            reversed
            {...axisProps}
            tickFormatter={formatX}
            minTickGap={10}
          />
          <YAxis
            yAxisId='primary'
            orientation='right'
            width={42}
            {...axisProps}
            tickFormatter={formatValue}
          />
          {secondaryKeys.length > 0 ? (
            <YAxis
              yAxisId='secondary'
              orientation='left'
              width={42}
              {...axisProps}
              tickFormatter={formatValue}
            />
          ) : null}
          <Tooltip
            cursor={{ stroke: theme.border, strokeDasharray: "4 4" }}
            content={
              <ChartTooltipBox
                formatValue={formatValue}
                formatLabel={formatLabel}
              />
            }
          />
          {series.map((item, index) => {
            const color = seriesColor(index, theme.series, item.color);
            const dashed = dashedKeys.includes(item.key);
            return (
              <Line
                key={item.key}
                yAxisId={
                  secondaryKeys.includes(item.key) ? "secondary" : "primary"
                }
                type='monotone'
                dataKey={item.key}
                name={item.label}
                stroke={color}
                strokeWidth={dashed ? 1.5 : 2.2}
                strokeDasharray={dashed ? "5 4" : undefined}
                dot={showDots ? { r: 2.5, strokeWidth: 0, fill: color } : false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: theme.surface }}
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


/* --------------------------------------------------------------------- bars */

export function BarSeries({
  data,
  series,
  xKey,
  height = 220,
  stacked = false,
  formatX,
  formatValue,
  formatLabel,
  className,
}: TrendChartProps & { stacked?: boolean }) {
  const { theme, axisProps } = useAxisTheme();
  const radius = theme.radius;

  return (
    <div className={cn("w-full", className)} style={{ height }} dir='ltr'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          barGap={stacked ? 0 : 4}
        >
          <CartesianGrid
            stroke={theme.grid}
            strokeDasharray='3 4'
            vertical={false}
          />
          <XAxis
            dataKey={xKey}
            reversed
            {...axisProps}
            tickFormatter={formatX}
            minTickGap={6}
          />
          <YAxis
            orientation='right'
            width={44}
            {...axisProps}
            tickFormatter={formatValue}
          />
          <Tooltip
            cursor={{ fill: theme.muted, opacity: 0.55 }}
            content={
              <ChartTooltipBox
                formatValue={formatValue}
                formatLabel={formatLabel}
              />
            }
          />
          {series.map((item, index) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.label}
              stackId={stacked ? "cc-stack" : undefined}
              fill={seriesColor(index, theme.series, item.color)}
              radius={
                stacked
                  ? index === series.length - 1
                    ? [radius, radius, 0, 0]
                    : 0
                  : [radius, radius, 0, 0]
              }
              maxBarSize={stacked ? 34 : 22}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* -------------------------------------------------------------------- donut */

export type DonutSlice = {
  label: string;
  value: number;
  color?: string;
};

export function DonutBreakdown({
  data,
  height = 200,
  centerLabel,
  centerValue,
  innerRatio = 0.62,
  formatValue,
  className,
}: {
  data: DonutSlice[];
  height?: number;
  centerLabel?: ReactNode;
  centerValue?: ReactNode;
  innerRatio?: number;
  formatValue?: (value: number) => string;
  className?: string;
}) {
  const { theme } = useAxisTheme();
  const rows = data.map((slice, index) => ({
    ...slice,
    fill: seriesColor(index, theme.series, slice.color),
  }));

  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Tooltip
            content={
              <ChartTooltipBox formatValue={formatValue} formatLabel={() => ""} />
            }
          />
          <Pie
            data={rows}
            dataKey='value'
            nameKey='label'
            innerRadius={`${innerRatio * 100}%`}
            outerRadius='88%'
            paddingAngle={1.5}
            stroke={theme.surface}
            strokeWidth={2}
            isAnimationActive={false}
          >
            {rows.map((row) => (
              <Cell key={row.label} fill={row.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {centerValue !== undefined ? (
        <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center'>
          <span className={`${monoType} text-[length:calc(var(--cc-font-size)*1.05)] font-black text-[color:var(--cc-surface-foreground)]`}>
            {centerValue}
          </span>
          {centerLabel ? (
            <span
              className={cn(
                "text-[length:calc(var(--cc-font-size)*0.62)] text-[color:var(--cc-muted-foreground)]",
                labelType,
              )}
            >
              {centerLabel}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

