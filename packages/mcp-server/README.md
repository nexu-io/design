# @nexu-design/mcp

Read-only MCP server for querying Nexu Design component, example, and token metadata.

```bash
npx -y @nexu-design/mcp
```

The server uses the same docs metadata exposed by the Nexu Design docs JSON APIs. Set
`NEXU_DESIGN_DOCS_URL` to point at a local or preview docs deployment; otherwise it defaults to
`https://design.nexu.io`.

Available tools:

- `search_components`
- `get_component`
- `get_component_props`
- `get_example`
- `search_tokens`
- `get_token`

The package is intentionally read-only. It does not write files, install dependencies, render
previews, start Storybook, or access private design assets.
