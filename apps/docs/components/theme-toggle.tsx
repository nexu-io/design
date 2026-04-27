"use client";

import { useEffect, useState } from "react";
import { Button } from "@nexu-design/ui-web";

type Theme = "light" | "dark";

const storageKey = "nexu-docs-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = storedTheme ?? (prefersDark ? "dark" : "light");

    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      window.localStorage.setItem(storageKey, nextTheme);

      return nextTheme;
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-pressed={theme === "dark"}
    >
      {theme === "dark" ? "Light" : "Dark"} mode
    </Button>
  );
}
