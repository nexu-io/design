---
"@nexu-design/ui-web": patch
---

All floating overlay surfaces now share one dark-mode recipe —
`surface-2` + `border-border-subtle dark:border-border-strong` +
`shadow-lg` — so overlays stay visually distinct from each other in
overlay-on-overlay scenarios (e.g. `Popover` or `Select` opening
inside a `Dialog`, or a `DropdownMenu` cascading into a submenu).

Per-primitive:

- `Popover`: previously only lifted to `dark:bg-surface-2` after PR
  #57. Now also carries explicit border + stronger shadow so it no
  longer fuses into a Dialog it opens on top of.
- `Select` (`SelectContent`): was stuck at `bg-popover` (`surface-1`
  in dark) — rendered as a pit inside Dialogs. Lifted to `surface-2`
  with the full edge treatment.
- `Dialog`, `Sheet`, `DropdownMenu`, `DropdownMenuSubContent`:
  previously used `dark:border-border`, but `--border` in dark
  resolves to the same tone as `surface-2` so the edge self-painted
  invisibly on overlay-on-overlay stacks. Switched to
  `dark:border-border-strong` (translucent-white 12%), which lifts
  clear of any parent surface regardless of what's underneath.
- `Sheet`: also bumped `shadow-md` → `shadow-lg` to match the rest
  of the family.
- `Combobox` inherits the fix automatically because it portals
  through `PopoverContent`.

Light mode unchanged. No API changes.

The rule — "modal / floating surfaces carry `surface-2` +
`dark:border-border-strong` + `shadow-lg` for overlay-on-overlay
clarity; never `dark:border-border` (surface-tone, self-paints
invisible on same-tone parents)" — is documented in
`COMPONENT_REFERENCE.md` under "Dark-mode surface & contrast ladder"
and in `specs/ui-polish-conventions.md` §12.
