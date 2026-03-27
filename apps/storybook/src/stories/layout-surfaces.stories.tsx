import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown, ChevronsUpDown, Circle, MoreHorizontal, Sparkles } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DataTable,
  DataTableDescription,
  DataTableFooter,
  DataTableHeader,
  DataTableTitle,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  PanelFooter,
  PanelFooterActions,
  PanelFooterMeta,
  ScrollArea,
  ScrollBar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nexu/ui-web";

const meta = {
  title: "Primitives/LayoutSurfaces",
  component: ScrollArea,
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ScrollAreaExample: Story = {
  render: () => (
    <div className="w-[420px] rounded-xl border border-border bg-surface-1">
      <ScrollArea className="h-56">
        <div className="space-y-3 p-4">
          {Array.from({ length: 12 }, (_, index) => {
            const label = `Audit log entry #${index + 1}`;

            return (
              <div
                key={label}
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-secondary"
              >
                {label}
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  ),
};

export const AccordionExample: Story = {
  render: () => (
    <div className="w-[560px] rounded-xl border border-border bg-surface-1 p-2">
      <Accordion type="single" collapsible defaultValue="sources">
        <AccordionItem value="sources">
          <AccordionTrigger>Connected sources</AccordionTrigger>
          <AccordionContent>
            Slack, Linear, and HubSpot are synced to this workspace.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="automations">
          <AccordionTrigger>Running automations</AccordionTrigger>
          <AccordionContent>
            Eight automations are active with a 96% success rate this week.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const CollapsibleExample: Story = {
  render: () => (
    <div className="w-[560px] rounded-xl border border-border bg-surface-1 p-4">
      <Collapsible defaultOpen>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-text-primary">Escalation policy</div>
            <div className="text-xs text-text-muted">
              Expand to review the configured fallback path.
            </div>
          </div>
          <CollapsibleTrigger className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary">
            Details
            <ChevronDown className="size-4" />
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-4 rounded-lg border border-border bg-surface-2 p-3 text-sm text-text-secondary">
          If the owner does not respond within 15 minutes, the issue escalates to the on-call lead.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

export const PanelFooterExample: Story = {
  render: () => (
    <div className="w-[560px] overflow-hidden rounded-xl border border-border bg-surface-1">
      <div className="px-4 py-6 text-sm text-text-secondary">
        Review the changes before publishing.
      </div>
      <PanelFooter>
        <PanelFooterMeta>Last saved 2 minutes ago</PanelFooterMeta>
        <PanelFooterActions>
          <Button variant="ghost">Cancel</Button>
          <Button>Publish</Button>
        </PanelFooterActions>
      </PanelFooter>
    </div>
  ),
};

export const InteractiveRowExample: Story = {
  render: () => (
    <div className="grid w-[640px] gap-3">
      <InteractiveRow className="p-4">
        <InteractiveRowLeading>
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Sparkles className="size-4" />
          </div>
        </InteractiveRowLeading>
        <InteractiveRowContent>
          <div className="text-sm font-medium text-text-primary">Summarize customer interviews</div>
          <div className="text-xs text-text-muted">Content ops • Updated 6 minutes ago</div>
        </InteractiveRowContent>
        <InteractiveRowTrailing>
          <Badge variant="accent">Ready</Badge>
        </InteractiveRowTrailing>
      </InteractiveRow>
      <InteractiveRow selected tone="subtle" className="p-4">
        <InteractiveRowLeading>
          <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
            <Circle className="size-4 fill-current" />
          </div>
        </InteractiveRowLeading>
        <InteractiveRowContent>
          <div className="text-sm font-medium text-text-primary">
            Publish weekly automation recap
          </div>
          <div className="text-xs text-text-muted">Marketing • Due in 30 minutes</div>
        </InteractiveRowContent>
        <InteractiveRowTrailing>
          <MoreHorizontal className="size-4 text-text-muted" />
        </InteractiveRowTrailing>
      </InteractiveRow>
    </div>
  ),
};

export const DataTableExample: Story = {
  render: () => (
    <DataTable className="w-[760px]">
      <DataTableHeader>
        <div>
          <DataTableTitle>Approval queue</DataTableTitle>
          <DataTableDescription>
            Representative dense table view for operator workflows.
          </DataTableDescription>
        </div>
        <Button variant="outline" size="sm">
          Export
        </Button>
      </DataTableHeader>
      <Table density="compact">
        <TableHeader>
          <TableRow>
            <TableHead>Owner</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ops copilot</TableCell>
            <TableCell>Review refund exception</TableCell>
            <TableCell>
              <Badge variant="warning">Needs review</Badge>
            </TableCell>
            <TableCell className="text-right text-text-muted">2 min ago</TableCell>
          </TableRow>
          <TableRow selected>
            <TableCell>Revenue agent</TableCell>
            <TableCell>Update invoice follow-up</TableCell>
            <TableCell>
              <Badge variant="success">Ready</Badge>
            </TableCell>
            <TableCell className="text-right text-text-muted">12 min ago</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <DataTableFooter>
        <span>Showing 2 of 18 approvals</span>
        <Button variant="ghost" size="sm">
          View all
        </Button>
      </DataTableFooter>
    </DataTable>
  ),
};
