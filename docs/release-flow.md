# Release flow

This document is the repository-level reference for package release work in this repo.

## Scope

Publishable packages:

- `@nexu-design/tokens`
- `@nexu-design/ui-web`

Non-publishable workspace apps and internal packages should not receive release entries.

## Core commands

- Create a changeset: `pnpm changeset`
- Apply pending version bumps locally: `pnpm version:packages`
- Run release readiness checks: `pnpm release:check`
- Publish pending releases: `pnpm release`

## Release model

- Versioning and npm publishing are automated with Changesets.
- Changesets config lives in `.changeset/config.json`.
- The release workflow is `.github/workflows/release.yml`.
- Use Changesets for every consumer-visible package change.
- Treat `@nexu-design/tokens` as the upstream contract for `@nexu-design/ui-web`.
- `@nexu-design/tokens` and `@nexu-design/ui-web` are kept in a linked Changesets group so public versions stay coordinated.

## Authoring a release change

For any consumer-visible package change, add a changeset from the repo root:

```bash
pnpm changeset
```

Rules of thumb:

- **Only `ui-web` changes** → add a changeset for `@nexu-design/ui-web`; linked versioning will keep the public package versions coordinated.
- **Token/CSS contract changes** → add a changeset for `@nexu-design/tokens`.
- **Tokens change that affects ui-web consumption, styling, or compatibility** → prefer changesets for both packages so the release notes stay explicit.
- **Breaking change** → use `major` and include migration notes.

## CI enforcement

Pull requests that modify either of these paths must include a real changeset entry:

- `packages/tokens/**`
- `packages/ui-web/**`

Accepted changeset entries are `.changeset/*.md` files, excluding `.changeset/README.md`.

## Release workflow

1. Add and commit the required `.changeset/*.md` file(s).
2. Merge the feature PR into `main`.
3. Manually run the **Release packages** GitHub Actions workflow on `main` with `action=version`.
4. Review and merge the generated `chore: version packages` PR.
5. Let the merge to `main` trigger `.github/workflows/release.yml` and publish automatically.
6. Use `action=publish` only for manual retry or exceptional recovery.

## What the workflow does

- creates or updates the version PR only when manually dispatched with `action=version`
- applies version bumps and internal dependency updates in that PR
- keeps package-level changelog generation disabled; version PR creation does not depend on `packages/*/CHANGELOG.md`
- publishes only when the version PR lands on `main`, or when `action=publish` is run manually
- runs `pnpm release:check` before publishing
- requires publishable packages to declare `repository.url: "https://github.com/nexu-io/design"` so npm provenance validation passes

## npm trusted publishing setup

Use npm trusted publishing for both public packages instead of a long-lived `NPM_TOKEN`.

Configure a trusted publisher entry in the npm package settings for each package:

- `@nexu-design/tokens`
- `@nexu-design/ui-web`

For each package, set:

- Provider: `GitHub Actions`
- Repository owner: `nexu-io`
- Repository name: `design`
- Workflow file: `release.yml`

Notes:

- npm trusted publishing is configured per package, not once per scope.
- `.github/workflows/release.yml` must keep `id-token: write` on the publish job.
- `repository.url` in each publishable package manifest must match `https://github.com/nexu-io/design`.
- After trusted publishing is configured, the publish job does not need `NODE_AUTH_TOKEN` or `NPM_CONFIG_PROVENANCE`.

## First release bootstrap

This section is only for the one-time initial package creation flow. If the packages already exist on npm, skip it.

1. Run:

   ```bash
   pnpm release:check
   pnpm build:packages
   ```

2. Publish `@nexu-design/tokens` manually first with `npm publish --access public`.
3. Confirm it is installable from npm.
4. Publish `@nexu-design/ui-web` manually second.
5. After both exist on npm, configure npm trusted publishing for `.github/workflows/release.yml`.

## Validation commands

- Full release readiness: `pnpm release:check`
- Tokens package dry run: `pnpm release:check:tokens`
- UI package dry run: `pnpm release:check:ui-web`

For `@nexu-design/ui-web`, release validation must confirm that
`packages/ui-web/dist/styles.css` is the compiled publish artifact. Do not publish if
that file still contains raw Tailwind input directives such as `@source` or
`@import "tailwindcss"`.

## Hotfix and rollback

- Prefer a new patch release over unpublishing.
- Flow: revert or fix on a hotfix branch → add a patch changeset → merge → create a new version PR → publish.
- If a published version should not be used, deprecate it on npm rather than removing it.

## Release summary skill

When the user asks for release notes, release summaries, version PR summaries, or package publish notes, use:

- `.agents/skills/release-summary/SKILL.md`

Default expectations for this skill:

- generate the summary in English unless the user asks for another language
- prefer `.changeset/*.md` as the primary source
- summarize consumer-visible impact, not internal implementation detail
- split notes by package when both `tokens` and `ui-web` are involved

## Related docs

- `docs/package-publishing-and-consumption.md`
- `AGENTS.md`
