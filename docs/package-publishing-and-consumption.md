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

### 3) Automated npm release flow with Changesets

This repo now uses Changesets for package versioning and npm release automation.

Core files:

- `.changeset/config.json`
- `.github/workflows/release.yml`

#### Recommended setup

Use npm trusted publishing for this repository instead of a long-lived `NPM_TOKEN`:

1. In npm package settings for both `@nexu-design/tokens` and `@nexu-design/ui-web`, add this repo/workflow as a trusted publisher.
2. Keep the workflow file name stable: `.github/workflows/release.yml`.
3. Publish from GitHub Actions on a GitHub-hosted runner.

#### Authoring a release

For any consumer-visible package change, add a changeset from the repo root:

```bash
pnpm changeset
```

Choose the affected package(s), select the semver bump type, and write a short summary.

#### What the workflow does

- installs dependencies with pnpm
- runs on pushes to `main`
- creates or updates a version PR when unreleased changesets are present
- applies version bumps and internal dependency updates in that PR
- publishes all unpublished public packages after the version PR is merged
- runs `pnpm release:check` before publishing

#### Local release checks

```bash
pnpm release:check
```

#### Release checklist

1. Add a changeset for each consumer-visible change.
2. Merge changesets into `main`.
3. Review and merge the generated `chore: version packages` PR.
4. Let the release workflow publish the new npm versions.

## Versioning + release notes expectations

- Use semver per package (`major.minor.patch`)
- Bump `@nexu-design/tokens` when tokens/CSS contract changes
- Bump `@nexu-design/ui-web` for component API or behavior changes
- If `@nexu-design/ui-web` needs newer tokens, bump both and keep dependency aligned
- Add concise release notes per version with:
  - **What changed** (consumer-visible)
  - **Migration impact** (if any)
  - **Any required CSS/theme updates**

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
