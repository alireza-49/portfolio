import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { borderChrome, labelType, motion } from "./styles";

const fieldBase = [
  "w-full",
  borderChrome,
  "rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
  "bg-[var(--cc-surface)] text-[color:var(--cc-surface-foreground)]",
  "px-[calc(0.75rem*var(--cc-density))] py-[calc(0.5rem*var(--cc-density))]",
  "text-[length:var(--cc-font-size)]",
  "[font-weight:var(--cc-font-weight)] [line-height:var(--cc-line-height)]",
  "placeholder:text-[color:var(--cc-muted-foreground)]",
  "[box-shadow:var(--cc-shadow)]",
  motion,
  "focus-visible:outline-none focus-visible:ring-[length:var(--cc-focus-ring-width)] focus-visible:ring-[color:var(--cc-ring)]",
  "disabled:cursor-not-allowed disabled:opacity-50",
];

export function Input({
  className,
  type = "text",
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-cc-input=""
      className={cn(fieldBase, className)}
      {...props}
    />
  );
}

export function Textarea({
  className,
  rows = 3,
  ...props
}: ComponentProps<"textarea">) {
  return (
    <textarea
      rows={rows}
      data-cc-textarea=""
      className={cn(fieldBase, "resize-y", className)}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      data-cc-label=""
      className={cn(
        "text-[length:calc(var(--cc-font-size)*0.9)]",
        labelType,
        "text-[color:var(--cc-surface-foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  className,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? (
        <span className="text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
