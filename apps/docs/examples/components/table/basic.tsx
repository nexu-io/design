import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nexu-design/ui-web";

export function TableBasicExample() {
  return (
    <Table className="w-[560px]">
      <TableHeader>
        <TableRow>
          <TableHead>Owner</TableHead>
          <TableHead>Task</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ops copilot</TableCell>
          <TableCell>Review refund exception</TableCell>
          <TableCell>Needs review</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Revenue agent</TableCell>
          <TableCell>Update invoice follow-up</TableCell>
          <TableCell>Ready</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
