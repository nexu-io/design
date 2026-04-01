import path from "node:path";

import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  staticDirs: ["../public"],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  async viteFinal(config) {
    config.plugins = config.plugins ?? [];
    config.plugins.push(tailwindcss());
    config.resolve = config.resolve ?? {};
    config.resolve.alias = [
      {
        find: "@nexu-design/tokens/styles.css",
        replacement: path.resolve(__dirname, "../../../packages/tokens/src/styles.css"),
      },
      {
        find: "@nexu-design/tokens/",
        replacement: `${path.resolve(__dirname, "../../../packages/tokens/src")}/`,
      },
      {
        find: "@nexu-design/tokens",
        replacement: path.resolve(__dirname, "../../../packages/tokens/src/index.ts"),
      },
      {
        find: "@nexu-design/ui-web",
        replacement: path.resolve(__dirname, "../../../packages/ui-web/src/index.ts"),
      },
    ];

    return config;
  },
};

export default config;
