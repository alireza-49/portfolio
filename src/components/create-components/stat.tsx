import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { borderChrome, headingType, labelType, monoType, motion } from "./styles";

export type StatDelta = {
  value: string;
  direction?: "up" | "down" | "flat";
};

export type StatProps = {
  label: string;
  value: ReactNode;
  /** e.g. `+۱۲٪` plus a direction so the tone is automatic. */
  delta?: StatDelta;
  hint?: ReactNode;
  icon?: ReactNode;
  /** Slot under the value — usually `<Sparkline />` or `<MiniBars />`. */
  children?: ReactNode;
  className?: string;
};

/**
 * KPI tile used by dashboards and summaries: label, big figure, delta chip and
 * an optional mini chart. Direction drives the colour, so "down is good"
 * metrics can override it via `delta.direction`.
 */
export function Stat({
  label,
  value,
  delta,
  hint,
  icon,
  children,
  className,
}: StatProps) {
  const direction = delta?.direction ?? "up";
  const deltaTone =
    direction === "up"
      ? "bg-[var(--cc-success)] text-[color:var(--cc-success-foreground)]"
      : direction === "down"
        ? "bg-[var(--cc-danger)] text-[color:var(--cc-danger-foreground)]"
        : "bg-[var(--cc-muted)] text-[color:var(--cc-muted-foreground)]";

  return (
    <div
      data-cc-stat=''
      className={cn(
        "flex flex-col gap-1.5 bg-[var(--cc-surface)] p-[calc(0.75rem*var(--cc-density))]",
        "rounded-[var(--cc-card-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
        borderChrome,
        "[background-image:var(--cc-surface-pattern)] [background-size:var(--cc-surface-pattern-size)]",
        "[box-shadow:var(--cc-shadow)]",
        motion,
        className,
      )}
    >
      <div className='flex items-start justify-between gap-2'>
        <span
          className={cn(
            "text-[length:calc(var(--cc-font-size)*0.72)] text-[color:var(--cc-muted-foreground)]",
            labelType,
          )}
        >
          {label}
        </span>
        {icon ? (
          <span className='flex size-6 shrink-0 items-center justify-center rounded-[var(--cc-radius-sm)] bg-[var(--cc-muted)] text-[color:var(--cc-primary)]'>
            {icon}
          </span>
        ) : null}
      </div>

      <div className='flex flex-wrap items-baseline gap-2'>
        <span
          className={cn(
            "text-[length:calc(var(--cc-font-size)*1.35)] font-black text-[color:var(--cc-surface-foreground)]",
            monoType,
            headingType,
          )}
        >
          {value}
        </span>
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-[var(--cc-badge-radius)] px-1.5 py-0.5 text-[length:calc(var(--cc-font-size)*0.62)] font-bold",
              monoType,
              deltaTone,
            )}
          >
            {direction === "up" ? "▲" : direction === "down" ? "▼" : "■"}
            {delta.value}
          </span>
        ) : null}
      </div>

      {children ? <div className='pt-0.5'>{children}</div> : null}

      {hint ? (
        <span className='text-[length:calc(var(--cc-font-size)*0.64)] text-[color:var(--cc-muted-foreground)]'>
          {hint}
        </span>
      ) : null}
    </div>
  );
}
