# Home Page Canonical Alignment Checklist

Canonical source: `/Users/mrc/Projects/nexu-io/nexu/apps/web/src/pages/home.tsx`  
Design system source: `packages/ui-web` (`@nexu-design/ui-web`)

## Goal

Align the home page implementation in this repository with the canonical Nexu app home page while using the shared `@nexu-design/ui-web` component library wherever possible.

## Relevant file map

- Current design-side landing/home-like surface:
  - `apps/demo/src/pages/LandingPreview.tsx`
  - `apps/demo/src/pages/journey/StepLanding.tsx`
  - `apps/demo/src/app/design-system-shell.tsx`
- Canonical app home:
  - `/Users/mrc/Projects/nexu-io/nexu/apps/web/src/pages/home.tsx`
  - `/Users/mrc/Projects/nexu-io/nexu/apps/web/src/app.tsx`
  - `/Users/mrc/Projects/nexu-io/nexu/apps/web/src/layouts/workspace-layout.tsx`
  - `/Users/mrc/Projects/nexu-io/nexu/apps/web/tests/home.test.tsx`

## Checklist

### 1. Page scope and routing

- [ ] Confirm which page in `design` is the alignment target (`LandingPreview`, a new demo page, or another app surface).
- [ ] Confirm whether the target should match canonical `/workspace` / `/workspace/home` rather than root `/` welcome behavior.
- [ ] Preserve the canonical distinction between welcome/landing and operational home if both flows are needed.
- [ ] Document whether the aligned page is web-only or also expected to model desktop-client spacing/behavior.

### 2. Information architecture parity

- [ ] Replicate the canonical two-scene structure:
  - first-run / idle state
  - operational / active state
- [ ] Define the gating condition equivalent to `hasOperationalContext`.
- [ ] Keep budget warning placement consistent across both scenes.
- [ ] Keep promotional / secondary banner placement consistent across both scenes.
- [ ] Ensure channel onboarding, connected channels, and recent activity appear in the same priority order as canonical.

### 3. Hero section alignment

- [ ] Match the canonical hero content hierarchy:
  - avatar / media
  - product title
  - runtime status
  - key metadata / actions
- [ ] Preserve the distinct hero treatment between idle and operational scenes.
- [ ] Match title typography, spacing, and visual weight.
- [ ] Verify the idle CTA treatment (speech-bubble / guidance affordance) exists if onboarding is part of scope.
- [ ] Verify the operational hero includes model selection and key runtime indicators if those are in scope.

### 4. Layout and container structure

- [ ] Match canonical max-width, horizontal padding, and vertical rhythm.
- [ ] Verify page sections use consistent spacing tokens rather than ad hoc values.
- [ ] Confirm section ordering and card grouping match canonical home.
- [ ] Decide whether to preserve canonical tighter density or adapt slightly to design-system page-shell conventions.
- [ ] Validate the page still works inside the demo/app shell used in this repo.

### 5. Component library adoption

- [ ] Replace custom/static card wrappers with `Card` where feasible.
- [ ] Use `PageHeader` or equivalent shared page-shell primitives when they fit the canonical structure.
- [ ] Use `Badge` for channel/state pills instead of hand-rolled spans where possible.
- [ ] Use `StatusDot` for runtime/channel status indicators.
- [ ] Use `InteractiveRow` for connected channel rows if it matches the interaction model.
- [ ] Use `Alert` for budget warning / important inline notices.
- [ ] Use `Dialog` / `DialogContent` for connection/setup modals.
- [ ] Use `Skeleton` for loading states.
- [ ] Use `EmptyState` for no-activity / no-content states if appropriate.
- [ ] Keep barrel exports and public API consistency if new `ui-web` components are required.

### 6. Channels section parity

- [ ] Match the canonical split between connected and unconnected channels.
- [ ] Preserve connected channel row density, status affordances, and trailing actions.
- [ ] Preserve unconnected channel card treatment and hover behavior.
- [ ] Keep channel icon sizing aligned with adjacent text per repo conventions.
- [ ] Ensure channel action wording matches canonical intent.
- [ ] Verify external chat/link actions remain visually secondary to primary actions.

### 7. Activity feed parity

- [ ] Match canonical recent-activity information hierarchy:
  - status dot
  - title / session label
  - channel badge
  - relative timestamp
- [ ] Preserve empty state behavior when no sessions exist.
- [ ] Preserve loading state behavior while data is unresolved.
- [ ] Ensure feed rows remain keyboard- and screen-reader-friendly.
- [ ] Use shared badges / row patterns instead of bespoke markup where possible.

### 8. Typography, color, and tokens

- [ ] Replace hardcoded typography values with design token-backed classes where possible.
- [ ] Map text colors to semantic tokens:
  - heading
  - primary
  - secondary
  - muted
- [ ] Replace raw hex / raw white surfaces with tokenized surfaces.
- [ ] Keep semantic colors reserved for status/feedback states.
- [ ] Verify hover, selected, warning, success, and error treatments use library/token conventions.

### 9. Spacing and density

- [ ] Normalize hero spacing to repo spacing conventions.
- [ ] Normalize card padding using `Card` padding props or consistent utilities.
- [ ] Normalize section gaps to `gap-*` / `space-y-*` conventions in AGENTS.md.
- [ ] Check compact metadata rows for stable baseline alignment.
- [ ] Check icon-to-text spacing across channel rows, pills, and action groups.

### 10. Responsive behavior

- [ ] Verify idle channel grid breakpoints produce the same effective layout as canonical.
- [ ] Verify operational layout does not collapse awkwardly at narrow widths.
- [ ] Verify hero action clusters wrap cleanly.
- [ ] Verify connected/unconnected channel sections remain readable on small widths.
- [ ] Verify CTA banners and bottom callouts do not overflow at intermediate widths.

### 11. States and interactions

- [ ] Match canonical hover/pressed states for onboarding cards, channel rows, and activity items.
- [ ] Preserve pulse/animated status behavior where it conveys runtime state.
- [ ] Preserve disabled/loading behavior on async actions.
- [ ] Ensure only one primary CTA is visually dominant in a given action group.
- [ ] Right-align confirm/save actions per repo conventions.

### 12. Loading, empty, and error handling

- [ ] Define the equivalent loading guard for channels/sessions/runtime data.
- [ ] Provide an intentional loading UI instead of blank content where appropriate.
- [ ] Preserve canonical empty states for no channels / no activity.
- [ ] Preserve channel error and degraded-state communication.
- [ ] Ensure async failure paths use consistent feedback patterns.

### 13. Accessibility

- [ ] Verify heading hierarchy is sequential and meaningful.
- [ ] Ensure decorative media is marked appropriately (`aria-hidden` if needed).
- [ ] Ensure interactive rows are true buttons/links or have equivalent keyboard support.
- [ ] Replace custom modal focus management with shared `Dialog` behavior where possible.
- [ ] Ensure status indicators expose accessible labels, not just visual color.
- [ ] Ensure all controls retain visible `focus-visible` styles.

### 14. Dark mode and theming readiness

- [ ] Remove `bg-white` / similar fixed-light surfaces from the aligned page.
- [ ] Replace hardcoded borders/backgrounds with surface and border tokens.
- [ ] Verify tinted warning/success/error treatments still read correctly in dark mode.
- [ ] Verify shadows/elevation match design tokens rather than custom mixes.

### 15. Modal and overlay consistency

- [ ] Inventory all channel setup flows needed on the aligned page.
- [ ] Consolidate repeated modal structure onto shared `Dialog` primitives.
- [ ] Keep footer action ordering consistent with repo conventions.
- [ ] Ensure modal titles, descriptions, and close affordances are consistent.

### 16. Data flow and behavioral parity

- [ ] Document which canonical queries/mutations must be mirrored or mocked.
- [ ] Mirror the canonical state transitions for pending channel setup and disconnect actions.
- [ ] Preserve optimistic / transient states where they are part of the UX contract.
- [ ] Note any polling intervals or freshness assumptions the aligned page should honor.

### 17. Storybook and documentation sync

- [ ] If new public `ui-web` usage patterns emerge, add or update dedicated stories.
- [ ] If a new page-level composition pattern is introduced, add a scenario story.
- [ ] Keep stories aligned with the final home-page composition contract.

### 18. Validation and regression checklist

- [ ] Typecheck affected packages.
- [ ] Test affected `ui-web` behavior if primitives/patterns changed.
- [ ] Typecheck Storybook if stories are updated.
- [ ] Manually verify idle scene, operational scene, loading, empty, warning, and error states.
- [ ] Manually verify keyboard navigation, focus behavior, and responsive layouts.

## Recommended implementation order

- [ ] 1. Confirm the exact target page and scope boundary.
- [ ] 2. Recreate canonical information architecture and layout skeleton.
- [ ] 3. Replace bespoke surfaces/interactions with `@nexu-design/ui-web` components.
- [ ] 4. Align visual tokens, spacing, and responsive behavior.
- [ ] 5. Align loading/empty/error/modal states.
- [ ] 6. Update stories/tests and run validation.

## Suggested files to inspect first during implementation

- `apps/demo/src/pages/LandingPreview.tsx`
- `apps/demo/src/pages/journey/StepLanding.tsx`
- `apps/demo/src/app/design-system-shell.tsx`
- `packages/ui-web/COMPONENT_REFERENCE.md`
- `/Users/mrc/Projects/nexu-io/nexu/apps/web/src/pages/home.tsx`
- `/Users/mrc/Projects/nexu-io/nexu/apps/web/src/layouts/workspace-layout.tsx`
