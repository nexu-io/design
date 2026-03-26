# nexu-ui

`nexu-ui` is a pnpm workspace for Nexu's React and TypeScript UI library, shared design tokens, a Storybook app, and a Tauri demo app.

## Workspace packages

- `packages/ui-web` — `@nexu/ui-web`, the React component library
- `packages/tokens` — `@nexu/tokens`, shared design tokens and CSS
- `apps/storybook` — `@nexu/storybook`, the component playground and docs app
- `apps/demo` — `@nexu/demo`, the Tauri demo app

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
- rustup / Rust toolchain (the Tauri demo pins its own version in `apps/demo/src-tauri/rust-toolchain.toml`)

### Install dependencies

```bash
pnpm install
```

### Start local development

```bash
pnpm dev
```

This starts:

- Storybook at `http://localhost:6006`
- the Tauri demo from `apps/demo`

## Common commands

### Root workspace

```bash
pnpm dev
pnpm dev:storybook
pnpm dev:demo
pnpm dev:demo:web
pnpm build
pnpm build:storybook
pnpm build:tauri
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
pnpm --filter @nexu/demo dev
pnpm --filter @nexu/demo tauri:build
```

## Repository structure

```text
.
├── apps/
│   ├── demo/
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
- The desktop demo lives in `apps/demo`, with Rust sources in `apps/demo/src-tauri`.
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
