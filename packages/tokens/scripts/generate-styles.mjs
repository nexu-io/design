import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const sourcePath = resolve(import.meta.dirname, "../src/token-source.json");
const outputPath = resolve(import.meta.dirname, "../src/styles.css");

const tokenSource = JSON.parse(readFileSync(sourcePath, "utf8"));

const themeMappings = [
  ["--background", "--color-background"],
  ["--foreground", "--color-foreground"],
  ["--card", "--color-card"],
  ["--card-foreground", "--color-card-foreground"],
  ["--popover", "--color-popover"],
  ["--popover-foreground", "--color-popover-foreground"],
  ["--primary", "--color-primary"],
  ["--primary-foreground", "--color-primary-foreground"],
  ["--secondary", "--color-secondary"],
  ["--secondary-foreground", "--color-secondary-foreground"],
  ["--muted", "--color-muted"],
  ["--muted-foreground", "--color-muted-foreground"],
  ["--accent", "--color-accent"],
  ["--accent-foreground", "--color-accent-foreground"],
  ["--destructive", "--color-destructive"],
  ["--destructive-foreground", "--color-destructive-foreground"],
  ["--success", "--color-success"],
  ["--success-foreground", "--color-success-foreground"],
  ["--warning", "--color-warning"],
  ["--warning-foreground", "--color-warning-foreground"],
  ["--border", "--color-border"],
  ["--input", "--color-input"],
  ["--ring", "--color-ring"],
  ["--radius-xs", "--radius-xs"],
  ["--radius-sm", "--radius-sm"],
  ["--radius-md", "--radius-md"],
  ["--radius-lg", "--radius-lg"],
  ["--radius-xl", "--radius-xl"],
];

const generated = `${banner()}${renderBlock(":root", tokenSource.themes.light)}

${renderBlock(".dark", tokenSource.themes.dark)}

${renderThemeMappings(themeMappings)}

@layer base {
  * {
    @apply border-border;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  }
}
`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, generated);

function banner() {
  return "/* This file is generated from src/token-source.json. Do not edit by hand. */\n\n";
}

function renderBlock(selector, variables) {
  const lines = Object.entries(variables).map(([name, value]) => `  ${name}: ${value};`);

  return `${selector} {\n${lines.join("\n")}\n}`;
}

function renderThemeMappings(mappings) {
  const lines = mappings.map(([sourceVar, themeVar]) => {
    const isColor = themeVar.startsWith("--color-");
    return `  ${themeVar}: ${isColor ? `hsl(var(${sourceVar}))` : `var(${sourceVar})`};`;
  });

  return `@theme inline {\n${lines.join("\n")}\n}`;
}
