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
  ["--link", "--color-link"],
  ["--error", "--color-error"],
  ["--error-foreground", "--color-error-foreground"],
  ["--info", "--color-info"],
  ["--info-foreground", "--color-info-foreground"],
  ["--color-surface-0", "--color-surface-0", "direct"],
  ["--color-surface-1", "--color-surface-1", "direct"],
  ["--color-surface-2", "--color-surface-2", "direct"],
  ["--color-surface-3", "--color-surface-3", "direct"],
  ["--color-surface-4", "--color-surface-4", "direct"],
  ["--color-text-primary", "--color-text-primary", "direct"],
  ["--color-text-secondary", "--color-text-secondary", "direct"],
  ["--color-text-muted", "--color-text-muted", "direct"],
  ["--color-brand-primary", "--color-brand-primary", "direct"],
  ["--color-brand-subtle", "--color-brand-subtle", "direct"],
  ["--color-accent-fg", "--color-accent-fg", "direct"],
  ["--color-accent-hover", "--color-accent-hover", "direct"],
  ["--color-error-subtle", "--color-error-subtle", "direct"],
  ["--color-success-subtle", "--color-success-subtle", "direct"],
  ["--color-warning-subtle", "--color-warning-subtle", "direct"],
  ["--color-info-subtle", "--color-info-subtle", "direct"],
  ["--color-border-subtle", "--color-border-subtle", "direct"],
  ["--color-border-strong", "--color-border-strong", "direct"],
  ["--color-border-hover", "--color-border-hover", "direct"],
  ["--color-border-card", "--color-border-card", "direct"],
  ["--color-text-heading", "--color-text-heading", "direct"],
  ["--color-text-tertiary", "--color-text-tertiary", "direct"],
  ["--color-text-placeholder", "--color-text-placeholder", "direct"],
  ["--color-text-disabled", "--color-text-disabled", "direct"],
  ["--color-dark-bg", "--color-dark-bg", "direct"],
  ["--color-dark-surface", "--color-dark-surface", "direct"],
  ["--color-dark-surface-hover", "--color-dark-surface-hover", "direct"],
  ["--color-dark-border", "--color-dark-border", "direct"],
  ["--color-accent-subtle", "--color-accent-subtle", "direct"],
  ["--color-accent-glow", "--color-accent-glow", "direct"],
  ["--font-sans", "--font-sans"],
  ["--font-mono", "--font-mono"],
  ["--font-heading", "--font-heading"],
  ["--spacing", "--spacing"],
  ["--radius-sm", "--radius-sm"],
  ["--radius-md", "--radius-md"],
  ["--radius-lg", "--radius-lg"],
  ["--radius-xl", "--radius-xl"],
  ["--radius-2xl", "--radius-2xl"],
  ["--radius-pill", "--radius-pill"],
  ["--shadow-xs", "--shadow-xs"],
  ["--shadow-sm", "--shadow-sm"],
  ["--shadow-md", "--shadow-md"],
  ["--shadow-lg", "--shadow-lg"],
  ["--shadow-xl", "--shadow-xl"],
  ["--shadow-rest", "--shadow-rest"],
  ["--shadow-card", "--shadow-card"],
  ["--shadow-dropdown", "--shadow-dropdown"],
  ["--shadow-focus", "--shadow-focus"],
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
    font-family: var(--font-sans, Inter, ui-sans-serif, system-ui, sans-serif);
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
  const lines = mappings.map(([sourceVar, themeVar, mode]) => {
    if (mode === "direct") {
      return `  ${themeVar}: var(${sourceVar});`;
    }
    const isColor = themeVar.startsWith("--color-");
    return `  ${themeVar}: ${isColor ? `hsl(var(${sourceVar}))` : `var(${sourceVar})`};`;
  });

  return `@theme inline {\n${lines.join("\n")}\n}`;
}
