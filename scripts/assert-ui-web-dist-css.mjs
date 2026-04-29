import { readFile } from "node:fs/promises";

const distCssUrl = new URL("../packages/ui-web/dist/styles.css", import.meta.url);
const distCss = await readFile(distCssUrl, "utf8");

if (distCss.trim().length === 0) {
  console.error("ui-web dist CSS check failed: dist/styles.css is empty.");
  process.exit(1);
}

const forbiddenPatterns = [
  { label: "@source directive", regex: /@source\b/ },
  { label: "tailwindcss import", regex: /@import\s+["']tailwindcss["']/ },
];

for (const { label, regex } of forbiddenPatterns) {
  if (regex.test(distCss)) {
    console.error(`ui-web dist CSS check failed: found forbidden ${label} in dist/styles.css.`);
    process.exit(1);
  }
}

const requiredPatterns = [
  { label: "relative utility", regex: /\.relative(?=[:\s.{[#])/ },
  { label: "absolute utility", regex: /\.absolute(?=[:\s.{[#])/ },
  { label: "right-2 utility", regex: /\.right-2(?=[:\s.{[#])/ },
  { label: "focus:bg-surface-3 utility", regex: /\.focus\\:bg-surface-3(?=[:\s.{[#])/ },
];

for (const { label, regex } of requiredPatterns) {
  if (!regex.test(distCss)) {
    console.error(`ui-web dist CSS check failed: missing ${label} in dist/styles.css.`);
    process.exit(1);
  }
}

console.log("ui-web dist CSS check passed.");
