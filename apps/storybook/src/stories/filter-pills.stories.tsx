import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Bot, Globe, Zap } from "lucide-react";

import { FilterPills, type FilterPillItem } from "@nexu-design/ui-web";

const categoryItems: FilterPillItem[] = [
  { id: "all", label: "All", count: 38 },
  { id: "social", label: "Social", count: 12, emoji: "💬" },
  { id: "coding", label: "Coding", count: 8, emoji: "🧑‍💻" },
  { id: "writing", label: "Writing", count: 6, emoji: "✍️" },
  { id: "research", label: "Research", count: 5 },
  { id: "data", label: "Data", count: 7 },
];

const segmentItems: FilterPillItem[] = [
  { id: "marketplace", label: "Marketplace" },
  { id: "yours", label: "Yours" },
  { id: "running", label: "Running" },
];

const iconItems: FilterPillItem[] = [
  { id: "agents", label: "Agents", icon: Bot },
  { id: "channels", label: "Channels", icon: Globe },
  { id: "skills", label: "Skills", icon: Zap },
];

const meta = {
  title: "Primitives/FilterPills",
  component: FilterPills,
  tags: ["autodocs"],
  args: {
    items: categoryItems,
    value: "all",
    onChange: () => {},
  },
} satisfies Meta<typeof FilterPills>;

export default meta;
type Story = StoryObj<typeof meta>;

function PillDemo({
  items,
  variant,
  size,
}: {
  items: FilterPillItem[];
  variant?: "pill" | "segment";
  size?: "sm" | "md";
}) {
  const [value, setValue] = useState(items[0].id);
  return (
    <FilterPills items={items} value={value} onChange={setValue} variant={variant} size={size} />
  );
}

export const Default: Story = {
  render: () => <PillDemo items={categoryItems} />,
};

export const SegmentVariant: Story = {
  render: () => <PillDemo items={segmentItems} variant="segment" />,
};

export const MediumSize: Story = {
  render: () => <PillDemo items={categoryItems} size="md" />,
};

export const WithIcons: Story = {
  render: () => <PillDemo items={iconItems} />,
};

export const SegmentMedium: Story = {
  render: () => <PillDemo items={segmentItems} variant="segment" size="md" />,
};
