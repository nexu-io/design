import type { Meta, StoryObj } from '@storybook/react'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@nexu/ui-web'

const meta = {
  title: 'Primitives/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

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
}
