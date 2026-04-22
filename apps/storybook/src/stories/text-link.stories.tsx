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

export const InlineInParagraph: Story = {
  name: 'Inline in paragraph (size="inherit")',
  render: () => (
    <div className="max-w-md space-y-4">
      <p className="text-[11px] leading-relaxed text-text-tertiary">
        By continuing, you agree to our{" "}
        <TextLink href="#" size="inherit">
          Terms
        </TextLink>{" "}
        and{" "}
        <TextLink href="#" size="inherit">
          Privacy Policy
        </TextLink>
        .
      </p>
      <p className="text-[13px] leading-relaxed text-text-secondary">
        Need help?{" "}
        <TextLink href="#" size="inherit">
          Contact support
        </TextLink>{" "}
        or{" "}
        <TextLink href="#" size="inherit">
          read the docs
        </TextLink>
        .
      </p>
      <p className="text-base leading-relaxed text-text-primary">
        Read more in the{" "}
        <TextLink href="#" size="inherit">
          pricing guide
        </TextLink>
        .
      </p>
    </div>
  ),
};
