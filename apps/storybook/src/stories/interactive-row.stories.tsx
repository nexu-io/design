import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal, Sparkles } from "lucide-react";

import {
  Badge,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  StatusDot,
} from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/InteractiveRow",
  component: InteractiveRow,
  tags: ["autodocs"],
} satisfies Meta<typeof InteractiveRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[640px] gap-3">
      <InteractiveRow className="p-4">
        <InteractiveRowLeading>
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Sparkles className="size-4" />
          </div>
        </InteractiveRowLeading>
        <InteractiveRowContent>
          <div className="text-lg font-medium text-text-primary">Summarize customer interviews</div>
          <div className="text-sm text-text-muted">Content ops • Updated 6 minutes ago</div>
        </InteractiveRowContent>
        <InteractiveRowTrailing>
          <Badge variant="accent">Ready</Badge>
        </InteractiveRowTrailing>
      </InteractiveRow>
      <InteractiveRow selected tone="subtle" className="p-4">
        <InteractiveRowLeading>
          <StatusDot status="success" size="lg" />
        </InteractiveRowLeading>
        <InteractiveRowContent>
          <div className="text-lg font-medium text-text-primary">
            Publish weekly automation recap
          </div>
          <div className="text-sm text-text-muted">Marketing • Due in 30 minutes</div>
        </InteractiveRowContent>
        <InteractiveRowTrailing>
          <MoreHorizontal className="size-4 text-text-muted" />
        </InteractiveRowTrailing>
      </InteractiveRow>
    </div>
  ),
};
