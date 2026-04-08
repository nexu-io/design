import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: resolve(__dirname, "../demo/public"),
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@nexu-design/demo-pages": resolve(__dirname, "../../packages/demo-pages/src/index.ts"),
      "@nexu-design/ui-web": resolve(__dirname, "../../packages/ui-web/src/index.ts"),
      "@nexu-design/ui-web/styles.css": resolve(__dirname, "../../packages/ui-web/src/styles.css"),
      "@nexu-design/tokens": resolve(__dirname, "../../packages/tokens/src/index.ts"),
      "@nexu-design/tokens/styles.css": resolve(__dirname, "../../packages/tokens/src/styles.css"),
    },
  },
  server: { port: 5176 },
});
