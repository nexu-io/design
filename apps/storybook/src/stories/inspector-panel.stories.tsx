import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpRight, ExternalLink, MessageSquare } from "lucide-react";

import { Button, FollowUpInput, InspectorPanel, PanelFooterActions } from "@nexu-design/ui-web";

const meta = {
  title: "Patterns/InspectorPanel",
  component: InspectorPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof InspectorPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Campaign approval",
  },
  render: () => (
    <div className="h-[420px] overflow-hidden rounded-xl border border-border bg-surface-2">
      <InspectorPanel
        className="h-full"
        title="Campaign approval"
        description="Review the latest automation decision before publishing."
        width={360}
        leading={
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-clone/10">
            <MessageSquare size={16} className="text-clone" />
          </div>
        }
        badges={
          <>
            <span className="rounded bg-clone/10 px-1.5 py-0.5 text-[9px] font-medium text-clone">
              Approval
            </span>
            <span className="rounded bg-warning/10 px-1.5 py-0.5 text-[9px] text-warning">
              Pending review
            </span>
          </>
        }
        closeButtonProps={{ srLabel: "Close details" }}
        footer={
          <div className="space-y-2">
            <FollowUpInput placeholder="Adjust the brief or ask for more context..." />
            <PanelFooterActions>
              <Button type="button" size="inline" className="flex-1 gap-1.5">
                <ExternalLink size={12} /> Open session
              </Button>
              <Button type="button" size="inline" variant="secondary" className="flex-1 gap-1.5">
                <ArrowUpRight className="size-3" /> View tasks
              </Button>
            </PanelFooterActions>
          </div>
        }
      >
        <div className="space-y-4 p-4 text-sm text-text-secondary">
          <div className="rounded-lg border border-border bg-surface-1 p-3">
            Finance approval is required because today&apos;s projected spend exceeds the daily cap.
          </div>
          <div className="rounded-lg border border-border bg-surface-1 p-3">
            Suggested next step: reduce the audience size or split the rollout into two phases.
          </div>
        </div>
      </InspectorPanel>
    </div>
  ),
};
