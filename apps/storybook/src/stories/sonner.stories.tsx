import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";

import { Button, Toaster } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Sonner",
  component: Toaster,
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex gap-3">
      <Toaster richColors closeButton position="top-right" />
      <Button
        onClick={() => {
          toast.success("Deployment finished", {
            description: "All workspace checks passed and the new version is live.",
            action: {
              label: "View",
              onClick: () => {},
            },
          });
        }}
      >
        Show success toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.error("Sync failed", {
            description: "Linear could not be reached. Retry in a few moments.",
          });
        }}
      >
        Show error toast
      </Button>
    </div>
  ),
};
