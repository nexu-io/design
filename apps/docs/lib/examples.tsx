import { readFileSync } from "node:fs";
import type { ComponentType } from "react";

import { ButtonBasicExample } from "../examples/components/button/basic";
import { ButtonLoadingExample } from "../examples/components/button/loading";
import { ButtonVariantsExample } from "../examples/components/button/variants";

export const exampleIds = ["button/basic", "button/variants", "button/loading"] as const;

export type ExampleId = (typeof exampleIds)[number];

export type ExampleCategory = "components";

export interface ExampleDefinition {
  id: ExampleId;
  title: string;
  description?: string;
  category: ExampleCategory;
  component: ComponentType;
  source: string;
  filePath: `examples/${string}.tsx`;
}

export const examples = {
  "button/basic": defineExample({
    id: "button/basic",
    title: "Basic usage",
    description: "Render a primary action with the default Button variant and size.",
    category: "components",
    component: ButtonBasicExample,
    filePath: "examples/components/button/basic.tsx",
  }),
  "button/variants": defineExample({
    id: "button/variants",
    title: "Variants",
    description: "Compare the common emphasis levels available on Button.",
    category: "components",
    component: ButtonVariantsExample,
    filePath: "examples/components/button/variants.tsx",
  }),
  "button/loading": defineExample({
    id: "button/loading",
    title: "Loading and disabled states",
    description: "Use loading for pending work and disabled for unavailable actions.",
    category: "components",
    component: ButtonLoadingExample,
    filePath: "examples/components/button/loading.tsx",
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
  return readFileSync(new URL(`../${filePath}`, import.meta.url), "utf8").trimEnd();
}
