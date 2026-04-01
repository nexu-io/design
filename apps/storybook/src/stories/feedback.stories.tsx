import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator, Skeleton, Spinner } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Feedback",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[360px] gap-4">
      <div className="flex items-center gap-3 text-lg">
        <Spinner />
        <span>Loading session list…</span>
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
      <Separator />
      <div className="flex h-12 items-center gap-3">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  ),
};
