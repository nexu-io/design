---
"@nexu-design/ui-web": patch
---

Popover and Select now match the full floating-surface recipe the
PR #57 dark-mode ladder codified for `Dialog`, `Sheet`, and
`DropdownMenu`:

- `Popover`: adds `border-border-subtle dark:border-border` edge
  reinforcement and upgrades `shadow-md` → `shadow-lg`. Previously
  only `dark:bg-surface-2` was applied, so a Popover opening inside
  a Dialog (both `surface-2` in dark) fused into the dialog surface
  with only a faint default border to separate them.
- `Select` (`SelectContent`): aligns to the same recipe — lifts
  from `bg-popover` (`surface-1` in dark) to `surface-2`, adds
  `dark:border-border`, and carries `shadow-lg`. Fixes the same
  overlay-on-overlay blending when Select opens inside a Dialog
  and also stops Select from rendering as a "pit" (surface-1 below
  surface-2) on `Dialog` parents.
- `Combobox` inherits the fix automatically because it portals
  through `PopoverContent`.

Light mode is unchanged. No API changes.

The rule — "modal / floating surfaces carry `surface-2` +
`dark:border-border` + `shadow-lg` for overlay-on-overlay clarity"
— is documented in `COMPONENT_REFERENCE.md` under "Dark-mode surface
& contrast ladder" and in `specs/ui-polish-conventions.md` §12.
