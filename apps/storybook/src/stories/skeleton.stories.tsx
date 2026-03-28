import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Skeleton",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[360px] gap-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  ),
};
