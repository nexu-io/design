import {
  Badge,
  Button,
  DataTable,
  DataTableDescription,
  DataTableFooter,
  DataTableHeader,
  DataTableTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nexu-design/ui-web";

export function DataTableBasicExample() {
  return (
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
            <TableCell className="text-right text-xs text-text-muted">2 min ago</TableCell>
          </TableRow>
          <TableRow selected>
            <TableCell>Revenue agent</TableCell>
            <TableCell>Update invoice follow-up</TableCell>
            <TableCell>
              <Badge variant="success">Ready</Badge>
            </TableCell>
            <TableCell className="text-right text-xs text-text-muted">12 min ago</TableCell>
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
  );
}
