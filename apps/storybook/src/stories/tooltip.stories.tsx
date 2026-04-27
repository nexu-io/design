import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/Tooltip",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/tooltip"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Quick explanation</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
