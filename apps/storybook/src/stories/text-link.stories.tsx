import { TextLink } from "@nexu-design/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Primitives/TextLink",
  component: TextLink,
  tags: ["autodocs"],
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <TextLink href="#">Default link</TextLink>
      <TextLink href="#" variant="muted">
        Muted link
      </TextLink>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <TextLink href="#" target="_blank" rel="noopener noreferrer" showArrowUpRight>
      Open in browser
    </TextLink>
  ),
};

export const ExternalLinks: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <TextLink href="#" target="_blank" rel="noopener noreferrer" showArrowUpRight>
        Open documentation
      </TextLink>
      <TextLink href="#" size="default" target="_blank" rel="noopener noreferrer" showArrowUpRight>
        Visit provider console
      </TextLink>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <TextLink href="#" size="xs">
        Extra small
      </TextLink>
      <TextLink href="#" size="sm">
        Small (default)
      </TextLink>
      <TextLink href="#" size="default">
        Default
      </TextLink>
      <TextLink href="#" size="lg">
        Large
      </TextLink>
    </div>
  ),
};
