import {
  Badge,
  DetailPanel,
  DetailPanelCloseButton,
  DetailPanelContent,
  DetailPanelDescription,
  DetailPanelHeader,
  DetailPanelTitle,
} from "@nexu-design/ui-web";

export function DetailPanelBasicExample() {
  return (
    <div className="h-[360px] overflow-hidden rounded-xl border border-border-subtle bg-surface-2">
      <DetailPanel className="h-full" width={360}>
        <DetailPanelHeader>
          <div className="min-w-0 flex-1">
            <DetailPanelTitle>Approval details</DetailPanelTitle>
            <DetailPanelDescription>
              Review the latest automation decision before publishing.
            </DetailPanelDescription>
          </div>
          <DetailPanelCloseButton srLabel="Close details" />
        </DetailPanelHeader>
        <DetailPanelContent className="space-y-3 p-4 text-base text-text-secondary">
          <div className="rounded-lg border border-border-subtle bg-surface-1 p-3">
            The workflow is waiting for finance approval because spend exceeds the daily threshold.
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-1 p-3">
            <span>Current status</span>
            <Badge variant="warning">Pending review</Badge>
          </div>
        </DetailPanelContent>
      </DetailPanel>
    </div>
  );
}
