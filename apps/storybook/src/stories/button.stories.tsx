import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Save changes",
    variant: "primary",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/button"),
      },
    },
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

export const Loading: Story = {
  args: {
    loading: true,
    children: "Saving...",
  },
};

export const PolishStates: Story = {
  render: () => (
    <div className="grid gap-4">
      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">
          Surface-first hover treatment
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">Outline action</Button>
          <Button variant="ghost">Ghost action</Button>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">
          Focus-visible uses the shared ring token
        </p>
        <div className="flex flex-wrap gap-3">
          <Button autoFocus variant="outline">
            Keyboard focus
          </Button>
          <Button variant="ghost">Secondary action</Button>
        </div>
      </div>
    </div>
  ),
};
