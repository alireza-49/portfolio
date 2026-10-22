"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { borderChrome, labelType, motion } from "./styles";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(`${component} must be rendered inside <Tabs>`);
  }
  return context;
}

export type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
};

export function Tabs({
  value,
  defaultValue = "",
  onValueChange,
  className,
  children,
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;

  const context = useMemo<TabsContextValue>(
    () => ({
      value: current,
      setValue: (next) => {
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
      },
    }),
    [current, onValueChange, value],
  );

  return (
    <TabsContext.Provider value={context}>
      <div data-cc-tabs="" className={cn("flex flex-col gap-3", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="tablist"
      data-cc-tabs-list=""
      className={cn(
        "inline-flex items-center gap-1 self-start",
        borderChrome,
        "rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
        "bg-[var(--cc-muted)] p-1",
        className,
      )}
      {...props}
    />
  );
}

export type TabsTriggerProps = ComponentProps<"button"> & { value: string };

export function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const tabs = useTabs("TabsTrigger");
  const isActive = tabs.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => tabs.setValue(value)}
      data-cc-tabs-trigger=""
      className={cn(
        "inline-flex items-center justify-center gap-1.5",
        labelType,
        motion,
        "rounded-[var(--cc-radius-sm)]",
        "px-[calc(0.75rem*var(--cc-density))] py-[calc(0.25rem*var(--cc-density))]",
        "text-[length:calc(var(--cc-font-size)*0.9)]",
        "focus-visible:outline-none focus-visible:ring-[length:var(--cc-focus-ring-width)] focus-visible:ring-[color:var(--cc-ring)]",
        isActive
          ? "bg-[var(--cc-surface)] text-[color:var(--cc-primary)] [box-shadow:var(--cc-shadow)]"
          : "text-[color:var(--cc-muted-foreground)] hover:text-[color:var(--cc-surface-foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export type TabsContentProps = ComponentProps<"div"> & { value: string };

export function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const tabs = useTabs("TabsContent");
  if (tabs.value !== value) return null;

  return (
    <div
      role="tabpanel"
      data-cc-tabs-content=""
      className={cn("text-[length:var(--cc-font-size)]", className)}
      {...props}
    >
      {children}
    </div>
  );
}
