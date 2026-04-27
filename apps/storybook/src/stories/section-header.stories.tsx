import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, SectionHeader } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Patterns/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/patterns/section-header"),
      },
    },
  },
  args: {
    title: "Recent activity",
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SectionHeader
      title={<span className="text-sm font-semibold text-text-primary">Recent activity</span>}
      action={
        <Button size="sm" variant="outline">
          View all
        </Button>
      }
    />
  ),
};
