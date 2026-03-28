import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Spinner",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <Spinner />
      <span>Loading session list…</span>
    </div>
  ),
};
