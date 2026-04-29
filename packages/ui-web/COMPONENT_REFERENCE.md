# @nexu-design/ui-web — Component Reference

> **Audience:** AI agents and developers consuming `@nexu-design/ui-web`.
> For each component: props table, variant/size options, composition pattern, and usage examples.

---

## Table of Contents

- [Button](#button)
- [Card](#card)
- [Badge](#badge)
- [Alert](#alert)
- [Dialog](#dialog)
- [InteractiveRow](#interactiverow)
- [StatCard](#statcard)
- [PageHeader](#pageheader)
- [Input](#input)
- [Select](#select)
- [Switch](#switch)
- [Checkbox](#checkbox)
- [FormField](#formfield)
- [Tabs](#tabs)
- [TextLink](#textlink)
- [UI Polish Conventions](#ui-polish-conventions)
- [Tooltip](#tooltip)
- [Popover](#popover)
- [Separator](#separator)
- [ScrollArea](#scrollarea)
- [Common Patterns](#common-patterns)
- [Design Tokens](#design-tokens)

---

## Button

**Import:** `import { Button } from '@nexu-design/ui-web'`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'brand' \| 'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'soft' \| 'destructive' \| 'link'` | `'default'` | Visual style |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'inline' \| 'icon' \| 'icon-sm'` | `'md'` | Size preset |
| `loading` | `boolean` | `false` | Shows spinner, disables interaction |
| `disabled` | `boolean` | `false` | Disables the button |
| `leadingIcon` | `ReactNode` | — | Icon before children |
| `trailingIcon` | `ReactNode` | — | Icon after children |
| `asChild` | `boolean` | `false` | Renders as Radix Slot (for custom elements) |

Also accepts all native `<button>` HTML attributes.

### Variant Guide

| Variant | When to use |
|---------|------------|
| `default` | Primary actions (dark bg, white text) |
| `brand` | Brand-colored actions |
| `outline` | Secondary actions, less emphasis |
| `ghost` | Tertiary actions, icon-only buttons |
| `soft` | Gentle emphasis without strong contrast |
| `destructive` | Dangerous/irreversible actions |
| `link` | Inline text-level action |

### Size Guide

| Size | Height | Text | Icon size to match |
|------|--------|------|--------------------|
| `xs` | 24px | ~11px | 12px |
| `sm` | 32px | ~13px | 14px |
| `md` | 36px | ~14px | 16px (default) |
| `lg` | 44px | ~16px | 18px |
| `icon-sm` | 28px | — | 14px |
| `icon` | 36px | — | 16px |

### Examples

```tsx
// Basic
<Button>Save changes</Button>

// Outlined with leading icon
<Button variant="outline" size="sm">
  <ArrowUp size={14} />
  Upgrade
</Button>

// Loading state
<Button loading>Processing...</Button>

// Icon-only
<Button variant="ghost" size="icon-sm" aria-label="Close">
  <X size={14} />
</Button>

// Destructive
<Button variant="destructive" size="sm">Delete</Button>
```

---

## Card

**Import:** `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@nexu-design/ui-web'`

### Props (Card)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'outline' \| 'muted' \| 'interactive' \| 'static'` | `'default'` | Visual style |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding |

### Variant Guide

| Variant | When to use |
|---------|------------|
| `default` | Standard card with shadow |
| `outline` | Bordered card, no shadow |
| `muted` | Subdued background |
| `interactive` | Hover effect for clickable cards |
| `static` | No hover, no shadow — for fixed panels |

### Composition

```
Card
├── CardHeader
│   ├── CardTitle         (renders <h3>)
│   └── CardDescription   (renders <p>)
├── CardContent           (main body)
└── CardFooter            (actions row)
```

### Examples

```tsx
// Simple outlined card
<Card variant="outlined" padding="sm">
  <CardHeader>
    <CardTitle>Plan Details</CardTitle>
    <CardDescription>Current billing cycle</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Free tier — 2,000 credits/month</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline" size="sm">Upgrade</Button>
  </CardFooter>
</Card>

// Minimal card with no header
<Card variant="outlined" padding="none" className="px-5 py-4">
  <p className="text-sm text-text-secondary">Custom content</p>
</Card>
```

---

## Badge

**Import:** `import { Badge } from '@nexu-design/ui-web'`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'accent' \| 'secondary' \| 'outline' \| 'success' \| 'warning' \| 'danger' \| 'destructive'` | `'default'` | Visual style |
| `size` | `'xs' \| 'sm' \| 'default' \| 'lg'` | `'default'` | Size preset |
| `radius` | `'full' \| 'md' \| 'lg'` | `'full'` | Border radius |

### Variant Guide

| Variant | Appearance |
|---------|-----------|
| `default` | Neutral gray bg |
| `accent` | Brand teal border + light bg |
| `secondary` | Light gray, low emphasis |
| `outline` | Bordered, transparent bg |
| `success` | Green bg |
| `warning` | Yellow/orange bg |
| `danger` | Red bg |
| `destructive` | Solid red bg |

### Examples

```tsx
<Badge variant="accent" size="xs">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning" radius="md">Expiring</Badge>
```

---

## Alert

**Import:** `import { Alert, AlertTitle, AlertDescription } from '@nexu-design/ui-web'`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'info' \| 'success' \| 'warning' \| 'destructive'` | `'default'` | Visual style |

Has `role="alert"`. First `<svg>` child is auto-styled as the alert icon.

### Composition

```
Alert
├── <svg> (icon — auto-styled)
├── AlertTitle       (renders <h5>)
└── AlertDescription (renders <div>)
```

### Examples

```tsx
<Alert variant="warning">
  <AlertCircle size={16} />
  <AlertTitle>Credits running low</AlertTitle>
  <AlertDescription>
    You have 50 credits remaining. Consider upgrading.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertCircle size={16} />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

---

## Dialog

**Import:** `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@nexu-design/ui-web'`

### Props (DialogContent)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Max width |
| `closeOnOverlayClick` | `boolean` | `true` | Close when clicking overlay |

### Size Guide

| Size | Max width |
|------|-----------|
| `sm` | `max-w-sm` (384px) |
| `md` | `max-w-lg` (512px) |
| `lg` | `max-w-2xl` (672px) |
| `xl` | `max-w-4xl` (896px) |
| `full` | `max-w-[min(96vw,90rem)]` |

### Composition

```
Dialog
└── DialogContent
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription
    ├── DialogBody (scrollable content area)
    └── DialogFooter (action buttons)
```

### Examples

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent size="sm">
    <DialogHeader>
      <DialogTitle>Delete item?</DialogTitle>
      <DialogDescription>This cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## InteractiveRow

**Import:** `import { InteractiveRow, InteractiveRowLeading, InteractiveRowContent, InteractiveRowTrailing } from '@nexu-design/ui-web'`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tone` | `'default' \| 'subtle'` | `'default'` | Visual density |
| `selected` | `boolean` | — | Selected state |

Renders as `<button>` by default; inherits all button HTML attributes.

### Composition

```
InteractiveRow
├── InteractiveRowLeading   (icon / avatar area, shrink-0)
├── InteractiveRowContent   (label + description, flex-1)
└── InteractiveRowTrailing  (meta / action, shrink-0)
```

### Examples

```tsx
<InteractiveRow tone="subtle" onClick={handleClick}>
  <InteractiveRowLeading>
    <CreditIcon size={14} />
  </InteractiveRowLeading>
  <InteractiveRowContent>
    <span className="text-[13px] font-semibold">Total credits</span>
  </InteractiveRowContent>
  <InteractiveRowTrailing>
    <span className="text-[13px] font-bold tabular-nums">1,952</span>
  </InteractiveRowTrailing>
</InteractiveRow>
```

---

## StatCard

**Import:** `import { StatCard } from '@nexu-design/ui-web'`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | required | Stat description |
| `value` | `ReactNode` | required | Main value (uses MonoDigits) |
| `icon` | `React.ElementType` | — | Icon component (e.g. `Zap`) |
| `tone` | `'default' \| 'info' \| 'accent' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Icon background color |
| `trend` | `{ label: ReactNode, variant?: BadgeVariant }` | — | Trend badge |
| `meta` | `ReactNode` | — | Additional text below value |
| `progress` | `number \| null` | — | Optional progress bar |
| `progressVariant` | `'default' \| 'success' \| 'warning' \| 'accent'` | `'default'` | Progress bar color |
| `progressMax` | `number` | — | Progress max value |

Also inherits Card's `variant`, `padding`, `className`.

### Examples

```tsx
// Basic stat
<StatCard label="Total Users" value="12,345" icon={Users} tone="info" />

// With trend and progress
<StatCard
  label="Revenue"
  value="$45,200"
  icon={TrendingUp}
  tone="success"
  trend={{ label: "+12%", variant: "success" }}
  progress={72}
  progressMax={100}
  variant="outlined"
/>
```

---

## PageHeader

**Import:** `import { PageHeader } from '@nexu-design/ui-web'`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | required | Main heading (renders `<h1>`) |
| `description` | `ReactNode` | — | Subtitle text |
| `actions` | `ReactNode` | — | Right-aligned action buttons |
| `density` | `'default' \| 'shell'` | `'default'` | Spacing + typography contract for standard vs embedded shell headers |

### Spacing contract

- Prefer `PageHeader` over handwritten page-title spacing.
- `ui-web` does not ship an official `.page-header` utility class; use the `PageHeader` component as the source of truth.
- `default` density uses a roomier title block (`gap-3 pb-6`, `space-y-2`).
- `shell` density uses tighter desktop-shell spacing (`gap-2 pb-4`, `space-y-1`).
- Links inside descriptions should use `--color-link`; avoid ad-hoc blue utility classes.

### Examples

```tsx
<PageHeader
  title="Settings"
  description="Manage your account preferences"
  actions={<Button size="sm">Save</Button>}
/>
```

---

## Input

**Import:** `import { Input } from '@nexu-design/ui-web'`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height preset |
| `invalid` | `boolean` | `false` | Error state (sets `aria-invalid`) |
| `leadingIcon` | `ReactNode` | — | Icon inside left edge |
| `trailingIcon` | `ReactNode` | — | Icon inside right edge |
| `inputClassName` | `string` | — | Class on the inner `<input>` |

Also accepts all native `<input>` attributes except `size`.

### Examples

```tsx
<Input placeholder="Search..." leadingIcon={<Search size={14} />} />
<Input type="email" invalid={!!error} />
```

---

## Select

**Import:** `import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator } from '@nexu-design/ui-web'`

### Composition

```
Select (Root)
├── SelectTrigger
│   └── SelectValue (placeholder display)
└── SelectContent (position="popper" by default)
    └── SelectGroup
        ├── SelectLabel
        ├── SelectItem (value="...")
        └── SelectSeparator
```

### Examples

```tsx
<Select value={plan} onValueChange={setPlan}>
  <SelectTrigger>
    <SelectValue placeholder="Select a plan" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="free">Free</SelectItem>
    <SelectItem value="plus">Plus</SelectItem>
    <SelectItem value="pro">Pro</SelectItem>
  </SelectContent>
</Select>
```

---

## Switch

**Import:** `import { Switch } from '@nexu-design/ui-web'`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'default' \| 'sm'` | `'default'` | Size preset |
| `checked` | `boolean` | — | Controlled state |
| `onCheckedChange` | `(checked: boolean) => void` | — | Change handler |
| `disabled` | `boolean` | — | Disabled state |

### Examples

```tsx
<Switch checked={enabled} onCheckedChange={setEnabled} />
<Switch size="sm" />
```

---

## Checkbox

**Import:** `import { Checkbox } from '@nexu-design/ui-web'`

Radix-based. Key props: `checked`, `onCheckedChange`, `disabled`, `required`.

### Examples

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" checked={accepted} onCheckedChange={setAccepted} />
  <Label htmlFor="terms">Accept terms</Label>
</div>
```

---

## FormField

**Import:** `import { FormField, FormFieldLabel, FormFieldControl, FormFieldDescription, FormFieldError } from '@nexu-design/ui-web'`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | — | Field label |
| `description` | `ReactNode` | — | Help text |
| `error` | `ReactNode` | — | Error message |
| `required` | `boolean` | `false` | Shows required indicator |
| `invalid` | `boolean` | `false` | Error state |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction |

Auto-wires `id`, `aria-invalid`, `aria-describedby` to child control via context.

### Composition

```
FormField
├── FormFieldLabel        (auto-linked via htmlFor)
├── FormFieldControl      (clones child with aria props)
├── FormFieldDescription  (help text, linked via aria-describedby)
└── FormFieldError        (error text, linked via aria-describedby)
```

### Examples

```tsx
<FormField label="API Key" required invalid={!!error} error={error}>
  <FormFieldControl>
    <Input type="password" placeholder="sk-..." />
  </FormFieldControl>
  <FormFieldDescription>Found in your dashboard settings.</FormFieldDescription>
</FormField>

// Horizontal layout (label beside control)
<FormField label="Dark mode" orientation="horizontal">
  <FormFieldControl>
    <Switch />
  </FormFieldControl>
</FormField>
```

---

## Tabs

**Import:** `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@nexu-design/ui-web'`

### Variants (TabsList / TabsTrigger)

| Variant | Appearance |
|---------|-----------|
| `default` | Contained background tabs |
| `pill` | Rounded pill tabs |
| `underline` | Bottom-border tabs |

### Examples

```tsx
<Tabs defaultValue="general">
  <TabsList variant="underline">
    <TabsTrigger variant="underline" value="general">General</TabsTrigger>
    <TabsTrigger variant="underline" value="advanced">Advanced</TabsTrigger>
  </TabsList>
  <TabsContent value="general">General settings...</TabsContent>
  <TabsContent value="advanced">Advanced settings...</TabsContent>
</Tabs>
```

---

## TextLink

**Import:** `import { TextLink } from '@nexu-design/ui-web'`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'muted'` | `'default'` | Color style |
| `size` | `'xs' \| 'sm' \| 'default' \| 'lg'` | `'sm'` | Text size |
| `asChild` | `boolean` | `false` | Render as Radix Slot |

### External-link standard

- Use `ArrowUpRight` for external links.
- Keep the icon inline with `gap-1.5` spacing.
- Match icon size to text; for `size="sm"`, use 12px.

### Examples

```tsx
<TextLink href="/docs" size="sm">
  View documentation <ArrowUpRight size={12} />
</TextLink>
```

---

## UI Polish Conventions

Shared guardrails for the most common polish regressions.

### Link color + help links

- Use `--color-link` for inline links and supporting help links.
- Do not introduce raw blue utilities or hex values for product links.
- For external destinations, use `ArrowUpRight` instead of `ExternalLink`.

### Focus rings

- Default interactive controls should use `focus-visible:ring-2 focus-visible:ring-ring`.
- Add `focus-visible:ring-offset-2 focus-visible:ring-offset-background` on filled or elevated surfaces.
- Reuse the shared focus token rather than creating per-component glow colors.

### Interactive typography floor

- Interactive text has a 12px minimum.
- Do not use `text-[10px]` or `text-[11px]` on tabs, pills, segmented controls, or compact clickable labels.
- Run `pnpm check:interactive-typography` when touching compact control styling.

### Page header spacing

- `PageHeader` is the preferred page-title abstraction.
- Prefer its `density` prop over custom per-page title margins.

### Serif heading boundary

- Treat `var(--font-heading)` as a marketing / welcome accent, not the default product heading font.
- Do not add serif styling to `PageHeader`, standard settings pages, dashboards, dialogs, or dense app sections.
- `ui-web` keeps sans-serif as the default for reusable heading patterns; apply serif only at composition level for hero or brand-rail moments.

### Provider settings composition

- Build provider settings surfaces from existing primitives instead of a dedicated `ProviderSettingsCard` or `AuthSwitcher` export.
- Recommended stack: `Card` + region `Tabs` + auth `ToggleGroup`/`RadioGroup` + `FormField` inputs + trailing save row.
- Saved API keys should stay in the form as a masked read-only field with inline `Replace key` / `Edit`, not a detached success banner.
- Clicking `Replace key` should reveal an editable empty input in the same field position; the card footer `Save` remains the primary confirmation action.
- Save actions belong in a trailing footer row inside the same card or panel as the fields they submit.
- Use `flex justify-end gap-2` for that row; secondary actions sit to the left of the primary `Save` button.
- Keep exactly one visually primary CTA in the row, and use `loading` on `Save` while async submission is in flight.
- Revisit a dedicated pattern only after multiple real surfaces repeat the same behavior contract around region switching, auth switching, saved-secret masking, and save semantics.

### Helper and disclaimer copy endings

- Use sentence case for helper text, disclaimers, descriptions, and alert body copy.
- End full-sentence supporting copy with a period.
- Keep compact meta fragments such as `Last saved 2 minutes ago` or `Global defaults apply across shared provider traffic` without terminal punctuation.
- Keep labels, tabs, buttons, and badges punctuation-free unless the punctuation is part of the product name itself.

### Status expression

- Prefer `StatusDot` for lightweight live/presence state inside dense rows, sidebars, and session lists.
- Prefer `Badge` when the state must stand on its own as a semantic chip or filterable label.
- Do not pair a dot with a redundant `Live` / `Online` / `Connected` text pill that repeats the same meaning.
- In compact rows, use one primary status affordance unless multiple indicators carry different information.
- Recommended session/sidebar row: leading logo/icon + title + muted subtitle/meta + trailing `StatusDot`.
- Keep the title line visually dominant and keep passive context on a single secondary line instead of introducing extra pills or helper icons.

### Dense picker rows

- For dense `Select` / `Combobox` menus, use a 16px visual slot for the leading provider logo or mark.
- If the leading asset is a stroked icon rather than a real logo, keep it optically balanced inside that slot (for example, 14px inside a 16px carrier).
- Keep interactive picker rows at a 36px minimum height (`h-9` baseline); do not compress below that for dense model/provider menus.
- Prefer a single-line row anatomy: logo, label, optional single compact badge, trailing muted metadata.
- If a picker needs larger artwork or two-line descriptions, promote it to a roomier custom menu pattern instead of squeezing it into the dense picker baseline.

### Skills / marketplace card icons

- Keep brand/logo mapping in the data layer, not inside `SkillMarketplaceCard`.
- Prefer local SVG logos keyed by stable product ids for known integrations and marketplace entries.
- Use semantic Lucide icons only as fallbacks for unknown, custom, or internal skills.
- Keep the existing marketplace card slot sizing: 18px mark inside the 36px leading carrier.

### Dark-mode surface & contrast ladder

Dark mode inverts the "light = shallow, dark = elevated" relationship that
the default surface token map assumes, so a handful of primitives
deliberately override their background, ring, or placeholder opacity under
`.dark`. Keep the relationship consistent across the library — straying
breaks either the "well" feel of inputs or the "floats above" feel of
modals.

The ladder (approximate background lightness in dark mode):

| Role | Dark surface | Primitives |
|------|--------------|-----------|
| App / page | `surface-0` (~5.7%) | app background, scrim |
| **Input well** (inset, _below_ card) | `color-mix(surface-0, surface-1)` (~8.5%) | `Input`, `Textarea`, `Select`, `Combobox`, install-command pill, copyable-link container |
| Card / panel | `surface-1` (~11%) | `Card`, main content |
| **Button / chip** (_above_ card, low emphasis) | translucent `foreground` tint (`bg-foreground/[0.03]` light, `bg-foreground/[0.06]` dark for `outline`; `/[0.06]` light, `/[0.1]` dark for `secondary`) | `Button variant="outline" \| "secondary"`, chip-style affordances |
| **Modal / floating layer** (_above_ card) | `surface-2` + `dark:border-border-strong` + `shadow-lg` | `Dialog`, `Sheet`, `DropdownMenu`, `Popover`, `Select`, `Combobox` (via `Popover`) |

Paired rules:

- Input placeholders drop to `dark:placeholder:text-muted-foreground/35` — `/50` is too hot on the deep-ish input background.
- Avatars / icon tiles use `ring-black/5 dark:ring-white/10` so the edge stays visible on dark surfaces.
- Low-emphasis buttons (`outline`, `secondary`, `ghost`) use a translucent tint of `foreground` rather than a hard `surface-2` fill so they borrow the parent's colour on tinted cards (warning / success / info / glass) and remain visible on `surface-2` overlays. Brand / CTA buttons (`default`, `brand`, `primary`, `destructive`) stay solid — emphasis is intentional.
- Light mode is intentionally left untouched. Every rule is a `dark:` override layered on top of the existing token.

Do:

- Reach for `color-mix(surface-0, surface-1)` when a control needs the "inset well" feel in dark.
- Raise modal / popover surfaces to `surface-2`, use `dark:border-border-strong` (translucent-white 12%, not the surface-tone `--border` token), _and_ carry `shadow-lg`. Overlay-on-overlay cases (e.g. a Popover / Select opening inside a Dialog) put two surface-2 panels flush against each other — a solid-tone border self-paints invisibly, only a translucent-white edge lifts clear of any parent surface.
- Keep all surface overrides expressed as `dark:` utilities on the existing light token, not a parallel token.

Don't:

- Don't apply bare `bg-surface-0` to modal or floating layers — they blend into the scrim'd page in dark.
- Don't use `ring-black/5` alone on avatars that may render on dark surfaces.
- Don't stamp a hard `bg-surface-*` fill on low-emphasis buttons (`outline`, `secondary`). They must ride on top of potentially tinted parents (warning / success / info / glass cards); a translucent `foreground` tint keeps the button coherent with whichever card it lands on.
- Don't invent a new surface tone for a control without first mapping it onto this ladder; promote to a named token only once the mapping recurs across multiple primitives.

Spec: `specs/ui-polish-conventions.md#12-dark-mode-surface--contrast-ladder`.

### Related docs and stories

- Spec: `specs/ui-polish-conventions.md`
- Tokens: `apps/storybook/src/stories/tokens.stories.tsx`
- Buttons: `apps/storybook/src/stories/button.stories.tsx`
- Provider settings hierarchy: `apps/storybook/src/stories/provider-settings.stories.tsx`
- Status patterns: `apps/storybook/src/stories/status-dot.stories.tsx`, `apps/storybook/src/stories/interactive-row.stories.tsx`
- Sidebar/session rows: `apps/storybook/src/stories/sidebar.stories.tsx`
- Dense picker baseline: `apps/storybook/src/stories/model-picker.stories.tsx`
- Skills / marketplace cards: `apps/storybook/src/stories/skill-marketplace-card.stories.tsx`
- Tabs: `apps/storybook/src/stories/tabs.stories.tsx`
- Toggle: `apps/storybook/src/stories/toggle.stories.tsx`
- TextLink: `apps/storybook/src/stories/text-link.stories.tsx`
- PageHeader: `apps/storybook/src/stories/page-header.stories.tsx`
- Audit surface: `apps/storybook/src/stories/ui-polish-audit.stories.tsx`
- Dark-mode surface ladder: `packages/ui-web/src/primitives/{input,textarea,select,combobox,button,dialog,sheet,dropdown-menu,popover}.tsx` + `specs/ui-polish-conventions.md#12-dark-mode-surface--contrast-ladder`

---

## Tooltip

**Import:** `import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@nexu-design/ui-web'`

Wrap your app (or section) in `<TooltipProvider>`.

### Examples

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="icon-sm"><Info size={14} /></Button>
  </TooltipTrigger>
  <TooltipContent side="bottom">
    Credits reset monthly.
  </TooltipContent>
</Tooltip>
```

---

## Popover

**Import:** `import { Popover, PopoverTrigger, PopoverContent } from '@nexu-design/ui-web'`

### Examples

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm">Filter</Button>
  </PopoverTrigger>
  <PopoverContent align="start" className="w-64">
    <p>Popover content here</p>
  </PopoverContent>
</Popover>
```

---

## Separator

**Import:** `import { Separator } from '@nexu-design/ui-web'`

| Prop | Default |
|------|---------|
| `orientation` | `'horizontal'` |
| `decorative` | `true` |

```tsx
<Separator />
<Separator orientation="vertical" className="h-4" />
```

---

## ScrollArea

**Import:** `import { ScrollArea, ScrollBar } from '@nexu-design/ui-web'`

```tsx
<ScrollArea className="h-[300px]">
  <div className="p-4">{longContent}</div>
  <ScrollBar orientation="vertical" />
</ScrollArea>
```

---

## Common Patterns

### Icon sizing in buttons

Match icon size to button text for visual balance:

| Button size | Icon size |
|-------------|-----------|
| `xs` | 12px |
| `sm` | 14px |
| `md` / `default` | 16px |
| `lg` | 18px |

```tsx
<Button size="sm"><ArrowUp size={14} /> Upgrade</Button>
<Button size="xs"><X size={12} /></Button>
```

### Card layouts

```tsx
// Stat display card (custom, no StatCard)
<Card variant="outlined" padding="none" className="relative overflow-hidden px-5 py-4">
  <Gift size={64} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-heading/[0.06]" />
  <div className="relative">
    <div className="text-sm font-semibold text-text-secondary">Credits earned</div>
    <div className="mt-2 text-xl font-bold text-text-primary">1,802 / 2,000</div>
  </div>
</Card>
```

### Form patterns

```tsx
// Complete form field with validation
<FormField label="Email" required invalid={!!error} error="Invalid email address">
  <FormFieldControl>
    <Input type="email" placeholder="you@example.com" />
  </FormFieldControl>
  <FormFieldDescription>We'll never share your email.</FormFieldDescription>
</FormField>
```

### Interactive lists

```tsx
// Settings-style list
<div className="flex flex-col gap-1">
  <InteractiveRow onClick={() => navigate('/general')}>
    <InteractiveRowLeading><Settings size={16} /></InteractiveRowLeading>
    <InteractiveRowContent>General</InteractiveRowContent>
    <InteractiveRowTrailing><ChevronRight size={14} /></InteractiveRowTrailing>
  </InteractiveRow>
  <InteractiveRow onClick={() => navigate('/account')}>
    <InteractiveRowLeading><User size={16} /></InteractiveRowLeading>
    <InteractiveRowContent>Account</InteractiveRowContent>
    <InteractiveRowTrailing><ChevronRight size={14} /></InteractiveRowTrailing>
  </InteractiveRow>
</div>
```

### Credits pill (top-right trigger)

```tsx
<div className="flex items-center gap-1 h-7 pl-3 pr-3 rounded-full bg-surface-0 border border-border-subtle">
  <CreditIcon size={12} />
  <span className="text-[13px] tabular-nums font-medium">{credits}</span>
  <span className="w-px h-3 bg-border-subtle mx-1.5" />
  <button className="text-[13px] font-semibold text-text-heading">Upgrade</button>
</div>
```

---

## Design Tokens

### Color — Text hierarchy

Use in order of emphasis (strongest → weakest):

1. `var(--color-text-heading)` — headings, key numbers, strongest emphasis
2. `var(--color-text-primary)` — default body text
3. `var(--color-text-secondary)` — supporting labels, descriptions
4. `var(--color-text-muted)` — hints, meta text, placeholders
5. `var(--color-text-tertiary)` — timestamps, very low emphasis
6. `var(--color-text-disabled)` — disabled controls

### Color — Surfaces

From lightest to darkest:

1. `var(--color-surface-0)` — page canvas
2. `var(--color-surface-1)` — cards, panels
3. `var(--color-surface-2)` — secondary fills, hover states
4. `var(--color-surface-3)` — tertiary fills
5. `var(--color-surface-4)` — strong dividers

### Color — Brand & Semantic

| Token | Use for |
|-------|---------|
| `var(--color-brand-primary)` | Brand teal — links, active states, focus rings |
| `var(--color-brand-subtle)` | Light teal wash for brand-themed containers |
| `var(--color-accent)` | Primary UI accent (near-black in light theme) |
| `var(--color-accent-fg)` | White text on accent backgrounds |
| `var(--color-success)` | Positive / confirmation |
| `var(--color-warning)` | Caution / attention |
| `var(--color-info)` | Informational (blue) |
| `var(--color-error)` | Errors / validation |
| `var(--color-*-subtle)` | Light wash versions for backgrounds |

### Color — Borders

| Token | Use for |
|-------|---------|
| `var(--color-border)` | Default borders |
| `var(--color-border-subtle)` | Lightest separators |
| `var(--color-border-strong)` | Emphasized dividers |
| `var(--color-border-hover)` | Hovered interactive elements |
| `var(--color-border-card)` | Card outlines |

### Shadow

| Token | Use for |
|-------|---------|
| `var(--shadow-xs)` | Micro elevation |
| `var(--shadow-sm)` | Subtle cards |
| `var(--shadow-md)` | Medium panels |
| `var(--shadow-lg)` | Large overlays |
| `var(--shadow-card)` | Card default |
| `var(--shadow-dropdown)` | Menus, popovers |
| `var(--shadow-focus)` | Focus ring glow |

### Radius

| Token | Value | Use for |
|-------|-------|---------|
| `var(--radius-sm)` | 6px | Small controls |
| `var(--radius-md)` | 8px | Default inputs, buttons |
| `var(--radius-lg)` | 12px | Cards, panels |
| `var(--radius-xl)` | 16px | Large cards |
| `var(--radius-2xl)` | 20px | Hero sections |
| `var(--radius-pill)` | 100px | Badges, pills, tags |

### Typography

| Token | Value |
|-------|-------|
| `var(--font-sans)` | Digits, Manrope, Inter, system |
| `var(--font-mono)` | JetBrains Mono, SF Mono |
| `var(--font-heading)` | Georgia, serif |
| `var(--text-size-2xs)` | 10px |
| `var(--text-size-xs)` | 11px |
| `var(--text-size-sm)` | 12px |
| `var(--text-size-base)` | 13px |
| `var(--text-size-lg)` | 14px |
| `var(--text-size-xl)` | 16px |

### Animation

| Token | Value | Use for |
|-------|-------|---------|
| `var(--duration-fast)` | 120ms | Hovers, micro interactions |
| `var(--duration-normal)` | 200ms | Default transitions |
| `var(--ease-standard)` | `cubic-bezier(0.2, 0, 0, 1)` | Shared easing curve |
