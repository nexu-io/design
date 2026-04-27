import { readFileSync } from "node:fs";
import path from "node:path";

export const exampleIds = [
  "button/basic",
  "button/variants",
  "button/loading",
  "input/basic",
  "card/basic",
  "badge/basic",
  "checkbox/basic",
  "switch/basic",
  "select/basic",
  "dialog/basic",
  "tabs/basic",
  "tooltip/basic",
  "popover/basic",
  "dropdown-menu/basic",
  "alert/basic",
  "spinner/basic",
  "skeleton/basic",
] as const;

export type ExampleId = (typeof exampleIds)[number];

export type ExampleCategory = "components";

export interface ExampleDefinition {
  id: ExampleId;
  title: string;
  description?: string;
  category: ExampleCategory;
  source: string;
  filePath: `examples/${string}.tsx`;
}

export const examples = {
  "button/basic": defineExample({
    id: "button/basic",
    title: "Basic usage",
    description: "Render a primary action with the default Button variant and size.",
    category: "components",
    filePath: "examples/components/button/basic.tsx",
  }),
  "button/variants": defineExample({
    id: "button/variants",
    title: "Variants",
    description: "Compare the common emphasis levels available on Button.",
    category: "components",
    filePath: "examples/components/button/variants.tsx",
  }),
  "button/loading": defineExample({
    id: "button/loading",
    title: "Loading and disabled states",
    description: "Use loading for pending work and disabled for unavailable actions.",
    category: "components",
    filePath: "examples/components/button/loading.tsx",
  }),
  "input/basic": defineExample({
    id: "input/basic",
    title: "Basic usage",
    description: "Pair Input with a visible label and optional icon for common form fields.",
    category: "components",
    filePath: "examples/components/input/basic.tsx",
  }),
  "card/basic": defineExample({
    id: "card/basic",
    title: "Basic usage",
    description: "Compose Card slots for grouped content, supporting copy, and actions.",
    category: "components",
    filePath: "examples/components/card/basic.tsx",
  }),
  "badge/basic": defineExample({
    id: "badge/basic",
    title: "Basic usage",
    description: "Use badge variants for compact status and metadata labels.",
    category: "components",
    filePath: "examples/components/badge/basic.tsx",
  }),
  "checkbox/basic": defineExample({
    id: "checkbox/basic",
    title: "Basic usage",
    description: "Use Checkbox for independent yes/no choices with an associated label.",
    category: "components",
    filePath: "examples/components/checkbox/basic.tsx",
  }),
  "switch/basic": defineExample({
    id: "switch/basic",
    title: "Basic usage",
    description: "Use Switch for immediately applied on/off settings.",
    category: "components",
    filePath: "examples/components/switch/basic.tsx",
  }),
  "select/basic": defineExample({
    id: "select/basic",
    title: "Basic usage",
    description: "Use Select for a closed list of values where one option is chosen.",
    category: "components",
    filePath: "examples/components/select/basic.tsx",
  }),
  "dialog/basic": defineExample({
    id: "dialog/basic",
    title: "Basic usage",
    description: "Compose Dialog with trigger, labelled content, body, and footer actions.",
    category: "components",
    filePath: "examples/components/dialog/basic.tsx",
  }),
  "tabs/basic": defineExample({
    id: "tabs/basic",
    title: "Basic usage",
    description: "Use Tabs to switch between related panels without leaving the page.",
    category: "components",
    filePath: "examples/components/tabs/basic.tsx",
  }),
  "tooltip/basic": defineExample({
    id: "tooltip/basic",
    title: "Basic usage",
    description: "Use Tooltip for brief, non-essential hints on focus or hover.",
    category: "components",
    filePath: "examples/components/tooltip/basic.tsx",
  }),
  "popover/basic": defineExample({
    id: "popover/basic",
    title: "Basic usage",
    description: "Use Popover for lightweight contextual content anchored to a trigger.",
    category: "components",
    filePath: "examples/components/popover/basic.tsx",
  }),
  "dropdown-menu/basic": defineExample({
    id: "dropdown-menu/basic",
    title: "Basic usage",
    description: "Use DropdownMenu for compact action lists and menu-style choices.",
    category: "components",
    filePath: "examples/components/dropdown-menu/basic.tsx",
  }),
  "alert/basic": defineExample({
    id: "alert/basic",
    title: "Basic usage",
    description: "Use Alert to surface contextual status or recovery guidance.",
    category: "components",
    filePath: "examples/components/alert/basic.tsx",
  }),
  "spinner/basic": defineExample({
    id: "spinner/basic",
    title: "Basic usage",
    description: "Use Spinner to show indeterminate background or inline loading.",
    category: "components",
    filePath: "examples/components/spinner/basic.tsx",
  }),
  "skeleton/basic": defineExample({
    id: "skeleton/basic",
    title: "Basic usage",
    description: "Use Skeleton to reserve space while content loads.",
    category: "components",
    filePath: "examples/components/skeleton/basic.tsx",
  }),
} satisfies Record<ExampleId, ExampleDefinition>;

export function getExample(id: ExampleId) {
  return examples[id];
}

export function getExamples(ids: readonly ExampleId[]) {
  return ids.map((id) => getExample(id));
}

function defineExample(definition: Omit<ExampleDefinition, "source">): ExampleDefinition {
  return {
    ...definition,
    source: readExampleSource(definition.filePath),
  };
}

function readExampleSource(filePath: ExampleDefinition["filePath"]) {
  const source = readFileSync(resolveExampleFile(filePath), "utf8");

  return source
    .replace('"../../../../../packages/ui-web/src/primitives/button"', '"@nexu-design/ui-web"')
    .trimEnd();
}

function resolveExampleFile(filePath: ExampleDefinition["filePath"]) {
  const cwd = process.cwd();
  const docsRoot = cwd.endsWith(`${path.sep}apps${path.sep}docs`)
    ? cwd
    : path.join(cwd, "apps", "docs");

  return path.join(docsRoot, filePath);
}
