"use client";

import {
  createContext,
  useContext,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import {
  defaultCreateComponentTheme,
  themeToCssVars,
  type CreateComponentTheme,
} from "./theme";

const CreateComponentThemeContext = createContext<CreateComponentTheme>(
  defaultCreateComponentTheme,
);

/** Read the resolved theme (useful when a component needs a raw value). */
export function useCreateComponentTheme(): CreateComponentTheme {
  return useContext(CreateComponentThemeContext);
}

export type CreateComponentsThemeProviderProps = {
  /** Partial overrides merged onto `defaultCreateComponentTheme`. */
  theme?: Partial<CreateComponentTheme>;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Scopes a theme to its subtree by writing `--cc-*` custom properties onto a
 * wrapper element. Nest providers to preview several themes side by side.
 */
export function CreateComponentsThemeProvider({
  theme,
  className,
  style,
  children,
}: CreateComponentsThemeProviderProps) {
  const value = useMemo<CreateComponentTheme>(
    () => ({ ...defaultCreateComponentTheme, ...theme }),
    [theme],
  );

  const vars = useMemo(() => themeToCssVars(value), [value]);

  return (
    <CreateComponentThemeContext.Provider value={value}>
      <div
        data-cc-theme=""
        className={cn(
          "text-[color:var(--cc-surface-foreground)] antialiased",
          className,
        )}
        style={{
          ...vars,
          fontFamily: "var(--cc-font-family)",
          fontSize: "var(--cc-font-size)",
          backgroundColor: "var(--cc-background)",
          ...style,
        }}
      >
        {children}
      </div>
    </CreateComponentThemeContext.Provider>
  );
}
