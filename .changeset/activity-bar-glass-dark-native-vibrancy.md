---
"@nexu-design/ui-web": patch
---

`ActivityBar` `surface="glass"`: tune the dark-mode HTML tint so the
rail no longer reads as colour-cast/whitish when the app theme is
dark but the host OS is in Light Mode (the common case — the in-app
theme is decoupled from OS appearance, so native `vibrancy:
"sidebar"` keeps rendering a light desktop wallpaper behind the
chrome).

Previously the variant layered `dark:bg-black/80
dark:backdrop-saturate-125 dark:backdrop-blur-md` on top of native
vibrancy. The `backdrop-saturate-125` amplified the saturation of
the 20 % light-OS vibrancy that leaked through, so the rail read as
whitish even though the html layer itself was near-black.

Now:
- Light mode is unchanged: `bg-white/30 backdrop-saturate-150` on
  top of light sidebar vibrancy.
- Dark mode uses `bg-surface-0/85 backdrop-saturate-100` — a
  `surface-0` wash (one step darker than the surrounding
  `surface-1` island), with the saturate boost explicitly
  neutralised so residual leaks are not colour-amplified. The
  token-based colour also keeps the rail in the project's dark
  ramp instead of a raw near-black.

No API changes.
