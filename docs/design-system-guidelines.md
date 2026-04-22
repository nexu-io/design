# Design System Guidelines

See also:
- `../AGENTS.md`
- `./copy-and-localization.md`
- `./component-api-guidelines.md`
- `../packages/ui-web/COMPONENT_REFERENCE.md`

Use this doc for:
- visual and interaction constraints
- component selection and usage conventions
- layout, spacing, typography, color, and elevation rules
- component quick-reference
- design token reference

## Table of contents
- [Applicability](#applicability)
- [Design & styling](#design--styling)
  - [Styling conventions](#styling-conventions)
  - [Icon sizing in buttons and interactive elements](#icon-sizing-in-buttons-and-interactive-elements)
  - [Layout conventions](#layout-conventions)
  - [Button variant selection](#button-variant-selection)
  - [Typography hierarchy](#typography-hierarchy)
  - [Spacing scale](#spacing-scale)
  - [Color usage](#color-usage)
  - [Component selection guide](#component-selection-guide)
  - [Elevation & shadow](#elevation--shadow)
  - [Frosted glass (translucent surfaces)](#frosted-glass-translucent-surfaces)
- [Component usage quick-reference](#component-usage-quick-reference)
- [Design tokens cheat-sheet](#design-tokens-cheat-sheet)

## Applicability
- Applies whenever work touches user-facing UI, Storybook docs, visual states, or interaction patterns.
- Shared library packages such as `packages/ui-web` and `packages/tokens` should follow these rules unless a file or task explicitly documents an exception.

## Design & styling

### Styling conventions
- Styling is Tailwind-utility-driven, with a shared `cn()` helper built from `clsx` + `twMerge`.
- Use tokens and CSS custom properties from `@nexu-design/tokens` and package `styles.css` files.
- Prefer variant classes via CVA over ad hoc conditional string concatenation.
- Reuse existing spacing, radius, typography, and color tokens when possible.
- Prefer semantic Tailwind utility classes when the design-system mapping already exists; use `var(--token)` arbitrary values when a semantic utility is unavailable.
- Keep global styles in package-level `styles.css`; keep component styles inline via class names.

### Icon sizing in buttons and interactive elements
- Icons placed inside buttons or alongside text must have a visual weight that matches the adjacent text.
- Rule of thumb: use an icon size roughly equal to or slightly larger than the companion text so that the two feel balanced.
- Reference sizes for `Button` variants:
  - `size="xs"` (11px text) → icon 12px (`size={12}` or `className="size-3"`)
  - `size="sm"` (13px text) → icon 14px (`size={14}` or `className="size-3.5"`)
  - `size="md"` (default) → icon 16px (`size={16}` or `className="size-4"`)
  - `size="lg"` → icon 18px (`size={18}` or `className="size-[18px]"`)
- Match the icon to the current text token used by the button size instead of hardcoding font-size assumptions in call sites.
- When an icon looks visually smaller or larger than the text next to it, adjust the icon size rather than the text size.
- Apply the same principle to inline icons in labels, badges, and navigation items.

### Layout conventions
- **Workspace content-panel layout**: every page rendered inside the OpenClaw workspace sidebar (Settings, Skills, Home, Deployments, Schedule, Rewards, Channels…) must use a consistent inner content wrapper: outer `h-full overflow-y-auto`, inner `max-w-[800px] mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8`.
- **Page header → content spacing**: `PageHeader` with `density="shell"` uses `pb-6` (24px) as bottom padding. Do not override it with ad-hoc spacing.
- **Selection check icon placement**: use the row pattern `[icon/logo] [label] [meta] [check ✓]`. Icons identify; checks confirm selection. In selectable lists, the selected checkmark must appear on the **right** side of the row, never on the left. Style it with `strokeWidth={3}` and `text-text-heading`.
- **Dropdown list hover style**: clickable rows inside dropdown menus, popovers, and select panels must use `rounded-lg hover:bg-surface-2`. Do not mix rounded and square hover shapes in the same list, and do not soften this with opacity variants like `/50` or `/40`.
- **Compact nav list density** (channels, DMs, workspace lists, sidebar sections):
  - Scroll container: `px-2`
  - Row gap: `space-y-0.5` (do not collapse to `0` or loosen to `1`; this is the balanced dense rhythm)
  - Row radius: `rounded-md` (do not jump to `rounded-lg`; large pills make compact lists look bloated)
  - Row padding: `pl-2 pr-2 py-2` with `gap-2.5`
  - Unread/count badge: `h-4 min-w-4 rounded-full text-[10px] px-1`
  - Section header: `px-2 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-nav-muted` (keep `pb-2`; `pb-1` crowds the first row below)
  - Section header affordance button: `h-6 w-6 rounded-md p-0` with `h-3.5 w-3.5` icon (use 14px icons here, not 16px)
  - Search/filter input wrapper should use the same `px-2` as the list below
  - Search/filter input should use `h-8 border-border-subtle bg-nav-input` with `focus-within:border-transparent focus-within:ring-1`
  - Do not use `border-transparent` in the resting state; the field still needs a visible interactive boundary before focus
  - Decorative uppercase labels stay English across locales; see `docs/copy-and-localization.md`
  - Bottom affordance rows should match the same list padding rhythm
  - Applies to row-based sidebar surfaces, not content lists
- **Selection row background**: selected rows in list-like surfaces must use a neutral background such as `bg-surface-3` with `text-text-heading` and `font-semibold`. Do not use brand/accent/semantic fills for persistent selection states.
- **Selection row exception**: transient real-time spotlight states such as a moderation row actively processing or a recording row actively capturing may temporarily use a brand tint. Call that exception out explicitly in the PR description so reviewers know it is intentional.
- **Row-level hover fill**: use `hover:bg-surface-2` for row-shaped targets.
- **Model/list-item tier badges**:
  - Plus: `bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)]`
  - Pro: `bg-[var(--color-warning-subtle)] text-[var(--color-warning)]`
  - Badge size: `rounded-[4px] px-1.5 py-[1px] text-[9px] font-semibold uppercase leading-tight`
  - Row layout: `[icon/logo] [label] [tier badge] [meta] [check ✓]`; the tier badge sits immediately after the label, not floating near the trailing meta
  - If a model or list item has no tier value, omit the badge entirely
- **Settings row title font size**: use `text-[13px]` for titles; descriptions/hints use `text-[12px]`.
- **Settings row pattern**: `[title + description]` on the left, `[control]` on the right, using `flex items-start justify-between gap-4`; multiple rows use `divide-y divide-border`.
- **Chat-feed content-block widths**:
  - Card tier: `w-full max-w-[640px]` — use for `CodeBlock`, `DiffBlock`, `ToolResultBlock`, `ActionCard`, `ApprovalBlock`, `ProgressBlock`, and `TopicCard`
  - Attachment tier: `w-[360px] max-w-full` — use for `FileAttachment`, `ImageAttachment` (default `width={360} height={220}`), `VideoAttachment`, and `VoiceMessage`
  - `ImageGallery` is the explicit third-width exception: `max-w-[480px]` with a 3-column layout when needed
  - Do not introduce ad-hoc third-width tiers without an explicit reason.
- **Avatar shape and hairline border**:
  - **Human (user) and AI (agent) avatars are always circular (`rounded-full`).** Shape is a semantic signal — circles read as "who", squares read as "what". Mixing round users with square agents inside the same list makes agents look like apps rather than teammates.
  - **Workspace / team / organization / integration icons** stay rounded-rectangular (`rounded-lg` for ≤ 40px, `rounded-xl` for larger). Those represent containers and tools, not beings.
  - Canonical recipe for a resting bare `<img>` / `<div>` avatar: `rounded-full bg-secondary ring-1 ring-inset ring-black/5`.
    - `ring-inset` is required — a non-inset 1px ring around a `rounded-full` image bleeds past the circular mask at the corners.
    - `bg-secondary` is the fallback fill while remote avatars load, preventing a transparent circle on white surfaces.
  - Exceptions: avatars wrapped in the `Avatar` primitive (the primitive already applies `ring-1 ring-[var(--color-border-subtle)]`, so do not double-ring); stacked/overlapping avatars use `ring-2 ring-surface-0` instead (thicker ring in the surface color draws the separating "gap"); tiny decorative avatars ≤ 20px omit the hairline ring (a 1px ring on a 16px circle swallows the image).
  - Status dots / notification badges anchored to an avatar keep their own `border-2 border-nav` separator — independent of the avatar's hairline ring.
- Primary action buttons default to the **right** side of their container; secondary/cancel actions sit to the left.
- Use `DialogFooter` for dialogs; for standalone form sections use `<div className="flex justify-end gap-2">`.

### Button variant selection

| Scenario | Variant | Example |
|----------|---------|---------|
| Page-level primary action | `default` or `brand` | "Create project", "Deploy" |
| Secondary / supporting action | `outline` | "Cancel", "View details" |
| Tertiary / minimal-weight action | `ghost` | "Skip", "Not now" |
| Destructive / irreversible action | `destructive` | "Delete workspace", "Revoke key" |
| In-context soft action | `soft` | "Edit", "Retry" |
| Navigation-like text action | `link` | "Learn more", "View docs" |

- A button group should have **at most one** `default`/`brand` button.
- Pair `loading` with async actions; never leave a button clickable while a request is in flight.
- Inline bordered buttons should use `text-text-primary`, not `text-text-secondary`.
- Sign-out/disconnect/revoke hover states should use destructive styling: `hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5`.
- Buttons must not change shadow on hover. Forbidden examples include `hover:shadow-md`, `hover:shadow-lg`, and accent-tinted shadows such as `hover:shadow-accent/20`.
- Cards may lift; buttons may not. Do not create a second elevation jump by combining button hover with card hover.

### Typography hierarchy

| Role | Token / Class | Weight |
|------|--------------|--------|
| Page title (`<h1>`) | `--text-size-2xl` / `--text-size-3xl` | `font-semibold` or `font-bold` |
| Section heading (`<h2>`) | `--text-size-xl` | `font-semibold` |
| Sub-heading (`<h3>`) | `--text-size-lg` | `font-medium` |
| Body text | `--text-size-base` | `font-normal` |
| Label / caption | `--text-size-sm` | `font-medium` |
| Hint / meta / timestamp | `--text-size-xs` | `font-normal` |

- Use the matching text-color tokens:
  - Headings → `--color-text-heading`
  - Body → `--color-text-primary`
  - Labels → `--color-text-secondary`
  - Hints/placeholders → `--color-text-muted`
  - Disabled → `--color-text-disabled`
- Prefer `font-heading` only for hero/marketing headings.
- Do not skip heading levels.

### Spacing scale

| Context | Recommended spacing |
|---------|-------------------|
| Between form fields | `space-y-4` or `gap-4` |
| Between items in a compact list | `space-y-2` or `gap-2` |
| Between page-level sections | `space-y-8` to `space-y-12` |
| Between heading and its content | `mb-2` to `mb-4` |
| Between card body elements | `space-y-3` |
| Inline element groups (buttons, badges) | `gap-2` to `gap-3` |
| Padding inside cards | Use Card's `padding` prop (`sm` / `md` / `lg`) |

- Prefer Tailwind spacing utilities over custom pixel values.

### Color usage

| Color | Use for |
|-------|---------|
| `success` / `success-subtle` | Positive outcomes, completion, online status |
| `warning` / `warning-subtle` | Caution states, approaching limits, pending |
| `error` / `error-subtle` | Validation errors, failures, destructive emphasis |
| `info` / `info-subtle` | Informational callouts, tips, neutral highlights |

- Brand color is for links, focus rings, badges, and brand emphasis — not status.
- Accent color is for primary interactive surfaces. Do not use `bg-accent`/`hover:bg-accent` as a general hover background on rows, menu items, cards, or outline/ghost buttons. Tailwind's default `bg-accent` resolves to raw brand teal (`hsl(var(--accent))`), not the design-system `--color-accent`, so the hover state will drift green.
- If you intentionally need a brand-tinted hover background, use `hover:bg-[var(--color-brand-subtle)]` instead.
- Use the numbered surface scale in order: `surface-0` → `surface-1` → `surface-2` → `surface-3`.
- Do not use semantic colors decoratively.

### Component selection guide

| Need | Use | Not |
|------|-----|-----|
| User picks a value from a closed list | `Select` | `DropdownMenu` |
| User picks a value with search/filter | `Combobox` | `Select` |
| Menu of actions / commands | `DropdownMenu` | `Select` |
| Binary on/off setting | `Switch` | `Checkbox` |
| Multiple independent boolean options | `Checkbox` | `Switch` |
| Confirmation before destructive action | `ConfirmDialog` | plain `Dialog` |
| Slide-over panel from edge | `Sheet` | `Dialog` |
| Centered modal with focus trap | `Dialog` | `Sheet` |
| Brief helper text on hover | `Tooltip` | `Popover` |
| Rich interactive overlay | `Popover` | `Tooltip` |
| Navigation between views | `Tabs` | `Select` |
| Inline status indicator | `Badge` or `StatusDot` | plain `<span>` |
| Labeled form input with validation | `FormField > Input` | bare `Input` |

- Prefer higher-level patterns (`FormField`, `ConfirmDialog`, `PageHeader`) over manual primitive composition where possible.

### Elevation & shadow

| Element | Shadow token |
|---------|-------------|
| Cards (resting) | `--shadow-card` or `--shadow-sm` |
| Cards (hover / interactive) | `--shadow-md` |
| Dropdowns, popovers, select menus | `--shadow-dropdown` |
| Dialogs / modals | `--shadow-lg` |
| Heavy overlays / command palettes | `--shadow-xl` |
| Focus rings | `--shadow-focus` |

- Do not stack multiple shadow tokens on the same element.
- Elevation should increase with z-index.
- Match radius to context: `--radius-md` for controls, `--radius-lg` for cards, `--radius-xl` for large panels.

### Frosted glass (translucent surfaces)
- Use frosted glass for floating chrome, not regular content panels.
- Canonical recipes:
  - `bg-surface-0/85 backdrop-blur-md border border-border`
  - `bg-surface-1/80 backdrop-blur-md border border-border-subtle`
- Always start from `--color-surface-1`, not `--color-surface-2`, for light-theme frosted chrome.
- Alpha guidance:
  - Over native vibrancy: 75–85%
  - Over in-window content only: 70–92%
- Pair translucency with `backdrop-blur-md` and a subtle border.
- Keep the full parent chain transparent when relying on native vibrancy.
- Electron/macOS native vibrancy checklist:
  1. Set `BrowserWindow` `vibrancy`.
  2. Set `visualEffectState` so the material keeps updating with window activity.
  3. Provide a platform-appropriate transparent or nearly transparent `backgroundColor`.
  4. Keep `html`, `body`, and `#root` transparent.
  5. Keep shell/layout wrappers such as `AppLayout` transparent; do not add a fallback `bg-background` over the chrome layer.
- Reverse trap: content panels must still set their own opaque `bg-surface-1`. If a long-form panel inherits the vibrancy backdrop by accident, that is a bug, not a frosted style.

---

## Component usage quick-reference

Use this section when consuming `@nexu-design/ui-web` components. For exhaustive props and examples, see `packages/ui-web/COMPONENT_REFERENCE.md`.

### Button
- Variants: `default`, `brand`, `primary`, `secondary`, `outline`, `ghost`, `soft`, `destructive`, `link`
- Sizes: `xs`, `sm`, `md`, `lg`, `inline`, `icon`, `icon-sm`
- Key props: `loading`, `disabled`, `leadingIcon`, `trailingIcon`, `asChild`

### Card
- Variants: `default`, `outline`, `muted`, `interactive`, `static`
- Padding: `none`, `sm`, `md`, `lg`

### Badge
- Variants: `default`, `accent`, `secondary`, `outline`, `success`, `warning`, `danger`, `destructive`
- Sizes: `xs`, `sm`, `default`, `lg`

### Alert
- Variants: `default`, `info`, `success`, `warning`, `destructive`

### Dialog
- Sizes: `sm`, `md`, `lg`, `xl`, `full`
- Key prop: `closeOnOverlayClick`

### InteractiveRow
- Tone: `default`, `subtle`
- Key props: `selected`, `tone`; inherits `<button>` attributes

### StatCard
- Props: `label`, `value`, `icon`, `tone`, `trend`, `meta`, `progress`, `progressVariant`, `progressMax`

### PageHeader
- Props: `title`, `description`, `actions`, `density`
- For workspace panel spacing and `density="shell"` usage, follow the rule in `Layout conventions` above.

### Input
- Sizes: `sm`, `md`, `lg`
- Key props: `invalid`, `leadingIcon`, `trailingIcon`, `inputClassName`

### Select
- Composition: `Select > SelectTrigger > SelectValue` + `SelectContent > SelectGroup > SelectItem`

### Switch
- Sizes: `default`, `sm`

### Checkbox
- Accepts `checked`, `onCheckedChange`, `disabled`, `required`

### FormField
- Props: `label`, `description`, `error`, `required`, `invalid`, `orientation`

### Tabs
- Variants: `default`, `compact`
- Page-level tabs must include icons.
- Page-level tab labels stay English unless a documented exception applies; see `docs/copy-and-localization.md`.
- In chrome-like chat/channel/settings headers, all triggers stay `font-semibold` in both active and inactive states so the label width does not jump on selection.
- Compact header tabs should use `TabsList h-7 rounded-md p-0.5`, `TabsTrigger h-6 gap-1 px-2 text-[12px] font-semibold`, and `size-3` icons.
- Keep the title row and `TabsList` inside the same header container so they share one `border-b`; do not split them into two stacked bordered toolbars.

### TextLink
- Variants: `default`, `muted`
- Sizes: `xs`, `sm`, `default`, `lg`, `inherit`
- **Clickable inline links use the link color, not a muted/neutral tone**: for any anchor rendered inside body text (Terms / Privacy, "Learn more", "Contact support", docs deep-links inside descriptions, etc.), use `variant="default"` — it resolves to `--color-link` (brand teal). `variant="muted"` is reserved for rare cases where the link needs to visually recede on purpose (e.g. decorative footer meta where the destination is optional). A "normal" clickable word in a paragraph should always read as a link, not as gray body text.
- **Inline links must match the surrounding paragraph's font size** — no mixed sizes on the same row. Use `size="inherit"` when the link sits inside a `<p>`, caption, label, or any container that already sets a `text-*` class; the link will adopt the parent size instead of forcing its own. Use a concrete size (`xs` / `sm` / `default` / `lg`) only when the link is a standalone line, button-like affordance, or sits outside body copy.
  - Good: `<p className="text-[11px]">By continuing, you agree to our <TextLink href="#" size="inherit">Terms</TextLink>.</p>`
  - Bad: `<p className="text-[11px]">… <TextLink size="xs">Terms</TextLink> …</p>` — `size="xs"` resolves to `text-sm` (12px) while the paragraph is 11px, producing a visibly mismatched link inside the same line.

### Tooltip
- Composition: `TooltipProvider > Tooltip > TooltipTrigger + TooltipContent`

### Popover
- Composition: `Popover > PopoverTrigger + PopoverContent`

### Separator
- Props: `orientation`, `decorative`

### ScrollArea
- Wraps scrollable content; optional `ScrollBar`

---

## Design tokens cheat-sheet

Use these CSS custom properties via `var(--name)` in inline styles or Tailwind arbitrary values.

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

App-level CSS var mappings for row selection and nav surfaces should stay neutral:
- `--slark-color-nav-active` → `--color-surface-3`
- active-label text → `--color-text-heading`
- Do not map persistent selected-row styles to brand or accent tokens

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
