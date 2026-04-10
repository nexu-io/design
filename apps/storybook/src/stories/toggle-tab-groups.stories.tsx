import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToggleGroup, ToggleGroupItem } from "@nexu-design/ui-web";

const meta: Meta = {
  title: "Primitives/Segmented",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Segmented control for filtering or switching modes without changing page content. Built on ToggleGroup. For content panel switching use **Tabs**; for single on/off use **Toggle**.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const ThreeOptions: Story = {
  name: "3 options with counts",
  render: () => (
    <ToggleGroup type="single" defaultValue="all" variant="outline" aria-label="Skill filter">
      <ToggleGroupItem value="all" variant="outline">
        All <span className="ml-1 tabular-nums opacity-70">31</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="builtin" variant="outline">
        Built-in <span className="ml-1 tabular-nums opacity-70">31</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="custom" variant="outline">
        Custom <span className="ml-1 tabular-nums opacity-70">0</span>
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const FourOptions: Story = {
  name: "4 options",
  render: () => (
    <ToggleGroup type="single" defaultValue="week" variant="outline" aria-label="Time range">
      <ToggleGroupItem value="day" variant="outline">
        Day
      </ToggleGroupItem>
      <ToggleGroupItem value="week" variant="outline">
        Week
      </ToggleGroupItem>
      <ToggleGroupItem value="month" variant="outline">
        Month
      </ToggleGroupItem>
      <ToggleGroupItem value="year" variant="outline">
        Year
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

