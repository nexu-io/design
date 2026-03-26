import { render, screen } from "@testing-library/react";

import { DataTable, DataTableDescription, DataTableHeader, DataTableTitle } from "./data-table";
import {
  TableHeader as PrimitiveTableHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "./table";

describe("DataTable", () => {
  it("renders a composed table shell", () => {
    render(
      <DataTable>
        <DataTableHeader>
          <div>
            <DataTableTitle>Approvals</DataTableTitle>
            <DataTableDescription>Pending decisions</DataTableDescription>
          </div>
        </DataTableHeader>
        <Table>
          <PrimitiveTableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </PrimitiveTableHeader>
          <TableBody>
            <TableRow>
              <TableCell>One</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DataTable>,
    );

    expect(screen.getByText("Approvals")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("One")).toBeInTheDocument();
  });
});
