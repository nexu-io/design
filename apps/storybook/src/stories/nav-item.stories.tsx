import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Home, Sparkles } from "lucide-react";

import { NavItem } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/NavItem",
  component: NavItem,
  tags: ["autodocs"],
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[280px] gap-1 rounded-xl border border-border bg-surface-1 p-3">
      <NavItem selected>
        <Home className="size-4" />
        Home
      </NavItem>
      <NavItem>
        <Sparkles className="size-4" />
        Skills
      </NavItem>
      <NavItem size="compact">
        <Bell className="size-4" />
        Notifications
      </NavItem>
    </div>
  ),
};

export const Accent: Story = {
  render: () => (
    <div className="grid w-[280px] gap-1 rounded-xl border border-border bg-surface-1 p-3">
      <NavItem tone="accent" selected>
        <Home className="size-4" />
        Dashboard
      </NavItem>
      <NavItem tone="accent">
        <Sparkles className="size-4" />
        Automation
      </NavItem>
    </div>
  ),
};
