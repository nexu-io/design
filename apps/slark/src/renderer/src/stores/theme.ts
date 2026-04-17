import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  const stored = localStorage.getItem("slark-theme") as Theme | null;
  const initial: Theme = stored ?? "dark";

  return {
    theme: initial,
    setTheme: (theme) => {
      localStorage.setItem("slark-theme", theme);
      set({ theme });
    },
  };
});
