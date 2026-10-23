"use client";

import { cn } from "@/lib/utils";
import { borderChrome, labelType, monoType, motion } from "./styles";

export type StepperStep = {
  id: string;
  label: string;
  hint?: string;
};

export type StepperProps = {
  steps: StepperStep[];
  /** Zero-based index of the active step. */
  current: number;
  /** When provided, completed steps become clickable. */
  onStepClick?: (index: number) => void;
  className?: string;
};

/**
 * Progress rail for multi-step flows (reservation funnel, checkout, wizard).
 * Completed steps read as filled, the active step shows its number in the
 * brand colour, and upcoming steps stay recessive.
 */
export function Stepper({
  steps,
  current,
  onStepClick,
  className,
}: StepperProps) {
  return (
    <ol
      data-cc-stepper=''
      className={cn("flex w-full items-start gap-1", className)}
    >
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        const clickable = Boolean(onStepClick) && done;

        return (
          <li
            key={step.id}
            aria-current={active ? "step" : undefined}
            className='flex flex-1 flex-col items-center gap-1'
          >
            <div className='flex w-full items-center gap-1'>
              <span
                aria-hidden='true'
                className={cn(
                  "h-[length:var(--cc-border-width)] flex-1",
                  index === 0 ? "opacity-0" : "bg-[var(--cc-border)]",
                  done && "bg-[var(--cc-primary)]",
                )}
              />
              <button
                type='button'
                data-cc-step={step.id}
                data-state={done ? "done" : active ? "active" : "todo"}
                disabled={!clickable}
                onClick={clickable ? () => onStepClick?.(index) : undefined}
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border-[length:var(--cc-border-width)] text-[length:calc(var(--cc-font-size)*0.7)] font-bold",
                  monoType,
                  borderChrome,
                  motion,
                  done || active
                    ? "border-[color:var(--cc-primary)] bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]"
                    : "border-[color:var(--cc-border)] bg-[var(--cc-surface)] text-[color:var(--cc-muted-foreground)]",
                  active && "[box-shadow:var(--cc-shadow)]",
                  clickable
                    ? "cursor-pointer hover:opacity-80"
                    : "cursor-default",
                )}
              >
                {done ? (
                  <svg viewBox='0 0 16 16' className='size-3.5' aria-hidden='true'>
                    <path
                      d='M3.5 8.5l3 3 6-7'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </button>
              <span
                aria-hidden='true'
                className={cn(
                  "h-[length:var(--cc-border-width)] flex-1",
                  index === steps.length - 1 ? "opacity-0" : "bg-[var(--cc-border)]",
                  done && "bg-[var(--cc-primary)]",
                )}
              />
            </div>

            <span
              className={cn(
                "text-center text-[length:calc(var(--cc-font-size)*0.66)]",
                labelType,
                active
                  ? "text-[color:var(--cc-primary)]"
                  : done
                    ? "text-[color:var(--cc-surface-foreground)]"
                    : "text-[color:var(--cc-muted-foreground)]",
              )}
            >
              {step.label}
            </span>
            {step.hint ? (
              <span className={`text-center ${monoType} text-[length:calc(var(--cc-font-size)*0.58)] text-[color:var(--cc-muted-foreground)]`}>
                {step.hint}
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
