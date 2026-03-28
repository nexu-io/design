import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Tabs",
  component: Tabs,
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="models" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="models">Models</TabsTrigger>
        <TabsTrigger value="channels">Channels</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
      </TabsList>
      <TabsContent value="models">
        <Card>
          <CardContent className="mt-0 text-sm text-muted-foreground">
            Manage model providers and priorities.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="channels">
        <Card>
          <CardContent className="mt-0 text-sm text-muted-foreground">
            Connect Slack, Feishu, WeChat and more.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="skills">
        <Card>
          <CardContent className="mt-0 text-sm text-muted-foreground">
            Install and organize agent skills.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};
