"use client";

import {
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type RadioGroupContextValue = {
  value: string;
  setValue: (value: string) => void;
  name: string;
  disabled: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroup(component: string) {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error(`${component} must be rendered inside <RadioGroup>`);
  }
  return context;
}

export type RadioGroupProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export function RadioGroup({
  value,
  defaultValue = "",
  onValueChange,
  disabled = false,
  className,
  children,
}: RadioGroupProps) {
  const [internal, setInternal] = useState(defaultValue);
  const name = useId();
  const current = value !== undefined ? value : internal;

  const context = useMemo<RadioGroupContextValue>(
    () => ({
      value: current,
      name,
      disabled,
      setValue: (next) => {
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
      },
    }),
    [current, disabled, name, onValueChange, value],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <div
        role="radiogroup"
        data-cc-radio-group=""
        className={cn("flex flex-col gap-2", className)}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupItemProps = Omit<ComponentProps<"button">, "value"> & {
  value: string;
};

export function RadioGroupItem({
  value,
  className,
  disabled,
  ...props
}: RadioGroupItemProps) {
  const group = useRadioGroup("RadioGroupItem");
  const isChecked = group.value === value;
  const isDisabled = disabled || group.disabled;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isChecked}
      disabled={isDisabled}
      onClick={() => group.setValue(value)}
      data-cc-radio=""
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-full",
        "border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
        "transition-colors duration-[var(--cc-duration)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cc-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cc-background)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isChecked ? "border-[color:var(--cc-primary)]" : "bg-[var(--cc-surface)]",
        className,
      )}
      {...props}
    >
      {isChecked ? (
        <span className="block size-2 rounded-full bg-[var(--cc-primary)]" />
      ) : null}
    </button>
  );
}

export function RadioGroupField({
  value,
  label,
  description,
  disabled,
}: {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  const group = useRadioGroup("RadioGroupField");
  const isChecked = group.value === value;

  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-2.5",
        (disabled || group.disabled) && "cursor-not-allowed opacity-50",
      )}
    >
      <RadioGroupItem value={value} disabled={disabled} className="mt-0.5" />
      <span className="flex flex-col gap-0.5">
        <span
          className={cn(
            "text-[length:var(--cc-font-size)]",
            isChecked
              ? "font-medium text-[color:var(--cc-primary)]"
              : "text-[color:var(--cc-surface-foreground)]",
          )}
        >
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
