import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Popover",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-2">
        <div className="text-sm font-medium">Connected workspace</div>
        <p className="text-xs text-muted-foreground">Switch active workspace or review status.</p>
      </PopoverContent>
    </Popover>
  ),
};
