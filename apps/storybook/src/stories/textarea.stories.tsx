import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/textarea"),
      },
    },
  },
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
