import type { Meta, StoryObj } from "@storybook/react-vite";

import { ResizableHandle, ResizablePanel, SplitView } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/SplitView",
  component: SplitView,
  tags: ["autodocs"],
} satisfies Meta<typeof SplitView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-[360px] w-[960px] overflow-hidden rounded-xl border border-border">
      <SplitView className="h-full bg-surface-2">
        <ResizablePanel size={240} className="border-r border-border bg-surface-1 p-4">
          <div className="text-sm font-medium text-text-primary">Navigation</div>
        </ResizablePanel>
        <ResizableHandle className="w-px bg-border" />
        <ResizablePanel className="min-w-0 p-4">
          <div className="h-full rounded-lg border border-dashed border-border p-4 text-sm text-text-muted">
            Main workspace content
          </div>
        </ResizablePanel>
        <ResizableHandle className="w-px bg-border" />
        <ResizablePanel size={320} className="border-l border-border bg-surface-1 p-4">
          <div className="text-sm font-medium text-text-primary">Details</div>
        </ResizablePanel>
      </SplitView>
    </div>
  ),
};
