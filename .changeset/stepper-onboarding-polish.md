---
"@nexu-design/ui-web": patch
---

Polish `Stepper` primitive and related shell surfaces for the Slark 3-step onboarding:

- `Stepper`: smaller (36px) circular indicators, dark-filled completed + current steps (current keeps a soft halo), white-fill pending steps, and connector lines use a consistent `text-heading/15` tint instead of switching color with state. Completed steps retain their original step icon rather than swapping to a checkmark. Labels are now `text-xs` at `font-normal` and differentiate state via color only.
- `StepperItem`: when `onClick` is provided the item becomes keyboard-accessible (`role="button"`, tab-focusable, Enter/Space activation) so completed steps can be revisited.
- `AuthShell`: the scroll column now reserves space for the vertical scrollbar (`scrollbar-gutter: stable`) so expanding/collapsing long content no longer shifts centered children horizontally.
- `FormField`: adds optional `labelClassName` to let callers style the label without wrapping it.
- `Tabs` (default variant): active tab drops the `shadow-sm` lift and the list background shifts to `surface-3` for a flatter, less busy look.
