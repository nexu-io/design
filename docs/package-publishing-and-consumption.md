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

#### Release model

- Use Changesets for every consumer-visible change.
- Treat `@nexu-design/tokens` as the upstream contract for `@nexu-design/ui-web`.
- Keep `@nexu-design/tokens` and `@nexu-design/ui-web` in a linked Changesets group so version bumps stay coordinated.
- Do not publish directly from feature PR merges. First create a version PR, then publish only after that PR lands on `main`.

#### Authoring a release

For any consumer-visible package change, add a changeset from the repo root:

```bash
pnpm changeset
```

Choose the affected package(s), select the semver bump type, and write a short summary.

Rules of thumb:

- **Only `ui-web` changes** → add a changeset for `@nexu-design/ui-web`.
- **Token/CSS contract changes** → add a changeset for `@nexu-design/tokens`.
- **Tokens change that affects ui-web consumption, styling, or compatibility** → add changesets for both packages.
- **Breaking change** → use `major` and include migration notes.

#### What the workflow does

- installs dependencies with pnpm
- requires a manual `workflow_dispatch` run with `action=version` to create or update the version PR
- applies version bumps and internal dependency updates in that PR
- publishes only when versioned package manifests land on `main` or when `action=publish` is run manually
- runs `pnpm release:check` before publishing
- protects publish through the `npm-publish` GitHub environment

#### First release bootstrap

The first npm release for each package must be done manually because the packages do not exist on npm yet.

1. Run:

   ```bash
   pnpm release:check
   pnpm build:packages
   ```

2. Publish `@nexu-design/tokens` manually first.
3. Confirm it is installable from npm.
4. Publish `@nexu-design/ui-web` manually second.
5. After both exist on npm, configure trusted publishing for `.github/workflows/release.yml`.

#### Local release checks

```bash
pnpm release:check
```

#### Release checklist

1. Add a changeset for each consumer-visible change.
2. Merge changesets into `main`.
3. Trigger **Release packages** with `action=version`.
4. Review and merge the generated `chore: version packages` PR.
5. Let the merge to `main` trigger the publish path, or run `action=publish` manually for recovery.

## Versioning + release notes expectations

- Use semver per package (`major.minor.patch`)
- Bump `@nexu-design/tokens` when tokens/CSS contract changes
- Bump `@nexu-design/ui-web` for component API or behavior changes
- If `@nexu-design/ui-web` needs newer tokens, bump both and keep dependency aligned
- Add concise release notes per version with:
  - **What changed** (consumer-visible)
  - **Migration impact** (if any)
  - **Any required CSS/theme updates**

## Hotfix and rollback

- For a bad published release, prefer a new patch release over unpublishing.
- Flow: revert or fix on a hotfix branch → add a patch changeset → merge → create a new version PR → publish.
- If a published version should not be used, deprecate it on npm rather than removing it.

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
