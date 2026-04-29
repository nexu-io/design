import type { Meta, StoryObj } from "@storybook/react-vite";

import { Sparkles } from "lucide-react";

import {
  Badge,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  StatusDot,
} from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/InteractiveRow",
  component: InteractiveRow,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/interactive-row"),
      },
    },
  },
} satisfies Meta<typeof InteractiveRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[640px] gap-3">
      <InteractiveRow className="p-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
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
      <InteractiveRow
        selected
        tone="subtle"
        className="p-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <InteractiveRowLeading>
          <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--color-success-subtle)] text-[var(--color-success)]">
            <Sparkles className="size-4" />
          </div>
        </InteractiveRowLeading>
        <InteractiveRowContent>
          <div className="text-lg font-medium text-text-primary">
            Publish weekly automation recap
          </div>
          <div className="text-sm text-text-muted">Marketing • Due in 30 minutes</div>
        </InteractiveRowContent>
        <InteractiveRowTrailing>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>Running</span>
            <StatusDot status="success" />
          </div>
        </InteractiveRowTrailing>
      </InteractiveRow>
    </div>
  ),
};
