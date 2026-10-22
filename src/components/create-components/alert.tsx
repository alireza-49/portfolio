import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { borderChrome, headingType } from "./styles";

export const alertVariants = cva(
  [
    "flex items-start gap-3",
    borderChrome,
    "rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)]",
    "[border-inline-start-width:calc(var(--cc-border-width)+var(--cc-alert-rule-width))]",
    "p-[calc(0.875rem*var(--cc-density))]",
    "text-[length:calc(var(--cc-font-size)*0.9)]",
    "[line-height:var(--cc-line-height)]",
  ],
  {
    variants: {
      variant: {
        info: "border-[color:var(--cc-border)] bg-[var(--cc-muted)] text-[color:var(--cc-surface-foreground)]",
        success:
          "border-[color:var(--cc-success)] bg-[color-mix(in_srgb,var(--cc-success)_12%,transparent)] text-[color:var(--cc-surface-foreground)]",
        warning:
          "border-[color:var(--cc-warning)] bg-[color-mix(in_srgb,var(--cc-warning)_16%,transparent)] text-[color:var(--cc-surface-foreground)]",
        danger:
          "border-[color:var(--cc-danger)] bg-[color-mix(in_srgb,var(--cc-danger)_12%,transparent)] text-[color:var(--cc-surface-foreground)]",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

export type AlertProps = ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    icon?: ReactNode;
    title?: string;
  };

export function Alert({
  className,
  variant,
  icon,
  title,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      data-cc-alert=""
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon ? <span className="mt-0.5 shrink-0">{icon}</span> : null}
      <div className="flex flex-col gap-0.5">
        {title ? (
          <span
            className={cn(
              "text-[color:var(--cc-surface-foreground)]",
              headingType,
            )}
          >
            {title}
          </span>
        ) : null}
        {children ? (
          <span className="text-[color:var(--cc-muted-foreground)]">
            {children}
          </span>
        ) : null}
      </div>
    </div>
  );
}
