import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/card"),
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Slack</CardTitle>
        <CardDescription>Connect your workspace and start routing messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Uses semantic tokens and stays Tailwind-friendly.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Connect</Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Hover to see lift effect.</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="interactive">
        <CardHeader>
          <CardTitle>Interactive</CardTitle>
          <CardDescription>Clickable card with bg + lift hover.</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="static">
        <CardHeader>
          <CardTitle>Static</CardTitle>
          <CardDescription>No hover effect — for panels and feeds.</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="muted">
        <CardHeader>
          <CardTitle>Muted</CardTitle>
          <CardDescription>Subtle background with lift hover.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
};
