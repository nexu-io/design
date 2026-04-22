---
"@nexu-design/ui-web": patch
---

`TextLink` now accepts `size="inherit"`, which skips the font-size class so the
link picks up the surrounding paragraph's size. Use this whenever a link sits
inline in body copy (Terms / Privacy, "Learn more", help links inside
descriptions, etc.) — it prevents the link from rendering at a different size
than the text around it on the same line.
