import type { Meta, StoryObj } from '@storybook/react'

import { Button, PageHeader } from '@nexu/ui-web'

const meta = {
  title: 'Patterns/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  args: {
    title: 'Page',
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <PageHeader
      title="Integrations"
      description="Manage all external services your workspace can connect to."
      actions={
        <>
          <Button variant="outline">Docs</Button>
          <Button>Add integration</Button>
        </>
      }
    />
  ),
}
