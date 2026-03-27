import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox, Label } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Checkbox",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Checkbox id="accept-terms" />
      <Label htmlFor="accept-terms">Accept terms</Label>
    </div>
  ),
};
