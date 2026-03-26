# nexu-ui

`nexu-ui` is a pnpm workspace for Nexu's React and TypeScript UI library, shared design tokens, and a Storybook app for local development and documentation.

## Workspace packages

- `packages/ui-web` — `@nexu/ui-web`, the React component library
- `packages/tokens` — `@nexu/tokens`, shared design tokens and CSS
- `apps/storybook` — `@nexu/storybook`, the component playground and docs app

## Stack

- React 19
- TypeScript
- Vite
- Storybook 9
- Vitest
- Biome
- pnpm workspaces

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install dependencies

```bash
pnpm install
```

### Start Storybook

```bash
pnpm dev
```

Storybook runs from `apps/storybook` on port `6006` by default.

## Common commands

### Root workspace

```bash
pnpm dev
pnpm build
pnpm build:packages
pnpm typecheck
pnpm test
pnpm lint
pnpm format
pnpm format:check
pnpm biome:check
pnpm release:check
```

### Package-specific examples

```bash
pnpm --filter @nexu/ui-web test
pnpm --filter @nexu/ui-web typecheck
pnpm --filter @nexu/tokens build
pnpm --filter @nexu/storybook build-storybook
```

## Repository structure

```text
.
├── apps/
│   └── storybook/
├── docs/
├── packages/
│   ├── tokens/
│   └── ui-web/
├── package.json
└── pnpm-workspace.yaml
```

## Development notes

- Use `pnpm` only.
- Source files are written in TypeScript and React.
- Component stories live in `apps/storybook/src/stories`.
- Tests for `@nexu/ui-web` are co-located with source files and run with Vitest.
- Formatting and code quality checks are managed with Biome and TypeScript.

## Release validation

Before publishing package changes, run:

```bash
pnpm release:check
```

This validates package builds, type checks, tests, and dry-run packaging.

## Additional docs

- `docs/package-publishing-and-consumption.md`
- `docs/component-api-guidelines.md`
- `docs/core-component-api-specs.md`
