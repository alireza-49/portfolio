"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Popover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";

export function ToolButton({
  active,
  disabled,
  label,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type='button'
      title={label}
      aria-label={label}
      aria-pressed={Boolean(active)}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-sm border transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "border-coral bg-coral/15 text-coral"
          : "border-indigo-ink/20 bg-paper text-indigo-ink hover:bg-mustard/30",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function ToolDivider() {
  return <span className='mx-0.5 h-6 w-px shrink-0 bg-indigo-ink/15' aria-hidden />;
}

const MenuContext = createContext<{ close: () => void } | null>(null);

export function ToolMenu({
  label,
  icon,
  children,
  align = "start",
  className,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <MenuContext.Provider value={{ close: () => setOpen(false) }}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          className={cn(
            "inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-sm border border-indigo-ink/20 bg-paper px-1.5 text-[10px] font-bold text-indigo-ink transition-colors hover:bg-mustard/30",
            className,
          )}
          aria-label={label}
          title={label}
        >
          {icon}
          <ChevronDown className='size-3 opacity-60' />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner
            side='bottom'
            align={align === "end" ? "end" : "start"}
            sideOffset={4}
            className='z-[120]'
          >
            <Popover.Popup className='min-w-44 rounded-md border-[2px] border-indigo-ink bg-paper p-1.5 shadow-craft-md outline-none'>
              {children}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </MenuContext.Provider>
  );
}

export function MenuItem({
  onClick,
  children,
  active,
  disabled,
  label,
}: {
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  label?: string;
}) {
  const menu = useContext(MenuContext);
  return (
    <button
      type='button'
      disabled={disabled}
      aria-label={label}
      aria-pressed={Boolean(active)}
      onClick={() => {
        onClick();
        menu?.close();
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-start text-[11px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        active ? "bg-coral/15 text-coral" : "text-indigo-ink hover:bg-mustard/30",
      )}
    >
      {children}
    </button>
  );
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <p className='px-2 pb-1 pt-1.5 text-[9px] font-black uppercase tracking-wide text-indigo-light'>
      {children}
    </p>
  );
}
