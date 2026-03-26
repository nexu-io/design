import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "@nexu/ui-web";

const meta = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Enter API key",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLeadingIcon: Story = {
  args: {
    leadingIcon: <span aria-hidden="true">🔎</span>,
    placeholder: "Search skills",
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "invalid-token",
  },
};
