import type { Meta, StoryObj } from "@storybook/react-vite";
import { Layers3, Sparkles } from "lucide-react";

import {
  Badge,
  Button,
  EntityCard,
  EntityCardContent,
  EntityCardDescription,
  EntityCardFooter,
  EntityCardHeader,
  EntityCardMedia,
  EntityCardMeta,
  EntityCardTitle,
} from "@nexu/ui-web";

const meta = {
  title: "Primitives/EntityCard",
  component: EntityCard,
  tags: ["autodocs"],
} satisfies Meta<typeof EntityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[760px] grid-cols-2 gap-4">
      <EntityCard interactive>
        <EntityCardHeader>
          <EntityCardMedia>
            <Sparkles className="size-4" />
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
          Built for teams that need a faster handoff from research to publish-ready content.
        </EntityCardContent>
        <EntityCardFooter>
          <Badge variant="success">Healthy</Badge>
        </EntityCardFooter>
      </EntityCard>

      <EntityCard>
        <EntityCardHeader>
          <EntityCardMedia>
            <Layers3 className="size-4" />
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
            View details
          </Button>
        </EntityCardFooter>
      </EntityCard>
    </div>
  ),
};
