# Package publishing and consumption workflow

This workspace is prepared for **future publish** of:

- `@nexu-design/tokens`
- `@nexu-design/ui-web`

No publishing is performed by default.

## Current package strategy

- Both packages now build to `dist/` using TypeScript emit (`.js` + `.d.ts`)
- `@nexu-design/ui-web` builds a precompiled `dist/styles.css` during package build
- `package.json` `exports` point to `dist` artifacts
- `files` is limited to publishable outputs (`dist`, `README.md`)
- `@nexu-design/ui-web/styles.css` remains the public CSS entrypoint
- `pack:check` runs build + publish-shape validation + `pnpm pack --dry-run`

This keeps the published outputs consumable by non-workspace apps without requiring
consumers to re-run Tailwind against the `ui-web` source package.

## `@nexu-design/ui-web` CSS contract

Consumers should import:

```ts
import '@nexu-design/ui-web/styles.css'
```

That file is a compiled library stylesheet, not a raw Tailwind entry file. Consumers
do not need to scan `@nexu-design/ui-web` with Tailwind `content` or Tailwind v4
`@source` rules to get the component utility classes used by the published package.

The release build blocks publishing if `packages/ui-web/dist/styles.css` looks like a
raw Tailwind input file instead of a compiled asset.

If an app also imports `@nexu-design/tokens/styles.css` separately, review the result
for duplicate global CSS. The preferred consumption path is to treat
`@nexu-design/ui-web/styles.css` as the single default stylesheet entry for `ui-web`
components.

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

For `ui-web`, import the published stylesheet entry in the consuming app:

```ts
import '@nexu-design/ui-web/styles.css'
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

`pnpm release:check:ui-web` verifies the publishable `ui-web` package shape, including
the compiled `dist/styles.css` contract.

## Notes about `@nexu-design/tokens`

`@nexu-design/ui-web` depends on `@nexu-design/tokens`, so a ui-web npm release is
only installable if the required tokens version/range is already published.
Changesets handles this by updating internal workspace dependency ranges during the
versioning step and publishing both packages from the same release flow when needed.
