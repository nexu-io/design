import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, SectionHeader } from "@nexu-design/ui-web";

const meta = {
  title: "Patterns/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
  args: {
    title: "Section",
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[640px]">
      <SectionHeader
        title="Slack"
        description="Manage workspace connection and credentials."
        action={<Button size="sm">Reconnect</Button>}
      />
    </div>
  ),
};
