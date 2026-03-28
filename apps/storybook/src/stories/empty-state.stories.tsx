import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, EmptyState } from "@nexu-design/ui-web";

const meta = {
  title: "Patterns/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "Empty",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[520px]">
      <EmptyState
        title="No channels connected"
        description="Connect your first channel to start receiving events."
        icon={<span aria-hidden="true">🔌</span>}
        action={<Button>Connect channel</Button>}
      />
    </div>
  ),
};
