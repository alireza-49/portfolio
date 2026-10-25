import { cn } from "@/lib/utils";
import { borderChrome, monoType } from "./styles";

export type ProgressProps = {
  value?: number;
  max?: number;
  showValue?: boolean;
  className?: string;
  indicatorClassName?: string;
};

export function Progress({
  value = 0,
  max = 100,
  showValue = false,
  className,
  indicatorClassName,
}: ProgressProps) {
  const safeMax = max <= 0 ? 100 : max;
  const percent = Math.min(100, Math.max(0, (value / safeMax) * 100));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={value}
        data-cc-progress=""
        className={cn(
          "[height:var(--cc-progress-height)] w-full overflow-hidden",
          borderChrome,
          "rounded-[var(--cc-radius)]",
          "border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
          "bg-[var(--cc-muted)]",
        )}
      >
        <div
          className={cn(
            "h-full rounded-[var(--cc-radius)] bg-[var(--cc-primary)]",
            "transition-[width] duration-[var(--cc-duration)]",
            indicatorClassName,
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showValue ? (
        <span className={cn("shrink-0 text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]", monoType)}>
          {Math.round(percent)}%
        </span>
      ) : null}
    </div>
  );
}
