import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/Spinner",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/spinner"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-lg">
      <Spinner />
      <span>Loading session list…</span>
    </div>
  ),
};
