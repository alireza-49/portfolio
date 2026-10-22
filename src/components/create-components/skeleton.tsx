import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-cc-skeleton=""
      className={cn(
        "animate-pulse rounded-[var(--cc-radius)] bg-[var(--cc-muted)]",
        className,
      )}
      {...props}
    />
  );
}
