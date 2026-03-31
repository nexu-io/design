import { addons } from "storybook/manager-api";

import { darkManagerTheme, lightManagerTheme } from "../src/storybook/storybook-themes";
import {
  STORYBOOK_THEME_STORAGE_KEY,
  readPersistedStorybookTheme,
  resolveThemeMode,
} from "../src/storybook/theme-sync";

applyManagerTheme(readPersistedStorybookTheme());

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== STORYBOOK_THEME_STORAGE_KEY) {
      return;
    }

    applyManagerTheme(readPersistedStorybookTheme());
  });
}

function applyManagerTheme(theme: "light" | "dark" | "system") {
  addons.setConfig({
    theme: resolveThemeMode(theme) === "dark" ? darkManagerTheme : lightManagerTheme,
  });
}
