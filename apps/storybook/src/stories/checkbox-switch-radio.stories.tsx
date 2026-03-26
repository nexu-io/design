import type { Meta, StoryObj } from '@storybook/react'

import { Checkbox, Label, RadioGroup, RadioGroupItem, Switch } from '@nexu/ui-web'

const meta = {
  title: 'Primitives/Selection Controls',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="grid gap-6">
      <div className="flex items-center gap-3">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms</Label>
      </div>

      <div className="flex items-center gap-3">
        <Switch id="notifications" defaultChecked />
        <Label htmlFor="notifications">Enable notifications</Label>
      </div>

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
    </div>
  ),
}
