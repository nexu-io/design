import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatsBar } from "@nexu/ui-web";

const meta = {
  title: "Primitives/StatsBar",
  component: StatsBar,
  tags: ["autodocs"],
} satisfies Meta<typeof StatsBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [],
  },
  render: () => (
    <div className="w-[760px]">
      <StatsBar
        items={[
          { id: "success", label: "Success rate", value: "96%", tone: "success" },
          { id: "active", label: "Active agents", value: "14", tone: "accent", selected: true },
          { id: "savings", label: "Hours saved", value: "128h" },
        ]}
      />
    </div>
  ),
};
