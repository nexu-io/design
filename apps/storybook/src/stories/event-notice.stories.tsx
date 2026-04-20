import type { Meta, StoryObj } from "@storybook/react-vite";
import { Archive, AtSign, LogIn, Pin } from "lucide-react";

import { EventNotice } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/EventNotice",
  component: EventNotice,
  tags: ["autodocs"],
  args: {
    children: "Bob Li joined #backend-platform",
    icon: <LogIn className="size-2.5" />,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Low-emphasis notice for meta events inside a feed — joins/leaves, mentions, pins, folded groups. Sits between messages as a quiet marker.",
      },
    },
  },
} satisfies Meta<typeof EventNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex w-[560px] flex-col rounded-lg border border-border bg-surface-0 py-2">
      <EventNotice icon={<LogIn className="size-2.5" />}>
        Bob Li joined #backend-platform
      </EventNotice>
      <EventNotice icon={<AtSign className="size-2.5" />}>
        Coder was mentioned by Alice Chen
      </EventNotice>
      <EventNotice icon={<Pin className="size-2.5" />}>
        Alice pinned "Billing retry regression (Apr 17 outage)"
      </EventNotice>
      <EventNotice icon={<Archive className="size-2.5" />}>
        3 older join/leave events folded · click to expand
      </EventNotice>
    </div>
  ),
};

export const Plain: Story = {
  args: {
    plain: true,
  },
};
