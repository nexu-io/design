import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart3, Sparkles, TrendingUp, Zap } from "lucide-react";

import { StatCard } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/StatCard",
  component: StatCard,
  tags: ["autodocs"],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Active automations",
    value: "14",
    icon: Zap,
    tone: "accent",
    trend: { label: "+3 today", variant: "success" },
    meta: "8 scheduled · 6 proactive",
  },
};

export const WithProgress: Story = {
  args: {
    label: "Execution success",
    value: "96%",
  },
  render: () => (
    <div className="grid w-[760px] grid-cols-2 gap-4">
      <StatCard
        label="Execution success"
        value="96%"
        icon={TrendingUp}
        tone="success"
        trend={{ label: "+2.1%", variant: "success" }}
        meta="vs last week"
        progress={96}
        progressVariant="success"
      />
      <StatCard
        label="Content pipeline"
        value="58%"
        icon={Sparkles}
        tone="accent"
        trend={{ label: "On track", variant: "brand" }}
        meta="31 / 54 tasks"
        progress={58}
        progressVariant="accent"
      />
      <StatCard
        label="Review queue"
        value="24"
        icon={BarChart3}
        tone="warning"
        meta="7 high priority"
      />
    </div>
  ),
};
