import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/app/App";
import { useThemeStore } from "@/stores/theme";
import "@/app/globals.css";

function ThemeInit(): null {
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }, [theme]);
  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeInit />
    <App />
  </React.StrictMode>,
);
