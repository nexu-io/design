import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpRight } from "lucide-react";

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
      <Button variant="link">
        View details <ArrowUpRight className="size-3" />
      </Button>
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
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
      <Button variant="destructive" disabled>
        Delete
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <Button size="xs">xs · 28px</Button>
      <Button size="sm">sm · 32px</Button>
      <Button size="default">default · 36px</Button>
      <Button size="md">md · 40px</Button>
      <Button size="lg">lg · 48px</Button>
      <Button size="icon" variant="outline" aria-label="Icon">
        <span aria-hidden="true">⚙️</span>
      </Button>
      <Button size="icon-sm" variant="outline" aria-label="Small icon">
        <span aria-hidden="true">✦</span>
      </Button>
    </div>
  ),
};

export const SizesOutline: Story = {
  name: "Sizes (Outline)",
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <Button variant="outline" size="xs">
        xs · 28px
      </Button>
      <Button variant="outline" size="sm">
        sm · 32px
      </Button>
      <Button variant="outline" size="default">
        default · 36px
      </Button>
      <Button variant="outline" size="md">
        md · 40px
      </Button>
      <Button variant="outline" size="lg">
        lg · 48px
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    children: "Saving...",
  },
};
