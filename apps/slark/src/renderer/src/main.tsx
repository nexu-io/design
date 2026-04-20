import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeRoot } from "@nexu-design/ui-web";

import { App } from "@/app/App";
import "@/app/globals.css";
import { syncDocumentTheme, useThemeStore } from "@/stores/theme";

function Root(): React.ReactElement {
  const theme = useThemeStore((state) => state.theme);

  React.useEffect(() => {
    syncDocumentTheme(theme);

    if (theme !== "system" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => syncDocumentTheme("system");

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <ThemeRoot theme={theme} className="contents">
      <App />
    </ThemeRoot>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
