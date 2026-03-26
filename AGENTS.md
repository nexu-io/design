# AGENTS.md

## Scope
- Applies to the entire repository rooted at `/Users/mrc/Projects/nexu-io/ui`.
- This is a pnpm workspace for a React/TypeScript UI library plus Storybook.
- No existing `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` files were found.

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
  - `@nexu/ui-web`
  - `@nexu/tokens`
  - `@nexu/storybook`

## Install
- `pnpm install`

## Common root commands
- Start Storybook: `pnpm dev`
- Build Storybook: `pnpm build`
- Build publishable packages: `pnpm build:packages`
- Format everything: `pnpm format`
- Check formatting: `pnpm format:check`
- Run Biome checks: `pnpm biome:check`
- Run all tests in workspace: `pnpm test`
- Run all type checks: `pnpm typecheck`
- Run all package lint scripts: `pnpm lint`
- Run release readiness checks: `pnpm release:check`

## Package-specific commands

### `packages/ui-web`
- Build: `pnpm --filter @nexu/ui-web build`
- Test all: `pnpm --filter @nexu/ui-web test`
- Typecheck: `pnpm --filter @nexu/ui-web typecheck`
- Lint: `pnpm --filter @nexu/ui-web lint`
- Pack dry run: `pnpm --filter @nexu/ui-web pack:check`

### `packages/tokens`
- Build: `pnpm --filter @nexu/tokens build`
- Typecheck: `pnpm --filter @nexu/tokens typecheck`
- Lint: `pnpm --filter @nexu/tokens lint`
- Pack dry run: `pnpm --filter @nexu/tokens pack:check`

### `apps/storybook`
- Start: `pnpm --filter @nexu/storybook storybook`
- Build: `pnpm --filter @nexu/storybook build-storybook`
- Typecheck: `pnpm --filter @nexu/storybook typecheck`
- Lint: `pnpm --filter @nexu/storybook lint`

## Testing guidance
- Test runner: Vitest.
- Config: `packages/ui-web/vitest.config.ts`.
- Test environment: `jsdom`.
- Setup file: `packages/ui-web/src/test/setup.ts`.
- Test file pattern: `packages/ui-web/src/**/*.test.ts` and `packages/ui-web/src/**/*.test.tsx`.
- Tests are co-located with source files.

## Running a single test
- Single file from repo root:
  - `pnpm --filter @nexu/ui-web exec vitest run src/primitives/button.test.tsx`
- Single file from inside `packages/ui-web`:
  - `pnpm exec vitest run src/primitives/button.test.tsx`
- Single test by name from repo root:
  - `pnpm --filter @nexu/ui-web exec vitest run src/primitives/button.test.tsx -t "renders children"`
- Watch one file interactively:
  - `pnpm --filter @nexu/ui-web exec vitest src/primitives/button.test.tsx`

## Recommended validation before finishing changes
- For code changes in `ui-web`: run
  - `pnpm --filter @nexu/ui-web typecheck`
  - `pnpm --filter @nexu/ui-web test`
- For formatting-sensitive changes: run
  - `pnpm format:check`
  - `pnpm biome:check`
- Before release-oriented changes: run
  - `pnpm release:check`

## Formatting rules
- Formatter is Biome (`biome.json`).
- Indentation: 2 spaces.
- Max line width: 100.
- JavaScript/TypeScript quotes: single quotes.
- JSX attribute/string quotes: double quotes.
- Semicolons: as needed, not mandatory.
- Trailing commas: ES5 style.
- Respect existing file formatting; do not introduce a conflicting style.

## TypeScript rules
- The repo uses strict TypeScript (`strict: true`).
- Target/runtime baseline: ES2022 modules with bundler resolution.
- Keep `noEmit` expectations for typecheck commands.
- Prefer explicit prop types for public components.
- Reuse platform types like `React.ButtonHTMLAttributes<HTMLButtonElement>`.
- Use `VariantProps<typeof ...>` when a component is driven by CVA variants.
- Preserve declaration-output compatibility for package builds.
- Avoid `any`; use precise types, unions, generics, or `unknown` plus narrowing.

## Naming conventions
- Source filenames are kebab-case: `button.tsx`, `form-field.tsx`, `radio-group.tsx`.
- Test filenames mirror source names: `button.test.tsx`.
- Storybook stories use `*.stories.tsx`.
- Exported React component names are PascalCase: `Button`, `FormField`, `PageHeader`.
- Utility functions use camelCase: `cn`, `expectNoA11yViolations`.
- Props interfaces are PascalCase with a `Props` suffix: `ButtonProps`, `FormFieldProps`.
- Context value interfaces use descriptive names: `FormFieldContextValue`.

## Imports and exports
- Follow the existing import grouping pattern:
  1. React import(s)
  2. third-party packages
  3. blank line
  4. local relative imports
- Example: `packages/ui-web/src/primitives/button.tsx`.
- Prefer named exports over default exports.
- Keep barrel exports updated in `packages/ui-web/src/index.ts` when adding public API.
- Use `import type` where only types are needed when it improves clarity.

## React/component patterns
- Components commonly use `React.forwardRef` for DOM-facing primitives.
- Set `displayName` on `forwardRef` components.
- Prefer composition via Radix primitives rather than custom low-level behavior.
- Support `className` merging via the shared `cn()` helper.
- Use CVA (`class-variance-authority`) for variant-driven styling.
- Keep accessibility props and roles intact when wrapping Radix or native elements.
- When using `asChild`, preserve disabled/loading behavior carefully.

## Styling conventions
- Styling is Tailwind-utility-driven, with a shared `cn()` helper built from `clsx` + `twMerge`.
- Use tokens and CSS custom properties from `@nexu/tokens` and package `styles.css` files.
- Prefer variant classes via CVA over ad hoc conditional string concatenation.
- Reuse existing spacing, radius, typography, and color tokens when possible.
- Keep global styles in package-level `styles.css`; keep component styles inline via class names.

## Accessibility and UX expectations
- Accessibility is actively tested with `vitest-axe`.
- Prefer semantic roles and label associations that work with Testing Library queries.
- Preserve or improve `aria-*` wiring when changing form controls.
- Maintain keyboard/focus behavior from Radix primitives.
- Use visible and accessible loading/disabled states.

## Test conventions
- Tests use Vitest + Testing Library + `@testing-library/jest-dom`.
- Import helpers from `@testing-library/react` and `@testing-library/user-event`.
- Prefer assertions through accessible queries like `getByRole`.
- Include a11y coverage when practical via `expectNoA11yViolations(container)`.
- Keep tests close to the component under test.
- Add or update stories for meaningful UI surface changes.

## Error handling and defensive coding
- Fail fast for invalid component composition.
- Existing pattern: throw a clear error when required context is missing.
- Prefer descriptive errors over silent fallback when misuse indicates a developer mistake.
- Avoid broad try/catch blocks in UI components unless there is a concrete recovery path.
- Preserve ARIA and prop passthrough behavior when cloning or wrapping elements.

## When editing public components
- Maintain backward-compatible exports unless the change is intentional.
- Update `packages/ui-web/src/index.ts` for new public components/utilities.
- Add tests for new behavior.
- Add or update Storybook stories for discoverability.
- Ensure package builds still copy `styles.css` into `dist/`.

## Things not to assume
- Do not assume ESLint, Prettier, Jest, Turbo, or Nx are configured; the repo currently uses Biome, TypeScript, and Vitest.
- Do not assume hidden agent rules exist; none were found in Cursor/Copilot rule locations.

## Good agent behavior in this repo
- Make minimal, targeted changes.
- Match existing naming and file placement.
- Prefer improving existing primitives/patterns over creating parallel abstractions.
- Verify with the smallest relevant command first, then broader checks if needed.
- If changing test behavior, include the exact single-test command in your notes or handoff.
