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
    },
  },
  server: { port: 5175 },
});
