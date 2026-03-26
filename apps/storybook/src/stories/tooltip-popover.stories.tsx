import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@nexu/ui-web";

const meta = {
  title: "Primitives/Tooltip & Popover",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Quick explanation</TooltipContent>
        </Tooltip>

        <Popover>
          <PopoverTrigger asChild>
            <Button>Open popover</Button>
          </PopoverTrigger>
          <PopoverContent className="grid gap-2">
            <div className="text-sm font-medium">Connected workspace</div>
            <p className="text-sm text-muted-foreground">
              Switch active workspace or review its status.
            </p>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  ),
};
