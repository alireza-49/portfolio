"use client";

import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { borderChrome, labelType, motion } from "./styles";

export const buttonVariants = cva(
  [
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap",
    labelType,
    borderChrome,
    "rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
    "[box-shadow:var(--cc-shadow)]",
    motion,
    "hover:[box-shadow:var(--cc-shadow-hover)] hover:[translate:var(--cc-hover-translate)] active:[translate:0px]",
    "focus-visible:outline-none focus-visible:ring-[length:var(--cc-focus-ring-width)] focus-visible:ring-[color:var(--cc-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cc-background)]",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        solid:
          "bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)] hover:bg-[var(--cc-primary-hover)]",
        secondary:
          "bg-[var(--cc-secondary)] text-[color:var(--cc-secondary-foreground)] hover:bg-[var(--cc-secondary-hover)]",
        outline:
          "bg-transparent text-[color:var(--cc-surface-foreground)] hover:bg-[var(--cc-muted)]",
        ghost:
          "border-transparent bg-transparent text-[color:var(--cc-surface-foreground)] [box-shadow:none] hover:bg-[var(--cc-muted)]",
        danger:
          "bg-[var(--cc-danger)] text-[color:var(--cc-danger-foreground)] hover:opacity-90",
        success:
          "bg-[var(--cc-success)] text-[color:var(--cc-success-foreground)] hover:opacity-90",
        link: "border-transparent bg-transparent text-[color:var(--cc-primary)] [box-shadow:none] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-[calc(0.75rem*var(--cc-density))] text-[length:calc(var(--cc-font-size)*0.85)]",
        md: "h-10 px-[calc(1rem*var(--cc-density))] text-[length:var(--cc-font-size)]",
        lg: "h-12 px-[calc(1.5rem*var(--cc-density))] text-[length:calc(var(--cc-font-size)*1.1)]",
        icon: "size-10",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
      fullWidth: false,
    },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  fullWidth,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-cc-button=""
      data-cc-variant={variant ?? "solid"}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}
