import { LocaleProvider, configureOpenExternal } from "@nexu-design/demo-pages";
import { Toaster, TooltipProvider } from "@nexu-design/ui-web";
import { openUrl } from "@tauri-apps/plugin-opener";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

configureOpenExternal(async (url) => {
  try {
    await openUrl(url);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
});

function shouldUseHashRouter() {
  if (typeof window === 'undefined') return false;

  return !['http:', 'https:'].includes(window.location.protocol);
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root not found");
}

const Router = shouldUseHashRouter() ? HashRouter : BrowserRouter;

createRoot(root).render(
  <StrictMode>
    <Router>
      <LocaleProvider>
        <TooltipProvider delayDuration={300} skipDelayDuration={100}>
          <App />
          <Toaster position="top-center" />
        </TooltipProvider>
      </LocaleProvider>
    </Router>
  </StrictMode>,
);
