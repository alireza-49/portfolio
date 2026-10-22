import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const fieldBase = [
  "w-full",
  "rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
  "bg-[var(--cc-surface)] text-[color:var(--cc-surface-foreground)]",
  "px-[calc(0.75rem*var(--cc-density))] py-[calc(0.5rem*var(--cc-density))]",
  "text-[length:var(--cc-font-size)]",
  "placeholder:text-[color:var(--cc-muted-foreground)]",
  "[box-shadow:var(--cc-shadow)]",
  "transition-colors duration-[var(--cc-duration)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cc-ring)]",
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
      className={cn(fieldBase, "resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      data-cc-label=""
      className={cn(
        "text-[length:calc(var(--cc-font-size)*0.9)] font-medium text-[color:var(--cc-surface-foreground)]",
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
