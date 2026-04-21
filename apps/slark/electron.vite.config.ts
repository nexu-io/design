import { resolve } from "node:path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@": resolve("src/renderer/src"),
        // Point ui-web at its source during dev so edits to primitives/patterns
        // reflect instantly via HMR, and so the classes Tailwind scans in
        // packages/ui-web/src/**/*.{ts,tsx} are the same ones actually rendered
        // at runtime. Without this the renderer consumes the stale dist bundle
        // (see packages/ui-web/package.json "main": "./dist/index.js") and any
        // new utility classes in a primitive silently never reach the DOM,
        // even though Tailwind still generates CSS for them. Storybook already
        // does the same remap in apps/storybook/.storybook/main.ts.
        "@nexu-design/ui-web": resolve(__dirname, "../../packages/ui-web/src/index.ts"),
      },
    },
    plugins: [react(), tailwindcss()],
  },
});
