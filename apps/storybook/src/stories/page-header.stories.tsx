import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, PageHeader } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Patterns/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/patterns/page-header"),
      },
    },
  },
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

export const WithLongDescription: Story = {
  render: () => (
    <PageHeader
      title="Provider settings"
      description="Configure regions, authentication methods, and network overrides without scattering custom margins between the title, helper copy, and trailing actions."
      actions={
        <>
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </>
      }
    />
  ),
};

export const WithDescriptionLink: Story = {
  render: () => (
    <PageHeader
      title="Channel setup"
      description={
        <>
          Review the rollout requirements before connecting production channels.{" "}
          <a href="#docs">Read setup guide</a>
        </>
      }
      actions={<Button variant="outline">Open docs</Button>}
    />
  ),
};
