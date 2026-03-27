import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "@nexu/ui-web";

const meta = {
  title: "Primitives/Separator",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[360px] gap-4">
      <Separator />
      <div className="flex h-12 items-center gap-3">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  ),
};
