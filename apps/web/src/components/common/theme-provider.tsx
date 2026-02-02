"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  attribute = "class", // use "data-theme" if you want named themes without dark class
}: {
  children: React.ReactNode;
  defaultTheme?: "system" | string;
  attribute?: "class" | "data-theme";
}) {
  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      attribute={attribute}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
