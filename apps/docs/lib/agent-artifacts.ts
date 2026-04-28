import { themeVariables } from "@nexu-design/tokens";

import { docsNavigationSections } from "./content-policy";
import {
  componentMetadata,
  exampleMetadata,
  inventoryMetadata,
  metadataSourceFiles,
  tokenMetadata,
  tokenMetadataPages,
} from "./docs-metadata";
import { publicApiInventory, type PublicApiInventoryItem } from "./public-api-inventory";

const inventorySource = "apps/docs/lib/public-api-inventory.ts";
const aiAgentsGuidePath = "guide/ai-agents";
const rootAgentEntrypoints = ["llms.txt", "llms-full.txt", aiAgentsGuidePath] as const;

function toBaseRelativePath(path: string) {
  return path.replace(/^\/+/, "");
}

interface AgentInventoryItem {
  id: string;
  name: string;
  kind: PublicApiInventoryItem["kind"];
  status: PublicApiInventoryItem["status"];
  packageName: PublicApiInventoryItem["packageName"];
  exports: string[];
  importSnippet?: string;
  docsSlug?: string;
  storybookId?: string;
  storybookPath?: string;
  examples: string[];
  coverage: PublicApiInventoryItem["coverage"];
}

const agentInventoryItems: AgentInventoryItem[] = publicApiInventory.map((item) => ({
  id: item.id,
  name: item.name,
  kind: item.kind,
  status: item.status,
  packageName: item.packageName,
  exports: item.exports,
  importSnippet: item.importSnippet,
  docsSlug: item.docsSlug,
  storybookId: item.storybookId,
  storybookPath: item.storybookPath,
  examples: item.examples,
  coverage: item.coverage,
}));

const routeItems = docsNavigationSections.flatMap((section) =>
  section.items.map((item) => ({
    title: item.title,
    href: item.href,
    section: section.title,
    status: item.status ?? "draft",
  })),
);

const packageNames = Array.from(new Set(publicApiInventory.map((item) => item.packageName))).sort();

const schemaVersion = "2026-04-27";

const jsonApiRoutes = [
  {
    href: "components.json",
    status: "generated",
    description: "Public component metadata backed by shared docs metadata.",
  },
  {
    href: "tokens.json",
    status: "generated",
    description: "Public token metadata backed by shared token metadata.",
  },
  {
    href: "examples.json",
    status: "generated",
    description: "Public example metadata backed by the examples registry and source files.",
  },
] as const;

export function getAgentManifest() {
  const counts = publicApiInventory.reduce(
    (summary, item) => {
      summary.total += 1;
      summary.byKind[item.kind] += 1;
      summary.byStatus[item.status] += 1;
      if (item.documentable) summary.documentable += 1;
      if (item.coverage.docs === "complete") summary.docsComplete += 1;
      return summary;
    },
    {
      total: 0,
      documentable: 0,
      docsComplete: 0,
      byKind: { primitive: 0, pattern: 0, utility: 0 },
      byStatus: { stable: 0, experimental: 0, internal: 0 },
    },
  );

  return {
    schemaVersion,
    name: "Nexu Design docs manifest",
    description:
      "Static machine-readable index for Nexu Design docs, public API inventory, and agent entrypoints.",
    generatedFrom: [inventorySource, "apps/docs/lib/content-policy.ts"],
    support: {
      mode: "static",
      guide: `../${aiAgentsGuidePath}`,
      entrypoints: [
        ...rootAgentEntrypoints.map((entrypoint) => `../${entrypoint}`),
        "manifest.json",
        ...jsonApiRoutes.map((route) => route.href),
      ],
      currentScope: [
        "Read public API inventory metadata, docs slugs, Storybook ids, package imports, examples, and coverage flags.",
        "Use docs pages and Storybook links as static references for component usage and QA context.",
        "Internal shared metadata for components, props, examples, and tokens is available from one source module.",
      ],
      limitations: [
        "Read-only MCP tools are available through @nexu-design/mcp and consume the same JSON metadata APIs.",
        "Coverage flags describe docs readiness and may not prove package export completeness.",
      ],
    },
    routes: {
      docs: routeItems,
      api: [
        { href: "manifest.json", status: "generated", description: "This manifest." },
        ...jsonApiRoutes,
      ],
    },
    packages: [...packageNames, "@nexu-design/mcp"],
    mcp: {
      package: "@nexu-design/mcp",
      command: "npx -y @nexu-design/mcp",
      transport: "stdio",
      tools: [
        "search_components",
        "get_component",
        "get_component_props",
        "get_example",
        "search_tokens",
        "get_token",
      ],
      scope:
        "read-only metadata lookup backed by /api/components.json, /api/examples.json, and /api/tokens.json",
    },
    inventory: {
      source: inventorySource,
      counts,
      items: agentInventoryItems,
    },
    metadata: {
      sources: metadataSourceFiles,
      counts: {
        inventory: inventoryMetadata.length,
        components: componentMetadata.length,
        examples: exampleMetadata.length,
        tokens: tokenMetadata.length,
      },
    },
  };
}

export function getComponentsApi() {
  return {
    schemaVersion,
    generatedFrom: metadataSourceFiles.components,
    count: componentMetadata.length,
    components: componentMetadata.map((component) => ({
      id: component.id,
      name: component.title,
      status: getInventoryStatus(component.id),
      category: `${getInventoryKind(component.id)}s`,
      package: component.packageName,
      exports: component.exports,
      import: component.importSnippet,
      description: component.description,
      overview: component.overview,
      usage: component.usage,
      docsUrl: component.docsSlug,
      storybookId: component.storybookId,
      storybookUrl: component.storybookPath,
      storybookTitle: component.storybookTitle,
      sourcePath: component.sourcePath,
      examples: component.examples,
      accessibility: component.accessibility,
      inheritedProps: component.inheritedProps,
      coverage: component.coverage,
      props: component.props,
    })),
  };
}

export function getTokensApi() {
  return {
    schemaVersion,
    generatedFrom: metadataSourceFiles.tokens,
    count: tokenMetadata.length,
    themes: themeVariables,
    pages: tokenMetadataPages.map((page) => ({
      id: page.id,
      title: page.title,
      groups: page.groups.map((group) => ({
        title: group.title,
        tokens: group.tokens.map((token) => token.name),
      })),
      ...(page.id === "typography" ? { textStyles: page.textStyles } : {}),
    })),
    tokens: tokenMetadata.map((token) => ({
      name: token.name,
      category: token.category,
      page: token.page,
      group: token.group,
      cssVar: token.cssVar,
      value: token.value,
      resolvedValue: token.resolvedValue,
      description: token.description,
      usage: token.utility,
      foreground: token.foreground,
      themes: {
        light: themeVariables.light[token.cssVar],
        dark: themeVariables.dark[token.cssVar],
      },
    })),
  };
}

export function getExamplesApi() {
  return {
    schemaVersion,
    generatedFrom: metadataSourceFiles.examples,
    count: exampleMetadata.length,
    examples: exampleMetadata.map((example) => {
      const componentId = example.id.split("/")[0];
      const component = componentMetadata.find((item) => item.id === componentId);

      return {
        id: example.id,
        componentId,
        title: example.title,
        description: example.description,
        category: example.category,
        tags: [example.category, componentId],
        filePath: example.filePath,
        source: example.source,
        dependencies: getExampleDependencies(example.source),
        docsUrl: component?.docsSlug,
      };
    }),
  };
}

export function generateLlmsText() {
  const documentedItems = publicApiInventory.filter(
    (item) => item.documentable && item.coverage.docs === "complete" && item.docsSlug,
  );
  const plannedItems = publicApiInventory.filter(
    (item) => item.documentable && item.coverage.docs !== "complete",
  );

  return [
    "# Nexu Design",
    "",
    "> Consumer docs and static agent entrypoints for the Nexu Design React component library.",
    "",
    "## Static agent support",
    "",
    `- Guide: ${toBaseRelativePath(aiAgentsGuidePath)}`,
    "- Manifest: api/manifest.json",
    "- Full context: llms-full.txt",
    `- Inventory source: ${inventorySource}`,
    "- Scope: static docs, curated public API inventory, shared component/example/token metadata, Storybook ids, import snippets, and coverage flags.",
    "- JSON metadata: api/components.json, api/tokens.json, api/examples.json",
    "- MCP: read-only tools via @nexu-design/mcp (stdio).",
    "",
    "## Packages",
    "",
    ...packageNames.map((packageName) => `- ${packageName}`),
    "",
    "## Primary docs",
    "",
    ...routeItems.map((item) => `- [${item.section} / ${item.title}](${item.href})`),
    "",
    "## Documented public API",
    "",
    ...documentedItems.map(formatInventoryItemForLlms),
    "",
    "## Planned or incomplete public API docs",
    "",
    ...plannedItems.map(
      (item) =>
        `- ${item.name} (${item.kind}, ${item.status}): docs=${item.coverage.docs}; storybook=${item.coverage.storybook}; props=${item.coverage.props}`,
    ),
    "",
  ].join("\n");
}

export function generateLlmsFullText() {
  return [
    "# Nexu Design full agent context",
    "",
    "> Static full-context export generated from shared component, token, example, and inventory metadata.",
    "",
    "## Generated JSON APIs",
    "",
    ...jsonApiRoutes.map((route) => `- api/${route.href}: ${route.description}`),
    "",
    "## Metadata sources",
    "",
    ...metadataSourceFiles.all.map((source) => `- ${source}`),
    "",
    "## Components",
    "",
    ...componentMetadata.flatMap((component) => [
      `### ${component.title}`,
      "",
      component.description,
      "",
      `- id: ${component.id}`,
      `- package: ${component.packageName}`,
      `- import: ${component.importSnippet}`,
      `- docs: ${component.docsSlug}`,
      `- storybook: ${component.storybookId ?? "none"}`,
      `- examples: ${component.examples.length > 0 ? component.examples.join(", ") : "none"}`,
      `- source: ${component.sourcePath}`,
      "- props:",
      ...component.props.map(
        (prop) =>
          `  - ${prop.name}: ${prop.type}; default=${prop.defaultValue}; ${prop.description}`,
      ),
      "- accessibility:",
      ...component.accessibility.map((item) => `  - ${item}`),
      "",
    ]),
    "## Tokens",
    "",
    ...tokenMetadataPages.flatMap((page) => [
      `### ${page.title}`,
      "",
      ...page.groups.flatMap((group) => [
        `#### ${group.title}`,
        "",
        ...group.tokens.map(
          (token) =>
            `- ${token.name} (${token.cssVar}): ${token.resolvedValue}; ${token.description}`,
        ),
        "",
      ]),
    ]),
    "## Examples",
    "",
    ...exampleMetadata.flatMap((example) => [
      `### ${example.id}`,
      "",
      `- title: ${example.title}`,
      `- description: ${example.description ?? "none"}`,
      `- file: ${example.filePath}`,
      "",
      "```tsx",
      example.source,
      "```",
      "",
    ]),
  ].join("\n");
}

function formatInventoryItemForLlms(item: PublicApiInventoryItem) {
  const parts = [
    `- [${item.name}](${item.docsSlug}) (${item.kind}, ${item.status})`,
    `exports: ${item.exports.join(", ")}`,
    `import: ${item.importSnippet}`,
  ];

  if (item.storybookId) parts.push(`storybook: ${item.storybookId}`);
  if (item.examples.length > 0) parts.push(`examples: ${item.examples.join(", ")}`);

  return parts.join("; ");
}

function getInventoryKind(componentId: string) {
  return publicApiInventory.find((item) => item.id === componentId)?.kind ?? "primitive";
}

function getInventoryStatus(componentId: string) {
  return publicApiInventory.find((item) => item.id === componentId)?.status ?? "experimental";
}

function getExampleDependencies(source: string) {
  return Array.from(
    new Set(
      Array.from(
        source.matchAll(/^import(?:\s+type)?[\s\S]*?\sfrom ["']([^"']+)["']/gm),
        (match) => match[1],
      ),
    ),
  ).sort();
}
