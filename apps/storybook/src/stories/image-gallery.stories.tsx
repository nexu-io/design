import type { Meta, StoryObj } from "@storybook/react-vite";

import { ImageGallery } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const mockImages = Array.from({ length: 9 }).map((_, i) => ({
  src: `https://picsum.photos/seed/gallery-${i}/200`,
  alt: `Screenshot ${i + 1}`,
}));

const meta = {
  title: "Primitives/ImageGallery",
  component: ImageGallery,
  tags: ["autodocs"],
  args: {
    images: mockImages,
  },
  parameters: {
    docs: {
      description: {
        component: `Three-column thumbnail grid for multiple images. Overflow past \`maxVisible\` collapses into a \`+N\` overlay on the last tile.

${docsDescription("/components/image-gallery")}`,
      },
    },
  },
} satisfies Meta<typeof ImageGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  args: {
    onSelect: () => {},
  },
};

export const NoOverflow: Story = {
  args: {
    images: mockImages.slice(0, 5),
  },
};
