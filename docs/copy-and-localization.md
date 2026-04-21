# Copy and Localization Guidelines

Use this document for product-surface copy, localization boundaries, and i18n policy decisions.

See also:
- `../AGENTS.md`
- `./design-system-guidelines.md`
- `./component-api-guidelines.md`

## Product copy policy
- Product-surface copy is hardcoded English by default unless a feature or document explicitly requires localization.
- Write shipped UI copy inline; do not introduce `useT(...)`, `t("...")`, or another i18n resolver unless the surface is explicitly localized.
- Do not convert intentionally hardcoded English product copy back to i18n wiring unless the surrounding surface is also localized.

## Exceptions
- User-generated content must be rendered as authored.
- Mock or seed demo content should remain in its authored language.
- Legal or policy text may use i18n when jurisdiction-specific localization is required.
- Dates, numbers, currencies, and pluralization should use locale-aware formatting such as `Intl.*` APIs.

## Related UI language rules
- Decorative uppercase labels stay English when the styling depends on `uppercase tracking-wider`.
- Page-level navigation tab labels stay English unless a documented exception exists.
- Shared component-library packages such as `packages/ui-web` and `packages/tokens` should remain copy-free and receive labels through props rather than hardcoded product strings.
