"use client";

import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { borderChrome } from "./styles";

/** Compact (`sm`) fits toolbar rows; `md` is the standalone control. */
export type SwitchSize = "sm" | "md";

/**
 * Track and knob metrics.
 *
 * The knob is positioned with logical `start-*`, so the site's RTL direction
 * mirrors the control instead of sliding the thumb out of the track (a physical
 * `translate-x` moved it further right, i.e. outside the pill). `100%` resolves
 * against the track's padding box, so `calc()` keeps the 2px gap at both ends
 * whatever border width the preset asks for.
 */
const SIZES: Record<
  SwitchSize,
  { track: string; knob: string; off: string; on: string }
> = {
  sm: {
    track: "h-5 w-9",
    knob: "size-3",
    off: "start-0.5",
    on: "start-[calc(100%-0.875rem)]",
  },
  md: {
    track: "h-6 w-11",
    knob: "size-4",
    off: "start-0.5",
    on: "start-[calc(100%-1.125rem)]",
  },
};

export type SwitchProps = Omit<
  ComponentProps<"button">,
  "onChange" | "value" | "defaultValue" | "size"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: SwitchSize;
};

export function Switch({
  className,
  size = "md",
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

  const metrics = SIZES[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      disabled={disabled}
      onClick={toggle}
      data-cc-switch=""
      data-cc-switch-size={size}
      className={cn(
        "relative inline-flex shrink-0 items-center",
        borderChrome,
        metrics.track,
        "rounded-[var(--cc-radius)]",
        "border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
        "transition-colors duration-[var(--cc-duration)]",
        "focus-visible:outline-none focus-visible:ring-[length:var(--cc-focus-ring-width)] focus-visible:ring-[color:var(--cc-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cc-background)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isOn ? "bg-[var(--cc-primary)]" : "bg-[var(--cc-muted)]",
        className,
      )}
      {...props}
    >
      {/*
        A hairline ring instead of `--cc-shadow`: the elevation tokens use hard
        offsets (nova 3px, manga 4px), which would stick out of a 16px thumb.
        The ring keeps the knob readable on presets where surface and muted are
        both near-white (swiss, editorial) without hardcoding a colour.
      */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 block -translate-y-1/2",
          "rounded-[var(--cc-radius-sm)]",
          "bg-[var(--cc-surface)] ring-1 ring-[color:var(--cc-border)]",
          "transition-[inset-inline-start] duration-[var(--cc-duration)]",
          metrics.knob,
          isOn ? metrics.on : metrics.off,
        )}
      />
    </button>
  );
}
