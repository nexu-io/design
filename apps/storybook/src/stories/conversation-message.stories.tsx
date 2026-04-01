import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpRight, Bot, User } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Button,
  ConversationMessage,
} from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/ConversationMessage",
  component: ConversationMessage,
  tags: ["autodocs"],
} satisfies Meta<typeof ConversationMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

const botAvatar = (
  <Avatar className="size-7">
    <AvatarFallback>
      <Bot className="size-4" />
    </AvatarFallback>
  </Avatar>
);

const userAvatar = (
  <Avatar className="size-7">
    <AvatarFallback>
      <User className="size-4" />
    </AvatarFallback>
  </Avatar>
);

export const Default: Story = {
  render: () => (
    <div className="grid w-[720px] gap-4">
      <ConversationMessage avatar={botAvatar} meta="Just now">
        I summarized the latest support requests and drafted the follow-up plan.
      </ConversationMessage>
      <ConversationMessage avatar={userAvatar} meta="1 min ago" variant="user">
        Please send the recap to the ops team and flag anything urgent.
      </ConversationMessage>
      <ConversationMessage
        avatar={botAvatar}
        meta="Just now"
        actions={
          <Button size="sm" variant="ghost">
            Open task <ArrowUpRight className="size-3" />
          </Button>
        }
      >
        A follow-up task was created for the billing review.
      </ConversationMessage>
    </div>
  ),
};

export const MultiTurnConversation: Story = {
  render: () => (
    <div className="grid w-[720px] gap-4">
      <ConversationMessage avatar={userAvatar} meta="19:44" variant="user">
        Help me draft a weekly update for the team.
      </ConversationMessage>
      <ConversationMessage avatar={botAvatar} meta="19:44">
        Sure! Here's a draft based on this week's activity:
        {"\n\n"}
        1. Closed 12 support tickets{"\n"}
        2. Shipped the new onboarding flow{"\n"}
        3. Resolved the billing sync issue
      </ConversationMessage>
      <ConversationMessage avatar={userAvatar} meta="19:45" variant="user">
        Looks good. Add a note about the upcoming maintenance window on Friday.
      </ConversationMessage>
      <ConversationMessage avatar={botAvatar} meta="19:45">
        Done — I added a section about the Friday maintenance window. Want me to send it to Slack
        now or save it as a draft?
      </ConversationMessage>
    </div>
  ),
};

export const LongMessage: Story = {
  render: () => (
    <div className="grid w-[720px] gap-4">
      <ConversationMessage avatar={botAvatar} meta="19:45">
        I reviewed the latest batch of support requests and here's what I found:
        {"\n\n"}
        There are three recurring themes this week. First, several customers are hitting a timeout
        error when exporting large datasets — this appears to be related to the new pagination logic
        we shipped on Tuesday. Second, the onboarding wizard is dropping users at step 3 because the
        email verification link expires too quickly. Third, two enterprise accounts reported that
        their SSO integration stopped working after we updated the SAML library.
        {"\n\n"}
        I've already created tickets for each issue and assigned them to the relevant teams. Want me
        to escalate any of these?
      </ConversationMessage>
    </div>
  ),
};

export const SystemMessage: Story = {
  render: () => (
    <div className="grid w-[720px] gap-4">
      <ConversationMessage variant="system">
        This conversation was transferred from the support queue. Previous context has been loaded.
      </ConversationMessage>
      <ConversationMessage avatar={botAvatar} meta="Just now">
        I see the previous context. How can I help you today?
      </ConversationMessage>
    </div>
  ),
};
