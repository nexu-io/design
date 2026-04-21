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
- **Before every commit** (mandatory): run `pnpm format` to auto-fix formatting, then `pnpm format:check` to verify. CI will reject unformatted code. Do this even for small changes — Biome formatting rules are strict and line-length violations are the most common CI failure.
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
- Full release guidance lives in `docs/release-flow.md`.
- Package publishing and local consumption guidance lives in `docs/package-publishing-and-consumption.md`.
- Use that document for:
  - changeset rules
  - version/publish workflow
  - release validation and rollback
  - release-summary skill usage
- Use `docs/package-publishing-and-consumption.md` for:
  - package build/publish artifact expectations
  - local workspace and `file:` consumption patterns
  - package relationship notes for consumers
- Keep the workflow filename stable if npm trusted publishing is configured against it.

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

### Product copy localization
- **Product-surface copy is hardcoded English, not routed through i18n.** This covers every UI string shipped to end users in the `apps/slark/src/renderer` product shell — dialog titles and buttons (e.g. `CreateChannelDialog`, `InvitePeopleDialog`), empty states, toasts, activity bar labels, chat header and composer labels, menu items, onboarding copy, workspace/agent/runtime panels, command palettes, etc. Write the English string inline; do not wrap with `useT(...)`, `t("...")`, or any i18n resolver. The product is English-first and mixed-locale UI creates a worse experience than a single clean language.
- **Do not regress hardcoded English copy back through i18n.** If a PR touches a surface that previously used `useT` and is now inline English, that is intentional — do not "restore" the i18n wiring. Reviewers should not treat the absence of `useT` as a bug unless the same screen still has some `useT` calls (inconsistent mixing is the real regression).
- **Exceptions — copy that should remain localized:**
  - User-generated content (workspace names, channel names, agent display names, messages, descriptions the user typed) — never translate, never hardcode; render as-is.
  - Mock / seed content for demos — keep in its authored language so demos feel authentic; do not auto-translate to English.
  - Legal / policy text (Terms, Privacy, cookie banners) — route through i18n if the product is sold in multiple legal jurisdictions.
  - Locale-sensitive formatting (dates, numbers, currencies, pluralization) — use `Intl.*` APIs, not hardcoded strings.
- **Related narrower rules already codified** (do not weaken these — the general policy above extends them, it does not replace them):
  - Decorative uppercase category labels (CHANNELS / PINNED / DIRECT MESSAGES) stay English with `uppercase tracking-wider` — see "Compact nav list density → Section header label language".
  - Page-level navigation tab labels stay English — see the rule in the Tabs section.
- **Shared component-library packages (`packages/ui-web`, `packages/tokens`) never hardcode product copy.** Library primitives (Button, Dialog, etc.) stay copy-free and receive labels via props — that pattern is unchanged.

### Layout conventions
- **Workspace content-panel layout**: every page rendered inside the OpenClaw workspace sidebar (Settings, Skills, Home, Deployments, Schedule, Rewards, Channels…) must use a consistent inner content wrapper: outer `h-full overflow-y-auto`, inner `max-w-[800px] mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8`. Do not use `max-w-3xl`, `max-w-4xl`, or other ad-hoc values — all panels share the same max-width, horizontal padding, and top spacing so margins stay consistent across pages.
- **Page header → content spacing**: `PageHeader` with `density="shell"` uses `pb-6` (24px) as bottom padding. This is the canonical gap between the title + subtitle block and whatever sits below it (tabs, content cards, etc.). All workspace panel pages must share this same spacing so the visual rhythm stays consistent. Do not override `pb-6` with ad-hoc margins or padding on the `PageHeader`; if a page needs tabs, place the `TabsList` directly after `PageHeader` — the header's built-in bottom padding provides the gap.
- **Selection check icon placement**: in selectable lists (model pickers, dropdown items, option lists), the check/checkmark icon for the selected item must always appear on the **right (trailing) side** of the row, never on the left. The left side is reserved for the item's icon/logo. Layout: `[icon/logo] [label] [meta] [check ✓]`. This keeps the visual hierarchy consistent — icons identify, checks confirm. Style the check icon with `strokeWidth={3}` and `text-text-heading` (bold + darkest color) so it reads clearly at small sizes.
- **Dropdown list hover style**: all clickable rows inside dropdown menus, popovers, and select panels must use `rounded-lg hover:bg-surface-2` for their hover state. Do not mix rounded and square hover backgrounds within the same dropdown, and do not use opacity variants like `bg-surface-2/50` — keep hover fills consistent and solid.
- **Compact nav list density** (channels, DMs, workspace lists, sidebar sections): use a tight vertical rhythm so rows read as one group, not a chain of pills. The canonical spec:
  - Scroll container: `px-2` (8px horizontal) so selected/hover rounded fills float 8px from the sidebar edge — **never** let the fill hug the panel wall.
  - Row gap: **`space-y-0.5`** (2px) — tight but not touching. This is the minimum gap that prevents adjacent filled states (hover + hover, focus-ring + hover, unread-bg + hover, selected + hover) from visually butting into each other when more than one row is styled at the same time. Do **not** use `space-y-1` (4px) or larger — that breaks the rows into disconnected pills. Do **not** use `space-y-0` — even though a single hovered row looks fine, two adjacent filled states glue together and look like one smudged block.
  - Row radius: `rounded-md` (8px) — `rounded-lg` (12px) looks pill-like inside narrow (≤240px) sidebars.
  - Row padding: `pl-2 pr-2 py-2` (8px vertical) with `gap-2.5` between icon and label, 13px text + 14px icon (`h-3.5 w-3.5`) yields a ~32px row height — comfortable breathing room without feeling floppy, matches Discord density. Use a 14px icon (not 16px) so the icon doesn't dominate 13px label text in narrow sidebars.
  - Unread / count badge: `h-4 min-w-4 rounded-full text-[10px] px-1` — keep it compact (16px) so it doesn't visually push row content or make rows feel crowded. Avoid the larger 18px badge inside a compact nav list.
  - Section header: `px-2 pt-3 pb-2` with `text-[11px] font-semibold uppercase tracking-wider text-nav-muted`. `pt-3` (12px) gives breathing room between sections; `pb-2` (8px) gives a clear gap between the decorative label and the first filled row so the label doesn't visually "touch" hover/selected backgrounds below it. Do not reduce to `pb-1` — 4px is not enough when the first row is hovered. 11px reads clearly at narrow sidebar widths without competing with the 13px row labels; 10px is too small and disappears.
  - Section header affordance button (e.g. the "+" to create a new channel): `h-6 w-6 rounded-md p-0` (24px hit area) with a `h-3.5 w-3.5` (14px) icon. Do not use `h-4 w-4` (16px) — the hover fill is too cramped to read as a real button and the tap target is below the accessible minimum.
  - Search / filter input at the top of the list: its wrapper container uses the **same `px-2`** as the list container below, so the input's horizontal bounds align with the selection/hover fills of the rows — a visual rhythm the user immediately reads as "this search filters this list". Mismatched insets (e.g. `px-3` search over `px-2` list) make the input look like a different component. Input styling: `h-8 border-border-subtle bg-nav-input`, focus state switches to `focus-within:border-transparent focus-within:ring-1` with the app's nav ring color. Do **not** use `border-transparent` at rest — a sidebar search without a visible border reads as a passive pill and loses affordance.
  - Section header label language: **decorative uppercase category labels stay English across all locales** (e.g. "CHANNELS" / "PINNED" / "DIRECT MESSAGES"). The `uppercase tracking-wider` styling is inherently English-first — CJK characters do not respond to `text-transform: uppercase`, and the wide letter-spacing looks wrong on CJK glyphs. Hardcode these strings rather than routing them through i18n. This matches the convention used by Slack / Cursor / Linear in their CJK locales. If a design explicitly needs localized category labels, drop `uppercase tracking-wider` and use sentence-case styling instead.
  - Apply the same paddings (`rounded-md pl-2 pr-2 py-[3px]`) to affordance rows at the bottom of a section (e.g. "Add channels", "New thread") so they stay visually part of the same list.
  - This density applies to channel lists, DM lists, workspace switchers, nested nav trees, and similar row-based sidebar surfaces. It does **not** apply to content lists (cards, settings rows) — those keep the looser `space-y-2` / `space-y-4` rhythm defined in "Spacing scale".
- **Selection row background**: selected rows in navigation bars, sidebars, channel lists, dropdowns, command menus, picker lists, and similar row-based surfaces must use a **neutral** background — `bg-surface-3` (one step darker than the hover's `bg-surface-2`) — paired with `text-text-heading` and `font-semibold`. **Never** fill a persistent selection with `--color-brand-primary`, `--color-accent`, or any semantic color token (warning, info, success, error) — those tokens are reserved for small accented badges, filled CTA buttons, links, focus rings, and status indicators. Emphasis on selected rows comes from **weight + text color contrast**, not from a colored fill. The same rule applies to app-level CSS variables (e.g. `--slark-color-nav-active`): map them to `--color-surface-3` / `--color-text-heading`, not to `--color-brand-primary` / `--color-accent`. **Exception** — only when a row represents a transient or real-time "spotlight" state (e.g. a moderation queue row currently being processed, a recording row currently capturing) may a brief brand tint be used, and it should be explicitly justified in the PR description. A persistent selected state is always neutral.
- **Row-level hover fill**: hover backgrounds on list rows, title buttons, header affordances, and any other interactive row-shaped target must use `hover:bg-surface-2` (neutral). **Never use `hover:bg-accent`** — Tailwind's `bg-accent` resolves to `hsl(var(--accent))` which is the raw brand **teal**, not our design-system `--color-accent` (near-black). Applying `hover:bg-accent` to a title or row floods the entire surface with teal on hover, violating the same "brand color reserved for accents only" rule as selection backgrounds. If you genuinely want a strong hover emphasis, use `hover:bg-surface-3`; if you want a brand-tinted hover on a single small inline target (e.g. a chip), use `hover:bg-[var(--color-brand-subtle)]`. When reviewing, `grep` new code for `hover:bg-accent` and replace it before landing.
- **Model / list-item tier badges**: when a selectable item is gated behind a subscription tier (e.g. Plus, Pro), display a small pill badge immediately after the item name, before any trailing meta (context window, price, check icon). Badge layout per row: `[icon/logo] [label] [tier badge] [meta] [check ✓]`. Style each tier distinctly:
  - **Plus** — `bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)]` (brand teal wash).
  - **Pro** — `bg-[var(--color-warning-subtle)] text-[var(--color-warning)]` (warm gold wash).
  Badge sizing: `rounded-[4px] px-1.5 py-[1px] text-[9px] font-semibold uppercase leading-tight`. The text is the tier name in uppercase (`PLUS` / `PRO`). Items with no `tier` value show no badge (free / included in all plans).
- **Settings row title font size**: setting row titles (e.g. "Launch at startup", "Usage analytics") use `text-[13px]` (`--text-size-base`), not 12px. These are primary labels and need the same body-text size for readability. Only descriptions/hints below the title use the smaller `text-[12px]`.
- **Settings row pattern**: within settings/preference pages, each setting item is a single horizontal row — `[title + description]` left-aligned, `[control (Switch / Select / Button)]` right-aligned — using `flex items-start justify-between gap-4`. Multiple rows within a section use `divide-y divide-border` for separation.
- **Chat-feed content-block widths** — every rich block rendered inside a chat message must belong to one of two predictable width tiers, so the conversation reads as a single vertical rhythm instead of a wobble of ad-hoc sizes:
 - **Card tier — `w-full max-w-[640px]`**: all "structured" cards in the feed — `CodeBlock` (collapsed + `CollapsedContentRow`), `DiffBlock`, `ToolResultBlock`, `ActionCard`, `ApprovalBlock`, `ProgressBlock`, `TopicCard`. These blocks carry titles, statuses, or multi-line details and need the horizontal room.
 - **Attachment tier — `w-[360px] max-w-full`**: all single-item media/file attachments — `FileAttachment`, `ImageAttachment` (default `width={360} height={220}`), `VideoAttachment`, `VoiceMessage`. They share the same frame regardless of payload so voice / file / image / video line up identically when stacked. `ImageGallery` is the one exception (3-column grid) and keeps its own `max-w-[480px]` so each thumbnail stays legible.
 - Do not hand-tune these widths per story or per message. If a new block needs a different size, decide explicitly which tier it belongs to and reuse the tier's width; do not introduce a third lane.
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
- **Accent color** (`--color-accent`) — primary interactive surfaces (filled buttons, toggles). Use `--color-accent-fg` for text on accent backgrounds. **Never use `bg-accent` / `hover:bg-accent` (or `/50`, `/40`, `/30` opacity variants) as a hover background on outline buttons, ghost buttons, list rows, menu items, or cards** — `--color-accent` is near-black in light mode and produces a heavy, filled affordance that reads as the primary action. Neutral hover fills must use `hover:bg-surface-2`; dropdown/menu rows must use `rounded-lg hover:bg-surface-2`; destructive-intent hover must use `hover:bg-destructive/10 hover:text-destructive` (see "Button variant selection").
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

### Frosted glass (translucent surfaces)
- Use the frosted-glass pattern for **chrome that floats over content** — sticky nav bars, activity bars, floating toasts/popovers — not for regular content panels.
- Canonical recipe: `bg-surface-0/85 backdrop-blur-md border border-border` (stacked nav/landing) or `bg-surface-1/80 backdrop-blur-md border border-border-subtle` (sidebar/activity bar over macOS vibrancy). Preserve the panel's native surface tone by using that surface at the alphas below instead of switching to a different color.
- **Always start from `--color-surface-1` (white), never `--color-surface-2` (gray)**, for frosted chrome in a light theme. `surface-2` is a gray token — at 50–70% alpha it reads as a dim gray wash even against a white desktop, making the chrome look dirty/dead instead of translucent. `surface-1` (white/card) at 75–85% alpha reads as "lightly frosted white" which is what Slack / Cursor / Finder sidebars look like. The same principle: if the solid fallback of your surface looks gray, the translucent version will look grayer.
- Alpha range depends on whether native vibrancy sits behind the surface:
  - **Over native vibrancy (Electron macOS with `vibrancy` set)**: 75–85% — this range lets a hint of the desktop shine through via blur without dragging the chrome grayer than the desktop. Going below 70% over vibrancy turns the sidebar visibly gray/dim (the vibrancy tint dominates), which users read as "something is wrong" rather than "frosted glass". If you want a more prominent desktop-blur feel, prefer moving `BrowserWindow` to a lighter `vibrancy` mode over dropping alpha further.
  - **Over in-window content only (no native vibrancy)**: 70–92% — higher alpha keeps legibility since there's no real desktop blur, just blurred in-window content.
  - Avoid `backdrop-saturate-*` unless you have a specific reason — saturating a blurred desktop wallpaper under a gray-ish frosted surface tends to deepen the perceived gray, not brighten it.
- Always pair translucency with `backdrop-blur-md` (medium blur). Heavier blurs (`backdrop-blur-xl`) are reserved for over-modal overlays and command palettes. Lighter blurs (`backdrop-blur-sm`) look muddy.
- Always add a subtle border (`border-border-subtle` for in-app chrome, `border-border` for landing-page chrome) — without a border, translucent surfaces bleed into neighbors and lose their edge.
- **Electron integration gotcha — the full parent chain must be transparent.** `backdrop-filter` / `backdrop-blur-*` only blurs what is **behind** the element in the same compositing layer. If **any** ancestor (html, body, #root, AppLayout root) has a solid background, that solid color covers the native vibrancy and the blur has nothing to reveal — the effect silently collapses to a flat tint. The Slark app enables this by:
  1. Setting `vibrancy: "sidebar"` and `visualEffectState: "active"` on `BrowserWindow` (darwin only). See `apps/slark/src/main/index.ts`.
  2. Not setting a solid `backgroundColor` on macOS windows (a solid bg suppresses vibrancy just like a solid DOM bg does). Non-mac platforms still set a solid `backgroundColor` so there's no black flash on startup.
  3. Keeping `html`, `body`, and `#root` at `background: transparent` (see `apps/slark/src/renderer/src/app/globals.css`) so vibrancy propagates up to the translucent chrome.
  4. Removing `bg-background` from the outermost layout container (e.g. `AppLayout`'s root `<div>`).
  5. Leaving the content panels (`Sidebar`, main chat view) with their own **opaque** `bg-nav` / `bg-surface-1` so only the chrome strip is translucent — long-form reading surfaces stay fully opaque.
- Do **not** apply this pattern to content panels (chat body, page cards, settings forms). Those are content-bearing surfaces and should stay fully opaque so text remains maximally readable.
- If you ever add a new top-level container above the ActivityBar, make sure it stays `background: transparent`; accidentally adding `bg-background` or `bg-surface-0` to a parent is the #1 way to silently break this effect.
- **The inverse gotcha — content panels must set their own opaque bg explicitly.** Because `html / body / #root / AppLayout` are transparent, any view that forgets `bg-surface-1` will silently show the native vibrancy through (it looks "frosted" but it's actually a bug — reading long-form text over vibrancy is uncomfortable and breaks the content/chrome distinction). The Slark app sets `bg-surface-1` on `AppLayout`'s `<main>` so every routed view inherits a solid white content canvas by default; individual views should not remove it. If a view truly wants to opt into the frosted chrome look (rare), it should still wrap its long-form text in an opaque inner panel.

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
- **Tab labels stay English across locales** for page-level navigation tabs (chat channel header tabs, settings nav tabs, skills nav tabs). These labels are short orientation markers — the same convention as decorative uppercase category labels (CHANNELS / PINNED / DIRECT MESSAGES). Hardcode them as English string literals rather than routing through i18n: CJK translations tend to be longer, breaking compact tab bars visually, and the tab icons already do most of the semantic work. If a particular tab genuinely needs localization, scale the tab container (not the individual triggers) and document the exception.
- **Compact tab size inside a chat/channel header**: when a tabs row sits inside a chrome header (directly under a channel title or page title), use a compact trigger size — `TabsList` `h-7 rounded-md p-0.5`, `TabsTrigger` `h-6 gap-1 px-2 text-[12px] font-semibold` with `size-3` (12px) icons. Full-size tabs (`text-sm`, `size-3.5` icons) look overweight when paired with a 15–16px channel title on the row above.
- **Unified chat/channel header (title + tabs in one block)**: when a channel header has both a title row and a tabs row, they must read as a **single** chrome surface — do not place a `border-b` between them. Wrap the title `WindowChrome` and the `TabsList` inside one container with a single bottom border, e.g. `<div className="border-b border-border px-4 pt-2 pb-1.5">[title row][tabs list]</div>`. A divider between the two rows reads as "two stacked toolbars" and wastes vertical space on what is conceptually one header. The single bottom border separates chrome from content.

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
