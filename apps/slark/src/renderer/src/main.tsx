import { App } from "@/app/App";
import { useThemeStore } from "@/stores/theme";
import { ThemeRoot } from "@nexu-design/ui-web";
import React from "react";
import ReactDOM from "react-dom/client";
import "@/app/globals.css";

function Root(): React.ReactElement {
  const theme = useThemeStore((s) => s.theme);

  return (
    <ThemeRoot theme={theme} className="min-h-screen">
      <App />
    </ThemeRoot>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Slark renderer root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
