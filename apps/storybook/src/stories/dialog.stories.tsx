import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Dialog",
  component: Dialog,
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Connect channel</DialogTitle>
          <DialogDescription>Add credentials to finish setup.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <Input placeholder="Client ID" />
          <Input placeholder="Client secret" />
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
