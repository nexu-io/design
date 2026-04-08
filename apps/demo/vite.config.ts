import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { type Plugin, defineConfig } from "vite";

/** Prints Nexu Digital URLs; avoids guessing port when multiple Vite instances run. */
function nexuDemoEntryHint(): Plugin {
  return {
    name: "nexu-demo-entry-hint",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        const addr = server.httpServer?.address();
        const port = typeof addr === "object" && addr !== null && "port" in addr ? addr.port : 5175;
        console.log(
          `\n  \x1b[96mNexu Digital — open in browser\x1b[0m\n    http://127.0.0.1:${port}/nexu/welcome\n    http://127.0.0.1:${port}/nexu\n  (If startup fails with “port in use”, close other Vite/Storybook on 5175 or run: lsof -i :5175)\n`,
        );
      });
    },
  };
}

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
  plugins: [react(), tailwindcss(), copyChangelog(), nexuDemoEntryHint()],
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
  server: {
    port: 5175,
    /** Expose LAN URL; use 127.0.0.1 in browser if localhost misbehaves */
    host: true,
    /** Must stay on 5175: matches Tauri devUrl; silent port drift caused “wrong port / can’t open” */
    strictPort: true,
  },
});
