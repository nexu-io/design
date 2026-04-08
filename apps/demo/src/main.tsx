import { Toaster, TooltipProvider } from "@nexu-design/ui-web";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LocaleProvider } from "./hooks/useLocale";
import "./index.css";
import App from "./App";

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
