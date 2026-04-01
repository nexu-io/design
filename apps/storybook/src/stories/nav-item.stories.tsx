import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Home, MessageSquare, Settings, Star, Users, Zap } from "lucide-react";

import { Badge, NavItem } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/NavItem",
  component: NavItem,
  tags: ["autodocs"],
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "conversations", label: "Conversations", icon: MessageSquare, count: 3 },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "team", label: "Team", icon: Users },
  { id: "rewards", label: "Rewards", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
];

function NavDemo({ density }: { density?: "default" | "compact" }) {
  const [active, setActive] = useState("home");
  return (
    <div className="w-56 rounded-xl border border-border bg-surface-0 p-2">
      <div className="space-y-0.5">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={<item.icon size={16} />}
            label={item.label}
            active={active === item.id}
            density={density}
            onClick={() => setActive(item.id)}
            trailing={item.count ? <Badge variant="secondary">{item.count}</Badge> : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <NavDemo />,
};

export const Compact: Story = {
  render: () => <NavDemo density="compact" />,
};

export const SingleItem: Story = {
  render: () => (
    <div className="w-56 space-y-2">
      <NavItem icon={<Home size={16} />} label="Active item" active />
      <NavItem icon={<Settings size={16} />} label="Inactive item" />
      <NavItem
        icon={<MessageSquare size={16} />}
        label="With trailing"
        trailing={<Badge variant="secondary">5</Badge>}
      />
    </div>
  ),
};
