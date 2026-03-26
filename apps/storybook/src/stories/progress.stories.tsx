import type { Meta, StoryObj } from "@storybook/react-vite";

import { Progress } from "@nexu/ui-web";

const meta = {
  title: "Primitives/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: {
    value: 48,
    max: 100,
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="grid w-[360px] gap-4">
      <div className="space-y-2">
        <div className="text-sm text-text-secondary">Default</div>
        <Progress value={32} />
      </div>
      <div className="space-y-2">
        <div className="text-sm text-text-secondary">Accent</div>
        <Progress value={58} variant="accent" />
      </div>
      <div className="space-y-2">
        <div className="text-sm text-text-secondary">Success</div>
        <Progress value={84} variant="success" />
      </div>
      <div className="space-y-2">
        <div className="text-sm text-text-secondary">Warning</div>
        <Progress value={24} variant="warning" />
      </div>
    </div>
  ),
};
