import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 whitespace-nowrap font-medium",
    "rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)]",
    "px-[calc(0.5rem*var(--cc-density))] py-[calc(0.125rem*var(--cc-density))]",
    "text-[length:calc(var(--cc-font-size)*0.75)]",
  ],
  {
    variants: {
      variant: {
        solid:
          "border-transparent bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]",
        soft: "border-transparent bg-[var(--cc-secondary)] text-[color:var(--cc-secondary-foreground)]",
        outline:
          "border-[color:var(--cc-border)] bg-transparent text-[color:var(--cc-surface-foreground)]",
        success:
          "border-transparent bg-[var(--cc-success)] text-[color:var(--cc-success-foreground)]",
        warning:
          "border-transparent bg-[var(--cc-warning)] text-[color:var(--cc-warning-foreground)]",
        danger:
          "border-transparent bg-[var(--cc-danger)] text-[color:var(--cc-danger-foreground)]",
        accent:
          "border-transparent bg-[var(--cc-accent)] text-[color:var(--cc-accent-foreground)]",
      },
    },
    defaultVariants: { variant: "soft" },
  },
);

export type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-cc-badge=""
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
