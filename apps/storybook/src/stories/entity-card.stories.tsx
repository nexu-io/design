import type { Meta, StoryObj } from "@storybook/react-vite";

import { Server, Zap } from "lucide-react";

import {
  Button,
  EntityCard,
  EntityCardContent,
  EntityCardDescription,
  EntityCardFooter,
  EntityCardHeader,
  EntityCardMedia,
  EntityCardMediaFallback,
  EntityCardMediaImage,
  EntityCardMeta,
  EntityCardTitle,
} from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/EntityCard",
  component: EntityCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/entity-card"),
      },
    },
  },
} satisfies Meta<typeof EntityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SkillCards: Story = {
  render: () => (
    <div className="grid w-[640px] grid-cols-2 gap-4">
      <EntityCard interactive>
        <EntityCardHeader>
          <EntityCardMedia>
            <EntityCardMediaImage src="/logos/slack.svg" alt="Slack" />
          </EntityCardMedia>
          <div>
            <EntityCardTitle>Slack Relay</EntityCardTitle>
            <EntityCardMeta className="mt-0.5">latest</EntityCardMeta>
          </div>
        </EntityCardHeader>
        <EntityCardContent>
          <EntityCardDescription>
            Route messages, trigger workflows, and manage channels from Slack.
          </EntityCardDescription>
        </EntityCardContent>
        <EntityCardFooter className="justify-end border-0 pt-0">
          <Button variant="outline" size="sm">
            Install
          </Button>
        </EntityCardFooter>
      </EntityCard>

      <EntityCard interactive>
        <EntityCardHeader>
          <EntityCardMedia>
            <EntityCardMediaImage src="/logos/github.svg" alt="GitHub" />
          </EntityCardMedia>
          <div>
            <EntityCardTitle>Git Bridge</EntityCardTitle>
            <EntityCardMeta className="mt-0.5">v2.1.0</EntityCardMeta>
          </div>
        </EntityCardHeader>
        <EntityCardContent>
          <EntityCardDescription>
            Sync repos, automate PR reviews, and manage branches across GitHub and GitLab.
          </EntityCardDescription>
        </EntityCardContent>
        <EntityCardFooter className="justify-end border-0 pt-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-text-muted hover:bg-destructive/10 hover:text-destructive"
          >
            Uninstall
          </Button>
        </EntityCardFooter>
      </EntityCard>

      <EntityCard interactive>
        <EntityCardHeader>
          <EntityCardMedia>
            <EntityCardMediaImage src="/logos/notion.svg" alt="Notion" />
          </EntityCardMedia>
          <div>
            <EntityCardTitle>Notion Sync</EntityCardTitle>
            <EntityCardMeta className="mt-0.5">v1.3.0</EntityCardMeta>
          </div>
        </EntityCardHeader>
        <EntityCardContent>
          <EntityCardDescription>
            Sync pages, databases, and wikis between Notion and your workspace.
          </EntityCardDescription>
        </EntityCardContent>
        <EntityCardFooter className="justify-end border-0 pt-0">
          <Button variant="outline" size="sm">
            Install
          </Button>
        </EntityCardFooter>
      </EntityCard>

      <EntityCard interactive>
        <EntityCardHeader>
          <EntityCardMedia>
            <EntityCardMediaImage src="/logos/gmail.svg" alt="Gmail" />
          </EntityCardMedia>
          <div>
            <EntityCardTitle>Gmail Agent</EntityCardTitle>
            <EntityCardMeta className="mt-0.5">latest</EntityCardMeta>
          </div>
        </EntityCardHeader>
        <EntityCardContent>
          <EntityCardDescription>
            Read, draft, and send emails. Manage labels and automate inbox workflows.
          </EntityCardDescription>
        </EntityCardContent>
        <EntityCardFooter className="justify-end border-0 pt-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-text-muted hover:bg-destructive/10 hover:text-destructive"
          >
            Uninstall
          </Button>
        </EntityCardFooter>
      </EntityCard>

      {/* Icon fallback — no third-party logo */}
      <EntityCard interactive>
        <EntityCardHeader>
          <EntityCardMedia>
            <EntityCardMediaFallback>
              <Zap className="size-5" />
            </EntityCardMediaFallback>
          </EntityCardMedia>
          <div>
            <EntityCardTitle>Gog CLI</EntityCardTitle>
            <EntityCardMeta className="mt-0.5">latest</EntityCardMeta>
          </div>
        </EntityCardHeader>
        <EntityCardContent>
          <EntityCardDescription>
            Google Workspace CLI for Gmail, Calendar, Drive, Contacts, Sheets, and more.
          </EntityCardDescription>
        </EntityCardContent>
        <EntityCardFooter className="justify-end border-0 pt-0">
          <Button variant="outline" size="sm">
            Install
          </Button>
        </EntityCardFooter>
      </EntityCard>

      <EntityCard interactive>
        <EntityCardHeader>
          <EntityCardMedia>
            <EntityCardMediaFallback>
              <Server className="size-5" />
            </EntityCardMediaFallback>
          </EntityCardMedia>
          <div>
            <EntityCardTitle>Infra Monitor</EntityCardTitle>
            <EntityCardMeta className="mt-0.5">v1.4.2</EntityCardMeta>
          </div>
        </EntityCardHeader>
        <EntityCardContent>
          <EntityCardDescription>
            Real-time alerts and dashboards for cloud infrastructure health.
          </EntityCardDescription>
        </EntityCardContent>
        <EntityCardFooter className="justify-end border-0 pt-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-text-muted hover:bg-destructive/10 hover:text-destructive"
          >
            Uninstall
          </Button>
        </EntityCardFooter>
      </EntityCard>
    </div>
  ),
};
