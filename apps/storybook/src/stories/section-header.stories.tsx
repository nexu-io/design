import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, SectionHeader } from "@nexu-design/ui-web";

const meta = {
  title: "Patterns/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
  args: {
    title: "Section",
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Color Tokens",
    description: "Design tokens used across the system for consistent color usage.",
  },
};

export const WithAction: Story = {
  render: () => (
    <SectionHeader
      title="Recent Activity"
      description="Events from the last 7 days."
      action={
        <Button variant="outline" size="sm">
          View all
        </Button>
      }
    />
  ),
};

export const TitleOnly: Story = {
  args: {
    title: "Typography",
  },
};
