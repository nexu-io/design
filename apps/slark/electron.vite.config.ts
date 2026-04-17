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
        "@": resolve(__dirname, "src/renderer/src"),
        "@nexu-design/ui-web/styles.css": resolve(
          __dirname,
          "../../packages/ui-web/src/styles.css",
        ),
        "@nexu-design/ui-web": resolve(__dirname, "../../packages/ui-web/src/index.ts"),
        "@nexu-design/tokens/styles.css": resolve(
          __dirname,
          "../../packages/tokens/src/styles.css",
        ),
        "@nexu-design/tokens": resolve(__dirname, "../../packages/tokens/src/index.ts"),
      },
    },
    plugins: [react(), tailwindcss()],
  },
});
