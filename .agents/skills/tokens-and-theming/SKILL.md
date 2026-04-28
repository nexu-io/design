---
name: tokens-and-theming
description: Apply Nexu Design tokens, CSS variables, and theme classes correctly by using token metadata, token references, and documented component variants instead of hard-coding values or duplicating token tables.
---

# Tokens and Theming

Use this skill when styling with Nexu Design tokens, CSS variables, and theme-aware component usage.

## When to use

Use this skill when the user asks to:

- style UI with the Nexu token system
- choose colors, spacing, radii, typography, or shadows
- implement or extend theming
- understand CSS variables or theme classes
- align custom CSS with existing component variants

## Workflow

1. Start with existing component variants before adding custom styling.
2. When custom styling is needed, prefer token-backed CSS variables.
3. Use documented theme classes and token semantics rather than raw values.
4. Check token names, intent, and examples through metadata or MCP.
5. Keep custom CSS aligned with existing theming behavior so components stay consistent across themes.

## Source of truth / lookups

Use these sources for exact token and theming information:

- `/guide/ai-agents`
- `/reference/tokens`
- `/reference/components`
- `/llms.txt`
- `/llms-full.txt`
- `/api/manifest.json`
- `/api/tokens.json`
- `/api/components.json`
- `/api/examples.json`

For machine-readable token lookup, use `@nexu-design/mcp`:

```bash
npx -y @nexu-design/mcp
```

Useful tools:

- `search_tokens`
- `get_token`
- `search_components`
- `get_component`
- `get_example`

Use these to verify:

- which token or CSS variable should back a style
- whether an existing variant already expresses the desired state
- how a token is intended to be used in theming or component composition

## Avoid

- Do not hard-code colors, spacing, radii, or other design values when a token exists.
- Do not duplicate token value tables in this skill.
- Do not create custom theme values that drift from documented token semantics without strong reason.
- Do not bypass existing component variants for styling that is already supported.
- Do not treat copied raw values as the source of truth; use token metadata, token APIs, and theming docs.
