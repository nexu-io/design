import { LocaleProvider, configureOpenExternal } from "@nexu-design/demo-pages";
import { Toaster, TooltipProvider } from "@nexu-design/ui-web";
import { openUrl } from "@tauri-apps/plugin-opener";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

configureOpenExternal(async (url) => {
  try {
    await openUrl(url);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
});

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root not found");
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <LocaleProvider>
        <TooltipProvider delayDuration={300} skipDelayDuration={100}>
          <App />
          <Toaster position="top-center" />
        </TooltipProvider>
      </LocaleProvider>
    </BrowserRouter>
  </StrictMode>,
);
