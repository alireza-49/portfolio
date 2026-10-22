import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { borderChrome, headingType } from "./styles";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-cc-card=""
      className={cn(
        "flex flex-col gap-4",
        borderChrome,
        "rounded-[var(--cc-radius-lg)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
        "bg-[var(--cc-surface)] text-[color:var(--cc-surface-foreground)]",
        "[box-shadow:var(--cc-shadow)]",
        "p-[calc(1.25rem*var(--cc-density))]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-cc-card-header=""
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      data-cc-card-title=""
      className={cn(
        "text-[length:calc(var(--cc-font-size)*1.15)]",
        headingType,
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-cc-card-description=""
      className={cn(
        "text-[length:calc(var(--cc-font-size)*0.9)] text-[color:var(--cc-muted-foreground)]",
        "[line-height:var(--cc-line-height)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-cc-card-content=""
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-cc-card-footer=""
      className={cn(
        "flex items-center gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] [border-top-style:var(--cc-border-style)] pt-[calc(0.75rem*var(--cc-density))]",
        className,
      )}
      {...props}
    />
  );
}
