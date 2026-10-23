"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Icon } from "./icon-set";
import { cn } from "@/lib/utils";
import { borderChrome, labelType, motion } from "./styles";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export function Select({
  options,
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  className,
  id,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const current = value !== undefined ? value : internal;

  const selected = useMemo(
    () => options.find((option) => option.value === current),
    [current, options],
  );

  const openList = useCallback(() => {
    const index = options.findIndex((option) => option.value === current);
    setActiveIndex(index >= 0 ? index : 0);
    setOpen(true);
  }, [current, options]);

  const commit = useCallback(
    (next: string) => {
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
      setOpen(false);
    },
    [onValueChange, value],
  );

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const move = (direction: 1 | -1) => {
    setActiveIndex((previous) => {
      if (options.length === 0) return -1;
      let next = previous;
      for (let step = 0; step < options.length; step += 1) {
        next = (next + direction + options.length) % options.length;
        if (!options[next]?.disabled) return next;
      }
      return previous;
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openList();
        return;
      }
      move(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        openList();
        return;
      }
      const option = options[activeIndex] ?? options[0];
      if (option && !option.disabled) commit(option.value);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        data-cc-select-trigger=""
        className={cn(
          "flex w-full items-center justify-between gap-2",
          labelType,
          borderChrome,
          "rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
          "bg-[var(--cc-surface)] text-[color:var(--cc-surface-foreground)]",
          "px-[calc(0.75rem*var(--cc-density))] py-[calc(0.5rem*var(--cc-density))]",
          "text-[length:var(--cc-font-size)]",
          "[box-shadow:var(--cc-shadow)]",
          motion,
          "focus-visible:outline-none focus-visible:ring-[length:var(--cc-focus-ring-width)] focus-visible:ring-[color:var(--cc-ring)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <span
          className={cn(
            "truncate text-left",
            !selected && "text-[color:var(--cc-muted-foreground)]",
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <Icon
          name='chevron-down'
          className={cn(
            "size-4 shrink-0 transition-transform duration-[var(--cc-duration)]",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          data-cc-select-content=""
          className={cn(
            "absolute z-50 mt-1 max-h-60 w-full overflow-auto p-1",
            borderChrome,
            "rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
            "bg-[var(--cc-surface)] [box-shadow:var(--cc-shadow)]",
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === current;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commit(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2",
                    "rounded-[var(--cc-radius-sm)] px-2 py-1.5 text-left",
                    "text-[length:var(--cc-font-size)]",
                    motion,
                    index === activeIndex && "bg-[var(--cc-muted)]",
                    isSelected
                      ? "text-[color:var(--cc-primary)]"
                      : "text-[color:var(--cc-surface-foreground)]",
                    option.disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? (
                    <Icon name='check' className="size-4 shrink-0" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
