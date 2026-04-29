import type { Meta, StoryObj } from "@storybook/react-vite";

import { Code2, Globe, Sparkles } from "lucide-react";

import { BudgetPopover, Button } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Patterns/BudgetPopover",
  component: BudgetPopover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/patterns/budget-popover"),
      },
    },
  },
} satisfies Meta<typeof BudgetPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: <Button variant="outline">View details</Button>,
    title: "Credit usage this month",
  },
  render: () => (
    <BudgetPopover
      defaultOpen
      trigger={<Button variant="outline">View details</Button>}
      title="Credit usage this month"
      description="Review current usage mix, then jump into Settings → Usage for the full plan and rewards breakdown."
      items={[
        {
          id: "ai-coding",
          label: "AI coding",
          value: "1,280",
          icon: Code2,
          dotClassName: "bg-info",
        },
        {
          id: "content",
          label: "Content automation",
          value: "620",
          icon: Sparkles,
          dotClassName: "bg-pink",
        },
        {
          id: "deployments",
          label: "Deployments",
          value: "100",
          icon: Globe,
          dotClassName: "bg-success",
        },
      ]}
      summary="3,000 credits left this month · resets in ~12 days."
      footer={<Button size="sm">Open Settings → Usage</Button>}
    />
  ),
};
