# Package publishing and consumption workflow

This workspace is prepared for **future publish** of:

- `@nexu/tokens`
- `@nexu/ui-web`

No publishing is performed by default.

## Current package strategy

- Both packages now build to `dist/` using TypeScript emit (`.js` + `.d.ts`)
- CSS is copied to `dist/styles.css`
- `package.json` `exports` point to `dist` artifacts
- `files` is limited to publishable outputs (`dist`, `README.md`)
- `pack:check` runs build + `pnpm pack --dry-run`

This keeps the setup minimal while making outputs consumable by non-workspace apps.

## Local consumption options

### 1) Monorepo/workspace link (preferred during development)

In consumers inside a pnpm workspace:

- `"@nexu/tokens": "workspace:^0.1.0"`
- `"@nexu/ui-web": "workspace:^0.1.0"`

### 2) `file:` dependency (outside workspace, local machine)

Point directly to this repo paths, e.g.:

- `"@nexu/tokens": "file:../ui/packages/tokens"`
- `"@nexu/ui-web": "file:../ui/packages/ui-web"`

Run package builds before consuming:

```bash
pnpm --dir ../ui build:packages
```

### 3) Future registry publish (npm/GitHub Packages)

When ready, publish from `dist`-based package config after version bump and release validation:

```bash
pnpm release:check
# then publish command(s) when policy is finalized
```

## Versioning + release notes expectations

- Use semver per package (`major.minor.patch`)
- Bump `@nexu/tokens` when tokens/CSS contract changes
- Bump `@nexu/ui-web` for component API or behavior changes
- If `@nexu/ui-web` needs newer tokens, bump both and keep dependency aligned
- Add concise release notes per version with:
  - **What changed** (consumer-visible)
  - **Migration impact** (if any)
  - **Any required CSS/theme updates**

## Validation commands

- Build distributable outputs:
  - `pnpm build:packages`
- Type safety + tests + package tarball dry run:
  - `pnpm release:check`
