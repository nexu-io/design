import type { Preview } from "@storybook/react-vite";

import {
  BRAND_PRESET_LABELS,
  RADIUS_PRESET_LABELS,
  applyGlobalTokenState,
} from "../src/storybook/token-controls";

import "../src/styles.css";

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
    layout: "centered",
  },
};

export default preview;
