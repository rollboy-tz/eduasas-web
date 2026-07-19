"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Hapa hatuweki tena 'if (!mounted) return null' 
  // kwa sababu tunataka NextThemesProvider iweke script yake ya kuzuia flash (injection script)
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}