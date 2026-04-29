import type { Meta, StoryObj } from "@storybook/react-vite";

import { FormField, Input } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Patterns/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/patterns/forms"),
      },
    },
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <FormField label="API Key" description="Stored locally on your machine.">
        <Input placeholder="sk-..." />
      </FormField>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="w-[420px]">
      <FormField
        label="Client Secret"
        description="Use the secret from your Slack app configuration."
        error="Client secret is required."
        invalid
        required
      >
        <Input placeholder="Enter secret" invalid />
      </FormField>
    </div>
  ),
};
