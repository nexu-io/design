import { create } from "zustand";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const THEME_STORAGE_KEY = "nexu-theme";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);

  return stored === "light" || stored === "dark" || stored === "system" ? stored : "dark";
};

const getResolvedTheme = (theme: Theme): "light" | "dark" => {
  if (theme !== "system") {
    return theme;
  }

  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light";
};

export const syncDocumentTheme = (theme: Theme): void => {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedTheme = getResolvedTheme(theme);
  const root = document.documentElement;

  root.dataset.theme = theme;
  root.style.colorScheme = resolvedTheme;
  root.classList.toggle("dark", resolvedTheme === "dark");
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    syncDocumentTheme(theme);
    set({ theme });
  },
}));

if (typeof document !== "undefined") {
  syncDocumentTheme(useThemeStore.getState().theme);
}
