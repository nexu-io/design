import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bot, User } from "lucide-react";

import { Button, ConversationMessage, ConversationMessageStatusIcon } from "@nexu/ui-web";

const meta = {
  title: "Primitives/ConversationMessage",
  component: ConversationMessage,
  tags: ["autodocs"],
} satisfies Meta<typeof ConversationMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[720px] gap-4">
      <ConversationMessage avatar={<Bot className="size-4" />} meta="Just now">
        I summarized the latest support requests and drafted the follow-up plan.
      </ConversationMessage>
      <ConversationMessage avatar={<User className="size-4" />} meta="1 min ago" variant="user">
        Please send the recap to the ops team and flag anything urgent.
      </ConversationMessage>
      <ConversationMessage variant="status" contentClassName="flex items-center gap-2">
        <ConversationMessageStatusIcon />
        Workflow completed successfully.
      </ConversationMessage>
      <ConversationMessage
        avatar={<Bot className="size-4" />}
        meta="Optional action"
        actions={
          <Button size="sm" variant="ghost">
            Open task
          </Button>
        }
      >
        A follow-up task was created for the billing review.
      </ConversationMessage>
    </div>
  ),
};
