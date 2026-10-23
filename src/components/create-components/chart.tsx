"use client";

import {
  useId,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { bodyType, borderChrome, headingType, labelType, monoType } from "./styles";
import { useCreateComponentTheme } from "./theme-provider";

/* ------------------------------------------------------------------ shared */

export type ChartSeries = {
  /** Value key inside the data rows. */
  key: string;
  /** Human label (already translated by the caller). */
  label: string;
  /** Optional explicit colour; defaults to the themed series ramp. */
  color?: string;
};

/**
 * Resolved palette for chart engines.
 *
 * SVG presentation attributes accept `var(--cc-*)`, but charting libraries
 * need concrete values (gradients, legends, tooltips), so this hook hands out
 * the theme's hex colours.
 */
export function useChartTheme() {
  const theme = useCreateComponentTheme();
  return useMemo(
    () => ({
      series: [
        theme.chart1,
        theme.chart2,
        theme.chart3,
        theme.chart4,
        theme.chart5,
        theme.chart6,
      ],
      grid: theme.chartGrid,
      axis: theme.mutedForeground,
      border: theme.border,
      surface: theme.surface,
      surfaceForeground: theme.surfaceForeground,
      muted: theme.muted,
      mutedForeground: theme.mutedForeground,
      primary: theme.primary,
      accent: theme.accent,
      danger: theme.danger,
      success: theme.success,
      radius: theme.radius,
      fontFamily: theme.labelFontFamily,
      fontSize: theme.fontSize * 0.7,
      density: theme.density,
    }),
    [theme],
  );
}

/** Colour for series `index`, honouring an explicit override. */
export function seriesColor(
  index: number,
  palette: string[],
  override?: string,
): string {
  return override ?? palette[index % palette.length];
}

/* -------------------------------------------------------------------- frame */

export type ChartFrameProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  legend?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

/**
 * Bordered shell shared by every chart. Keeps headers, legends and footnotes
 * on the same rhythm as `Card`, without nesting interactive cards.
 */
export function ChartFrame({
  eyebrow,
  title,
  description,
  actions,
  legend,
  footer,
  children,
  className,
  contentClassName,
}: ChartFrameProps) {
  return (
    <section
      data-cc-chart-frame=''
      className={cn(
        "flex flex-col gap-[calc(0.75rem*var(--cc-density))] bg-[var(--cc-surface)]",
        "rounded-[var(--cc-card-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
        borderChrome,
        "[background-image:var(--cc-surface-pattern)] [background-size:var(--cc-surface-pattern-size)]",
        "[box-shadow:var(--cc-shadow)]",
        "p-[calc(1rem*var(--cc-density))]",
        className,
      )}
    >
      <header className='flex flex-wrap items-start justify-between gap-2'>
        <div className='flex flex-col gap-1'>
          {eyebrow ? (
            <span
              className={cn(
                "text-[length:calc(var(--cc-font-size)*0.68)] text-[color:var(--cc-primary)]",
                labelType,
              )}
            >
              {eyebrow}
            </span>
          ) : null}
          <h3
            className={cn(
              "text-[length:calc(var(--cc-font-size)*1.05)] text-[color:var(--cc-surface-foreground)]",
              headingType,
            )}
          >
            {title}
          </h3>
          {description ? (
            <p
              className={cn(
                "text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]",
                bodyType,
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className='flex flex-wrap items-center gap-1.5'>{actions}</div>
        ) : null}
      </header>

      {legend ? <div className='flex flex-wrap items-center gap-3'>{legend}</div> : null}

      <div className={cn("sc-chart-fade relative w-full", contentClassName)}>
        {children}
      </div>

      {footer ? (
        <div className='flex flex-wrap items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-[calc(0.5rem*var(--cc-density))] text-[length:calc(var(--cc-font-size)*0.7)] text-[color:var(--cc-muted-foreground)]'>
          {footer}
        </div>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------- legend */

export function ChartLegend({
  items,
  className,
}: {
  items: { label: string; color: string; dashed?: boolean }[];
  className?: string;
}) {
  return (
    <ul
      data-cc-chart-legend=''
      className={cn("flex flex-wrap items-center gap-3", className)}
    >
      {items.map((item) => (
        <li
          key={item.label}
          className='flex items-center gap-1.5 text-[length:calc(var(--cc-font-size)*0.72)] text-[color:var(--cc-muted-foreground)]'
        >
          <span
            aria-hidden='true'
            className={cn(
              "inline-block h-0.5 w-4 rounded-full",
              item.dashed && "opacity-70",
            )}
            style={
              item.dashed
                ? {
                    backgroundImage: `repeating-linear-gradient(90deg, ${item.color} 0 3px, transparent 3px 6px)`,
                  }
                : { backgroundColor: item.color }
            }
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}


/* ---------------------------------------------------------------- sparkline */

function toPath(points: number[], width: number, height: number, pad = 2) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const step = (width - pad * 2) / Math.max(1, points.length - 1);
  return points
    .map((value, index) => {
      const x = pad + index * step;
      const y = height - pad - ((value - min) / span) * (height - pad * 2);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

/** Tiny trend line for KPI cards (no chart engine, dozens per page). */
export function Sparkline({
  points,
  className,
  area = true,
  strokeWidth = 2,
  tone = "auto",
}: {
  points: number[];
  className?: string;
  area?: boolean;
  strokeWidth?: number;
  /**
   * `auto` colours by direction. Use `success` when a falling line is good
   * (churn, waiting time) and `danger` when it is not.
   */
  tone?: "auto" | "primary" | "success" | "danger";
}) {
  const gradientId = `cc-spark-${useId().replace(/:/g, "")}`;
  if (points.length < 2) return null;
  const path = toPath(points, 120, 40);
  const rising = points[points.length - 1] >= points[0];
  const color =
    tone === "auto"
      ? rising
        ? "var(--cc-primary)"
        : "var(--cc-danger)"
      : `var(--cc-${tone})`;

  return (
    <svg
      data-cc-sparkline=''
      viewBox='0 0 120 40'
      preserveAspectRatio='none'
      className={cn("block h-8 w-full overflow-visible", className)}
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor={color} stopOpacity='0.35' />
          <stop offset='100%' stopColor={color} stopOpacity='0' />
        </linearGradient>
      </defs>
      {area ? (
        <path
          d={`${path} L118 40 L2 40 Z`}
          fill={`url(#${gradientId})`}
          stroke='none'
        />
      ) : null}
      <path
        d={path}
        fill='none'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
        style={{ stroke: color }}
        className='sc-chart-draw'
        strokeDasharray='240'
      />
    </svg>
  );
}

/** Compact vertical bars, used in stat cards and mini distributions. */
export function MiniBars({
  points,
  className,
  highlightLast = true,
}: {
  points: number[];
  className?: string;
  highlightLast?: boolean;
}) {
  const max = Math.max(...points) || 1;
  return (
    <div
      data-cc-minibars=''
      className={cn("flex h-8 w-full items-end gap-[2px]", className)}
      aria-hidden='true'
    >
      {points.map((value, index) => {
        const isLast = index === points.length - 1;
        return (
          <span
            key={index}
            className={cn(
              "sc-chart-grow flex-1 rounded-[1px]",
              highlightLast && isLast
                ? "bg-[var(--cc-primary)]"
                : "bg-[color:color-mix(in_srgb,var(--cc-primary)_38%,var(--cc-muted))]",
            )}
            style={{
              height: `${Math.max(8, (value / max) * 100)}%`,
              animationDelay: `${index * 40}ms`,
            }}
          />
        );
      })}
    </div>
  );
}


/* -------------------------------------------------------------------- gauge */

export function RadialGauge({
  value,
  max = 100,
  label,
  hint,
  footnote,
  size = 132,
  thickness = 10,
  tone = "primary",
  className,
}: {
  value: number;
  max?: number;
  /** Big number in the middle; defaults to the percentage. */
  label?: ReactNode;
  /** Small line under the big number. */
  hint?: ReactNode;
  /** Note under the ring. */
  footnote?: ReactNode;
  size?: number;
  thickness?: number;
  tone?: "primary" | "accent" | "success" | "danger";
  className?: string;
}) {
  const safeMax = max <= 0 ? 100 : max;
  const percent = Math.min(100, Math.max(0, (value / safeMax) * 100));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const toneVar = {
    primary: "var(--cc-primary)",
    accent: "var(--cc-accent)",
    success: "var(--cc-success)",
    danger: "var(--cc-danger)",
  }[tone];

  return (
    <div
      data-cc-gauge=''
      className={cn("flex flex-col items-center gap-1", className)}
    >
      <div className='relative' style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className='size-full -rotate-90'
          aria-hidden='true'
          focusable='false'
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='none'
            strokeWidth={thickness}
            style={{ stroke: "var(--cc-muted)" }}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='none'
            strokeWidth={thickness}
            strokeLinecap='round'
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - percent / 100)}
            className='sc-gauge-arc'
            style={{
              stroke: toneVar,
              "--sc-dash": `${circumference}`,
            } as CSSProperties}
          />
        </svg>
        <div className='absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center'>
          <span
            className={cn(
              "text-[length:calc(var(--cc-font-size)*1.25)] font-black text-[color:var(--cc-surface-foreground)]",
              monoType,
              headingType,
            )}
          >
            {label ?? `${Math.round(percent)}%`}
          </span>
          {hint ? (
            <span
              className={cn(
                "max-w-[80%] text-[length:calc(var(--cc-font-size)*0.65)] text-[color:var(--cc-muted-foreground)]",
                labelType,
              )}
            >
              {hint}
            </span>
          ) : null}
        </div>
      </div>
      {footnote ? (
        <span
          className={cn(
            "text-[length:calc(var(--cc-font-size)*0.68)] text-[color:var(--cc-muted-foreground)]",
            labelType,
          )}
        >
          {footnote}
        </span>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ heatmap */

export type HeatmapCell = {
  row: string;
  column: string;
  /** 0..1 intensity. */
  intensity: number;
  /** Optional tooltip label. */
  label?: string;
};

/**
 * Day × hour activity grid. Intensity is mixed into the primary colour so the
 * ramp follows every preset instead of a hard-coded palette.
 */
export function Heatmap({
  rows,
  columns,
  cells,
  className,
  lowLabel = "کم",
  highLabel = "زیاد",
}: {
  rows: string[];
  columns: string[];
  cells: HeatmapCell[];
  className?: string;
  lowLabel?: string;
  highLabel?: string;
}) {
  const lookup = new Map(
    cells.map((cell) => [`${cell.row}|${cell.column}`, cell]),
  );

  return (
    <div data-cc-heatmap='' className={cn("flex flex-col gap-1.5", className)}>
      <div className='flex items-center gap-1 ps-10'>
        {columns.map((column) => (
          <span
            key={column}
            className={`flex-1 text-center ${monoType} text-[length:calc(var(--cc-font-size)*0.58)] text-[color:var(--cc-muted-foreground)]`}
          >
            {column}
          </span>
        ))}
      </div>

      <div className='flex flex-col gap-1'>
        {rows.map((row) => (
          <div key={row} className='flex items-center gap-1'>
            <span
              className={cn(
                "w-9 shrink-0 text-[length:calc(var(--cc-font-size)*0.6)] text-[color:var(--cc-muted-foreground)]",
                labelType,
              )}
            >
              {row}
            </span>
            {columns.map((column, index) => {
              const cell = lookup.get(`${row}|${column}`);
              const intensity = Math.min(1, Math.max(0, cell?.intensity ?? 0));
              return (
                <span
                  key={column}
                  title={cell?.label ?? `${row} · ${column}`}
                  className='sc-heat-cell h-5 flex-1 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:color-mix(in_srgb,var(--cc-border)_45%,transparent)] transition-transform duration-[var(--cc-duration)] hover:scale-110'
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--cc-primary) ${Math.round(intensity * 88) + 4}%, var(--cc-muted))`,
                    animationDelay: `${index * 18}ms`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className='flex items-center justify-end gap-1.5'>
        <span className='text-[length:calc(var(--cc-font-size)*0.6)] text-[color:var(--cc-muted-foreground)]'>
          {lowLabel}
        </span>
        {[0.12, 0.3, 0.5, 0.7, 0.92].map((step) => (
          <span
            key={step}
            aria-hidden='true'
            className='size-3 rounded-[2px] border-[length:var(--cc-border-width)] border-[color:color-mix(in_srgb,var(--cc-border)_45%,transparent)]'
            style={{
              backgroundColor: `color-mix(in srgb, var(--cc-primary) ${Math.round(
                step * 88,
              ) + 4}%, var(--cc-muted))`,
            }}
          />
        ))}
        <span className='text-[length:calc(var(--cc-font-size)*0.6)] text-[color:var(--cc-muted-foreground)]'>
          {highLabel}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- funnel */

export type FunnelStage = {
  label: string;
  value: number;
  note?: string;
};

/** Conversion funnel with step-to-step drop-off. */
export function FunnelChart({
  stages,
  className,
  formatValue = (value) => String(value),
}: {
  stages: FunnelStage[];
  className?: string;
  formatValue?: (value: number) => string;
}) {
  const top = Math.max(...stages.map((stage) => stage.value), 1);

  return (
    <div data-cc-funnel='' className={cn("flex flex-col gap-2", className)}>
      {stages.map((stage, index) => {
        const previous = index === 0 ? stage.value : stages[index - 1].value;
        const drop =
          index === 0 || previous === 0
            ? 0
            : Math.round(((previous - stage.value) / previous) * 100);
        const width = Math.max(14, (stage.value / top) * 100);

        return (
          <div key={stage.label} className='flex flex-col gap-1'>
            <div className='flex items-baseline justify-between gap-2'>
              <span
                className={cn(
                  "text-[length:calc(var(--cc-font-size)*0.72)] text-[color:var(--cc-surface-foreground)]",
                  labelType,
                )}
              >
                {stage.label}
              </span>
              <span className={`flex items-baseline gap-1.5 ${monoType} text-[length:calc(var(--cc-font-size)*0.72)] text-[color:var(--cc-surface-foreground)]`}>
                {formatValue(stage.value)}
                {drop > 0 ? (
                  <span className='text-[color:var(--cc-danger)]'>−{drop}٪</span>
                ) : null}
              </span>
            </div>
            <div
              className='flex h-6 items-center justify-end rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pe-1.5 transition-[width] duration-[var(--cc-duration)]'
              style={{
                width: `${width}%`,
                backgroundColor: `color-mix(in srgb, var(--cc-chart-1) ${
                  92 - index * 16
                }%, var(--cc-muted))`,
              }}
            >
              {stage.note ? (
                <span className={`${monoType} text-[length:calc(var(--cc-font-size)*0.58)] text-[color:var(--cc-surface)] opacity-90`}>
                  {stage.note}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
