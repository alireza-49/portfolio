import type { ComponentProps, ReactNode } from "react";
import { cn } from "cn";

/**
 * Presentational primitives shared by every console screen.
 *
 * They are deliberately server-safe (no hooks), token-only (paper / ink / coral
 * / mustard / teal) and built from the same hard-edged print language as the
 * public site.
 */

export type Tone = "ink" | "coral" | "teal" | "mustard" | "muted";

export const TONE_PILL: Record<Tone, string> = {
  ink: "border-indigo-ink bg-paper text-indigo-ink",
  coral: "border-coral bg-coral/10 text-coral",
  teal: "border-teal-craft bg-teal-craft/10 text-teal-craft",
  mustard: "border-mustard-deep bg-mustard/25 text-indigo-ink",
  muted: "border-indigo-ink/25 bg-paper-dim text-indigo-light",
};

const TONE_DOT: Record<Tone, string> = {
  ink: "bg-indigo-ink",
  coral: "bg-coral",
  teal: "bg-teal-craft",
  mustard: "bg-mustard-deep",
  muted: "bg-indigo-light",
};

const TONE_BAR: Record<Tone, string> = {
  ink: "bg-indigo-ink",
  coral: "bg-coral",
  teal: "bg-teal-craft",
  mustard: "bg-mustard-deep",
  muted: "bg-indigo-light/60",
};

export function StatusPill({
  tone = "muted",
  dot = true,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-sm border-[1.5px] px-2 py-0.5 text-[11px] leading-5 font-bold whitespace-nowrap",
        TONE_PILL[tone],
        className,
      )}
    >
      {dot ? (
        <span className={cn("size-1.5 shrink-0 rounded-full", TONE_DOT[tone])} />
      ) : null}
      {children}
    </span>
  );
}

export function Panel({
  className,
  children,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-md border-[2px] border-indigo-ink bg-paper-light shadow-craft",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function PanelHeading({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b-[2px] border-dashed border-indigo-ink/20 px-4 py-3 sm:px-5",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow ? (
          <span className="font-mono text-[10px] font-bold tracking-widest text-coral uppercase">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="text-base font-black text-indigo-ink sm:text-lg">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-xs leading-relaxed font-medium text-indigo-light">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b-[2.5px] border-indigo-ink pb-5 md:flex-row md:items-end">
      <div className="flex min-w-0 flex-col gap-2">
        {eyebrow ? (
          <span className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest text-coral uppercase">
            <span className="size-2 rounded-full bg-coral" />
            {eyebrow}
          </span>
        ) : null}
        <h1 className="font-display text-2xl leading-tight font-black text-indigo-ink sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-3xl text-sm leading-relaxed font-medium text-indigo-light">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  unit,
  hint,
  tone = "coral",
  icon,
  progress,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  progress?: number;
}) {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-md border-[2px] border-indigo-ink bg-paper-light p-4 shadow-craft">
      <span
        aria-hidden
        className={cn("absolute inset-y-0 right-0 w-1.5", TONE_BAR[tone])}
      />
      <div className="flex items-start justify-between gap-2 pr-2">
        <span className="text-[11px] font-bold text-indigo-light">{label}</span>
        {icon ? (
          <span className={cn("rounded-sm border px-1 py-0.5", TONE_PILL[tone])}>
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5 pr-2">
        <span className="font-display text-2xl font-black text-indigo-ink">
          {value}
        </span>
        {unit ? (
          <span className="text-[11px] font-bold text-indigo-light">{unit}</span>
        ) : null}
      </div>
      {hint ? (
        <p className="mt-1 pr-2 text-[11px] font-medium text-indigo-light">
          {hint}
        </p>
      ) : null}
      {typeof progress === "number" ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper-shade">
          <div
            className={cn("h-full rounded-full", TONE_BAR[tone])}
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-sm border-[2px] border-dashed border-indigo-ink/30 bg-paper px-6 py-10 text-center",
        className,
      )}
    >
      {icon ? <span className="text-indigo-light">{icon}</span> : null}
      <p className="text-sm font-black text-indigo-ink">{title}</p>
      {description ? (
        <p className="max-w-sm text-xs leading-relaxed font-medium text-indigo-light">
          {description}
        </p>
      ) : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}

/* Shared field styling — inputs keep the ink border and coral focus ring. */
export const FIELD_CLASS =
  "h-auto w-full rounded-sm border-[2px] border-indigo-ink bg-paper px-3 py-2 text-sm font-medium text-indigo-ink placeholder:text-indigo-ink/35 focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/25";

export const TEXTAREA_CLASS =
  "min-h-20 w-full rounded-sm border-[2px] border-indigo-ink bg-paper px-3 py-2 text-sm leading-relaxed font-medium text-indigo-ink placeholder:text-indigo-ink/35 focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/25";

export const LABEL_CLASS = "text-[12px] font-bold text-indigo-ink";

export const BTN_PRIMARY =
  "craft-btn inline-flex h-auto items-center justify-center gap-1.5 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-3.5 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-60";

export const BTN_SECONDARY =
  "craft-btn inline-flex h-auto items-center justify-center gap-1.5 rounded-sm border-[2px] border-indigo-ink bg-paper px-3 py-2 text-xs font-black text-indigo-ink hover:bg-mustard/30 disabled:cursor-not-allowed disabled:opacity-60";

export const BTN_GHOST =
  "inline-flex h-auto items-center justify-center gap-1.5 rounded-sm border border-transparent px-2 py-1 text-xs font-bold text-indigo-ink/80 transition-colors hover:bg-mustard/25 hover:text-indigo-ink disabled:opacity-50";
