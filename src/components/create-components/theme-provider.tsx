"use client";

import {
  createContext,
  useContext,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { resolveTheme, type ThemedProps } from "./style-presets";
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

export type CreateComponentsThemeProviderProps = ThemedProps & {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Scopes a theme to its subtree by writing `--cc-*` custom properties onto a
 * wrapper element. Nest providers to preview several styles side by side.
 *
 * ```tsx
 * <CreateComponentsThemeProvider preset="riso">
 *   <Alert title="Saved">Your changes are live.</Alert>
 * </CreateComponentsThemeProvider>
 * ```
 *
 * Individual components can still override the provider with their own
 * `preset` / `theme` props.
 */
export function CreateComponentsThemeProvider({
  preset = "modern",
  theme,
  className,
  style,
  children,
}: CreateComponentsThemeProviderProps) {
  const value = useMemo<CreateComponentTheme>(
    () => resolveTheme(preset, theme),
    [preset, theme],
  );

  const vars = useMemo(() => themeToCssVars(value), [value]);

  return (
    <CreateComponentThemeContext.Provider value={value}>
      <div
        data-cc-theme=""
        data-cc-style={value.style}
        className={cn(
          "font-[family-name:var(--cc-font-family)] text-[color:var(--cc-surface-foreground)] antialiased",
          className,
        )}
        style={{
          ...vars,
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

/** Alias for the shorter naming used across the rest of the library. */
export const CreateThemeProvider = CreateComponentsThemeProvider;
export type CreateThemeProviderProps = CreateComponentsThemeProviderProps;

/** Alias for the shorter naming used across the rest of the library. */
export const useCreateTheme = useCreateComponentTheme;
