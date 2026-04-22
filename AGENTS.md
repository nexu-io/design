# AGENTS.md

## Scope
- Applies to the entire repository rooted at `/Users/mrc/Projects/nexu-io/design`.
- This is a pnpm workspace for a React/TypeScript UI library plus Storybook.
- This repo does not use `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md`; do not add them without discussion.

## Document map
- Design-system, UI, component usage, and token rules: `docs/design-system-guidelines.md`
- Product copy and localization policy: `docs/copy-and-localization.md`
- Shared component API design guidance: `docs/component-api-guidelines.md`
- Release workflow: `docs/release-flow.md`
- Package publishing and local consumption: `docs/package-publishing-and-consumption.md`
- Component API reference: `packages/ui-web/COMPONENT_REFERENCE.md`

## Repository map
- `package.json` — root workspace scripts.
- `pnpm-workspace.yaml` — workspace packages: `apps/*`, `packages/*`.
- `biome.json` — formatting rules.
- `tsconfig.base.json` — shared strict TypeScript settings.
- `packages/ui-web` — main React component library.
- `packages/tokens` — shared token package and CSS.
- `apps/storybook` — local component playground and docs.

## Package manager
- Use `pnpm` only.
- Workspace package names:
  - `@nexu-design/ui-web`
  - `@nexu-design/tokens`
  - `@nexu-design/storybook`

## Install
- `pnpm install`

## Common root commands
- Start Storybook: `pnpm dev`
- Build Storybook: `pnpm build`
- Build publishable packages: `pnpm build:packages`
- Create a changeset entry: `pnpm changeset`
- Format everything: `pnpm format`
- Check formatting: `pnpm format:check`
- Run Biome checks: `pnpm biome:check`
- Run all tests in workspace: `pnpm test`
- Run all type checks: `pnpm typecheck`
- Run all package lint scripts: `pnpm lint`
- Apply pending version bumps: `pnpm version:packages`
- Publish pending releases: `pnpm release`
- Run release readiness checks: `pnpm release:check`

## Package-specific commands

### `packages/ui-web`
- Build: `pnpm --filter @nexu-design/ui-web build`
- Test all: `pnpm --filter @nexu-design/ui-web test`
- Typecheck: `pnpm --filter @nexu-design/ui-web typecheck`
- Lint: `pnpm --filter @nexu-design/ui-web lint`
- Pack dry run: `pnpm --filter @nexu-design/ui-web pack:check`

### `packages/tokens`
- Build: `pnpm --filter @nexu-design/tokens build`
- Typecheck: `pnpm --filter @nexu-design/tokens typecheck`
- Lint: `pnpm --filter @nexu-design/tokens lint`
- Pack dry run: `pnpm --filter @nexu-design/tokens pack:check`

### `apps/storybook`
- Start: `pnpm --filter @nexu-design/storybook storybook`
- Build: `pnpm --filter @nexu-design/storybook build-storybook`
- Typecheck: `pnpm --filter @nexu-design/storybook typecheck`
- Lint: `pnpm --filter @nexu-design/storybook lint`

## Formatting and TypeScript rules
- Formatter is Biome (`biome.json`).
- Indentation: 2 spaces.
- Max line width: 100.
- JavaScript/TypeScript quotes: single quotes.
- JSX attribute/string quotes: double quotes.
- Semicolons: as needed, not mandatory.
- Trailing commas: ES5 style.
- Respect existing file formatting; do not introduce a conflicting style.
- The repo uses strict TypeScript (`strict: true`).
- Target/runtime baseline: ES2022 modules with bundler resolution.
- Keep `noEmit` expectations for typecheck commands.
- Prefer explicit prop types for public components.
- Reuse platform types like `React.ButtonHTMLAttributes<HTMLButtonElement>`.
- Use `VariantProps<typeof ...>` when a component is driven by CVA variants.
- Preserve declaration-output compatibility for package builds.
- Avoid `any`; use precise types, unions, generics, or `unknown` plus narrowing.

## Naming, imports, and component patterns
- Source filenames are kebab-case: `button.tsx`, `form-field.tsx`, `radio-group.tsx`.
- Test filenames mirror source names: `button.test.tsx`.
- Storybook stories use `*.stories.tsx`.
- Exported React component names are PascalCase.
- Utility functions use camelCase.
- Props interfaces are PascalCase with a `Props` suffix.
- Context value interfaces use descriptive names.
- Follow the existing import grouping pattern:
  1. React import(s)
  2. third-party packages
  3. blank line
  4. local relative imports
- Prefer named exports over default exports.
- Keep barrel exports updated in `packages/ui-web/src/index.ts` when adding public API.
- Use `import type` where only types are needed when it improves clarity.
- Components commonly use `React.forwardRef` for DOM-facing primitives.
- Set `displayName` on `forwardRef` components.
- Prefer composition via Radix primitives rather than custom low-level behavior.
- Support `className` merging via the shared `cn()` helper.
- Use CVA (`class-variance-authority`) for variant-driven styling.
- Keep accessibility props and roles intact when wrapping Radix or native elements.
- When using `asChild`, preserve disabled/loading behavior carefully.
- Before changing public UI, visual behavior, layout, variants, or interaction patterns, read `docs/design-system-guidelines.md`.
- Before changing product-surface copy or i18n behavior, read `docs/copy-and-localization.md`.

## Tests and accessibility
- Test runner: Vitest.
- Config: `packages/ui-web/vitest.config.ts`.
- Test environment: `jsdom`.
- Setup file: `packages/ui-web/src/test/setup.ts`.
- Test file pattern: `packages/ui-web/src/**/*.test.ts` and `packages/ui-web/src/**/*.test.tsx`.
- Tests are co-located with source files.
- Tests use Vitest + Testing Library + `@testing-library/jest-dom`.
- Import helpers from `@testing-library/react` and `@testing-library/user-event`.
- Prefer assertions through accessible queries like `getByRole`.
- Include a11y coverage when practical via `expectNoA11yViolations(container)`.
- Accessibility is actively tested with `vitest-axe`.
- Prefer semantic roles and label associations that work with Testing Library queries.
- Preserve or improve `aria-*` wiring when changing form controls.
- Maintain keyboard/focus behavior from Radix primitives.
- Use visible and accessible loading/disabled states.

## Running a single test
- From repo root:
  - `pnpm --filter @nexu-design/ui-web exec vitest run src/primitives/button.test.tsx`
  - `pnpm --filter @nexu-design/ui-web exec vitest run src/primitives/button.test.tsx -t "renders children"`
  - `pnpm --filter @nexu-design/ui-web exec vitest src/primitives/button.test.tsx`
- From inside `packages/ui-web`:
  - `pnpm exec vitest run src/primitives/button.test.tsx`

## Storybook and public-component synchronization
- Treat Storybook as part of the component-library contract, not as optional follow-up work.
- When changing public UI primitives or patterns, consult both `docs/design-system-guidelines.md` and `packages/ui-web/COMPONENT_REFERENCE.md` before updating stories.
- When changing `packages/ui-web/src/primitives/*` or `packages/ui-web/src/patterns/*`, review whether the corresponding Storybook entry in `apps/storybook/src/stories/*` must be added or updated in the same change.
- Each public primitive in `packages/ui-web/src/primitives/*.tsx` should have its own dedicated story file in `apps/storybook/src/stories/` named `<primitive>.stories.tsx`.
- Dedicated primitive stories are the primary component docs; keep them focused on that single primitive.
- Grouped or multi-component stories should live as scenario pages under `Scenarios/...`, not under `Primitives/...`.
- When a primitive API, variants, slots, accessibility behavior, or visual states change, update both the dedicated primitive story and any relevant scenario story.
- When adding a new public primitive, also:
  - export it from `packages/ui-web/src/index.ts`
  - add tests for new behavior
  - add a dedicated Storybook story
  - add or update a scenario story if the component is mainly valuable in composition
- If a component is internal-only or not exported publicly, do not create Storybook coverage unless there is a clear documentation need.
- Maintain backward-compatible exports unless the change is intentional.
- Ensure package builds still copy `styles.css` into `dist/`.

## Validation before finishing changes
- **Before every commit**: run `pnpm format`, then `pnpm format:check`.
- **Do not stop at running the commands**: after any code change, `pnpm format:check` and `pnpm biome:check` must both pass cleanly, and every reported issue must be fixed before you consider the work done.
- For code changes in `ui-web`:
  - `pnpm --filter @nexu-design/ui-web typecheck`
  - `pnpm --filter @nexu-design/ui-web test`
- For Storybook changes or component-library changes that should sync to Storybook:
  - `pnpm --filter @nexu-design/storybook typecheck`
- For formatting-sensitive changes:
  - `pnpm format:check`
  - `pnpm biome:check`
- Treat `pnpm format:check` and `pnpm biome:check` as required final gates for code changes, not optional spot checks.
- Before release-oriented changes:
  - `pnpm --filter @nexu-design/storybook typecheck`
  - `pnpm release:check`

## Release flow
- Release guidance lives in `docs/release-flow.md`.
- Package publishing and local consumption guidance lives in `docs/package-publishing-and-consumption.md`.
- Use those documents for changesets, version/publish workflow, release validation, rollback, package artifact expectations, and local `file:` consumption patterns.

## Error handling and defensive coding
- Fail fast for invalid component composition.
- Throw clear errors when required context is missing.
- Prefer descriptive errors over silent fallback when misuse indicates a developer mistake.
- Avoid broad try/catch blocks in UI components unless there is a concrete recovery path.
- Preserve ARIA and prop passthrough behavior when cloning or wrapping elements.

## Things not to assume
- Do not assume ESLint, Prettier, Jest, Turbo, or Nx are configured; the repo currently uses Biome, TypeScript, and Vitest.
- Do not assume hidden Cursor/Copilot rule files exist; this repo does not use them.

## Good agent behavior in this repo
- Make minimal, targeted changes.
- Match existing naming and file placement.
- Prefer improving existing primitives/patterns over creating parallel abstractions.
- Verify with the smallest relevant command first, then broader checks if needed.
- If changing test behavior, include the exact single-test command in your notes or handoff.
