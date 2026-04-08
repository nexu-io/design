# AGENTS.md

## Scope
- Applies to the entire repository rooted at `/Users/mrc/Projects/nexu-io/design`.
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

## Testing guidance
- Test runner: Vitest.
- Config: `packages/ui-web/vitest.config.ts`.
- Test environment: `jsdom`.
- Setup file: `packages/ui-web/src/test/setup.ts`.
- Test file pattern: `packages/ui-web/src/**/*.test.ts` and `packages/ui-web/src/**/*.test.tsx`.
- Tests are co-located with source files.

## Storybook synchronization rules
- Treat Storybook as part of the component-library contract, not as optional follow-up work.
- When changing `packages/ui-web/src/primitives/*` or `packages/ui-web/src/patterns/*`, review whether the corresponding Storybook entry in `apps/storybook/src/stories/*` must be added or updated in the same change.
- Each public primitive in `packages/ui-web/src/primitives/*.tsx` should have its own dedicated story file in `apps/storybook/src/stories/` named `<primitive>.stories.tsx`.
- Dedicated primitive stories are the primary component docs; keep them focused on that single primitive.
- Grouped or multi-component stories should live as scenario pages under `Scenarios/...`, not under `Primitives/...`.
- When a primitive API, variants, slots, accessibility behavior, or visual states change, update both:
  - the dedicated primitive story
  - any scenario story that meaningfully demonstrates that primitive in context
- When adding a new public primitive, also:
  - export it from `packages/ui-web/src/index.ts`
  - add a dedicated Storybook story
  - add or update a scenario story if the component is mainly valuable in composition
- If a component is internal-only or not exported publicly, do not create Storybook coverage unless there is a clear documentation need.

## Running a single test
- Single file from repo root:
  - `pnpm --filter @nexu-design/ui-web exec vitest run src/primitives/button.test.tsx`
- Single file from inside `packages/ui-web`:
  - `pnpm exec vitest run src/primitives/button.test.tsx`
- Single test by name from repo root:
  - `pnpm --filter @nexu-design/ui-web exec vitest run src/primitives/button.test.tsx -t "renders children"`
- Watch one file interactively:
  - `pnpm --filter @nexu-design/ui-web exec vitest src/primitives/button.test.tsx`

## Recommended validation before finishing changes
- For code changes in `ui-web`: run
  - `pnpm --filter @nexu-design/ui-web typecheck`
  - `pnpm --filter @nexu-design/ui-web test`
- For Storybook changes or any component-library changes that should sync to Storybook: run
  - `pnpm --filter @nexu-design/storybook typecheck`
- For formatting-sensitive changes: run
  - `pnpm format:check`
  - `pnpm biome:check`
- Before release-oriented changes: run
  - `pnpm release:check`

## Release flow
- Versioning and npm publishing are automated with Changesets.
- Author consumer-visible package releases with `pnpm changeset`.
- Changesets config lives in `.changeset/config.json`.
- The release workflow is `.github/workflows/release.yml`.
- First-time package creation on npm must be done manually with `npm publish --access public`.
- Publish `@nexu-design/tokens` before `@nexu-design/ui-web` for the initial manual release.
- After the first manual publish, configure npm trusted publishing for both packages against `.github/workflows/release.yml`.
- Pushes to `main` with pending changesets create or update a `chore: version packages` PR.
- Merging that PR publishes any unpublished public packages to npm.
- `apps/demo` and `apps/storybook` are ignored by Changesets and should not receive release entries.
- Keep the workflow filename stable if npm trusted publishing is configured against it.

### Future release checklist
1. Run `pnpm changeset` for each consumer-visible package change.
2. Commit the generated `.changeset/*.md` file(s).
3. Open and merge the feature PR into `main`.
4. Review and merge the generated `chore: version packages` PR.
5. Let GitHub Actions publish the new package versions from `.github/workflows/release.yml`.

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

## Icon sizing in buttons and interactive elements
- Icons placed inside buttons or alongside text must have a visual weight that matches the adjacent text.
- Rule of thumb: use an icon size roughly equal to or slightly larger than the font size of the companion text so that the two feel balanced.
- Reference sizes for `Button` variants:
  - `size="xs"` (text ~11px) → icon 12px (`size={12}` or `className="size-3"`)
  - `size="sm"` (text ~13px) → icon 14px (`size={14}` or `className="size-3.5"`)
  - `size="default"` (text ~14px) → icon 16px (`size={16}` or `className="size-4"`)
  - `size="lg"` (text ~16px) → icon 18px (`size={18}` or `className="size-4.5"`)
- When an icon looks visually smaller or larger than the text next to it, adjust the icon size rather than the text size.
- Apply the same principle to inline icons in labels, badges, and navigation items.

## Styling conventions
- Styling is Tailwind-utility-driven, with a shared `cn()` helper built from `clsx` + `twMerge`.
- Use tokens and CSS custom properties from `@nexu-design/tokens` and package `styles.css` files.
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
- Keep dedicated primitive stories and relevant scenario stories in sync with the implementation.
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

---

## Component usage quick-reference

Use this section when consuming `@nexu-design/ui-web` components. For exhaustive props and examples, see `packages/ui-web/COMPONENT_REFERENCE.md`.

### Button
- **Variants:** `default`, `brand`, `primary`, `secondary`, `outline`, `ghost`, `soft`, `destructive`, `link`
- **Sizes:** `xs`, `sm`, `md` (default), `lg`, `inline`, `icon`, `icon-sm`
- **Key props:** `loading` (shows spinner, disables), `disabled`, `leadingIcon`, `trailingIcon`, `asChild`
- **Example:** `<Button variant="outline" size="sm"><ArrowUp size={14} /> Upgrade</Button>`

### Card
- **Variants:** `default`, `outline`, `muted`, `interactive`, `static`
- **Padding:** `none`, `sm`, `md` (default), `lg`
- **Composition:** `Card > CardHeader > CardTitle / CardDescription` + `CardContent` + `CardFooter`
- **Example:**
  ```tsx
  <Card variant="outlined" padding="sm">
    <CardHeader><CardTitle>Title</CardTitle></CardHeader>
    <CardContent>Body</CardContent>
  </Card>
  ```

### Badge
- **Variants:** `default`, `accent`, `secondary`, `outline`, `success`, `warning`, `danger`, `destructive`
- **Sizes:** `xs`, `sm`, `default`, `lg`
- **Radius:** `full` (default), `md`, `lg`
- **Example:** `<Badge variant="accent" size="xs">New</Badge>`

### Alert
- **Variants:** `default`, `info`, `success`, `warning`, `destructive`
- **Composition:** `Alert > AlertTitle + AlertDescription`; first `<svg>` child is auto-styled as the icon.
- **Example:**
  ```tsx
  <Alert variant="warning">
    <AlertCircle size={16} />
    <AlertTitle>Warning</AlertTitle>
    <AlertDescription>Credits running low.</AlertDescription>
  </Alert>
  ```

### Dialog
- **Sizes (on DialogContent):** `sm`, `md` (default), `lg`, `xl`, `full`
- **Composition:** `Dialog > DialogContent > DialogHeader > DialogTitle / DialogDescription` + `DialogBody` + `DialogFooter`
- **Key prop:** `closeOnOverlayClick` (default `true`)
- **Example:**
  ```tsx
  <Dialog open onOpenChange={setOpen}>
    <DialogContent size="sm">
      <DialogHeader>
        <DialogTitle>Confirm</DialogTitle>
        <DialogDescription>Are you sure?</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleConfirm}>Confirm</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  ```

### InteractiveRow
- **Tone:** `default`, `subtle`
- **Composition:** `InteractiveRow > InteractiveRowLeading + InteractiveRowContent + InteractiveRowTrailing`
- **Key props:** `selected`, `tone`, inherits `<button>` attributes
- **Example:**
  ```tsx
  <InteractiveRow tone="subtle" onClick={handleClick}>
    <InteractiveRowLeading><Icon size={16} /></InteractiveRowLeading>
    <InteractiveRowContent>Label text</InteractiveRowContent>
    <InteractiveRowTrailing><ChevronRight size={14} /></InteractiveRowTrailing>
  </InteractiveRow>
  ```

### StatCard
- **Props:** `label` (required), `value` (required), `icon` (ElementType), `tone` (`default` | `info` | `accent` | `success` | `warning` | `danger`), `trend` (`{ label, variant? }`), `meta` (ReactNode), `progress` (number), `progressVariant`, `progressMax`
- Inherits Card's `variant` and `padding` props.
- **Example:** `<StatCard label="Credits" value="1,200" icon={Zap} tone="accent" variant="outlined" padding="sm" />`

### PageHeader
- **Props:** `title` (required), `description`, `actions`
- Renders `<header>` with `<h1>`.

### Input
- **Sizes:** `sm`, `md` (default), `lg`
- **Key props:** `invalid` (boolean), `leadingIcon`, `trailingIcon`, `inputClassName`
- Default type is `text`. Sets `aria-invalid` when `invalid`.

### Select
- **Composition:** `Select > SelectTrigger > SelectValue` + `SelectContent > SelectGroup > SelectItem`
- Radix-based; `SelectContent` defaults to `position="popper"`.

### Switch
- **Sizes:** `default`, `sm`
- Radix-based; accepts `checked`, `onCheckedChange`, `disabled`.

### Checkbox
- Radix-based; accepts `checked`, `onCheckedChange`, `disabled`, `required`.

### FormField (pattern)
- **Props:** `label`, `description`, `error`, `required`, `invalid`, `orientation` (`vertical` | `horizontal`)
- **Composition:** `FormField > FormFieldLabel + FormFieldControl > (input) + FormFieldDescription + FormFieldError`
- Provides context to wire `id`, `aria-invalid`, `aria-describedby` automatically.
- **Example:**
  ```tsx
  <FormField label="Email" required invalid={!!error} error={error}>
    <FormFieldControl>
      <Input type="email" placeholder="you@example.com" />
    </FormFieldControl>
  </FormField>
  ```

### Tabs
- **Variants (TabsList / TabsTrigger):** `default`, `pill`, `underline`
- **Composition:** `Tabs > TabsList > TabsTrigger` + `TabsContent`

### TextLink
- **Variants:** `default`, `muted`
- **Sizes:** `xs`, `sm` (default), `default`, `lg`
- Renders `<a>`; supports `asChild`.

### Tooltip
- **Composition:** `TooltipProvider > Tooltip > TooltipTrigger + TooltipContent`
- `TooltipContent` default `sideOffset={4}`.

### Popover
- **Composition:** `Popover > PopoverTrigger + PopoverContent`
- `PopoverContent` defaults: `align="center"`, `sideOffset={4}`.

### Separator
- **Props:** `orientation` (`horizontal` default, `vertical`), `decorative` (default `true`)

### ScrollArea
- **Composition:** `ScrollArea` wraps scrollable content. Optional `ScrollBar` with `orientation` (`vertical` | `horizontal`).

---

## Design tokens cheat-sheet

Use these CSS custom properties via `var(--name)` in inline styles or Tailwind arbitrary values like `text-[var(--color-brand-primary)]`.

### Color — Text
| Token | Purpose |
|-------|---------|
| `--color-text-heading` | Strongest emphasis — headings, key numbers |
| `--color-text-primary` | Default body text |
| `--color-text-secondary` | Supporting text, labels |
| `--color-text-muted` | Hints, placeholders, disabled-adjacent |
| `--color-text-tertiary` | Weakest text (meta, timestamps) |
| `--color-text-disabled` | Disabled controls |

### Color — Surface
| Token | Purpose |
|-------|---------|
| `--color-surface-0` | Page canvas / background |
| `--color-surface-1` | Cards, panels |
| `--color-surface-2` | Secondary fills, hover states |
| `--color-surface-3` | Tertiary fills, dividers |
| `--color-surface-4` | Strong dividers, scrollbar tracks |

### Color — Brand & Semantic
| Token | Purpose |
|-------|---------|
| `--color-brand-primary` | Brand teal — links, accents, focus |
| `--color-brand-subtle` | Light brand wash background |
| `--color-accent` | Primary UI accent (near-black in light) |
| `--color-accent-fg` | Foreground on accent |
| `--color-accent-hover` | Accent hover state |
| `--color-success` | Positive states |
| `--color-success-subtle` | Success background wash |
| `--color-warning` | Caution states |
| `--color-warning-subtle` | Warning background wash |
| `--color-info` | Informational (blue) |
| `--color-info-subtle` | Info background wash |
| `--color-error` | Error / validation |
| `--color-error-subtle` | Error background wash |

### Color — Border
| Token | Purpose |
|-------|---------|
| `--color-border` | Default borders |
| `--color-border-subtle` | Lightest dividers |
| `--color-border-strong` | Emphasized dividers |
| `--color-border-hover` | Hovered controls |
| `--color-border-card` | Card outlines |

### Shadow
| Token | Purpose |
|-------|---------|
| `--shadow-xs` | Micro elevation |
| `--shadow-sm` | Small / subtle cards |
| `--shadow-md` | Medium panels |
| `--shadow-lg` | Large overlays |
| `--shadow-xl` | Heavy overlays |
| `--shadow-card` | Card elevation |
| `--shadow-dropdown` | Menus, popovers, dropdowns |
| `--shadow-focus` | Focus ring glow |

### Radius
| Token | Value | Use case |
|-------|-------|----------|
| `--radius-sm` | 6px | Small elements |
| `--radius-md` | 8px | Default controls |
| `--radius-lg` | 12px | Cards, panels |
| `--radius-xl` | 16px | Large cards |
| `--radius-2xl` | 20px | Hero sections |
| `--radius-pill` | 100px | Badges, pills |

### Typography
| Token | Value |
|-------|-------|
| `--font-sans` | Digits, Manrope, Inter, PingFang SC, system |
| `--font-mono` | JetBrains Mono, SF Mono, Fira Code |
| `--font-heading` | Georgia, Times New Roman, serif |
| `--text-size-2xs` | 0.625rem (10px) |
| `--text-size-xs` | 0.6875rem (11px) |
| `--text-size-sm` | 0.75rem (12px) |
| `--text-size-base` | 0.8125rem (13px) |
| `--text-size-lg` | 0.875rem (14px) |
| `--text-size-xl` | 1rem (16px) |
| `--text-size-2xl` | 1.25rem (20px) |
| `--text-size-3xl` | 1.5rem (24px) |

### Animation
| Token | Value | Purpose |
|-------|-------|---------|
| `--duration-fast` | 120ms | Quick hovers |
| `--duration-normal` | 200ms | Default transitions |
| `--ease-standard` | cubic-bezier(0.2, 0, 0, 1) | Shared easing |
