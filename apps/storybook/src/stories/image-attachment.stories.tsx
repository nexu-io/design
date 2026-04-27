import type { Meta, StoryObj } from "@storybook/react-vite";

import { ImageAttachment } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/ImageAttachment",
  component: ImageAttachment,
  tags: ["autodocs"],
  args: {
    src: "https://picsum.photos/seed/image-attachment/640/400",
    alt: "Sample image",
    width: 360,
    height: 220,
  },
  parameters: {
    docs: {
      description: {
        component: `Inline image attachment with fixed dimensions and an optional caption. Pass \`onSelect\` to make the image keyboard-activatable (opens a lightbox in the host app).

${docsDescription("/components/image-attachment")}`,
      },
    },
  },
} satisfies Meta<typeof ImageAttachment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCaption: Story = {
  args: {
    caption: "P99 latency jumped at 03:14 UTC — matches deploy window.",
  },
};

export const Interactive: Story = {
  args: {
    onSelect: () => {},
    caption: "Click or press Enter to open at full size.",
  },
};
