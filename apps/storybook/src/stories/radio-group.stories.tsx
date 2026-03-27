import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label, RadioGroup, RadioGroupItem } from "@nexu/ui-web";

const meta = {
  title: "Primitives/RadioGroup",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="cloud" className="gap-3">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="cloud" id="cloud" />
        <Label htmlFor="cloud">Cloud models</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="byok" id="byok" />
        <Label htmlFor="byok">Bring your own key</Label>
      </div>
    </RadioGroup>
  ),
};
