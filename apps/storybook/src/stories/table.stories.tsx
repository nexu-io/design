import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Table",
  component: Table,
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  {
    owner: "研发助手",
    task: "Merge PR #234",
    status: { label: "Needs review", variant: "warning" as const },
    time: "2 min ago",
  },
  {
    owner: "运营助手",
    task: "Send weekly digest",
    status: { label: "Ready", variant: "success" as const },
    time: "15 min ago",
  },
  {
    owner: "内容助手",
    task: "Publish post to X",
    status: { label: "Queued", variant: "accent" as const },
    time: "1 hour ago",
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-[760px] rounded-xl border border-border bg-surface-1 p-4">
      <Table>
        <TableCaption>Approval queue snapshot</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Owner</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.task}>
              <TableCell>{row.owner}</TableCell>
              <TableCell>{row.task}</TableCell>
              <TableCell>
                <Badge variant={row.status.variant}>{row.status.label}</Badge>
              </TableCell>
              <TableCell className="text-right text-text-muted">{row.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="w-[760px] rounded-xl border border-border bg-surface-1 p-4">
      <Table density="compact">
        <TableHeader>
          <TableRow>
            <TableHead>Scope</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-mono text-[11px] text-accent">chat:write</TableCell>
            <TableCell>Send messages</TableCell>
            <TableCell className="text-right text-success">Enabled</TableCell>
          </TableRow>
          <TableRow selected>
            <TableCell className="font-mono text-[11px] text-accent">channels:history</TableCell>
            <TableCell>Read channel messages</TableCell>
            <TableCell className="text-right text-warning">Pending</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};
