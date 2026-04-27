import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, PanelFooter, PanelFooterActions, PanelFooterMeta } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/PanelFooter",
  component: PanelFooter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/panel-footer"),
      },
    },
  },
} satisfies Meta<typeof PanelFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[560px] overflow-hidden rounded-xl border border-border bg-surface-1">
      <div className="px-4 py-6 text-sm text-text-secondary">
        Review the changes before publishing.
      </div>
      <PanelFooter>
        <PanelFooterMeta>Last saved 2 minutes ago</PanelFooterMeta>
        <PanelFooterActions>
          <Button variant="ghost">Cancel</Button>
          <Button>Publish</Button>
        </PanelFooterActions>
      </PanelFooter>
    </div>
  ),
};
