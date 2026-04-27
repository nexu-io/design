import type { Meta, StoryObj } from "@storybook/react-vite";

import { getDocsUrl } from "../storybook/docs-links";

const docsHomeUrl = getDocsUrl("/");

const meta = {
  title: "Introduction/Docs Site",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Nexu Design docs are the consumer-facing source for installation, tokens, component usage, accessibility notes, and release guidance.

Full documentation: [${docsHomeUrl}](${docsHomeUrl})`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenDocsSite: Story = {
  render: () => (
    <div className="max-w-xl rounded-2xl border border-border-subtle bg-card p-6 text-text-primary shadow-rest">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
        Documentation portal
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-text-heading">Open the docs site</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Use Storybook for component state matrices and QA. Use the docs site for consumer-facing
        setup guides, component APIs, examples, and foundations.
      </p>
      <a
        href={docsHomeUrl}
        className="mt-5 inline-flex h-10 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
      >
        Open Nexu Design docs
      </a>
    </div>
  ),
};
