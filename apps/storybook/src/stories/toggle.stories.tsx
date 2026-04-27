import type { Meta, StoryObj } from "@storybook/react-vite";

import { Bold, Italic, Pin, Underline } from "lucide-react";

import { Toggle, ToggleGroup, ToggleGroupItem } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Single on/off toggle button (e.g. bold, pin). For switching between views use **Tabs**; for segmented filters use **Segmented**.

${docsDescription("/components/toggle")}`,
      },
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Pin message" defaultPressed>
      <Pin className="size-4" />
    </Toggle>
  ),
};

export const Groups: Story = {
  render: () => (
    <div className="grid gap-6">
      <ToggleGroup type="single" defaultValue="bold" aria-label="Formatting">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Bold className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Italic className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Underline className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" defaultValue={["email", "slack"]} aria-label="Channels">
        <ToggleGroupItem value="email">Email</ToggleGroupItem>
        <ToggleGroupItem value="slack">Slack</ToggleGroupItem>
        <ToggleGroupItem value="sms">SMS</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="grid gap-3">
      <p className="text-sm text-text-secondary">
        Compact segmented controls use a 12px minimum label size.
      </p>
      <ToggleGroup type="single" variant="compact" defaultValue="api-key" aria-label="Auth method">
        <ToggleGroupItem variant="compact" value="oauth">
          OAuth
        </ToggleGroupItem>
        <ToggleGroupItem variant="compact" value="api-key">
          API Key
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};
