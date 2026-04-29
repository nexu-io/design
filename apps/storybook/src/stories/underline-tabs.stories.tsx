import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Card,
  CardContent,
  UnderlineTabs,
  UnderlineTabsContent,
  UnderlineTabsList,
  UnderlineTabsTrigger,
} from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Patterns/UnderlineTabs",
  component: UnderlineTabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/patterns/underline-tabs"),
      },
    },
  },
} satisfies Meta<typeof UnderlineTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <UnderlineTabs defaultValue="usage" className="w-[420px]">
      <UnderlineTabsList className="mb-4">
        <UnderlineTabsTrigger value="usage">Usage</UnderlineTabsTrigger>
        <UnderlineTabsTrigger value="plans">Plans</UnderlineTabsTrigger>
        <UnderlineTabsTrigger value="rewards">Rewards</UnderlineTabsTrigger>
      </UnderlineTabsList>
      <UnderlineTabsContent value="usage">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Credits, reset windows, and quota status.
          </CardContent>
        </Card>
      </UnderlineTabsContent>
      <UnderlineTabsContent value="plans">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Compare tiers, promos, and model access.
          </CardContent>
        </Card>
      </UnderlineTabsContent>
      <UnderlineTabsContent value="rewards">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Bonus credits from referrals and streaks.
          </CardContent>
        </Card>
      </UnderlineTabsContent>
    </UnderlineTabs>
  ),
};
