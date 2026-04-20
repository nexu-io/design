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
  ["--color-danger", "--color-danger", "direct"],
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
  ["--color-danger-subtle", "--color-danger-subtle", "direct"],
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
  ["--font-script", "--font-script"],
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
  ["--shadow-refine", "--shadow-refine"],
  ["--shadow-elevated", "--shadow-elevated"],
  ["--shadow-overlay", "--shadow-overlay"],
  ["--text-size-2xs", "--text-2xs"],
  ["--text-size-xs", "--text-xs"],
  ["--text-size-sm", "--text-sm"],
  ["--text-size-base", "--text-base"],
  ["--text-size-lg", "--text-lg"],
  ["--text-size-xl", "--text-xl"],
  ["--text-size-2xl", "--text-2xl"],
  ["--text-size-3xl", "--text-3xl"],
  ["--text-size-4xl", "--text-4xl"],
  ["--text-weight-normal", "--font-weight-normal"],
  ["--text-weight-medium", "--font-weight-medium"],
  ["--text-weight-semibold", "--font-weight-semibold"],
  ["--text-weight-bold", "--font-weight-bold"],
];

const generated = `${banner()}${renderFontFaces()}

${renderBlock(":root", tokenSource.themes.light)}

${renderBlock(".dark", tokenSource.themes.dark)}

${renderThemeMappings(themeMappings, tokenSource.metadata.fontSizes)}

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

@layer utilities {
  .font-script {
    font-family: var(--font-script, cursive);
  }
}
`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, generated);

function banner() {
  return "/* This file is generated from src/token-source.json. Do not edit by hand. */\n\n";
}

function renderFontFaces() {
  return `@font-face {
  font-family: "Caveat";
  src: local("Caveat"), url("./fonts/Caveat-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}`;
}

function renderBlock(selector, variables) {
  const lines = Object.entries(variables).map(([name, value]) => `  ${name}: ${value};`);

  return `${selector} {\n${lines.join("\n")}\n}`;
}

function renderThemeMappings(mappings, fontSizes = []) {
  const lines = mappings.map(([sourceVar, themeVar, mode]) => {
    if (mode === "direct") {
      return `  ${themeVar}: var(${sourceVar});`;
    }
    const isColor = themeVar.startsWith("--color-");
    return `  ${themeVar}: ${isColor ? `hsl(var(${sourceVar}))` : `var(${sourceVar})`};`;
  });

  for (const fontSize of fontSizes) {
    if (!fontSize.cssVar || !fontSize.utility || fontSize.lineHeight == null) continue;
    lines.push(`  --${fontSize.utility}--line-height: ${fontSize.lineHeight};`);
  }

  return `@theme inline {\n${lines.join("\n")}\n}`;
}
