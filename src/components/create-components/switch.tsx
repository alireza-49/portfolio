"use client";

import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { borderChrome } from "./styles";

export type SwitchProps = Omit<
  ComponentProps<"button">,
  "onChange" | "value" | "defaultValue"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  ...props
}: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isOn = isControlled ? checked : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      disabled={disabled}
      onClick={toggle}
      data-cc-switch=""
      className={cn(
        "relative inline-flex shrink-0 items-center",
        borderChrome,
        "h-6 w-11 rounded-[var(--cc-radius)]",
        "border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
        "transition-colors duration-[var(--cc-duration)]",
        "focus-visible:outline-none focus-visible:ring-[length:var(--cc-focus-ring-width)] focus-visible:ring-[color:var(--cc-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cc-background)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isOn ? "bg-[var(--cc-primary)]" : "bg-[var(--cc-muted)]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none block size-4 rounded-[var(--cc-radius-sm)] bg-[var(--cc-surface)]",
          "[box-shadow:var(--cc-shadow)]",
          "transition-transform duration-[var(--cc-duration)]",
          isOn ? "translate-x-[calc(100%+0.25rem)]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
