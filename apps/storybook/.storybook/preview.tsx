import type React from "react";

import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks";
import type { Preview } from "@storybook/react-vite";

import { darkManagerTheme, lightManagerTheme } from "../src/storybook/storybook-themes";
import {
  persistStorybookTheme,
  readPersistedStorybookTheme,
  resolveThemeMode,
} from "../src/storybook/theme-sync";
import {
  BRAND_PRESET_LABELS,
  RADIUS_PRESET_LABELS,
  applyGlobalTokenState,
} from "../src/storybook/token-controls";

import "../src/styles.css";

function ThemedDocsContainer({ children, ...props }: React.PropsWithChildren<DocsContainerProps>) {
  const resolved = resolveThemeMode(readPersistedStorybookTheme());
  const docsTheme = resolved === "dark" ? darkManagerTheme : lightManagerTheme;

  return (
    <DocsContainer {...props} theme={docsTheme}>
      {children}
    </DocsContainer>
  );
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme mode",
      defaultValue: "system",
      toolbar: {
        icon: "mirror",
        dynamicTitle: true,
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
          { value: "system", title: "System" },
        ],
      },
    },
    brandPreset: {
      name: "Brand",
      description: "Global brand preset",
      defaultValue: "default",
      toolbar: {
        icon: "paintbrush",
        dynamicTitle: true,
        items: Object.entries(BRAND_PRESET_LABELS).map(([value, title]) => ({
          value,
          title,
        })),
      },
    },
    radiusPreset: {
      name: "Radius",
      description: "Global radius preset",
      defaultValue: "default",
      toolbar: {
        icon: "circlehollow",
        dynamicTitle: true,
        items: Object.entries(RADIUS_PRESET_LABELS).map(([value, title]) => ({
          value,
          title,
        })),
      },
    },
  },
  decorators: [
    (Story, context) => {
      applyGlobalTokenState({
        theme: context.globals.theme,
        brandPreset: context.globals.brandPreset,
        radiusPreset: context.globals.radiusPreset,
      });
      persistStorybookTheme(context.globals.theme);

      return Story();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Foundations", "Primitives", "Patterns", "Scenarios"],
      },
    },
    backgrounds: {
      options: {
        light: { name: "Light", value: "hsl(var(--background))" },
        dark: { name: "Dark", value: "hsl(var(--background))" },
      },
    },
    docs: {
      container: ThemedDocsContainer,
    },
    layout: "centered",
  },
  initialGlobals: {
    backgrounds: { value: "light" },
  },
};

export default preview;
