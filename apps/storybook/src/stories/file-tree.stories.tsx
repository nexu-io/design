import type { Meta, StoryObj } from "@storybook/react-vite";
import { Brain, Clock, Database, FileText, Sparkles, Terminal, Users, Wrench } from "lucide-react";

import { FileTree } from "@nexu-design/ui-web";

const tree = [
  {
    name: ".soul",
    type: "folder" as const,
    icon: <Brain size={14} className="text-clone" />,
    children: [
      { name: "identity.md", type: "file" as const },
      { name: "persona.md", type: "file" as const },
    ],
  },
  {
    name: "contacts",
    type: "folder" as const,
    icon: <Users size={14} className="text-role-ops" />,
    children: [{ name: "founders.md", type: "file" as const, modified: true }],
  },
  {
    name: "memory",
    type: "folder" as const,
    icon: <Database size={14} className="text-info" />,
    children: [
      {
        name: "decisions",
        type: "folder" as const,
        children: [
          { name: "2026-02-22-agent-native-team.md", type: "file" as const, active: true },
        ],
      },
    ],
  },
  {
    name: "knowledge",
    type: "folder" as const,
    icon: <FileText size={14} className="text-success" />,
    children: [{ name: "architecture.md", type: "file" as const }],
  },
  {
    name: "artifacts",
    type: "folder" as const,
    icon: <Sparkles size={14} className="text-role-founder" />,
    children: [{ name: "universal-agent-v3.md", type: "file" as const, isNew: true }],
  },
  {
    name: "sessions",
    type: "folder" as const,
    icon: <Terminal size={14} className="text-role-programmer" />,
    children: [{ name: "thread.jsonl", type: "file" as const }],
  },
  {
    name: "automation",
    type: "folder" as const,
    icon: <Clock size={14} className="text-warning" />,
    children: [{ name: "morning-digest.yaml", type: "file" as const }],
  },
  {
    name: "skills",
    type: "folder" as const,
    icon: <Wrench size={14} className="text-role-designer" />,
    children: [
      {
        name: "memory-notes",
        type: "folder" as const,
        children: [{ name: "SKILL.md", type: "file" as const }],
      },
    ],
  },
];

const meta = {
  title: "Patterns/FileTree",
  component: FileTree,
  tags: ["autodocs"],
  args: {
    tree,
  },
} satisfies Meta<typeof FileTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-[420px] w-[280px] overflow-hidden rounded-xl border border-border bg-surface-1">
      <FileTree
        tree={tree}
        rootLabel="~/clone"
        defaultExpandedPaths={[".soul", "memory", "memory/decisions"]}
        defaultSelectedPath="memory/decisions/2026-02-22-agent-native-team.md"
        footer={
          <div className="flex items-center justify-between text-[10px] text-text-muted">
            <span>12 files</span>
            <span>1 modified · 1 new</span>
          </div>
        }
      />
    </div>
  ),
};
