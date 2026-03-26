import type { Meta, StoryObj } from "@storybook/react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nexu/ui-web";

const meta = {
  title: "Primitives/Select",
  component: Select,
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-72">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gemini">Gemini 2.5 Pro</SelectItem>
          <SelectItem value="gpt">GPT-4.1</SelectItem>
          <SelectItem value="claude">Claude Sonnet</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
