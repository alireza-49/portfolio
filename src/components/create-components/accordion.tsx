"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { borderChrome, labelType, motion } from "./styles";

type AccordionContextValue = {
  openValues: string[];
  toggle: (value: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

type AccordionItemContextValue = {
  value: string;
  open: boolean;
};

const AccordionItemContext =
  createContext<AccordionItemContextValue | null>(null);

function useAccordion(component: string) {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(`${component} must be rendered inside <Accordion>`);
  }
  return context;
}

function useAccordionItem(component: string) {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error(`${component} must be rendered inside <AccordionItem>`);
  }
  return context;
}

export type AccordionProps = {
  type?: "single" | "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  className?: string;
  children: ReactNode;
};

export function Accordion({
  type = "single",
  value,
  defaultValue = [],
  onValueChange,
  className,
  children,
}: AccordionProps) {
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const openValues = value ?? internal;

  const context = useMemo<AccordionContextValue>(
    () => ({
      openValues,
      toggle: (next) => {
        const isOpen = openValues.includes(next);
        let updated: string[];

        if (type === "single") {
          updated = isOpen ? [] : [next];
        } else {
          updated = isOpen
            ? openValues.filter((item) => item !== next)
            : [...openValues, next];
        }

        if (value === undefined) setInternal(updated);
        onValueChange?.(updated);
      },
    }),
    [onValueChange, openValues, type, value],
  );

  return (
    <AccordionContext.Provider value={context}>
      <div
        data-cc-accordion=""
        className={cn(
          "flex flex-col overflow-hidden",
          borderChrome,
          "rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
          "bg-[var(--cc-surface)] [box-shadow:var(--cc-shadow)]",
          className,
        )}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export type AccordionItemProps = ComponentProps<"div"> & { value: string };

export function AccordionItem({
  value,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const accordion = useAccordion("AccordionItem");
  const open = accordion.openValues.includes(value);

  const context = useMemo<AccordionItemContextValue>(
    () => ({ value, open }),
    [open, value],
  );

  return (
    <AccordionItemContext.Provider value={context}>
      <div
        data-cc-accordion-item=""
        className={cn(
          "border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] last:border-b-0",
          borderChrome,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<"button">) {
  const accordion = useAccordion("AccordionTrigger");
  const item = useAccordionItem("AccordionTrigger");

  return (
    <button
      type="button"
      aria-expanded={item.open}
      onClick={() => accordion.toggle(item.value)}
      data-cc-accordion-trigger=""
      className={cn(
        "flex w-full items-center justify-between gap-2",
        labelType,
        motion,
        "px-[calc(0.875rem*var(--cc-density))] py-[calc(0.625rem*var(--cc-density))]",
        "text-left text-[length:var(--cc-font-size)]",
        "text-[color:var(--cc-surface-foreground)]",
        "hover:bg-[var(--cc-muted)]",
        "focus-visible:outline-none focus-visible:ring-[length:var(--cc-focus-ring-width)] focus-visible:ring-[color:var(--cc-ring)] focus-visible:ring-inset",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "size-4 shrink-0 text-[color:var(--cc-muted-foreground)] transition-transform duration-[var(--cc-duration)]",
          item.open && "rotate-180",
        )}
      />
    </button>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  const item = useAccordionItem("AccordionContent");
  if (!item.open) return null;

  return (
    <div
      data-cc-accordion-content=""
      className={cn(
        "px-[calc(0.875rem*var(--cc-density))] pb-[calc(0.75rem*var(--cc-density))]",
        "text-[length:calc(var(--cc-font-size)*0.9)] text-[color:var(--cc-muted-foreground)]",
        "[line-height:var(--cc-line-height)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
