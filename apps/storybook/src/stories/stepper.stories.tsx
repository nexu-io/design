import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stepper, StepperItem, StepperSeparator } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Stepper",
  component: Stepper,
  tags: ["autodocs"],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[760px] gap-8">
      <Stepper>
        <StepperItem status="completed" step={1} label="Workspace" />
        <StepperSeparator active />
        <StepperItem status="current" step={2} label="Channels" />
        <StepperSeparator />
        <StepperItem status="pending" step={3} label="Launch" />
      </Stepper>
      <Stepper orientation="vertical">
        <StepperItem
          status="completed"
          step={1}
          label="Connect Slack"
          description="Messages and alerts are flowing into the workspace."
        />
        <StepperItem
          status="current"
          step={2}
          label="Configure approvals"
          description="Choose who reviews escalations and billing changes."
        />
        <StepperItem
          status="pending"
          step={3}
          label="Enable automations"
          description="Launch proactive routing and daily digests."
        />
      </Stepper>
    </div>
  ),
};
