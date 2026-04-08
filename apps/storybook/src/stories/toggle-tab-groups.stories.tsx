import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToggleGroup, ToggleGroupItem } from "@nexu-design/ui-web";

const meta: Meta = {
  title: "Primitives/Toggle/Tab groups",
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj;

export const DefaultHeight: Story = {
  name: "Default height",
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <ToggleGroup type="single" defaultValue="web" variant="pill" aria-label="Share destination">
          <ToggleGroupItem value="web" variant="outline">
            Share on Web
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile" variant="outline">
            Share on Mobile
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <ToggleGroup type="single" defaultValue="a" variant="default" aria-label="Segmented">
          <ToggleGroupItem value="a">Yours</ToggleGroupItem>
          <ToggleGroupItem value="b">Explore</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="web" variant="compact" aria-label="Share destination">
      <ToggleGroupItem value="web" variant="compact">
        Share on Web
      </ToggleGroupItem>
      <ToggleGroupItem value="mobile" variant="compact">
        Share on Mobile
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
