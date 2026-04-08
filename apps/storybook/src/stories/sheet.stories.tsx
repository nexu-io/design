import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Slide-over panel from a screen edge for settings, detail views, or secondary workflows. For centered modals use **Dialog**.",
      },
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>Update the active workspace configuration.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 py-4">
          <Input placeholder="Workspace name" />
          <Input placeholder="Owner" />
        </div>
        <SheetFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
