# UI Polish Conventions

Shared UI polish rules for the `design` repository. This spec turns PR #105 alignment notes into stable implementation guidance for tokens, `ui-web`, Storybook, and demo prototypes.

See also:

- Alignment checklist: `specs/2026-04-08-pr-105-ui-design-polish-alignment-checklist.md`
- Consumer docs: `packages/ui-web/COMPONENT_REFERENCE.md#ui-polish-conventions`
- Storybook audit surface: `apps/storybook/src/stories/ui-polish-audit.stories.tsx`
- Storybook provider settings scenario: `apps/storybook/src/stories/provider-settings.stories.tsx`

---

## 1. Link color semantics

Use `--color-link` for inline links, help links, descriptive links, and lightweight navigation text inside content blocks.

### Rules

- Do use `--color-link` through `TextLink` or a component-level rule like `[&_a]:text-[var(--color-link)]`.
- Do not hardcode a raw blue (`#0000ee`, `text-blue-*`, `rgb(...)`) for product links.
- Use underline-on-hover as the default affordance for inline text links.
- Keep visited-state styling the same as the default state unless a product surface has a proven need for differentiation.
- For external links, pair the label with `ArrowUpRight` rather than `ExternalLink`.

### External-link icon standard

- Default icon: `ArrowUpRight`
- Default inline icon size: 12px beside `TextLink size="sm"`; scale with the adjacent text.
- Keep the icon inline with the label using `inline-flex items-center gap-1.5`.

```tsx
<TextLink href="https://example.com" target="_blank" rel="noreferrer noopener">
  View docs
  <ArrowUpRight size={12} />
</TextLink>
```

---

## 2. Focus ring contract

Interactive controls should use the shared ring token instead of one-off focus colors.

### Rules

- Use `focus-visible:ring-ring` when a Tailwind ring utility is appropriate.
- Pair it with `focus-visible:ring-2` for standard controls.
- Add `focus-visible:ring-offset-2 focus-visible:ring-offset-background` when the control sits on a filled or elevated surface.
- Reuse `--shadow-focus` for documented focus examples and token references; do not invent component-specific focus glows.
- Keep focus styling tied to `:focus-visible`, not plain `:focus`, unless a primitive has a strong accessibility reason.

---

## 3. Interactive typography floor

All clickable, selectable, dismissible, or otherwise interactive text in the design system must render at **12px minimum**.

### Applies to

- button labels
- tab labels
- segmented controls / toggle groups
- filter pills
- badges that act as controls
- inline actions and close / dismiss affordances
- dense dropdown or picker rows when the row itself is interactive

### Does not force-upgrade

- passive timestamps
- helper text
- legal copy
- non-interactive counters or annotations

### Implementation rule

- Avoid `text-[10px]` and `text-[11px]` on interactive controls.
- `text-sm` is the minimum supported interactive size across compact controls in `ui-web`.

### Review + enforcement

- Run `pnpm check:interactive-typography` before merging typography-sensitive UI work.
- The script flags `text-[10px]` / `text-[11px]` when they appear in interactive control contexts across `ui-web` and Storybook source files.
- Reviewed exceptions must be rare and explicitly annotated with `interactive-typography-ignore`.

---

## 4. PageHeader contract

`PageHeader` is the official page-title entry point in `ui-web`. Prefer the React pattern over ad-hoc `.page-header` utility classes.

No shared `.page-header` utility is shipped from tokens or `ui-web` styles. If a product surface needs page-title polish, use `PageHeader` directly rather than recreating a parallel utility contract.

### Layout contract

- Title + description stack on the left; actions stay in the trailing area.
- Default density uses `gap-3 pb-6` with `space-y-2` between title and description.
- `density="shell"` uses `gap-2 pb-4` with `space-y-1` to match tighter desktop-shell layouts.
- Description links inherit `--color-link`.
- Consumers should prefer `PageHeader` props over custom margins for title-block spacing.

---

## 5. Button hover treatment

Secondary button surfaces should feel like surface affordances, not dark accent fills.

### Rules

- `ghost` and `outline` hover states should move toward surface tokens.
- Do not restyle secondary actions to a dark or accent-heavy hover just to increase contrast.
- Use shared visual references in Storybook when adjusting these states.

---

## 6. Serif heading boundary

`--font-heading` is a **brand-expression accent**, not the default product heading font.

### Use serif headings for

- marketing hero headlines
- welcome / onboarding hero copy
- auth-shell or brand-rail title blocks
- other deliberate brand moments where the heading is the visual focal point of the page

### Do not use serif headings for

- `PageHeader` titles
- standard product pages, settings pages, dashboards, tables, forms, or dialogs
- section headings inside cards or dense application surfaces
- a general `ui-web` heading variant meant for routine product usage

### Design-system decision

- Keep `font-sans` as the default for all reusable heading primitives and patterns.
- Do **not** add a generic serif heading option to `ui-web` just to expose `--font-heading` at the component API layer.
- When a product surface needs serif treatment, apply it intentionally at the page or story composition layer, with a documented marketing/welcome rationale.

This keeps serif usage rare, brand-forward, and away from dense product UI where sans-serif headings read more consistently.

---

## 7. Status expression contract

Use the lightest status treatment that still communicates state clearly.

### Rules

- Prefer a `StatusDot` plus nearby label or row context for lightweight live state such as online, syncing, running, connected, or draft/published presence.
- Prefer a `Badge` when the status itself needs a persistent semantic chip, filtering affordance, or stronger standalone emphasis.
- Do not add a second text pill when the row already has a `StatusDot`, label, subtitle, or badge communicating the same state.
- Avoid redundant patterns such as `Live` / `Online` / `Connected` pills when the same meaning can be expressed by a dot next to the title or metadata.
- Reserve text pills for cases where the status word is the primary artifact users scan, not a duplicate of adjacent context.

### Preferred patterns

- sidebar and session lists: title + subtitle/meta + trailing `StatusDot`
- reusable cards or tables: status `Badge` when the state must stand on its own
- dense rows: dot for presence/live-ness, badge for explicit workflow states such as `Beta`, `Paused`, or `Deprecated`

### Recommended session list / sidebar item anatomy

- Use a single compact row with four layers: leading icon/logo, primary title, secondary subtitle/meta, and a trailing status affordance.
- Keep the title as the strongest text in the row (`text-sm font-medium text-text-primary` or equivalent).
- Keep subtitle/meta on one lighter line for source, owner, timestamp, or environment; prefer muted text and compact separators such as `·`.
- Prefer a trailing `StatusDot` for lightweight live/online/running presence. Only add a trailing badge when the row needs a standalone workflow label.
- Keep row height compact but comfortable; avoid stacking multiple badges, pills, and helper icons in the same dense sidebar item.
- When the row is selectable, the selected state should come from the row container background/text treatment, not from adding extra status chips.

Recommended hierarchy:

1. **Leading** — provider logo, avatar, or simple icon
2. **Title** — session or destination name
3. **Subtitle/meta** — source + timestamp, workspace, or other passive context
4. **Trailing status** — `StatusDot` by default, optional single badge only when the state itself is the primary thing users scan

### Avoid

- `Live` pill next to a green dot that already means live
- `Online` badge next to a row subtitle that already says `Connected`
- multiple colored status affordances competing in the same compact row unless each conveys different information

---

## 8. Dense picker item sizing

Dense `Select` / `Combobox` rows for model pickers, provider pickers, and similar menus should keep logos readable without making the menu feel oversized.

### Rules

- Use a **16px visual slot** for the leading provider logo / mark in dense picker rows.
- If the leading asset is a simple stroked icon rather than a real logo, keep it optically balanced inside that slot (for example, a 14px glyph inside a 16px carrier).
- Keep dense interactive picker rows at **36px minimum height** (`h-9` baseline). Do not compress below that just to fit more items.
- Keep the row single-line when possible: leading logo, primary label, optional compact badge, trailing muted metadata.
- If a picker needs larger artwork, two-line descriptions, or helper copy, treat it as a roomier custom menu pattern instead of the default dense picker baseline.

### Default anatomy

1. **Leading logo** — 16px visual slot
2. **Primary label** — 13px+ label-first text
3. **Optional inline badge** — one compact badge at most
4. **Trailing metadata** — muted provider / cost / capability summary

Use the dense picker Storybook scenario as the baseline reference: `apps/storybook/src/stories/model-picker.stories.tsx`.

---

## 9. Provider settings hierarchy

Provider configuration surfaces should use a consistent three-layer layout:

1. **Region / scope selector** — top-level context such as `Global` vs `CN`
2. **Auth method switcher** — secondary mode choice such as `OAuth` vs `API Key`
3. **Inputs + trailing save action** — the form body, with the primary CTA aligned right

### Pattern guidance

- Prefer `Card` as the container.
- Use tabs or segmented controls for region/auth switching.
- Use `FormField` for labeled inputs.
- For saved secrets, prefer a masked read-only input plus inline `Replace key` / `Edit` in the same field row.
- Replacing a saved key should swap that field inline to an editable empty state; do not introduce a separate success banner or modal-only edit path.
- Place the primary `Save` action in a trailing `flex justify-end gap-2` row.

This hierarchy should be used in Storybook scenario docs and future reusable patterns.

For the full standalone spec, see `specs/provider-settings-hierarchy.md`.

---

## 10. Skills / marketplace icon mapping

Skills and marketplace cards should use a **stable, data-driven icon mapping** instead of ad-hoc generic placeholders.

### Rules

- Keep icon mapping in the composition or data layer, not inside `SkillMarketplaceCard` itself. The card should stay presentation-only: it accepts `logo` and `icon`, but it should not infer brands from labels.
- Prefer a **local branded SVG logo** for known third-party products, integrations, and marketplace entries. Use a normalized asset set with consistent visual weight rather than mixing favicons, screenshots, or random remote image sources.
- Match each known skill or integration to a **stable product key** (for example `github`, `slack`, `google-calendar`) and resolve the logo from a dedicated map such as `SKILL_ICON`. Do not key the map off mutable marketing copy.
- When the entry represents a branded product, treat a category glyph as a **fallback only**, not the primary identity.
- Fallback order should be:
  1. explicit local logo from the stable mapping
  2. an intentionally supplied branded logo asset
  3. a semantic Lucide icon that matches the skill category or capability
- Use generic category icons only for custom, internal, or genuinely unknown skills where no stable product identity exists yet.
- When a logo fails to load, fall back to the semantic icon in the same visual slot instead of leaving an empty box.

### Asset + sizing guidance

- Prefer local SVG assets checked into the repo over runtime-fetched favicons.
- Normalize marketplace card artwork to the existing `SkillMarketplaceCard` slot: **18px mark inside a 36px carrier** (`size-9` wrapper).
- Keep logo backgrounds neutral and lightweight; do not introduce decorative colored tiles unless the brand asset requires it.

### Recommended implementation split

- **Data layer:** stable id, category, optional `logo`, semantic fallback `icon`
- **Mapping module:** product-id → local SVG asset map
- **UI layer:** render `logo` first, then `icon` fallback through `SkillMarketplaceCard`

Reference implementation: `packages/demo-pages/src/pages/openclaw/skillData.ts`.
