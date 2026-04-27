import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label, Switch } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/Switch",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/switch"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Switch id="notifications" defaultChecked />
        <Label htmlFor="notifications">Enable notifications</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="auto-save" size="sm" defaultChecked />
        <Label htmlFor="auto-save">Auto save</Label>
      </div>
    </div>
  ),
};
