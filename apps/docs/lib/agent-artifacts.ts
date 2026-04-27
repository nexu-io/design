import { docsNavigationSections } from "./content-policy";
import { publicApiInventory, type PublicApiInventoryItem } from "./public-api-inventory";

const inventorySource = "apps/docs/lib/public-api-inventory.ts";
const aiAgentsGuidePath = "/guide/ai-agents";

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
    schemaVersion: "2026-04-27.phase-1.5",
    name: "Nexu Design docs manifest",
    description:
      "Static machine-readable index for Nexu Design docs, public API inventory, and agent entrypoints.",
    generatedFrom: [inventorySource, "apps/docs/lib/content-policy.ts"],
    support: {
      mode: "static",
      guide: aiAgentsGuidePath,
      entrypoints: ["/llms.txt", "/api/manifest.json", aiAgentsGuidePath],
      currentScope: [
        "Read public API inventory metadata, docs slugs, Storybook ids, package imports, examples, and coverage flags.",
        "Use docs pages and Storybook links as static references for component usage and QA context.",
        "Treat provisional props coverage as manually curated until Phase 2 metadata generation lands.",
      ],
      limitations: [
        "No MCP server or runtime search tools are published yet.",
        "Props, tokens, and examples JSON APIs are deferred to Phase 2 shared metadata generation.",
        "Coverage flags describe docs readiness and may not prove package export completeness.",
      ],
    },
    routes: {
      docs: routeItems,
      api: [
        { href: "/api/manifest.json", status: "generated", description: "This manifest." },
        {
          href: "/api/components.json",
          status: "planned",
          description: "Phase 2 generated component metadata.",
        },
        {
          href: "/api/tokens.json",
          status: "planned",
          description: "Phase 2 generated token metadata.",
        },
        {
          href: "/api/examples.json",
          status: "planned",
          description: "Phase 2 generated example metadata.",
        },
      ],
    },
    packages: packageNames,
    inventory: {
      source: inventorySource,
      counts,
      items: agentInventoryItems,
    },
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
    `- Guide: ${aiAgentsGuidePath}`,
    "- Manifest: /api/manifest.json",
    `- Inventory source: ${inventorySource}`,
    "- Scope: static docs, curated public API inventory, Storybook ids, import snippets, examples, and coverage flags.",
    "- Not available yet: MCP tools, runtime search APIs, generated props metadata, generated token metadata, or llms-full.txt.",
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
