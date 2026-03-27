import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, CreditCard, LayoutGrid, MessageSquare, Settings } from "lucide-react";

import {
  ActivityBar,
  ActivityBarContent,
  ActivityBarFooter,
  ActivityBarHeader,
  ActivityBarIndicator,
  ActivityBarItem,
  Button,
} from "@nexu/ui-web";

const meta = {
  title: "Primitives/ActivityBar",
  component: ActivityBar,
  tags: ["autodocs"],
} satisfies Meta<typeof ActivityBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-[360px] overflow-hidden rounded-xl border border-border">
      <ActivityBar className="h-full">
        <ActivityBarHeader>
          <Button variant="ghost" size="icon-sm" aria-label="Workspace home">
            <LayoutGrid className="size-4" />
          </Button>
        </ActivityBarHeader>
        <ActivityBarContent>
          <ActivityBarItem active aria-label="Inbox">
            <ActivityBarIndicator />
            <Bell className="size-4" />
          </ActivityBarItem>
          <ActivityBarItem aria-label="Messages">
            <MessageSquare className="size-4" />
          </ActivityBarItem>
          <ActivityBarItem aria-label="Billing">
            <CreditCard className="size-4" />
          </ActivityBarItem>
        </ActivityBarContent>
        <ActivityBarFooter>
          <ActivityBarItem aria-label="Settings">
            <Settings className="size-4" />
          </ActivityBarItem>
        </ActivityBarFooter>
      </ActivityBar>
    </div>
  ),
};
