import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DetailPanel,
  DetailPanelCloseButton,
  DetailPanelContent,
  DetailPanelDescription,
  DetailPanelHeader,
  DetailPanelTitle,
} from "@nexu/ui-web";

const meta = {
  title: "Primitives/DetailPanel",
  component: DetailPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof DetailPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-[360px] overflow-hidden rounded-xl border border-border bg-surface-2">
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
        <DetailPanelContent className="space-y-4 p-4 text-sm text-text-secondary">
          <div className="rounded-lg border border-border bg-surface-1 p-3">
            The workflow is waiting for finance approval because spend exceeds the daily threshold.
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-1 p-3">
            <span>Current status</span>
            <span className="rounded-full bg-warning/10 px-2 py-1 text-xs text-warning">
              Pending review
            </span>
          </div>
        </DetailPanelContent>
      </DetailPanel>
    </div>
  ),
};
