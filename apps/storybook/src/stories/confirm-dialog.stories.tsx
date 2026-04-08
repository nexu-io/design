import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, ConfirmDialog } from "@nexu-design/ui-web";

const meta = {
  title: "Patterns/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Pre-built confirm/cancel prompt for destructive or irreversible actions. For custom modal content use **Dialog** directly.',
      },
    },
  },
  args: {
    title: "Confirm action",
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ConfirmDialog
      trigger={<Button variant="destructive">Delete channel</Button>}
      title="Delete Slack channel"
      description="This will permanently remove connection credentials."
      confirmLabel="Delete"
    />
  ),
};
