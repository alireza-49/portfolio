import { cn } from "@/lib/utils";

export type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
};

export function Separator({
  orientation = "horizontal",
  label,
  className,
}: SeparatorProps) {
  if (orientation === "vertical") {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        data-cc-separator=""
        className={cn(
          "inline-block w-[length:var(--cc-border-width)] self-stretch bg-[var(--cc-border)]",
          className,
        )}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        data-cc-separator=""
        className={cn("flex items-center gap-3", className)}
      >
        <span className="h-[length:var(--cc-border-width)] flex-1 bg-[var(--cc-border)]" />
        <span className="text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]">
          {label}
        </span>
        <span className="h-[length:var(--cc-border-width)] flex-1 bg-[var(--cc-border)]" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      data-cc-separator=""
      className={cn(
        "h-[length:var(--cc-border-width)] w-full bg-[var(--cc-border)]",
        className,
      )}
    />
  );
}
