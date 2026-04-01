import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusDot } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/StatusDot",
  component: StatusDot,
  tags: ["autodocs"],
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Statuses: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-lg">
        <StatusDot status="success" /> Live
      </div>
      <div className="flex items-center gap-2 text-lg">
        <StatusDot status="warning" /> Building
      </div>
      <div className="flex items-center gap-2 text-lg">
        <StatusDot status="error" /> Failed
      </div>
      <div className="flex items-center gap-2 text-lg">
        <StatusDot status="info" /> Info
      </div>
      <div className="flex items-center gap-2 text-lg">
        <StatusDot status="neutral" /> Offline
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-lg">
        <StatusDot status="success" size="xs" /> xs
      </div>
      <div className="flex items-center gap-2 text-lg">
        <StatusDot status="success" size="sm" /> sm
      </div>
      <div className="flex items-center gap-2 text-lg">
        <StatusDot status="success" /> default
      </div>
      <div className="flex items-center gap-2 text-lg">
        <StatusDot status="success" size="lg" /> lg
      </div>
    </div>
  ),
};

export const Pulsing: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-lg">
        <StatusDot status="success" pulse /> Running
      </div>
      <div className="flex items-center gap-2 text-lg">
        <StatusDot status="warning" pulse /> Deploying
      </div>
    </div>
  ),
};
