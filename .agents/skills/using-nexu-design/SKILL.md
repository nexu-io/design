---
name: using-nexu-design
description: Guide consumers and agents to use @nexu-design/ui-web and @nexu-design/tokens correctly, relying on Nexu Design docs, metadata endpoints, and MCP lookups instead of recreating components, variants, prop tables, or token tables locally.
---

# Using Nexu Design

Use this skill when working with Nexu Design as a consumer-facing UI system rather than inventing a parallel one.

## When to use

Use this skill when the user asks to:

- build UI with `@nexu-design/ui-web`
- consume `@nexu-design/tokens`
- find the right existing component or variant
- check installation, imports, props, examples, or token usage
- integrate Nexu Design into an app, prototype, or AI workflow

## Workflow

1. Confirm the task is consumption, composition, or lookup.
2. Start from Nexu Design source-of-truth docs and machine-readable metadata.
3. Identify the existing component, pattern, variant, or token before proposing new UI.
4. Prefer published package usage:
   - install `@nexu-design/ui-web` and/or `@nexu-design/tokens`
   - import the package stylesheet: `@nexu-design/ui-web/styles.css`
5. Reuse existing components and variants instead of recreating them locally.
6. For exact APIs or examples, fetch them from metadata or MCP instead of writing static tables into the answer.

## Source of truth / lookups

Prefer these in roughly this order:

- `/guide/ai-agents`
- `/reference/components`
- `/reference/tokens`
- `/llms.txt`
- `/llms-full.txt`
- `/api/manifest.json`
- `/api/components.json`
- `/api/tokens.json`
- `/api/examples.json`

For machine-readable lookups, use `@nexu-design/mcp`:

```bash
npx -y @nexu-design/mcp
```

Useful tools:

- `search_components`
- `get_component`
- `get_component_props`
- `get_example`
- `search_tokens`
- `get_token`

Use MCP or metadata to answer questions like:

- which component should I use?
- what props or variants exist?
- is there an example for this pattern?
- which token or CSS variable should power this style?

## Avoid

- Do not create local duplicate components when an existing Nexu Design component fits.
- Do not invent new variants before checking metadata, docs, and examples.
- Do not copy component API tables, prop tables, or token value tables into the skill.
- Do not hard-code design decisions that should come from tokens or documented variants.
- Do not treat memory as the source of truth when MCP or metadata can answer exactly.
