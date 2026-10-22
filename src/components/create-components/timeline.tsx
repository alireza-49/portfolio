import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { labelType } from "./styles";

export type TimelineTone = "primary" | "success" | "warning" | "danger" | "muted";

const dotTone: Record<TimelineTone, string> = {
  primary: "bg-[var(--cc-primary)]",
  success: "bg-[var(--cc-success)]",
  warning: "bg-[var(--cc-warning)]",
  danger: "bg-[var(--cc-danger)]",
  muted: "bg-[var(--cc-border)]",
};

/** Vertical activity rail. */
export function Timeline({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ol
      data-cc-timeline=''
      className={cn("relative flex flex-col gap-3 ps-4", className)}
    >
      <span
        aria-hidden='true'
        className='absolute inset-y-1 start-[5px] w-px bg-[var(--cc-border)]'
      />
      {children}
    </ol>
  );
}

export function TimelineItem({
  title,
  description,
  meta,
  tone = "primary",
  icon,
}: {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  tone?: TimelineTone;
  icon?: ReactNode;
}) {
  return (
    <li data-cc-timeline-item='' className='relative flex flex-col gap-0.5'>
      <span
        aria-hidden='true'
        className={cn(
          "absolute -start-4 top-1 size-2.5 rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-surface)]",
          dotTone[tone],
        )}
      />
      <div className='flex flex-wrap items-baseline justify-between gap-2'>
        <span className='flex items-center gap-1 text-[length:calc(var(--cc-font-size)*0.78)] font-bold text-[color:var(--cc-surface-foreground)]'>
          {icon}
          {title}
        </span>
        {meta ? (
          <span
            className={cn(
              "font-mono text-[length:calc(var(--cc-font-size)*0.62)] text-[color:var(--cc-muted-foreground)]",
              labelType,
            )}
          >
            {meta}
          </span>
        ) : null}
      </div>
      {description ? (
        <span className='text-[length:calc(var(--cc-font-size)*0.7)] text-[color:var(--cc-muted-foreground)]'>
          {description}
        </span>
      ) : null}
    </li>
  );
}
