import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const rootDir = process.cwd();
const searchRoots = ["packages/ui-web/src", "apps/storybook/src"];
const fileExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mdx"]);
const typographyPattern = /text-\[(10|11)px\]/;
const interactivePattern =
  /Button|TextLink|TabsTrigger|Toggle|Select|Combobox|DropdownMenu|InteractiveRow|StatusDot|href=|onClick=|cursor-pointer|role=\"button\"|role=\{'button'\}|aria-selected|aria-pressed|data-\[state=on\]|data-\[state=active\]|<button|<a\b/;
const ignoreComment = "interactive-typography-ignore";

const issues = [];

for (const searchRoot of searchRoots) {
  for (const filePath of walk(join(rootDir, searchRoot))) {
    const content = readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];

      if (!typographyPattern.test(line) || line.includes(ignoreComment)) {
        continue;
      }

      const windowStart = Math.max(0, index - 2);
      const windowEnd = Math.min(lines.length - 1, index + 2);
      const context = lines.slice(windowStart, windowEnd + 1).join("\n");

      if (!interactivePattern.test(context)) {
        continue;
      }

      issues.push({
        filePath,
        lineNumber: index + 1,
        line: line.trim(),
      });
    }
  }
}

if (issues.length > 0) {
  console.error("Interactive typography floor violations found:");

  for (const issue of issues) {
    console.error(`- ${relative(rootDir, issue.filePath)}:${issue.lineNumber}`);
    console.error(`  ${issue.line}`);
  }

  console.error(
    "\nInteractive controls must not use text-[10px] or text-[11px]. Use 12px minimum, or add an inline interactive-typography-ignore comment for a reviewed exception.",
  );
  process.exit(1);
}

console.log("Interactive typography floor check passed.");

function walk(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const extension = entry.name.slice(entry.name.lastIndexOf("."));
    if (!fileExtensions.has(extension)) {
      continue;
    }

    if (!statSync(fullPath).isFile()) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}
