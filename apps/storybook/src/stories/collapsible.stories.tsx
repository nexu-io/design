import type { Meta, StoryObj } from "@storybook/react-vite";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Collapsible",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[560px] rounded-xl border border-border bg-surface-1 p-4">
      <Collapsible defaultOpen>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-text-primary">Escalation policy</div>
            <div className="text-xs text-text-muted">Expand to review the fallback path.</div>
          </div>
          <CollapsibleTrigger className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary">
            Details
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-4 rounded-lg border border-border bg-surface-2 p-3 text-sm text-text-secondary">
          If the owner does not respond, the issue escalates to the on-call lead.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};
