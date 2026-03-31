import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Save changes",
    variant: "primary",
    size: "md",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="link">View details</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button leadingIcon={<span aria-hidden="true">⚙️</span>}>Settings</Button>
      <Button trailingIcon={<span aria-hidden="true">→</span>}>Continue</Button>
      <Button size="icon" variant="ghost" aria-label="Settings">
        <span aria-hidden="true">⚙️</span>
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button disabled>Primary</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="outline" disabled>Outline</Button>
      <Button variant="ghost" disabled>Ghost</Button>
      <Button variant="destructive" disabled>Delete</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    children: "Saving...",
  },
};
