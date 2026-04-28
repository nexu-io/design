export const dynamic = "force-static";

export function GET() {
  return Response.json({
    name: "Nexu Design MCP",
    package: "@nexu-design/mcp",
    command: "npx -y @nexu-design/mcp",
    transport: "stdio",
    docsUrl: "../guide/ai-agents",
    metadata: {
      components: "../api/components.json",
      examples: "../api/examples.json",
      tokens: "../api/tokens.json",
    },
    tools: [
      "search_components",
      "get_component",
      "get_component_props",
      "get_example",
      "search_tokens",
      "get_token",
    ],
    scope: "read-only",
  });
}
