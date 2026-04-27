import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "@nexu-design/ui-web";
import { Search } from "lucide-react";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Enter API key",
  },
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/input"),
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLeadingIcon: Story = {
  args: {
    leadingIcon: <Search size={16} />,
    placeholder: "Search skills",
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "invalid-token",
  },
};
