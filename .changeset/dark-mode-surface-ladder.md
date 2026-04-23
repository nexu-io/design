---
"@nexu-design/ui-web": patch
---

Dark-mode surface & contrast ladder for primitives and low-emphasis
buttons. All changes are visual / CSS only — no API changes.

- `Input`, `Textarea`, `Select`, `Combobox`: dark mode now renders the
  control as a `color-mix(surface-0, surface-1)` "inset well" so the
  field no longer reads as a near-black pit against the card.
  Placeholder contrast drops to `dark:placeholder:text-muted-foreground/35`.
- `Dialog`, `Sheet`, `DropdownMenu` (content + sub-content), `Popover`:
  dark mode lifts the floating surface to `surface-2` and reinforces
  the edge with `dark:border-border` so overlays read as a clear
  elevation step instead of same-tone chips held up by shadow alone.
- `Button` `outline` and `secondary` variants: rest fill is now a
  translucent tint of `foreground` (`/[0.03]` → `/[0.06]` for
  `outline`, `/[0.06]` → `/[0.1]` for `secondary` light/dark), and
  `outline` no longer carries `shadow-xs`. Brand / CTA variants
  (`default`, `brand`, `primary`, `destructive`) are unchanged.
  Consumers using these variants on tinted / glass / warning / success
  cards will see the button borrow the parent's colour instead of
  stamping a fixed surface patch.
- `UiActivityBar` `surface="glass"`: variant is now theme-aware —
  keeps the light wash in light mode and applies `bg-black/80 +
  backdrop-saturate-125 + backdrop-blur-md` in dark mode so the rail
  merges with the rest of the dark chrome instead of rendering as a
  light-mode tint on a dark vibrancy host.

The ladder is documented in `COMPONENT_REFERENCE.md` under
"UI Polish Conventions → Dark-mode surface & contrast ladder" for
day-to-day lookup and in `specs/ui-polish-conventions.md` §12 for
the full rationale.
