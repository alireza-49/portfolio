"use client";

import { useState, type ComponentProps } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<
  ComponentProps<"button">,
  "onChange" | "value" | "defaultValue"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  ...props
}: CheckboxProps) {
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
      role="checkbox"
      aria-checked={isOn}
      disabled={disabled}
      onClick={toggle}
      data-cc-checkbox=""
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center",
        "rounded-[var(--cc-radius-sm)]",
        "border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
        "transition-colors duration-[var(--cc-duration)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cc-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cc-background)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isOn
          ? "bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]"
          : "bg-[var(--cc-surface)]",
        className,
      )}
      {...props}
    >
      {isOn ? <Check className="size-3" strokeWidth={3} /> : null}
    </button>
  );
}

export function CheckboxField({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
}: {
  label: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-2.5",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <Checkbox
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="mt-0.5"
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-[length:var(--cc-font-size)] font-medium text-[color:var(--cc-surface-foreground)]">
          {label}
        </span>
        {description ? (
          <span className="text-[length:calc(var(--cc-font-size)*0.85)] text-[color:var(--cc-muted-foreground)]">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
