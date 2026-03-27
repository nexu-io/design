import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckCircle2, CircleAlert, Info, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@nexu/ui-web";

const meta = {
  title: "Primitives/Alert",
  component: Alert,
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      <Info className="size-4" />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        Alerts work well for inline guidance, confirmations, and warnings.
      </AlertDescription>
    </Alert>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid w-[640px] gap-4">
      <Alert variant="info">
        <Info className="size-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>We&apos;re syncing your latest channel activity.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircle2 className="size-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your billing details were updated successfully.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert className="size-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Two connected integrations require re-authentication.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlert className="size-4" />
        <AlertTitle>Action required</AlertTitle>
        <AlertDescription>
          Publishing is paused until you resolve the approval error.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
