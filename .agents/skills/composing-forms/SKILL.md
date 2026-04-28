---
name: composing-forms
description: Compose accessible forms with existing Nexu Design primitives and patterns such as Input, Select, Checkbox, Switch, FormField, Button, Card, Dialog, and Alert, using metadata and MCP for exact props and examples instead of embedding duplicate API tables.
---

# Composing Forms

Use this skill to build forms from existing Nexu Design building blocks instead of designing ad hoc field systems.

## When to use

Use this skill when the user asks to:

- build a form, settings panel, filter form, signup flow, or modal form
- choose between form primitives or patterns
- wire validation, help text, error states, submit actions, or confirmation UI
- improve accessibility or form copy

Relevant building blocks often include:

- `Input`
- `Select`
- `Checkbox`
- `Switch`
- `FormField`
- `Button`
- `Card`
- `Dialog`
- `Alert`

## Workflow

1. Map the user flow first: inputs, choices, validation, submission, and feedback.
2. Compose with existing primitives and patterns rather than custom wrappers unless required.
3. Use `FormField` or equivalent documented patterns for labels, descriptions, and errors.
4. Keep actions clear with existing `Button` variants.
5. Use `Card` for grouped sections, `Dialog` for modal forms, and `Alert` for important blocking or status messaging when appropriate.
6. Check exact props, examples, and usage patterns via metadata or MCP before implementing.
7. Keep validation and copy aligned with product guidance; prefer clear labels, concise helper text, and actionable error copy.

## Source of truth / lookups

Use these references instead of embedding local tables:

- `/guide/ai-agents`
- `/reference/components`
- `/llms.txt`
- `/llms-full.txt`
- `/api/manifest.json`
- `/api/components.json`
- `/api/examples.json`

For exact lookups, use `@nexu-design/mcp`:

```bash
npx -y @nexu-design/mcp
```

Useful tools:

- `search_components`
- `get_component`
- `get_component_props`
- `get_example`

Use them to verify:

- correct form primitives for the job
- available props and states
- examples for composition and layout
- whether a documented pattern already solves the request

For validation and wording, follow the repo's copy and accessibility guidance rather than inventing inconsistent messaging.

## Avoid

- Do not duplicate prop tables or examples in this skill.
- Do not build one-off local field components if existing primitives cover the need.
- Do not separate labels, descriptions, and error text from accessible field wiring.
- Do not rely on placeholder text as the only label.
- Do not hard-code validation copy patterns when repo guidance or examples already exist.
- Do not add custom visual states before checking existing component variants and documented usage.
