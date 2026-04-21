# Package publishing and consumption workflow

This workspace is prepared for **future publish** of:

- `@nexu-design/tokens`
- `@nexu-design/ui-web`

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

- `"@nexu-design/tokens": "workspace:^0.1.0"`
- `"@nexu-design/ui-web": "workspace:^0.1.0"`

### 2) `file:` dependency (outside workspace, local machine)

Point directly to this repo paths, e.g.:

- `"@nexu-design/tokens": "file:../ui/packages/tokens"`
- `"@nexu-design/ui-web": "file:../ui/packages/ui-web"`

Run package builds before consuming:

```bash
pnpm --dir ../ui build:packages
```

### 3) Release workflow reference

Release and Changesets guidance now lives in:

- `docs/release-flow.md`

Use that document for:

- changeset authoring rules
- version and publish workflow
- release validation commands
- hotfix and rollback guidance
- release-summary skill usage

## Validation commands

- Build distributable outputs:
  - `pnpm build:packages`
- Type safety + tests + package tarball dry run:
  - `pnpm release:check`
- Package-focused tokens release dry run:
  - `pnpm release:check:tokens`
- Package-focused ui-web release dry run:
  - `pnpm release:check:ui-web`

## Notes about `@nexu-design/tokens`

`@nexu-design/ui-web` depends on `@nexu-design/tokens`, so a ui-web npm release is
only installable if the required tokens version/range is already published.
Changesets handles this by updating internal workspace dependency ranges during the
versioning step and publishing both packages from the same release flow when needed.
