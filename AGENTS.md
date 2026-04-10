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

## Design & styling

### Styling conventions
- Styling is Tailwind-utility-driven, with a shared `cn()` helper built from `clsx` + `twMerge`.
- Use tokens and CSS custom properties from `@nexu-design/tokens` and package `styles.css` files.
- Prefer variant classes via CVA over ad hoc conditional string concatenation.
- Reuse existing spacing, radius, typography, and color tokens when possible.
- Keep global styles in package-level `styles.css`; keep component styles inline via class names.

### Icon sizing in buttons and interactive elements
- Icons placed inside buttons or alongside text must have a visual weight that matches the adjacent text.
- Rule of thumb: use an icon size roughly equal to or slightly larger than the font size of the companion text so that the two feel balanced.
- Reference sizes for `Button` variants:
  - `size="xs"` (text ~11px) → icon 12px (`size={12}` or `className="size-3"`)
  - `size="sm"` (text ~13px) → icon 14px (`size={14}` or `className="size-3.5"`)
  - `size="default"` (text ~14px) → icon 16px (`size={16}` or `className="size-4"`)
  - `size="lg"` (text ~16px) → icon 18px (`size={18}` or `className="size-4.5"`)
- When an icon looks visually smaller or larger than the text next to it, adjust the icon size rather than the text size.
- Apply the same principle to inline icons in labels, badges, and navigation items.

### Layout conventions
- **Workspace content-panel layout**: every page rendered inside the OpenClaw workspace sidebar (Settings, Skills, Home, Deployments, Schedule, Rewards, Channels…) must use a consistent inner content wrapper: outer `h-full overflow-y-auto`, inner `max-w-[800px] mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8`. Do not use `max-w-3xl`, `max-w-4xl`, or other ad-hoc values — all panels share the same max-width, horizontal padding, and top spacing so margins stay consistent across pages.
- **Page header → content spacing**: `PageHeader` with `density="shell"` uses `pb-6` (24px) as bottom padding. This is the canonical gap between the title + subtitle block and whatever sits below it (tabs, content cards, etc.). All workspace panel pages must share this same spacing so the visual rhythm stays consistent. Do not override `pb-6` with ad-hoc margins or padding on the `PageHeader`; if a page needs tabs, place the `TabsList` directly after `PageHeader` — the header's built-in bottom padding provides the gap.
- **Selection check icon placement**: in selectable lists (model pickers, dropdown items, option lists), the check/checkmark icon for the selected item must always appear on the **right (trailing) side** of the row, never on the left. The left side is reserved for the item's icon/logo. Layout: `[icon/logo] [label] [meta] [check ✓]`. This keeps the visual hierarchy consistent — icons identify, checks confirm. Style the check icon with `strokeWidth={3}` and `text-text-heading` (bold + darkest color) so it reads clearly at small sizes.
- **Dropdown list hover style**: all clickable rows inside dropdown menus, popovers, and select panels must use `rounded-lg hover:bg-surface-2` for their hover state. Do not mix rounded and square hover backgrounds within the same dropdown, and do not use opacity variants like `bg-surface-2/50` — keep hover fills consistent and solid.
- **Model / list-item tier badges**: when a selectable item is gated behind a subscription tier (e.g. Plus, Pro), display a small pill badge immediately after the item name, before any trailing meta (context window, price, check icon). Badge layout per row: `[icon/logo] [label] [tier badge] [meta] [check ✓]`. Style each tier distinctly:
  - **Plus** — `bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)]` (brand teal wash).
  - **Pro** — `bg-[var(--color-warning-subtle)] text-[var(--color-warning)]` (warm gold wash).
  Badge sizing: `rounded-[4px] px-1.5 py-[1px] text-[9px] font-semibold uppercase leading-tight`. The text is the tier name in uppercase (`PLUS` / `PRO`). Items with no `tier` value show no badge (free / included in all plans).
- **Settings row title font size**: setting row titles (e.g. "Launch at startup", "Usage analytics") use `text-[13px]` (`--text-size-base`), not 12px. These are primary labels and need the same body-text size for readability. Only descriptions/hints below the title use the smaller `text-[12px]`.
- **Settings row pattern**: within settings/preference pages, each setting item is a single horizontal row — `[title + description]` left-aligned, `[control (Switch / Select / Button)]` right-aligned — using `flex items-start justify-between gap-4`. Multiple rows within a section use `divide-y divide-border` for separation.
- Action buttons (Save, Confirm, Submit) default to the **right** side of their container.
- In horizontal form rows the confirm button sits at the trailing (right) edge; in vertical stacks it right-aligns via `flex justify-end` or `ml-auto`.
- Cancel / secondary actions appear to the **left** of the primary confirm button.
- Use `DialogFooter` (which already right-aligns) for dialogs; for standalone form sections use `<div className="flex justify-end gap-2">`.

### Button variant selection
- Choose the variant that matches the action's weight and intent:
  | Scenario | Variant | Example |
  |----------|---------|---------|
  | Page-level primary action | `default` or `brand` | "Create project", "Deploy" |
  | Secondary / supporting action | `outline` | "Cancel", "View details" |
  | Tertiary / minimal-weight action | `ghost` | "Skip", "Not now" |
  | Destructive / irreversible action | `destructive` | "Delete workspace", "Revoke key" |
  | In-context soft action | `soft` | "Edit", "Retry" |
  | Navigation-like text action | `link` | "Learn more", "View docs" |
- A button group should have **at most one** `default`/`brand` button; others use `outline` or `ghost`.
- Pair `loading` prop with async actions; never leave a button clickable while a request is in flight.
- **Outline / bordered button text color**: inline bordered buttons (e.g. "Sign out", "Check for updates") in settings rows and cards must use `text-text-primary` (the deepest text color), not `text-text-secondary`. The border + background already convey "secondary weight"; dimming the label further makes it look disabled. Reserve `text-text-secondary` for ghost/link buttons where there is no visible border.
- **Sign-out / destructive-intent hover**: buttons with sign-out, disconnect, or revoke semantics should use `hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5` so the hover state clearly signals the destructive nature of the action, even when the resting state looks like a normal outline button.

### Typography hierarchy
- Use design tokens consistently to establish visual hierarchy:
  | Role | Token / Class | Weight |
  |------|--------------|--------|
  | Page title (`<h1>`) | `--text-size-2xl` / `--text-size-3xl` | `font-semibold` or `font-bold` |
  | Section heading (`<h2>`) | `--text-size-xl` | `font-semibold` |
  | Sub-heading (`<h3>`) | `--text-size-lg` | `font-medium` |
  | Body text | `--text-size-base` (13px) | `font-normal` |
  | Label / caption | `--text-size-sm` (12px) | `font-medium` |
  | Hint / meta / timestamp | `--text-size-xs` (11px) | `font-normal` |
- Pair text sizes with the correct text-color token:
  - Headings → `--color-text-heading`
  - Body → `--color-text-primary`
  - Labels → `--color-text-secondary`
  - Hints / placeholders → `--color-text-muted`
  - Disabled → `--color-text-disabled`
- Prefer `font-heading` (serif) only for hero / marketing headings; use `font-sans` everywhere else.
- Do not skip heading levels (e.g. `h1` → `h3`); keep the hierarchy sequential for accessibility.

### Spacing scale
- Use a consistent spacing scale to create rhythm:
  | Context | Recommended spacing |
  |---------|-------------------|
  | Between form fields | `space-y-4` or `gap-4` |
  | Between items in a compact list | `space-y-2` or `gap-2` |
  | Between page-level sections | `space-y-8` to `space-y-12` |
  | Between heading and its content | `mb-2` to `mb-4` |
  | Between card body elements | `space-y-3` |
  | Inline element groups (buttons, badges) | `gap-2` to `gap-3` |
  | Padding inside cards | Use Card's `padding` prop (`sm` / `md` / `lg`); avoid ad-hoc padding |
- Prefer Tailwind spacing utilities (`gap-*`, `space-y-*`, `p-*`) over custom pixel values.
- Keep spacing proportional: tighter inside components, looser between sections.

### Color usage
- **Semantic colors** — use for states and feedback only:
  | Color | Use for |
  |-------|---------|
  | `success` / `success-subtle` | Positive outcomes, completion, online status |
  | `warning` / `warning-subtle` | Caution states, approaching limits, pending |
  | `error` / `error-subtle` | Validation errors, failures, destructive emphasis |
  | `info` / `info-subtle` | Informational callouts, tips, neutral highlights |
- **Brand color** (`--color-brand-primary`) — links, focus rings, accented badges, brand emphasis. Do not use for status.
- **Accent color** (`--color-accent`) — primary interactive surfaces (filled buttons, toggles). Use `--color-accent-fg` for text on accent backgrounds.
- **Neutral text colors** — follow the hierarchy in "Typography hierarchy" above; never use raw hex/rgb.
- **Surface colors** — use the numbered scale in order: `surface-0` (page bg) → `surface-1` (cards) → `surface-2` (hover/secondary) → `surface-3` (dividers/tertiary). Do not skip levels.
- Do not mix semantic colors for decoration; they must convey meaning.

### Component selection guide
- Choosing between similar components:
  | Need | Use | Not |
  |------|-----|-----|
  | User picks a value from a closed list | `Select` | `DropdownMenu` |
  | User picks a value with search/filter | `Combobox` | `Select` |
  | Menu of actions / commands | `DropdownMenu` | `Select` |
  | Binary on/off setting | `Switch` | `Checkbox` |
  | Multiple independent boolean options | `Checkbox` (each) | `Switch` |
  | Confirmation before destructive action | `ConfirmDialog` | plain `Dialog` |
  | Slide-over panel from edge | `Sheet` | `Dialog` |
  | Centered modal with focus trap | `Dialog` | `Sheet` |
  | Brief helper text on hover | `Tooltip` | `Popover` |
  | Rich interactive overlay (forms, menus) | `Popover` | `Tooltip` |
  | Navigation between views | `Tabs` | `Select` |
  | Inline status indicator | `Badge` or `StatusDot` | plain `<span>` |
  | Labeled form input with validation | `FormField > Input` | bare `Input` |
- When in doubt, prefer the higher-level pattern (`FormField`, `ConfirmDialog`, `PageHeader`) over manually composing primitives.

### Elevation & shadow
- Apply shadows to convey depth, not decoration:
  | Element | Shadow token |
  |---------|-------------|
  | Cards (resting) | `--shadow-card` or `--shadow-sm` |
  | Cards (hover / interactive) | `--shadow-md` |
  | Dropdowns, popovers, select menus | `--shadow-dropdown` |
  | Dialogs / modals | `--shadow-lg` |
  | Heavy overlays / command palettes | `--shadow-xl` |
  | Focus rings | `--shadow-focus` |
- Do not stack multiple shadow tokens on the same element.
- Elevation should increase with z-index: page content → cards → popovers → modals.
- Match `border-radius` to context: `--radius-md` for controls, `--radius-lg` for cards, `--radius-xl` for large panels.

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
- **Props:** `title` (required), `description`, `actions`, `density` (`"default"` | `"shell"`)
- `density="shell"` — compact variant for embedded desktop/Electron panels: smaller title (20px bold), 12px tertiary description, `pb-6` (24px) bottom padding to content below.
- `density="default"` — standard web page header: larger title (24px semibold), 14px description, `pb-6` bottom padding.
- All workspace panel pages (Settings, Skills, Deployments, Schedule, Rewards, Channels…) use `density="shell"`.
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
- **Variants (TabsList / TabsTrigger):** `default`, `compact`
- **Composition:** `Tabs > TabsList > TabsTrigger` + `TabsContent`
- **All triggers use `font-semibold`** by default (both active and inactive) to prevent width shift on selection. The active tab is distinguished by `bg-white` fill against the `bg-surface-2` list background.
- **Page-level tabs must include icons**: when a tab controls a large content area (most or all of the page changes on switch — e.g. Settings "General" / "AI Model Providers", Skills "Yours" / "Explore"), each `TabsTrigger` must include a leading icon (`size={14}`) to reinforce the category at a glance. Use the built-in `gap-1.5` on the trigger to space icon and label. Reserve text-only tabs for lightweight, in-section switching where icons would add visual noise.

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
