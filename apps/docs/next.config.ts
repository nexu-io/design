import path from "node:path";
import { fileURLToPath } from "node:url";

import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const docsDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(docsDir, "../..");

function toTurbopackAliasTarget(...segments: string[]) {
  return `./${path.relative(docsDir, path.join(workspaceRoot, ...segments)).replaceAll("\\", "/")}`;
}

const webpackSourceAliases = {
  "@nexu-design/tokens$": path.join(workspaceRoot, "packages/tokens/src/index.ts"),
  "@nexu-design/tokens/styles.css": path.join(workspaceRoot, "packages/tokens/src/styles.css"),
  "@nexu-design/ui-web$": path.join(workspaceRoot, "packages/ui-web/src/index.ts"),
  "@nexu-design/ui-web/styles.css": path.join(workspaceRoot, "packages/ui-web/src/styles.css"),
};

const turbopackSourceAliases = {
  "@nexu-design/tokens": toTurbopackAliasTarget("packages/tokens/src/index.ts"),
  "@nexu-design/tokens/styles.css": toTurbopackAliasTarget("packages/tokens/src/styles.css"),
  "@nexu-design/ui-web": toTurbopackAliasTarget("packages/ui-web/src/index.ts"),
  "@nexu-design/ui-web/styles.css": toTurbopackAliasTarget("packages/ui-web/src/styles.css"),
};

const nextConfig: NextConfig = {
  transpilePackages: ["@nexu-design/tokens", "@nexu-design/ui-web"],
  turbopack: {
    resolveAlias: turbopackSourceAliases,
  },
  webpack(config) {
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      ...webpackSourceAliases,
    };

    return config;
  },
};

export default createMDX()(nextConfig);
