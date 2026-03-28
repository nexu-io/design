import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function copyChangelog() {
  const src = resolve(__dirname, "../clone/artifacts/changelog/changelog.json");
  const destDir = resolve(__dirname, "public");
  const dest = resolve(destDir, "changelog.json");
  return {
    name: "copy-changelog",
    buildStart() {
      if (existsSync(src)) {
        mkdirSync(destDir, { recursive: true });
        copyFileSync(src, dest);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyChangelog()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@nexu-design/ui-web": resolve(__dirname, "../../packages/ui-web/src/index.ts"),
      "@nexu-design/ui-web/styles.css": resolve(__dirname, "../../packages/ui-web/src/styles.css"),
      "@nexu-design/tokens": resolve(__dirname, "../../packages/tokens/src/index.ts"),
      "@nexu-design/tokens/styles.css": resolve(__dirname, "../../packages/tokens/src/styles.css"),
    },
  },
  server: { port: 5175 },
});
