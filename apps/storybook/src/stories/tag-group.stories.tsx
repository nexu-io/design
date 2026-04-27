import type { Meta, StoryObj } from "@storybook/react-vite";

import { TagGroup, TagGroupItem } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/TagGroup",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/tag-group"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TagGroup>
      <TagGroupItem variant="accent">AI</TagGroupItem>
      <TagGroupItem variant="accent">Slack</TagGroupItem>
      <TagGroupItem variant="success">Healthy</TagGroupItem>
      <TagGroupItem variant="warning">Needs review</TagGroupItem>
    </TagGroup>
  ),
};
