import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileAttachment } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/FileAttachment",
  component: FileAttachment,
  tags: ["autodocs"],
  args: {
    name: "Q2-billing-review.pdf",
    meta: "2.1 MB · PDF",
  },
  parameters: {
    docs: {
      description: {
        component: `Compact attachment row for files shared inside messages or feeds. Icon tile colors track the \`kind\` prop; consumers control click (open) and can override the trailing slot.

${docsDescription("/components/file-attachment")}`,
      },
    },
  },
} satisfies Meta<typeof FileAttachment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Kinds: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <FileAttachment name="Q2-billing-review.pdf" meta="2.1 MB · PDF" kind="doc" />
      <FileAttachment name="metrics-2026-04.xlsx" meta="312 KB · spreadsheet" kind="sheet" />
      <FileAttachment name="logs.tar.gz" meta="14.3 MB · archive" kind="archive" />
      <FileAttachment name="reproduce.sh" meta="1.8 KB · shell" kind="code" />
      <FileAttachment name="hero-banner.png" meta="840 KB · image" kind="media" />
      <FileAttachment name="notes.txt" meta="2 KB · plain" kind="generic" />
    </div>
  ),
};

export const LongName: Story = {
  args: {
    name: "a-really-long-file-name-that-should-truncate-in-the-row.pdf",
    meta: "4.2 MB · PDF",
  },
};
