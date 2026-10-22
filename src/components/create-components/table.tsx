import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { bodyType, borderChrome, labelType } from "./styles";

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        data-cc-table=""
        className={cn(
          "w-full border-collapse text-left text-[length:calc(var(--cc-font-size)*0.9)]",
          bodyType,
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      data-cc-table-header=""
      className={cn(
        "border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
        borderChrome,
        "bg-[var(--cc-muted)]",
        className,
      )}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody data-cc-table-body="" className={className} {...props} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-cc-table-row=""
      className={cn(
        "border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] last:border-b-0",
        borderChrome,
        "transition-colors duration-[var(--cc-duration)] hover:bg-[var(--cc-muted)]",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      data-cc-table-head=""
      className={cn(
        "px-[calc(0.75rem*var(--cc-density))] py-[calc(0.5rem*var(--cc-density))]",
        labelType,
        "text-[color:var(--cc-muted-foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      data-cc-table-cell=""
      className={cn(
        "px-[calc(0.75rem*var(--cc-density))] py-[calc(0.5rem*var(--cc-density))]",
        "text-[color:var(--cc-surface-foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({
  className,
  ...props
}: ComponentProps<"caption">) {
  return (
    <caption
      data-cc-table-caption=""
      className={cn(
        "mt-2 text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]",
        className,
      )}
      {...props}
    />
  );
}
