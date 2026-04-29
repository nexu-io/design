import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input, Label } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/label"),
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[320px] gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" placeholder="you@example.com" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="disabled-input">Disabled field</Label>
        <Input id="disabled-input" placeholder="Cannot edit" disabled />
      </div>
    </div>
  ),
};
