---
'@nexu-design/ui-web': patch
---

Chat primitives polish:

- `ChatMessage`: add `onReactionClick(emoji)` prop so consumers can toggle a reaction by clicking its chip; tighten compact and default vertical spacing slightly.
- `ImageAttachment` / `ImageGallery`: when an image fails to load, render an `ImageOff` placeholder with the alt text instead of leaving a broken `<img>` tile.
