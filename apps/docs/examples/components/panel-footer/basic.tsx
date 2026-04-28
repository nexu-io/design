import { Button, PanelFooter, PanelFooterActions, PanelFooterMeta } from "@nexu-design/ui-web";

export function PanelFooterBasicExample() {
  return (
    <div className="w-[560px] overflow-hidden rounded-xl border border-border bg-surface-1">
      <div className="px-4 py-6 text-sm text-text-secondary">
        Review the changes before publishing.
      </div>
      <PanelFooter>
        <PanelFooterMeta>Last saved 2 minutes ago</PanelFooterMeta>
        <PanelFooterActions>
          <Button variant="ghost">Cancel</Button>
          <Button>Publish</Button>
        </PanelFooterActions>
      </PanelFooter>
    </div>
  );
}
