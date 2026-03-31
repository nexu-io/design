import * as React from "react";

import { cn } from "../lib/cn";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeRootProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: ThemeMode;
}

export const ThemeRoot = React.forwardRef<HTMLDivElement, ThemeRootProps>(
  ({ theme = "system", className, ...props }, ref) => {
    const resolvedTheme = useResolvedTheme(theme);

    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "bg-background text-foreground transition-colors",
          resolvedTheme === "dark" && "dark",
          className,
        )}
        {...props}
      />
    );
  },
);

ThemeRoot.displayName = "ThemeRoot";

function useResolvedTheme(theme: ThemeMode): "light" | "dark" {
  const getSystemTheme = () => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(() => {
    return theme === "system" ? getSystemTheme() : theme;
  });

  React.useEffect(() => {
    if (theme !== "system") {
      setResolvedTheme(theme);
      return;
    }

    if (typeof window.matchMedia !== "function") {
      setResolvedTheme("light");
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setResolvedTheme(mediaQuery.matches ? "dark" : "light");

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return resolvedTheme;
}
