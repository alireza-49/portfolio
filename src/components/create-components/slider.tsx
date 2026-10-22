"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type SliderProps = Omit<ComponentProps<"input">, "type">;

export function Slider({ className, ...props }: SliderProps) {
  return (
    <input
      type="range"
      data-cc-slider=""
      className={cn(
        "h-2 w-full cursor-pointer appearance-auto",
        "accent-[var(--cc-primary)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
