---
"@nexu-design/ui-web": patch
---

Ship a fully compiled `styles.css` artifact for published `@nexu-design/ui-web` consumers.

- Fix npm consumption so component utility styles are included in the published CSS output instead of depending on consumers to rescan the package with Tailwind.
- Keep the public import path unchanged: `@nexu-design/ui-web/styles.css`.
