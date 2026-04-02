import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, PageHeader } from "@nexu-design/ui-web";

const meta = {
  title: "Patterns/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  args: {
    title: "Page",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <PageHeader
      title="Integrations"
      description="Manage all external services your workspace can connect to."
      actions={
        <>
          <Button variant="outline">Docs</Button>
          <Button>Add integration</Button>
        </>
      }
    />
  ),
};

export const ShellDensity: Story = {
  name: "Shell (desktop / Tauri)",
  render: () => (
    <PageHeader
      density="shell"
      title="Earn more usage"
      description={
        <>
          Complete tasks to get extra usage credits.{" "}
          <a
            href="#rewards"
            className="text-[var(--color-link)] underline-offset-4 hover:underline"
          >
            View reward rules
          </a>
        </>
      }
    />
  ),
};
