import type { ThemeMode } from "./token-controls";

export const STORYBOOK_THEME_STORAGE_KEY = "nexu-storybook-theme";

export function resolveThemeMode(theme: ThemeMode): "light" | "dark" {
  if (theme === "system") {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return theme;
}

export function persistStorybookTheme(theme: ThemeMode): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORYBOOK_THEME_STORAGE_KEY, theme);
}

export function readPersistedStorybookTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "system";
  }

  const persistedTheme = window.localStorage.getItem(STORYBOOK_THEME_STORAGE_KEY);

  if (persistedTheme === "light" || persistedTheme === "dark" || persistedTheme === "system") {
    return persistedTheme;
  }

  return "system";
}
