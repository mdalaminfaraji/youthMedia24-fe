"use client";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useMemo, useState, ReactNode } from "react";
import { lightTheme, darkTheme } from "@/lib/theme";

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const muiTheme = useMemo(() => {
    const mode = theme === "system" ? systemTheme : theme;
    return mode === "dark" ? darkTheme : lightTheme;
  }, [theme, systemTheme]);

  if (!mounted) return null;

  return (
    <NextThemeProvider attribute="class" defaultTheme="system">
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </NextThemeProvider>
  );
}
