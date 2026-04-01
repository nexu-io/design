import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpRight, Bot, Layers3, Sparkles, User } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  ConversationMessage,
  EntityCard,
  EntityCardContent,
  EntityCardDescription,
  EntityCardFooter,
  EntityCardHeader,
  EntityCardMedia,
  EntityCardMediaFallback,
  EntityCardMeta,
  EntityCardTitle,
  StatsBar,
  Stepper,
  StepperItem,
  StepperSeparator,
} from "@nexu-design/ui-web";

const meta = {
  title: "Scenarios/Conversation Entities",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TeamStatusThread: Story = {
  render: () => (
    <div className="grid w-[720px] gap-4">
      <ConversationMessage
        avatar={
          <Avatar className="size-7">
            <AvatarFallback>
              <Bot className="size-4" />
            </AvatarFallback>
          </Avatar>
        }
        meta="Just now"
        actions={
          <Button size="sm" variant="ghost">
            Open task <ArrowUpRight className="size-3" />
          </Button>
        }
      >
        I summarized the new support issues and drafted the follow-up actions.
      </ConversationMessage>
      <ConversationMessage
        avatar={
          <Avatar className="size-7">
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
        }
        meta="1 min ago"
        variant="user"
      >
        Send the recap to the revenue team and flag anything urgent.
      </ConversationMessage>
    </div>
  ),
};

export const LaunchStepperFlow: Story = {
  render: () => (
    <div className="grid w-[720px] gap-8">
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

export const WorkspaceEntityCards: Story = {
  render: () => (
    <div className="grid w-[760px] grid-cols-2 gap-4">
      <EntityCard interactive>
        <EntityCardHeader>
          <EntityCardMedia>
            <EntityCardMediaFallback>
              <Sparkles className="size-4" />
            </EntityCardMediaFallback>
          </EntityCardMedia>
          <div>
            <EntityCardTitle>Content pipeline</EntityCardTitle>
            <EntityCardDescription>
              Automated drafting and approvals for weekly campaigns.
            </EntityCardDescription>
            <EntityCardMeta>12 active flows</EntityCardMeta>
          </div>
        </EntityCardHeader>
        <EntityCardContent>
          Built for teams that need faster handoff from research to publish-ready content.
        </EntityCardContent>
        <EntityCardFooter>
          <Badge variant="success">Healthy</Badge>
        </EntityCardFooter>
      </EntityCard>
      <EntityCard>
        <EntityCardHeader>
          <EntityCardMedia>
            <EntityCardMediaFallback>
              <Layers3 className="size-4" />
            </EntityCardMediaFallback>
          </EntityCardMedia>
          <div>
            <EntityCardTitle>Escalation workspace</EntityCardTitle>
            <EntityCardDescription>
              Routes urgent issues to the right owner automatically.
            </EntityCardDescription>
            <EntityCardMeta>4 connected systems</EntityCardMeta>
          </div>
        </EntityCardHeader>
        <EntityCardFooter>
          <Button variant="outline" size="sm">
            View details <ArrowUpRight className="size-3" />
          </Button>
        </EntityCardFooter>
      </EntityCard>
    </div>
  ),
};

export const OperationalStatsBar: Story = {
  render: () => (
    <div className="w-[760px]">
      <StatsBar
        items={[
          { id: "success", label: "Success rate", value: "96%", tone: "success" },
          { id: "active", label: "Active agents", value: "14", tone: "accent", selected: true },
          { id: "savings", label: "Hours saved", value: "128h" },
        ]}
      />
    </div>
  ),
};
