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
} from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Reserved/ActivityBar",
  component: ActivityBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/activity-bar"),
      },
    },
  },
} satisfies Meta<typeof ActivityBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const RailDemo = () => (
  <>
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
  </>
);

export const Default: Story = {
  render: () => (
    <div className="h-[360px] overflow-hidden rounded-xl border border-border">
      <ActivityBar className="h-full">
        <RailDemo />
      </ActivityBar>
    </div>
  ),
};

/**
 * Light frosted-glass rail designed to sit on top of a translucent host window.
 * On macOS Electron this pairs with `BrowserWindow({ vibrancy: "sidebar" })` +
 * `nativeTheme.themeSource = "light"` to produce a true desktop blur behind the
 * rail. On web / non-vibrancy hosts it degrades to a soft white wash (never
 * dark), so it's safe to use in any environment.
 *
 * The demo below fakes a blurred desktop by placing the rail above a colored
 * gradient — real apps get their blur from the host window's vibrancy material.
 */
export const Glass: Story = {
  render: () => (
    <div
      className="relative h-[360px] overflow-hidden rounded-xl border border-border"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #6ea8ff 0%, #a2d4ff 40%, #cfe8ff 70%, #ffd9a8 100%)",
      }}
    >
      <ActivityBar className="h-full border-r-0" surface="glass">
        <RailDemo />
      </ActivityBar>
    </div>
  ),
};
