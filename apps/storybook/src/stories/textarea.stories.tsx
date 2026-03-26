import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "@nexu/ui-web";

const meta = {
  title: "Primitives/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    placeholder: "Describe your workflow...",
    rows: 5,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "Missing required context",
  },
};
