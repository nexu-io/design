# Cloud Demo Migration Plan

## Inputs

- Source compare: `refly-ai/agent-digital-cowork`
  - base: `16c4fd8e046475e46023b4a01a32ac1ff1985e77`
  - head: `b2b29ea65eb2539b355aba61e7f63addfde55411`
- Saved filtered patch: `docs/refly-design-system-compare-16c4fd8..b2b29ea.patch`
- Scope rule: only follow changes under `design-system/**`
- Local target repo: current `apps/demo` + new browser-only cloud demo app

## Goals

1. Update the existing `apps/demo` implementation to absorb the relevant design-system changes.
2. Keep the existing Tauri demo path intact.
3. Add a separate cloud web demo app instead of continuing to overload `apps/demo`.
4. Prefer `@nexu-design/ui-web` primitives/patterns before adding new demo-local UI.

## Recommended target structure

```text
apps/
  demo/                  # existing Tauri-oriented demo host
  cloud-demo/            # new browser-only cloud demo

packages/
  ui-web/                # shared public primitives/patterns
  tokens/
  demo-pages/            # private shared page-level code used by demo apps
```

### Why

- `apps/demo/src/App.tsx` currently mixes design-system docs, product demo routes, and cloud/openclaw routes in one router.
- A second web demo should not be implemented as more conditional routes inside the Tauri host.
- Page-level sharing belongs in a private package, not `ui-web`.

## What should be shared

### Move into `packages/demo-pages`

- design-system route pages
- cloud/openclaw pages that should exist in both apps
- docs layout/pages if still needed in both places
- shared demo-only hooks/config/constants used by those pages
- route metadata/nav manifests

### Keep app-local in `apps/demo`

- `src-tauri/**`
- Tauri bootstrap and packaging config
- desktop/product-only shells and flows
- any Tauri-specific integration helpers

### Keep app-local in `apps/cloud-demo`

- browser-only bootstrap
- cloud-demo specific entry routing
- any cloud-only auth/demo adapters

### Keep / promote into `packages/ui-web`

Only primitives/patterns that are generic enough to reuse across apps, such as:

- `Button`
- `Tabs`
- `Badge`
- `StatusDot`
- `Card`
- `Dialog`
- `Sheet`
- `Popover`
- `PageHeader`
- `PricingCard`
- `StatCard`
- `StatsBar`
- `Sidebar`
- `TagGroup`

If a needed primitive from the diff is still missing, promote only the generic version.

## Diff themes to implement locally

Based on the saved patch, the design-system changes cluster into these areas:

1. **Workspace billing / usage model refresh**
   - credit-pack framing replaces older usage wording
   - updated pricing / usage / rewards copy
   - reward channel adjustments

2. **Cloud workspace UX changes**
   - `OpenClawWorkspace` received the largest set of updates
   - updated banners, rewards, promo entry points, controls, usage surfaces

3. **Pricing and usage surfaces**
   - `NexuPricingPage` changed materially
   - `UsagePage` is a key target page

4. **Reusable UI extraction**
   - filter pills
   - underline tabs
   - page header
   - status dot
   - nav item
   - skill marketplace card

5. **Styling / assets refresh**
   - `index.css`
   - `animations-landing.css`
   - `markdown.css`
   - brand asset updates

## Proposed implementation phases

### Phase 1 — Stabilize routing seams

Goal: separate route ownership before moving pages.

- Split `apps/demo/src/App.tsx` into route modules:
  - desktop/product routes
  - design-system routes
  - cloud/openclaw routes
- Keep all current URLs working during this phase.
- Make `App.tsx` a thin composition layer only.

### Phase 2 — Extract shared page code

Goal: prepare for two demo apps without duplicating page implementations.

- Create `packages/demo-pages`
- Move shared page-level code out of `apps/demo`:
  - design-system pages
  - cloud/openclaw pages
  - docs pages/layout if needed by both apps
  - supporting hooks/components/constants that are not Tauri-specific
- Keep import paths internal/private to the workspace

### Phase 3 — Add new browser app

Goal: introduce a clean cloud web demo host.

- Create `apps/cloud-demo`
- Add package scripts: `dev`, `build`, `preview`, `typecheck`
- Add Vite config with the same workspace aliases for:
  - `@nexu-design/ui-web`
  - `@nexu-design/tokens`
  - new `packages/demo-pages`
- Add `main.tsx` + `App.tsx`
- Mount cloud/demo routes there

### Phase 4 — Apply the design-system diff

Goal: port the relevant UI/UX changes onto the extracted cloud/design surfaces.

- Implement/update these first:
  - pricing page
  - usage page
  - workspace home / workspace shell
  - rewards center / reward copy
  - locale/copy updates
- Then port reusable UI pieces.

### Phase 5 — Reuse or promote components from `ui-web`

For each diff-added primitive:

- `page-header` → use existing `PageHeader`
- `status-dot` → use existing `StatusDot`
- `filter-pills` / `underline-tabs` → prefer `Tabs`, `TagGroup`, `Badge`; only add a new primitive if the interaction model does not fit
- `nav-item` → prefer `Sidebar` composition first
- `SkillMarketplaceCard` → keep demo-local unless it is clearly generic enough for `ui-web`

### Phase 6 — Reduce `apps/demo` scope

Goal: keep Tauri demo focused.

- Remove duplicated cloud route ownership from `apps/demo`
- Keep desktop/product demo routes there
- If needed, leave redirects or an entry link to `apps/cloud-demo`

## File-level worklist

### Root workspace

- `package.json`
  - add `dev:cloud-demo`
  - add `build:cloud-demo`
  - possibly update combined `dev`

### New package

- `apps/cloud-demo/package.json`
- `apps/cloud-demo/tsconfig*.json` if needed
- `apps/cloud-demo/vite.config.ts`
- `apps/cloud-demo/index.html`
- `apps/cloud-demo/src/main.tsx`
- `apps/cloud-demo/src/App.tsx`

### Existing app refactor

- `apps/demo/src/App.tsx`
- `apps/demo/src/main.tsx`
- route module files under `apps/demo/src/app/*`

### New shared package

- `packages/demo-pages/package.json`
- `packages/demo-pages/src/index.ts`
- `packages/demo-pages/src/design-system/**`
- `packages/demo-pages/src/cloud/**`
- `packages/demo-pages/src/shared/**`

### Possible `ui-web` additions/updates

- `packages/ui-web/src/index.ts`
- primitive/pattern files only if a truly generic component is missing
- matching Storybook stories for any new public primitive

## Validation plan

Minimum validation after each major phase:

1. `pnpm --filter @nexu-design/demo typecheck`
2. `pnpm --filter @nexu-design/storybook typecheck` (if `ui-web` changes)
3. `pnpm --filter @nexu-design/cloud-demo typecheck`
4. `pnpm format:check`
5. `pnpm biome:check`

If `ui-web` exports change:

- add/update Storybook stories in `apps/storybook/src/stories/*`

## Main risks

1. Hidden coupling between current cloud pages and Tauri/demo-local helpers.
2. Over-promoting page-specific code into `ui-web`.
3. Deep-link breakage when cloud routes move out of `apps/demo`.
4. Styling drift if diff CSS is copied directly instead of mapped to tokens + `ui-web` primitives.
5. Duplicated app logic if `packages/demo-pages` is skipped.

## Recommended execution order

1. Split route ownership inside `apps/demo`
2. Create `packages/demo-pages`
3. Stand up `apps/cloud-demo`
4. Port pricing / usage / workspace changes from the saved patch
5. Promote only missing generic pieces into `ui-web`
6. Update stories for any new public `ui-web` surface
7. Trim duplicate cloud ownership from `apps/demo`
