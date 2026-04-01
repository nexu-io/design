import type { Meta, StoryObj } from "@storybook/react-vite";

import { ArrowUpRight } from "lucide-react";

import { Button, PageHeader, PageShell, SectionHeader } from "@nexu-design/ui-web";

const meta = {
  title: "Patterns/PageShell",
  component: PageShell,
  tags: ["autodocs"],
} satisfies Meta<typeof PageShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <PageShell>
      <PageHeader
        title="Design system"
        description="Browse the shared primitives, patterns, and documentation shells."
        actions={
          <Button>
            Open tokens <ArrowUpRight className="size-3" />
          </Button>
        }
      />

      <section className="mb-12">
        <SectionHeader
          title="Typography"
          description="Reference scales for headings, body copy, and captions."
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="rounded-lg border border-border bg-surface-2 p-4 text-sm text-text-secondary">
          Use this shell to compose page-level docs and design system overview screens.
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Color"
          action={
            <Button variant="outline" size="sm">
              View tokens <ArrowUpRight className="size-3" />
            </Button>
          }
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-surface-2 p-4">Surface</div>
          <div className="rounded-lg border border-border bg-surface-2 p-4">Text</div>
          <div className="rounded-lg border border-border bg-surface-2 p-4">Accent</div>
        </div>
      </section>
    </PageShell>
  ),
};
