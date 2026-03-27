import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollArea, ScrollBar } from "@nexu/ui-web";

const meta = {
  title: "Primitives/ScrollArea",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[420px] rounded-xl border border-border bg-surface-1">
      <ScrollArea className="h-56">
        <div className="space-y-3 p-4">
          {Array.from({ length: 12 }, (_, index) => {
            const label = `Audit log entry #${index + 1}`;

            return (
              <div
                key={label}
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-secondary"
              >
                {label}
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  ),
};
