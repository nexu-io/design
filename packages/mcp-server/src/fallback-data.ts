import type { MetadataStore } from "./types.js";

export const fallbackMetadata: MetadataStore = {
  componentsApi: {
    schemaVersion: "fallback.docs-api",
    generatedFrom: ["apps/docs/lib/agent-artifacts.ts"],
    count: 1,
    components: [
      {
        id: "button",
        name: "Button",
        status: "stable",
        category: "primitives",
        package: "@nexu-design/ui-web",
        exports: ["Button", "buttonVariants"],
        import: "import { Button } from '@nexu-design/ui-web'",
        description: "Trigger an action, submit a form, or navigate with a clear affordance.",
        overview:
          "Use Button for explicit user actions: saving changes, starting flows, confirming destructive work, or linking to a next destination when the action needs button affordance.",
        usage:
          "Choose one high-emphasis action per group, then use outline, ghost, or secondary variants for supporting actions. Pair loading with async work so users cannot submit twice.",
        docsUrl: "/components/button",
        storybookId: "button",
        examples: ["button/basic", "button/variants", "button/loading"],
        accessibility: [
          "Renders a native button by default, preserving keyboard and form behavior.",
          "Loading native buttons are disabled to prevent duplicate submission while keeping the visible label in place.",
          "Icon-only buttons must include an accessible label with aria-label.",
        ],
        inheritedProps: "Native button HTML attributes such as type, onClick, and aria-* props.",
        props: [
          {
            name: "variant",
            type: "'default' | 'brand' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'destructive' | 'link'",
            defaultValue: "'default'",
            description: "Visual style and emphasis level for the action.",
          },
          {
            name: "size",
            type: "'xs' | 'sm' | 'md' | 'lg' | 'inline' | 'icon' | 'icon-sm'",
            defaultValue: "'md'",
            description: "Control height, padding, and type scale preset.",
          },
          {
            name: "loading",
            type: "boolean",
            defaultValue: "false",
            description:
              "Shows a spinner and disables native button interaction while work is pending.",
          },
          {
            name: "asChild",
            type: "boolean",
            defaultValue: "false",
            description: "Renders through Radix Slot for link-like or custom element composition.",
          },
        ],
      },
    ],
  },
  examplesApi: {
    schemaVersion: "fallback.docs-api",
    generatedFrom: ["apps/docs/lib/examples.tsx"],
    count: 1,
    examples: [
      {
        id: "button/basic",
        componentId: "button",
        title: "Basic usage",
        description: "Render a primary action with the default Button variant and size.",
        category: "components",
        tags: ["components", "button"],
        filePath: "examples/components/button/basic.tsx",
        source:
          "import { Button } from '@nexu-design/ui-web';\n\nexport function ButtonBasicExample() {\n  return <Button>Save changes</Button>;\n}",
        dependencies: ["@nexu-design/ui-web"],
        docsUrl: "/components/button",
      },
    ],
  },
  tokensApi: {
    schemaVersion: "fallback.docs-api",
    generatedFrom: ["packages/tokens/src/token-data.ts"],
    count: 2,
    tokens: [
      {
        name: "color.background",
        category: "color",
        page: "colors",
        group: "Surface",
        cssVar: "--nexu-color-background",
        value: "oklch(1 0 0)",
        resolvedValue: "oklch(1 0 0)",
        description: "Default app background surface.",
        usage: "Use for root page and app shell backgrounds.",
      },
      {
        name: "radius.md",
        category: "radius",
        page: "radius",
        group: "Radius scale",
        cssVar: "--nexu-radius-md",
        value: "0.5rem",
        resolvedValue: "0.5rem",
        description: "Default control and card radius.",
        usage: "Use for medium controls and contained surfaces.",
      },
    ],
  },
};
