# Open Design Implementation Notes

## Source Implementation Scope

The implementation patch was produced from the current Open Design app worktree and covers:

- brand metadata, logo usage, and favicon assets
- homepage project creation panel, tabs, filters, and CTA treatments
- project title bar and navigation availability
- project workspace three-pane layout
- conversation sidebar and status panel styling
- chat segmented controls and starter-card icon states
- file workspace preview tab styling

Source implementation commit:

- `05d14bc feat: refresh Open Design product UI`

## Target Repository Compatibility

The target repository `nexu-io/design` does not currently share the same `apps/web` source tree as `nexu-io/open-design`.

Because of that, the app code patch should be treated as a reference implementation for the Open Design product surface, not as a blind apply-to-target patch. The canonical migration artifact for the target repository is this isolated `design/open-design/` directory.

## Patch

The source implementation patch is stored at:

- `patches/open-design-ui.patch`

Use it when porting the visual system into a compatible app package.
