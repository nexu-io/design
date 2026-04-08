import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Content panel switcher — each tab reveals a different content area. For in-place filtering without content panels use **Segmented**; for single on/off use **Toggle**.",
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const CountBadge = ({ count }: { count: number }) => (
  <span className="ml-1 text-sm font-[family-name:var(--font-mono)] text-text-muted">{count}</span>
);

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
          <CardContent className="mt-0 text-base text-muted-foreground">
            Manage model providers and priorities.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="channels">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Connect Slack, Feishu, WeChat and more.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="skills">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Install and organize agent skills.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const WithCount: Story = {
  render: () => (
    <Tabs defaultValue="models" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="models">
          Models <CountBadge count={12} />
        </TabsTrigger>
        <TabsTrigger value="channels">
          Channels <CountBadge count={5} />
        </TabsTrigger>
        <TabsTrigger value="skills">
          Skills <CountBadge count={38} />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="models">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Manage model providers and priorities.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="channels">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Connect Slack, Feishu, WeChat and more.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="skills">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Install and organize agent skills.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="grid gap-3">
      <p className="text-sm text-text-secondary">
        Compact interactive labels keep a 12px minimum for readability.
      </p>
      <Tabs defaultValue="web" className="w-[360px]">
        <TabsList variant="compact">
          <TabsTrigger value="web" variant="compact">
            Share on Web
          </TabsTrigger>
          <TabsTrigger value="mobile" variant="compact">
            Share on Mobile
          </TabsTrigger>
        </TabsList>
        <TabsContent value="web">
          <Card>
            <CardContent className="mt-0 text-sm text-muted-foreground">
              Web share tasks (X, Reddit, …).
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mobile">
          <Card>
            <CardContent className="mt-0 text-sm text-muted-foreground">
              Mobile share tasks (image cards for WeChat, Feishu, …).
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  ),
};
