# Open Design Design Spec

## Direction

Open Design should feel like a focused native design workspace: quiet chrome, compact controls, high information density, and neutral surfaces with black primary actions.

## Global Visual System

- Use white panels on a soft gray app background.
- Use `#353535` for primary selected or hover states where a strong action is required.
- Use teal only as a supporting status/accent color, not as the dominant action color.
- Segmented controls use compact rounded pills with a white active state.
- Secondary filters and subtabs should avoid heavy containers when simple text or light pills are sufficient.

## Entry View

- The left project creation area sits in its own rounded white panel.
- Project type tabs use compact segmented button styling.
- Create actions use black primary buttons.
- Example filters use outlined pills; selected filters use `#353535`.
- Example CTA buttons default to outline styling and turn black on hover.

## Project Workspace

- The title bar includes app branding plus back/forward controls with disabled state awareness.
- The project page uses three working panes: conversation list, chat, and design files.
- The old vertical nav rail is removed.
- The conversation list and file workspace use compact rounded panels.
- Chat mode tabs are smaller segmented pills.
- Empty-state starter cards use gray icon backgrounds; icons turn white on black when hovered.

## File Workspace

- HTML preview tabs should look like a compact website pill:
  - gray rounded background
  - globe icon
  - label `Open Design`
  - no long generated filename
  - no close affordance on the preview tab

## Acceptance Criteria

- Homepage and project workspace should stay visually consistent after refresh.
- Back/forward controls correctly show available and disabled states.
- File tab label and icon match the Open Design web-preview affordance.
- Design materials live under `design/open-design/` and do not mix with other project design assets.
