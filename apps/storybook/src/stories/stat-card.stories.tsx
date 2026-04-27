import type { Meta, StoryObj } from "@storybook/react-vite";

import { Activity, CreditCard, ShieldCheck, TriangleAlert } from "lucide-react";

import { StatCard } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/stat-card"),
      },
    },
  },
  args: {
    label: "Monthly credits",
    value: "128,400",
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMetaAndTrend: Story = {
  args: {
    label: "Resolved incidents",
    value: "96.2%",
    icon: ShieldCheck,
    tone: "success",
    trend: {
      label: "+4.8%",
      variant: "success",
    },
    meta: "Compared with last 30 days",
  },
};

export const WithProgress: Story = {
  args: {
    label: "Workspace storage",
    value: "73%",
    icon: CreditCard,
    tone: "accent",
    meta: "146 GB of 200 GB used",
    progress: 73,
    progressVariant: "accent",
  },
};

export const Tones: Story = {
  render: () => (
    <div className="grid w-[920px] grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard label="Agents online" value="24" icon={Activity} tone="accent" meta="3 new today" />
      <StatCard
        label="Healthy services"
        value="18"
        icon={ShieldCheck}
        tone="success"
        trend={{ label: "Stable", variant: "success" }}
      />
      <StatCard
        label="Warnings"
        value="7"
        icon={TriangleAlert}
        tone="warning"
        meta="Needs review"
      />
      <StatCard
        label="Overdue invoices"
        value="2"
        icon={CreditCard}
        tone="danger"
        trend={{ label: "Urgent", variant: "destructive" }}
      />
    </div>
  ),
};
