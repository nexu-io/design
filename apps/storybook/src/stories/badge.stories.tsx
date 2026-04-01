import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertCircle, CheckCircle2, CircleDot, Clock, Info } from "lucide-react";

import { Badge } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Connected</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="destructive">Failed</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">
        <CheckCircle2 /> Connected
      </Badge>
      <Badge variant="warning">
        <Clock /> Pending
      </Badge>
      <Badge variant="destructive">
        <AlertCircle /> Failed
      </Badge>
      <Badge variant="outline">
        <Info /> Info
      </Badge>
      <Badge>
        <CircleDot /> Running
      </Badge>
    </div>
  ),
};
