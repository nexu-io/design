# Desktop Demo → `@nexu/ui-web` Migration Plan

## Goal

Move the Tauri desktop demo away from page-local ad hoc UI and toward shared `@nexu/ui-web` primitives and patterns.

This is **not** a Button-only migration.

The target state is:

1. Desktop-critical demo pages (`openclaw/*`, `nexu/*`, `product/*`) consume shared UI from `@nexu/ui-web`
2. Repeated desktop layouts are extracted into reusable `ui-web` patterns
3. Demo pages keep only page-specific composition and business logic
4. Visual and interaction consistency is owned by `ui-web`, not by page-local Tailwind clusters

---

## Current status

> Status snapshot: updated for the current workspace on 2026-03-27.

### Already in `@nexu/ui-web`

#### Primitives
- `Alert`
- `Accordion`
- `Avatar`
- `Badge`
- `Button`
- `Card`
- `Checkbox`
- `Collapsible`
- `ConversationMessage`
- `DataTable`
- `Dialog`
- `DropdownMenu`
- `EntityCard`
- `Input`
- `InteractiveRow`
- `Label`
- `PanelFooter`
- `Popover`
- `Progress`
- `PricingCard`
- `RadioGroup`
- `ScrollArea`
- `Select`
- `Separator`
- `Sheet`
- `Skeleton`
- `Sonner`
- `Spinner`
- `StatCard`
- `Switch`
- `Stepper`
- `Table`
- `Tabs`
- `Textarea`
- `Tooltip`

#### Patterns
- `FormField`
- `EmptyState`
- `SectionHeader`
- `PageHeader`
- `SettingsSection`
- `ConfirmDialog`

### Already migrated substantially
- Standard CTA / footer actions across desktop-critical `openclaw/*`, `nexu/*`, and `product/*`
- A first round of shared visual alignment for `Button`, `Badge`, `Tabs`, `Input`, `Textarea`, `DialogTitle`
- Shared migration already landed across representative desktop pages, including:
  - `openclaw/DashboardPage.tsx` → `StatCard`
  - `openclaw/BillingPage.tsx` → `StatCard`, `PricingCard`
  - `openclaw/PostAuthSetupPage.tsx` → `Progress`, `Stepper`
  - `openclaw/ChannelsPage.tsx` → `Alert`, `Table`
  - `openclaw/OpenClawWorkspace.tsx` → `ScrollArea`, `Collapsible`, `InteractiveRow`, `PanelFooter`
  - `nexu/NexuApprovalsPage.tsx` / `NexuTaskPage.tsx` → `DataTable`, `Table`
  - `nexu/NexuAvatarsPage.tsx` / `NexuSettingsPage.tsx` → `InteractiveRow`, `ScrollArea`
  - `product/SessionsPage.tsx` → `DataTable`, `Table`, `ScrollArea`, `InteractiveRow`, `Collapsible`
  - `product/SkillsPage.tsx` → `EntityCard`, `ScrollArea`, `PanelFooter`
  - `product/ChatCards.tsx` → `ConversationMessage`

### Main remaining gap
Most remaining inconsistency is no longer about the first wave of shared UI.

It is now primarily about:
- finishing adoption on the remaining in-scope pages
- filling in the still-missing desktop shell/workbench components
- reducing page-local Tailwind clusters around navigation, split panes, and advanced filters

The largest remaining unimplemented shared pieces are:
- `ResizablePanel` / `SplitView`
- `Sidebar` / `NavigationMenu`
- `Toggle` / `ToggleGroup`
- `Combobox`
- `Breadcrumb`
- `ActivityBar`
- `DetailPanel`
- `StatsBar`

---

## Scope

### In scope
Desktop-critical routes loaded by the Tauri app:

#### OpenClaw
- `apps/demo/src/pages/openclaw/AuthPage.tsx`
- `apps/demo/src/pages/openclaw/ClientWelcomePage.tsx`
- `apps/demo/src/pages/openclaw/InvitePage.tsx`
- `apps/demo/src/pages/openclaw/OnboardingPage.tsx`
- `apps/demo/src/pages/openclaw/PostAuthSetupPage.tsx`
- `apps/demo/src/pages/openclaw/ChannelsPage.tsx`
- `apps/demo/src/pages/openclaw/OpenClawSkillsPage.tsx`
- `apps/demo/src/pages/openclaw/SkillDetailPage.tsx`
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`
- `apps/demo/src/pages/openclaw/DashboardPage.tsx`
- `apps/demo/src/pages/openclaw/BillingPage.tsx`

#### Nexu
- `apps/demo/src/pages/nexu/NexuLanding.tsx`
- `apps/demo/src/pages/nexu/NexuDashboardPage.tsx`
- `apps/demo/src/pages/nexu/NexuAvatarsPage.tsx`
- `apps/demo/src/pages/nexu/NexuAvatarDetailPage.tsx`
- `apps/demo/src/pages/nexu/NexuApprovalsPage.tsx`
- `apps/demo/src/pages/nexu/NexuTaskPage.tsx`
- `apps/demo/src/pages/nexu/NexuProgressPage.tsx`
- `apps/demo/src/pages/nexu/NexuSettingsPage.tsx`
- `apps/demo/src/pages/nexu/NexuSkillsKnowledgePage.tsx`

#### Product / desktop workspace
- `apps/demo/src/pages/product/CloneBuilderPage.tsx`
- `apps/demo/src/pages/product/TeamPage.tsx`
- `apps/demo/src/pages/product/SessionsPage.tsx`
- `apps/demo/src/pages/product/AutomationPage.tsx`
- `apps/demo/src/pages/product/SkillsPage.tsx`
- `apps/demo/src/pages/product/TeamTasks.tsx`
- `apps/demo/src/pages/product/TeamDetailPanels.tsx`
- `apps/demo/src/pages/product/PricingModal.tsx`
- `apps/demo/src/pages/product/ChatCards.tsx`

### Lower priority / out of current desktop migration scope
- `apps/demo/src/pages/docs/*`
- `apps/demo/src/pages/journey/*`
- pure design showcase pages unless they are reused by desktop-critical flows

---

## Migration principles

1. **Shared before local**
   - If 2+ desktop pages share a visual structure, move it into `@nexu/ui-web`

2. **Primitive first, pattern second**
   - Add a primitive when the gap is low-level and reusable broadly
   - Add a pattern when the gap is a repeated page composition

3. **Demo remains composition-only**
   - Business data + page flow stay in demo
   - Visual scaffolding should live in `ui-web`

4. **Do not force everything into Button**
   - Toggles, chips, segmented selectors, drag handles, disclosure controls, and tiny editor controls may stay native or get specialized primitives later

5. **Desktop-critical first**
   - Work from `openclaw/*`, `nexu/*`, `product/*`
   - `docs/*` and `journey/*` only after desktop flows are stable

---

## Missing primitives to add to `@nexu/ui-web`

### 1. `Table`

#### Why
Several demo areas still hand-roll tables and dense grid rows.

#### API target
- `Table`
- `TableHeader`
- `TableBody`
- `TableRow`
- `TableHead`
- `TableCell`
- `TableCaption`

#### Variants / needs
- compact / default density
- row hover state
- selectable row support hooks via className

#### Demo adoption targets
- `apps/demo/src/pages/nexu/NexuApprovalsPage.tsx`
- `apps/demo/src/pages/nexu/NexuTaskPage.tsx`
- `apps/demo/src/pages/openclaw/ChannelsPage.tsx`
- `apps/demo/src/pages/product/TeamTasks.tsx`
- `apps/demo/src/pages/product/SessionsPage.tsx`

---

### 2. `Alert` / `Callout`

#### Why
Warnings, info strips, success notices, and setup hints are repeated as custom bordered boxes.

#### API target
- `Alert`
- `AlertTitle`
- `AlertDescription`

#### Variants
- `default`
- `info`
- `success`
- `warning`
- `destructive`

#### Demo adoption targets
- `apps/demo/src/pages/openclaw/ChannelsPage.tsx`
- `apps/demo/src/pages/openclaw/PostAuthSetupPage.tsx`
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`
- `apps/demo/src/pages/product/AutomationPage.tsx`
- `apps/demo/src/pages/product/SkillsPage.tsx`

---

### 3. `Progress`

#### Why
Progress bars are currently custom `div` stacks with inline width styles.

#### API target
- `Progress`

#### Variants
- default
- success
- warning
- clone / accent

#### Demo adoption targets
- `apps/demo/src/pages/openclaw/PostAuthSetupPage.tsx`
- `apps/demo/src/pages/nexu/NexuProgressPage.tsx`
- `apps/demo/src/pages/product/TeamPage.tsx`
- `apps/demo/src/pages/product/CloneBuilderPage.tsx`

---

### 4. `Accordion` / `Collapsible`

#### Why
There are still hand-rolled open/close sections and FAQ-style blocks.

#### API target
- `Accordion`
- `AccordionItem`
- `AccordionTrigger`
- `AccordionContent`
- `Collapsible`
- `CollapsibleTrigger`
- `CollapsibleContent`

#### Demo adoption targets
- `apps/demo/src/pages/openclaw/SkillDetailPage.tsx`
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`
- later: `docs/*`, `journey/*`

---

### 5. `ScrollArea`

#### Why
Large desktop shells use manual `overflow-y-auto`, leading to inconsistent scroll surfaces.

#### API target
- `ScrollArea`
- `ScrollBar`

#### Demo adoption targets
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`
- `apps/demo/src/pages/product/SessionsPage.tsx`
- `apps/demo/src/pages/product/SkillsPage.tsx`
- `apps/demo/src/pages/product/CloneBuilderPage.tsx`
- `apps/demo/src/pages/nexu/NexuSettingsPage.tsx`

---

### 6. `ResizablePanel` / `SplitView`

#### Why
The desktop product shell already behaves like an IDE/workbench with resizable side panels and editor/detail regions.

#### shadcn alignment
- maps to shadcn `Resizable`

#### API target
- `ResizablePanelGroup`
- `ResizablePanel`
- `ResizableHandle`
- optional thin wrapper pattern: `SplitView`

#### Demo adoption targets
- `apps/demo/src/pages/product/ProductLayout.tsx`
- later: `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`

---

### 7. `Toggle` / `ToggleGroup`

#### Why
Desktop demo pages still hand-roll many chip-like selectors and segmented controls.

#### shadcn alignment
- maps to shadcn `Toggle`
- maps to shadcn `Toggle Group`

#### API target
- `Toggle`
- `ToggleGroup`
- `ToggleGroupItem`

#### Demo adoption targets
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`
- `apps/demo/src/pages/product/TeamPage.tsx`
- `apps/demo/src/pages/nexu/NexuTaskPage.tsx`
- later: `apps/demo/src/pages/journey/*`

---

### 8. `Combobox`

#### Why
Search + filter + select interactions are still mostly assembled ad hoc from `Input`, `Popover`, and local state.

#### shadcn alignment
- maps to shadcn `Combobox`

#### API target
- `Combobox`
- `ComboboxTrigger`
- `ComboboxContent`
- `ComboboxInput`
- `ComboboxItem`

#### Demo adoption targets
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`
- `apps/demo/src/pages/product/SkillsPage.tsx`
- `apps/demo/src/pages/product/SessionsPage.tsx`

---

### 9. `Breadcrumb`

#### Why
Breadcrumb logic already exists in docs and is likely to be useful in deeper desktop workbench hierarchies.

#### shadcn alignment
- maps to shadcn `Breadcrumb`

#### API target
- `Breadcrumb`
- `BreadcrumbList`
- `BreadcrumbItem`
- `BreadcrumbLink`
- `BreadcrumbPage`
- `BreadcrumbSeparator`

#### Demo adoption targets
- current reference: `apps/demo/src/pages/docs/DocsLayout.tsx`
- future desktop candidates: `product/*`, `openclaw/*` detail shells

---

### 10. `Sidebar` / `NavigationMenu`

#### Why
The desktop app now has multiple custom left-nav shells that should converge on a shared navigation system.

#### shadcn alignment
- maps conceptually to shadcn `Sidebar`
- partially overlaps with shadcn `Navigation Menu`

#### API target
- `Sidebar`
- `SidebarRail`
- `SidebarSection`
- `SidebarItem`
- `SidebarFooter`
- optional desktop-specific `ActivityBar`

#### Demo adoption targets
- `apps/demo/src/pages/product/ProductLayout.tsx`
- `apps/demo/src/pages/nexu/NexuProductLayout.tsx`
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`

---

## Missing patterns to add to `@nexu/ui-web`

### 1. `StatCard`

#### Why
KPI/metric cards are repeated across dashboards with nearly identical structure.

#### Proposed API
- `StatCard`
  - props: `label`, `value`, `icon`, `trend`, `meta`, `tone`

#### Demo adoption targets
- `apps/demo/src/pages/openclaw/DashboardPage.tsx`
- `apps/demo/src/pages/openclaw/BillingPage.tsx`
- `apps/demo/src/pages/nexu/NexuProgressPage.tsx`
- `apps/demo/src/pages/product/TeamPage.tsx`
- `apps/demo/src/pages/product/AutomationPage.tsx`

---

### 2. `PricingCard`

#### Why
Pricing tiers are reimplemented with local icon + feature list + CTA compositions.

#### Proposed API
- `PricingCard`
  - slots: `header`, `price`, `features`, `footer`
  - support `featured` / `recommended` state

#### Demo adoption targets
- `apps/demo/src/pages/openclaw/BillingPage.tsx`
- `apps/demo/src/pages/product/PricingModal.tsx`
- later: `GrowthLanding.tsx`, `LandingPreview.tsx`, `journey/StepUpgrade.tsx`

---

### 3. `ChatBubble` / `ConversationMessage`

#### Why
Chat-like surfaces are central to the product and currently remain custom.

#### Proposed API
- `ConversationMessage`
  - variants: `user`, `assistant`, `system`, `status`
- optional slots for avatar, meta, actions

#### Demo adoption targets
- `apps/demo/src/pages/product/ChatCards.tsx`
- `apps/demo/src/pages/openclaw/ClientWelcomePage.tsx`
- `apps/demo/src/pages/openclaw/OnboardingPage.tsx`
- `apps/demo/src/pages/openclaw/IMOAuthDemo.tsx`
- `apps/demo/src/pages/openclaw/GroupGrowthDemo.tsx`

---

### 4. `ListRow` / `InteractiveRow`

#### Why
Many desktop pages use a common row shape: icon/avatar + title + meta + trailing action/chevron.

#### Proposed API
- `InteractiveRow`
  - slots: `leading`, `content`, `trailing`
  - variants: `default`, `subtle`, `selected`

#### Demo adoption targets
- `apps/demo/src/pages/openclaw/DashboardPage.tsx`
- `apps/demo/src/pages/product/TeamPage.tsx`
- `apps/demo/src/pages/product/SessionsPage.tsx`
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`
- `apps/demo/src/pages/nexu/NexuAvatarsPage.tsx`

---

### 5. `PanelFooter`

#### Why
Panel/footer actions repeat in modals, inspector panes, and detail drawers.

#### Proposed API
- `PanelFooter`
  - layout for primary/secondary/destructive action groups

#### Demo adoption targets
- `apps/demo/src/pages/product/TeamDetailPanels.tsx`
- `apps/demo/src/pages/product/SkillsPage.tsx`
- `apps/demo/src/pages/product/AutomationPage.tsx`
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`

---

### 6. `DataTable`

#### Why
Once `Table` exists, desktop list views still need a consistent composed pattern.

#### Proposed API
- built on `Table`
- optional search / empty / footer / pagination slots

#### Demo adoption targets
- `apps/demo/src/pages/nexu/NexuApprovalsPage.tsx`
- `apps/demo/src/pages/nexu/NexuTaskPage.tsx`
- `apps/demo/src/pages/openclaw/ChannelsPage.tsx`
- `apps/demo/src/pages/product/TeamTasks.tsx`

---

### 7. `StepIndicator` / `Stepper`

#### Why
Desktop onboarding/setup flows still use local step and progress UIs.

#### Proposed API
- `Stepper`
- `StepperItem`
- `StepperSeparator`

#### Demo adoption targets
- `apps/demo/src/pages/openclaw/PostAuthSetupPage.tsx`
- `apps/demo/src/pages/openclaw/OnboardingPage.tsx`
- later: `journey/*`

---

### 8. `EntityCard` family

#### Why
The demo repeats several entity-style cards with the same shell but different content:
- skill cards
- channel cards
- avatar cards
- task cards

#### Proposed structure
- base pattern: `EntityCard`
- thin specializations if needed:
  - `SkillCard`
  - `ChannelCard`
  - `AvatarCard`
  - `TaskCard`

#### Demo adoption targets
- `apps/demo/src/pages/product/SkillsPage.tsx`
- `apps/demo/src/pages/product/CloneBuilderPage.tsx`
- `apps/demo/src/pages/nexu/NexuAvatarsPage.tsx`
- `apps/demo/src/pages/nexu/NexuSkillsKnowledgePage.tsx`
- `apps/demo/src/pages/product/TeamSprint.tsx`

---

### 9. `ActivityBar`

#### Why
The desktop app uses VS Code-like icon rails repeatedly, but this is currently page-local shell code.

#### shadcn alignment
- not a first-class official shadcn component
- should be treated as a desktop-specific pattern built on shared button/tooltip/navigation primitives

#### Proposed structure
- `ActivityBar`
- `ActivityBarItem`
- `ActivityBarFooter`

#### Demo adoption targets
- `apps/demo/src/pages/product/ProductLayout.tsx`
- `apps/demo/src/pages/nexu/NexuProductLayout.tsx`

---

### 10. `DetailPanel`

#### Why
The desktop product area repeatedly uses right-side detail panes with a shared shell structure.

#### shadcn alignment
- sits between shadcn `Sheet` and a desktop workbench inspector panel

#### Proposed structure
- `DetailPanel`
- `DetailPanelHeader`
- `DetailPanelBody`
- `DetailPanelFooter`

#### Demo adoption targets
- `apps/demo/src/pages/product/TeamDetailPanels.tsx`
- `apps/demo/src/pages/product/TeamPage.tsx`
- `apps/demo/src/pages/product/SkillsPage.tsx`
- `apps/demo/src/pages/product/AutomationPage.tsx`

---

### 11. `StatsBar`

#### Why
Several workbench pages use compact horizontal metric strips above detailed content.

#### shadcn alignment
- not a direct official shadcn component
- should be treated as a dashboard pattern composed from `Card`, `Badge`, `Button`, `Separator`

#### Proposed structure
- `StatsBar`
- `StatsBarItem`

#### Demo adoption targets
- `apps/demo/src/pages/product/TeamPage.tsx`
- future adoption: `nexu/*`, `openclaw/*` dashboards

---

## Demo refactor map

## Phase 1 — highest ROI, lowest risk

**Status:** Mostly complete. Core components are implemented and adopted on several target pages. Remaining work is mostly follow-through and consistency cleanup.

### Add to `ui-web`
- [x] `Table`
- [x] `Alert`
- [x] `Progress`
- [x] `StatCard`
- [x] `PricingCard`

### Refactor demo pages

#### `openclaw/*`
- [x] `DashboardPage.tsx`
  - replace local KPI boxes with `StatCard`
- [x] `BillingPage.tsx`
  - replace usage summary cards with `StatCard`
  - replace pricing section with `PricingCard`
- [x] `PostAuthSetupPage.tsx`
  - replace progress bars with `Progress`
- [x] `ChannelsPage.tsx`
  - replace warning/info boxes with `Alert`

#### `nexu/*`
- [~] `NexuProgressPage.tsx`
  - replace KPI blocks and progress bars with `StatCard` + `Progress`
- [x] `NexuApprovalsPage.tsx`
  - prepare for `Table` / `DataTable`
- [x] `NexuTaskPage.tsx`
  - prepare for `Table` / `DataTable`

#### `product/*`
- [x] `PricingModal.tsx`
  - replace local plan cards with `PricingCard`
- [x] `TeamPage.tsx`
  - replace dashboard metric cards with `StatCard`
- [x] `AutomationPage.tsx`
  - replace status/info boxes with `Alert`

---

## Phase 2 — desktop structural consistency

**Status:** Substantially complete. Shared building blocks exist and are already used in core desktop shells. Remaining work is selective page coverage.

### Add to `ui-web`
- [x] `ScrollArea`
- [x] `Accordion`
- [x] `Collapsible`
- [x] `PanelFooter`
- [x] `InteractiveRow`
- [x] `DataTable`

### Refactor demo pages

#### `openclaw/*`
- [x] `OpenClawWorkspace.tsx`
  - replace local scroll containers with `ScrollArea`
  - replace repeated footer action groups with `PanelFooter`
  - replace repeated clickable rows with `InteractiveRow`
- [x] `SkillDetailPage.tsx`
  - replace local expand/collapse sections with `Accordion`

#### `nexu/*`
- [x] `NexuAvatarsPage.tsx`
  - replace list/grid row shells with `InteractiveRow` or `EntityCard`
- [x] `NexuSettingsPage.tsx`
  - use `ScrollArea` for long settings regions
- [x] `NexuApprovalsPage.tsx`
  - migrate to `DataTable`
- [x] `NexuTaskPage.tsx`
  - migrate list/table sections to `DataTable`

#### `product/*`
- [x] `SessionsPage.tsx`
  - use `ScrollArea` in side/detail panes
  - use `InteractiveRow` for session rows
- [x] `TeamTasks.tsx`
  - migrate to `DataTable`
- [x] `TeamDetailPanels.tsx`
  - use `PanelFooter`
- [x] `SkillsPage.tsx`
  - use `ScrollArea` and `PanelFooter`

---

## Phase 3 — product-specific patterns

**Status:** In progress but already well underway. Core primitives/patterns are implemented; adoption is partial and uneven across the remaining pages.

### Add to `ui-web`
- [x] `ConversationMessage`
- [x] `Stepper`
- [x] `EntityCard`
- [ ] possibly `TagGroup`

### Refactor demo pages

#### `openclaw/*`
- [x] `ClientWelcomePage.tsx`
  - entry cards → reusable `EntityCard` or `EntryCard` pattern
- [~] `OnboardingPage.tsx`
  - chat-like areas → `ConversationMessage`
- [x] `PostAuthSetupPage.tsx`
  - onboarding flow → `Stepper`

#### `nexu/*`
- [x] `NexuSkillsKnowledgePage.tsx`
  - grouped skill tiles → `EntityCard` / `TagGroup`
- [x] `NexuAvatarDetailPage.tsx`
  - capability / profile grouped cards → `EntityCard`

#### `product/*`
- [x] `ChatCards.tsx`
  - convert to `ConversationMessage` + shared card shell
- [x] `CloneBuilderPage.tsx`
  - channel / memory / entity cards → `EntityCard`
- [x] `SkillsPage.tsx`
  - skill marketplace cards → `EntityCard`

---

## Page-by-page recommended migration targets

| Area | File | Recommended shared target |
| --- | --- | --- |
| OpenClaw | `DashboardPage.tsx` | `StatCard`, `InteractiveRow`, `SectionHeader` |
| OpenClaw | `BillingPage.tsx` | `StatCard`, `PricingCard`, `Tabs` |
| OpenClaw | `ChannelsPage.tsx` | `Alert`, `DataTable`, `PanelFooter` |
| OpenClaw | `PostAuthSetupPage.tsx` | `Progress`, `Stepper`, `Alert` |
| OpenClaw | `OpenClawWorkspace.tsx` | `ScrollArea`, `InteractiveRow`, `PanelFooter`, `Accordion/Collapsible` |
| OpenClaw | `SkillDetailPage.tsx` | `Accordion`, `PanelFooter`, `Alert` |
| Nexu | `NexuDashboardPage.tsx` | `SectionHeader`, `StatCard`, `InteractiveRow` |
| Nexu | `NexuProgressPage.tsx` | `StatCard`, `Progress` |
| Nexu | `NexuApprovalsPage.tsx` | `Table`, `DataTable` |
| Nexu | `NexuTaskPage.tsx` | `Table`, `DataTable`, `EmptyState` |
| Nexu | `NexuSettingsPage.tsx` | `ScrollArea`, `SettingsSection`, `Alert` |
| Nexu | `NexuAvatarsPage.tsx` | `AvatarCard` / `EntityCard`, `InteractiveRow` |
| Nexu | `NexuAvatarDetailPage.tsx` | `EntityCard`, `TagGroup`, `Progress` |
| Product | `CloneBuilderPage.tsx` | `EntityCard`, `PanelFooter`, `ScrollArea`, `Progress` |
| Product | `TeamPage.tsx` | `StatCard`, `InteractiveRow`, `PanelFooter` |
| Product | `SessionsPage.tsx` | `InteractiveRow`, `ScrollArea`, `PanelFooter` |
| Product | `AutomationPage.tsx` | `Alert`, `StatCard`, `PanelFooter` |
| Product | `SkillsPage.tsx` | `EntityCard`, `ScrollArea`, `PanelFooter`, `Alert` |
| Product | `TeamTasks.tsx` | `DataTable`, `PanelFooter` |
| Product | `TeamDetailPanels.tsx` | `PanelFooter`, `ConversationMessage` |
| Product | `PricingModal.tsx` | `PricingCard`, `Alert` |
| Product | `ChatCards.tsx` | `ConversationMessage`, `EntityCard` |

---

## Suggested implementation order

The original Wave 1-3 ordering is still useful as historical context, but the first three waves are no longer greenfield work. The next implementation order should prioritize the remaining gaps.

### Wave 1
- [x] `Table`
- [x] `Alert`
- [x] `Progress`
- [x] `StatCard`
- [x] `PricingCard`

### Wave 2
- [ ] `ResizablePanel` / `SplitView`
- [ ] `Sidebar` / `NavigationMenu`
- [ ] `ActivityBar`
- [ ] `DetailPanel`
- [x] `ScrollArea`
- [x] `Accordion`
- [x] `Collapsible`
- [x] `PanelFooter`
- [x] `InteractiveRow`
- [x] `DataTable`
- [ ] `Toggle` / `ToggleGroup`

### Wave 3
- [x] `ConversationMessage`
- [x] `Stepper`
- [x] `EntityCard`
- [ ] `Combobox`
- [ ] `Breadcrumb`
- [x] `StatsBar`
- [ ] optional `TagGroup`

---

## shadcn/ui alignment map

This section maps the migration roadmap to common shadcn/ui component families so we can distinguish between:

1. components we should implement almost directly
2. components that should become Nexu-specific desktop patterns

### Direct shadcn-style primitives to add

| Candidate | shadcn counterpart | Priority | Notes |
| --- | --- | --- | --- |
| `Table` | `Table` | High | Straightforward primitive addition |
| `Alert` | `Alert` | High | Straightforward primitive addition |
| `Progress` | `Progress` | High | Straightforward primitive addition |
| `Accordion` | `Accordion` | Medium | Good fit for expand/collapse sections |
| `Collapsible` | `Collapsible` | Medium | Good fit for shell/sidebar regions |
| `ScrollArea` | `Scroll Area` | Medium | Important for desktop consistency |
| `ResizablePanel` | `Resizable` | Medium | High-value desktop primitive |
| `Toggle` | `Toggle` | Medium | Good for selector-like controls |
| `ToggleGroup` | `Toggle Group` | Medium | Good for segmented chips/pills |
| `Combobox` | `Combobox` | Medium | Useful in filter-heavy workbench views |
| `Breadcrumb` | `Breadcrumb` | Low/Medium | Useful after shell structure stabilizes |

### shadcn-inspired Nexu desktop patterns

| Candidate | Built from | Priority | Notes |
| --- | --- | --- | --- |
| `StatCard` | `Card`, `Badge`, `Progress` | High | Dashboard metric pattern |
| `PricingCard` | `Card`, `Button`, `Badge` | High | Billing/upgrade pattern |
| `DataTable` | `Table`, `EmptyState`, `Button` | Medium | Better than raw table adoption alone |
| `InteractiveRow` | `Button`, `Avatar`, `Badge` | Medium | Shared desktop row shell |
| `PanelFooter` | `Separator`, `Button` | Medium | Repeated inspector/modal footer layout |
| `ConversationMessage` | `Card`, `Avatar`, `Badge` | Medium | Core product messaging surface |
| `EntityCard` | `Card`, `Badge`, `Button` | Medium | Skill/channel/avatar/task card family |
| `Stepper` | `Progress`, `Badge`, `Button` | Medium | Setup/onboarding flow pattern |
| `ActivityBar` | `Button`, `Tooltip`, `Sidebar` | Medium | Desktop-only shell pattern |
| `DetailPanel` | `Sheet`, `ScrollArea`, `PanelFooter` | Medium | Inspector/workbench side panel |
| `StatsBar` | `Card`, `Badge`, `Separator` | Low/Medium | Dense summary strip above work areas |

---

## Validation checklist per wave

For every new primitive or pattern:

1. add implementation in `packages/ui-web/src/primitives` or `src/patterns`
2. export from `packages/ui-web/src/index.ts`
3. add at least focused tests where behavior matters
4. refactor one representative demo page first
5. then refactor the rest of the target pages
6. run:
   - `pnpm --filter @nexu/ui-web test`
   - `pnpm --filter @nexu/ui-web build`
   - `pnpm --filter @nexu/demo typecheck`
   - `pnpm --filter @nexu/demo build`

---

## Definition of done

Desktop demo migration is complete when:

1. desktop-critical pages no longer hand-roll repeated stat, pricing, table, alert, progress, and panel-footer structures
2. `openclaw/*`, `nexu/*`, and `product/*` primarily compose from `@nexu/ui-web`
3. repeated visual behavior is owned by `ui-web`, not page-local Tailwind clusters
4. remaining local markup is only business-unique layout or intentionally native high-interaction controls

---

## Recommended next execution batch

If continuing implementation immediately, do this next:

1. finish partial migrations:
   - `nexu/NexuProgressPage.tsx` → complete `Progress` adoption
   - `openclaw/OnboardingPage.tsx` → evaluate whether chat-like sections should move to `ConversationMessage`
2. implement the missing desktop shell primitives:
   - `ResizablePanel` / `SplitView`
   - `Sidebar` / `NavigationMenu`
   - `Toggle` / `ToggleGroup`
3. apply those shell primitives to the highest-leverage layouts:
   - `product/ProductLayout.tsx`
   - `nexu/NexuProductLayout.tsx`
   - `openclaw/OpenClawWorkspace.tsx`
4. then tackle filter/navigation polish:
   - `Combobox`
   - `Breadcrumb`
   - `ActivityBar`
   - `DetailPanel`

That batch has the best balance of:
- high reuse
- desktop-shell consistency gain
- progress toward the remaining true gaps in the migration
