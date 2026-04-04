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

### 3) npm publish flow for `@nexu-design/ui-web`

`@nexu-design/ui-web` now has a dedicated GitHub Actions release workflow at
`.github/workflows/release-ui-web.yml`.

#### Recommended setup

Use npm trusted publishing for this repository instead of a long-lived `NPM_TOKEN`:

1. In npm package settings for `@nexu-design/ui-web`, add this repo/workflow as a trusted publisher.
2. Keep the workflow file name stable: `.github/workflows/release-ui-web.yml`.
3. Publish from GitHub Actions on a GitHub-hosted runner.

#### What the workflow does

- installs dependencies with pnpm
- runs `pnpm release:check`
- verifies the target `@nexu-design/ui-web` version is not already published
- verifies the required `@nexu-design/tokens` npm version/range already exists
- publishes `@nexu-design/ui-web` to npm when the workflow is triggered in publish mode

#### Trigger options

- **Manual validation / publish**: run the `Release ui-web to npm` workflow with
  the `publish` input set to `false` for validation-only or `true` to publish.
- **GitHub release publish**: publishing a GitHub Release also triggers npm publish.

#### Local release checks

For the full workspace gate:

```bash
pnpm release:check
```

For a faster package-focused gate:

```bash
pnpm release:check:ui-web
```

#### Release checklist

1. Bump `packages/ui-web/package.json` version.
2. Ensure the referenced `@nexu-design/tokens` range is already available on npm.
3. Add release notes describing consumer-visible changes and migration impact.
4. Run `pnpm release:check` locally if you want a preflight before CI.
5. Trigger the GitHub Actions workflow manually or publish a GitHub Release.

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
 - Package-focused ui-web release dry run:
   - `pnpm release:check:ui-web`

## Notes about `@nexu-design/tokens`

`@nexu-design/ui-web` depends on `@nexu-design/tokens`, so a ui-web npm release is
only installable if the required tokens version/range is already published.
The workflow fails early when that dependency is missing from npm.
