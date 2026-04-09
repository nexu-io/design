# Sidebar Canonical Alignment Checklist

Canonical source: `/Users/mrc/Projects/nexu-io/nexu/apps/web/src/layouts/workspace-layout.tsx`  
Design system source: `packages/ui-web` (`@nexu-design/ui-web`)

## Goal

Align the sidebar in this repository with the canonical Nexu workspace sidebar, while adopting `@nexu-design/ui-web` primitives and preserving the target visual treatment: a translucent sidebar with backdrop blur rather than an opaque solid panel.

## Relevant file map

- Design-side alignment targets:
  - `packages/ui-web/src/primitives/sidebar.tsx`
  - `apps/storybook/src/stories/sidebar.stories.tsx`
  - `apps/demo/src/pages/product/ProductLayout.tsx`
  - `apps/demo/src/pages/product/WorkspaceShell.tsx`
  - `packages/demo-pages/src/pages/openclaw/OpenClawWorkspace.tsx`
  - `apps/demo/src/app/design-system-shell.tsx`
- Canonical app references:
  - `/Users/mrc/Projects/nexu-io/nexu/apps/web/src/layouts/workspace-layout.tsx`
  - `/Users/mrc/Projects/nexu-io/nexu/apps/web/src/app.tsx`
  - `/Users/mrc/Projects/nexu-io/nexu/apps/desktop/src/components/desktop-shell.tsx`
  - `/Users/mrc/Projects/nexu-io/nexu/apps/desktop/src/main.tsx`

## Checklist

### 1. Scope and alignment target

- [ ] Confirm the exact sidebar to align in `design` (`ProductLayout`, `OpenClawWorkspace`, shared `ui-web` sidebar story, or a new workspace shell).
- [ ] Confirm whether alignment targets the canonical web workspace sidebar only, or also desktop-shell behavior.
- [ ] Confirm whether the sidebar should model the screenshot exactly, including logo placement, bottom promo card, balance row, and language/help/account footer actions.

### 2. Visual contract: translucent sidebar

- [ ] Make the sidebar background visually transparent/translucent rather than an opaque surface fill.
- [ ] Add backdrop blur to the sidebar container to match the target canonical look.
- [ ] Use a subtle tinted surface layer instead of flat white/solid gray.
- [ ] Ensure blur + translucency still preserve readable contrast for nav labels and metadata.
- [ ] Verify the blurred panel edge is separated from the main content with a soft border, shadow, or hairline rather than a heavy divider.
- [ ] Ensure the translucent treatment works against varied underlying page backgrounds/content.
- [ ] Check fallback behavior if `backdrop-filter` is unavailable or reduced by platform/browser constraints.

### 3. Shell structure and primitives

- [ ] Use `Sidebar` as the base wrapper instead of ad hoc `<div>` shell markup where feasible.
- [ ] Use `SidebarHeader` for the logo/brand row.
- [ ] Use `SidebarContent` for the scrollable nav + conversations region.
- [ ] Use `SidebarFooter` for the bottom account/meta area.
- [ ] Add an explicit `aria-label` to the sidebar landmark.
- [ ] Keep resize/collapse mechanics app-level if needed, but ensure they compose cleanly around the shared sidebar primitive.

### 4. Navigation information architecture

- [ ] Match canonical top-level navigation order and grouping.
- [ ] Preserve the distinction between static primary navigation and dynamic conversation/session entries.
- [ ] Add a clear section label for conversations/history.
- [ ] Ensure nav grouping still feels balanced when the session list is empty.
- [ ] Keep low-priority utility actions in the footer/meta area rather than mixing them into primary nav.

### 5. Navigation item composition

- [ ] Use `NavigationMenu`, `NavigationMenuList`, and `NavigationMenuItem` where they fit the sidebar IA.
- [ ] Use `NavigationMenuButton asChild` or `NavItem asChild` for links/buttons consistently.
- [ ] Standardize on a single nav item primitive for active/inactive/hover states.
- [ ] Keep icon sizing aligned with adjacent text per repo conventions.
- [ ] Keep count badges and trailing meta visually secondary.
- [ ] Ensure icon + label + count alignment remains stable across items with and without badges.

### 6. Active, hover, and selected states

- [ ] Match the canonical active item emphasis while respecting the translucent sidebar surface.
- [ ] Use token-based selected states rather than hardcoded background colors.
- [ ] Ensure hover states remain visible on top of the blurred/translucent panel.
- [ ] Add `aria-current="page"` to the active primary nav item.
- [ ] Ensure session/conversation selected rows have a distinct but not overly heavy selected treatment.
- [ ] Keep only one dominant selected surface per scope to avoid noisy emphasis.

### 7. Conversations / session list

- [ ] Align the conversation row structure with canonical:
  - platform/avatar icon
  - session title
  - meta row
  - live/status indicator
- [ ] Use `StatusDot` for live/runtime presence instead of bespoke dots.
- [ ] Consider a reusable session row pattern/component if the markup repeats across desktop/mobile/sidebar variants.
- [ ] Keep session title truncation and metadata truncation stable.
- [ ] Ensure row density matches canonical and doesn’t feel heavier than the primary nav.
- [ ] Preserve keyboard/focus behavior for selectable conversation rows.

### 8. Header area

- [ ] Align logo sizing, vertical spacing, and left padding with canonical.
- [ ] Use theme-aware logo/icon assets rather than fixed light-only images if possible.
- [ ] Keep any collapse button visually lightweight and aligned to the header row.
- [ ] Ensure the header still reads clearly over the translucent blurred background.

### 9. Footer and utility areas

- [ ] Align the lower promo/rewards/share card position and hierarchy.
- [ ] Keep balance/credits row visually quieter than primary navigation.
- [ ] Use shared menu primitives (`DropdownMenu`, `Popover`) for help/language/account menus instead of hand-rolled popups.
- [ ] Ensure footer icon buttons have consistent spacing, hover treatment, and hit area.
- [ ] Keep footer actions readable against the translucent background without adding heavy opaque pills unless necessary.

### 10. Component library adoption opportunities

- [ ] Use `Sidebar*` primitives for shell structure.
- [ ] Use `NavigationMenu*` or `NavItem` consistently for nav items.
- [ ] Use `Badge` for small counts/status pills where needed.
- [ ] Use `StatusDot` for live indicators.
- [ ] Use `DropdownMenu` for footer utility menus.
- [ ] Use `Sheet` for the mobile sidebar/drawer variant.
- [ ] Use `Popover`/existing budget-related primitives for credits/balance affordances where appropriate.

### 11. Responsive and collapsed behavior

- [ ] Verify the desktop sidebar width matches canonical proportions.
- [ ] Verify collapse/expand behavior feels intentional with the translucent treatment.
- [ ] Decide whether collapsed state means fully hidden or icon rail.
- [ ] If mobile uses a drawer, ensure the same content structure is reused rather than duplicated.
- [ ] Ensure mobile drawer uses a blurred/translucent treatment only if it still preserves readability and performance.
- [ ] Ensure body scroll locking and focus trapping are handled by shared primitives where possible.

### 12. Spacing and density

- [ ] Normalize nav item padding and row heights.
- [ ] Normalize section spacing between primary nav, conversations, promo card, and footer.
- [ ] Keep the session list compact but not cramped.
- [ ] Ensure footer icon hit areas meet comfort targets.
- [ ] Keep the sidebar vertically balanced so the content doesn’t feel top-heavy.

### 13. Accessibility

- [ ] Use proper `aside` and `nav` landmarks.
- [ ] Ensure active nav items expose `aria-current`.
- [ ] Ensure collapsed/expanded toggles expose `aria-expanded` and `aria-controls`.
- [ ] Ensure menus and mobile drawer trap focus and close on Escape.
- [ ] Ensure contrast remains sufficient over the translucent/blurred surface.
- [ ] Ensure live/status indicators are not color-only and expose accessible labels.

### 14. Tokens and theming

- [ ] Replace hardcoded colors with surface, text, border, and semantic tokens.
- [ ] Avoid raw white/black opacity layers that break in dark mode.
- [ ] Define a tokenized translucent sidebar surface recipe if one does not already exist.
- [ ] Use design-token shadows and radii consistently.
- [ ] Verify the blurred sidebar still works in both light and dark themes.

### 15. Gaps to consider in `ui-web`

- [ ] Decide whether `Sidebar` should support a first-class translucent/blurred variant.
- [ ] Decide whether a shared `SidebarToggle` pattern is needed.
- [ ] Decide whether a reusable `SessionRow` / conversation-list pattern belongs in `ui-web`.
- [ ] Extend shared platform/logo support if canonical sidebar requires icons not yet in the library.
- [ ] Add tests/stories covering translucent sidebar treatment if it becomes a shared primitive capability.

### 16. Validation and regression

- [ ] Compare the aligned sidebar visually against the canonical screenshot and source implementation.
- [ ] Verify translucent background + blur effect at multiple window sizes.
- [ ] Verify nav, sessions, promo card, balance row, and footer menus in both default and active states.
- [ ] Verify responsive/mobile drawer behavior.
- [ ] Verify keyboard navigation, focus rings, and screen reader landmarks.
- [ ] Typecheck affected packages and Storybook if shared primitives/stories change.

## Recommended implementation order

- [ ] 1. Confirm target sidebar surface and exact canonical scope.
- [ ] 2. Align shell structure using `Sidebar*` primitives.
- [ ] 3. Implement the translucent + blurred visual treatment.
- [ ] 4. Align nav/session/footer composition and active states.
- [ ] 5. Replace bespoke menus/drawer behavior with shared primitives.
- [ ] 6. Validate responsive, accessibility, and theme behavior.

## Suggested files to inspect first during implementation

- `packages/ui-web/src/primitives/sidebar.tsx`
- `apps/storybook/src/stories/sidebar.stories.tsx`
- `apps/demo/src/pages/product/ProductLayout.tsx`
- `packages/demo-pages/src/pages/openclaw/OpenClawWorkspace.tsx`
- `/Users/mrc/Projects/nexu-io/nexu/apps/web/src/layouts/workspace-layout.tsx`
- `/Users/mrc/Projects/nexu-io/nexu/apps/desktop/src/components/desktop-shell.tsx`
