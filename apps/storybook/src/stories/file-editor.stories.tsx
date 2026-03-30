import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileEditor } from "@nexu-design/ui-web";

const markdown = `# Universal agent v3

- filesystem-first memory
- skill-native execution
- proactive workflows`;

const meta = {
  title: "Patterns/FileEditor",
  component: FileEditor,
  tags: ["autodocs"],
  args: {
    filePath: "artifacts/prds/universal-agent-v3.md",
    initialContent: markdown,
    fileType: "markdown",
  },
} satisfies Meta<typeof FileEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MarkdownPreview: Story = {
  render: () => (
    <div className="h-[420px] w-[420px] overflow-hidden rounded-xl border border-border bg-surface-0">
      <FileEditor
        filePath="artifacts/prds/universal-agent-v3.md"
        initialContent={markdown}
        fileType="markdown"
        lastEditedBy="agent"
        lastEditedAt="09:42"
      />
    </div>
  ),
};

export const BinaryPlaceholder: Story = {
  render: () => (
    <div className="h-[420px] w-[420px] overflow-hidden rounded-xl border border-border bg-surface-0">
      <FileEditor
        filePath="artifacts/mockups/product-workspace.pdf"
        initialContent=""
        fileType="pdf"
        lastEditedBy="human"
        lastEditedAt="11:08"
      />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="h-[280px] w-[420px] overflow-hidden rounded-xl border border-border bg-surface-0">
      <FileEditor
        compact
        filePath="sessions/2026-02-22/thread.jsonl"
        initialContent={'{"role":"assistant","content":"Draft saved."}'}
        fileType="jsonl"
        lastEditedBy="agent"
        lastEditedAt="13:20"
      />
    </div>
  ),
};
