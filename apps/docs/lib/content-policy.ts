import { publicComponentInventory } from "./public-api-inventory";

export type DocsSectionId =
  | "guide"
  | "foundations"
  | "components"
  | "patterns"
  | "reference"
  | "changelog";

export type DocsPageKind =
  | "guide"
  | "foundation"
  | "component"
  | "pattern"
  | "reference"
  | "changelog"
  | "api";

export type DocsContentStatus = "stub" | "draft" | "mvp" | "stable" | "generated";

export type DocsSourceDocument =
  | "docs/design-system-guidelines.md"
  | "docs/component-api-guidelines.md"
  | "docs/copy-and-localization.md"
  | "docs/package-publishing-and-consumption.md"
  | "docs/release-flow.md"
  | "packages/ui-web/COMPONENT_REFERENCE.md"
  | "packages/ui-web/src/index.ts"
  | "packages/tokens/src/token-data.ts";

export interface DocsNavItemDefinition {
  title: string;
  href: `/${string}`;
  status?: DocsContentStatus;
}

export interface DocsNavSectionDefinition {
  id: DocsSectionId;
  title: string;
  items: DocsNavItemDefinition[];
}

export interface ComponentPageTemplateSection {
  id: string;
  title: string;
  required: boolean;
  source: "frontmatter" | "mdx" | "examples-registry" | "inventory" | "props-metadata";
}

export interface SourceOfTruthPolicyItem {
  source: DocsSourceDocument;
  docsDestinations: string[];
  policy: string;
}

const generatedComponentNavItems = publicComponentInventory
  .filter((item) => item.kind === "primitive" && item.docsSlug?.startsWith("/components/"))
  .map((item) => ({
    title: item.name,
    href: item.docsSlug as `/${string}`,
    status: item.coverage.docs === "complete" ? "generated" : "stub",
  })) satisfies DocsNavItemDefinition[];

const generatedPatternNavItems = publicComponentInventory
  .filter((item) => item.kind === "pattern" && item.docsSlug?.startsWith("/patterns/"))
  .map((item) => ({
    title: item.docsSlug === "/patterns/forms" ? "Forms" : item.name,
    href: item.docsSlug as `/${string}`,
    status: item.coverage.docs === "complete" ? "generated" : "stub",
  })) satisfies DocsNavItemDefinition[];

export const docsNavigationSections: DocsNavSectionDefinition[] = [
  {
    id: "guide",
    title: "Guide",
    items: [
      { title: "Introduction", href: "/guide/introduction", status: "mvp" },
      { title: "Installation", href: "/guide/installation", status: "mvp" },
      { title: "Styling", href: "/guide/styling", status: "mvp" },
      { title: "Theming", href: "/guide/theming", status: "mvp" },
      { title: "Dark mode", href: "/guide/dark-mode", status: "draft" },
      { title: "Accessibility", href: "/guide/accessibility", status: "mvp" },
      { title: "Copy & localization", href: "/guide/copy-and-localization", status: "mvp" },
      { title: "Release & versioning", href: "/guide/release-and-versioning", status: "mvp" },
      {
        title: "Local package consumption",
        href: "/guide/local-package-consumption",
        status: "mvp",
      },
      { title: "AI agents", href: "/guide/ai-agents", status: "generated" },
    ],
  },
  {
    id: "foundations",
    title: "Foundations",
    items: [
      { title: "Colors", href: "/foundations/colors", status: "stub" },
      { title: "Typography", href: "/foundations/typography", status: "stub" },
      { title: "Spacing", href: "/foundations/spacing", status: "stub" },
      { title: "Radius", href: "/foundations/radius", status: "stub" },
      { title: "Shadow", href: "/foundations/shadow", status: "stub" },
      { title: "Motion", href: "/foundations/motion", status: "stub" },
    ],
  },
  {
    id: "components",
    title: "Components",
    items: generatedComponentNavItems,
  },
  {
    id: "patterns",
    title: "Patterns",
    items: generatedPatternNavItems,
  },
  {
    id: "reference",
    title: "Reference",
    items: [
      { title: "Component API", href: "/reference/components", status: "stub" },
      { title: "Tokens", href: "/reference/tokens", status: "stub" },
    ],
  },
  {
    id: "changelog",
    title: "Changelog",
    items: [{ title: "Release notes", href: "/changelog", status: "stub" }],
  },
];

export const componentPageTemplateSections: ComponentPageTemplateSection[] = [
  { id: "overview", title: "Overview", required: true, source: "mdx" },
  { id: "import", title: "Import", required: true, source: "frontmatter" },
  { id: "basic-usage", title: "Basic usage", required: true, source: "examples-registry" },
  { id: "examples", title: "Examples", required: true, source: "examples-registry" },
  { id: "accessibility", title: "Accessibility", required: true, source: "mdx" },
  { id: "props", title: "Props", required: true, source: "props-metadata" },
  { id: "storybook", title: "Storybook", required: true, source: "inventory" },
];

export const docsSourceOfTruthPolicy: SourceOfTruthPolicyItem[] = [
  {
    source: "docs/design-system-guidelines.md",
    docsDestinations: [
      "/guide/styling",
      "/guide/theming",
      "/guide/accessibility",
      "/foundations/*",
    ],
    policy:
      "Internal design-system and token usage rules remain authoritative; docs pages summarize consumer-facing guidance and link back when details matter.",
  },
  {
    source: "docs/component-api-guidelines.md",
    docsDestinations: ["/reference/components", "/components/*"],
    policy:
      "Component page API conventions must follow this authoring policy until generated metadata and drift checks replace manual review.",
  },
  {
    source: "docs/copy-and-localization.md",
    docsDestinations: ["/guide/copy-and-localization", "/guide/accessibility"],
    policy:
      "Product copy and localization guidance is summarized in docs; conflicting wording guidance defers to the source policy.",
  },
  {
    source: "docs/package-publishing-and-consumption.md",
    docsDestinations: ["/guide/installation", "/guide/local-package-consumption"],
    policy:
      "Installation and local package consumption docs expose the consumer path while preserving the source document as the complete maintainer workflow.",
  },
  {
    source: "docs/release-flow.md",
    docsDestinations: ["/guide/release-and-versioning", "/changelog"],
    policy:
      "Release process pages are navigable summaries; release mechanics and validation commands remain governed by the source release flow.",
  },
];

export const componentFrontmatterPolicy = {
  required: [
    "title",
    "description",
    "kind",
    "status",
    "componentId",
    "packageName",
    "import",
    "storybookId",
  ],
  optional: [
    "examples",
    "sourceFiles",
    "sourceDocs",
    "related",
    "a11yStatus",
    "propsStatus",
    "since",
  ],
  notes:
    "Component MDX frontmatter identifies navigation, public API inventory links, Storybook links, examples, and source documents; narrative content stays in MDX and runnable examples stay in apps/docs/examples.",
} as const;
