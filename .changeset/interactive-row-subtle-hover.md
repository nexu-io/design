---
"@nexu-design/ui-web": patch
---

`InteractiveRow` `tone="subtle"` hover now uses a translucent `foreground`
tint (`hover:bg-foreground/[0.04]`, `dark:hover:bg-foreground/[0.06]`)
instead of `hover:bg-surface-2/60`.

The old recipe assumed the row sat on a `surface-0` / `surface-1` parent.
After the PR #57 dark-mode ladder lifted `Dialog`, `Popover`, and
`DropdownMenu` surfaces to `surface-2`, compositing 60% of surface-2 on
top of surface-2 produced no visible colour change, so subtle-tone rows
in overlays appeared unresponsive to hover. The translucent foreground
tint borrows value contrast from the text colour, so it reads on any
surface without per-theme tuning.

Visual impact only; no API change. `tone="default"` is unchanged.
