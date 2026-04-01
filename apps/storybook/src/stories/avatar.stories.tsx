import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback, AvatarImage } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Avatar",
  component: Avatar,
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Olivia Rhye" />
        <AvatarFallback>OR</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback />
      </Avatar>

      <Avatar className="size-12">
        <AvatarFallback />
      </Avatar>

      <Avatar className="size-14 rounded-xl">
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
    </div>
  ),
};
