import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bold, Italic, Pin, Underline } from "lucide-react";

import { Toggle, ToggleGroup, ToggleGroupItem } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Toggle",
  component: Toggle,
  tags: ["autodocs"],
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
