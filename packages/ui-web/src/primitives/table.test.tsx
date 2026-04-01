import { render, screen } from "@testing-library/react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

describe("Table", () => {
  it("renders caption and semantic cells", () => {
    render(
      <Table>
        <TableCaption>Recent approvals</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ops assistant</TableCell>
            <TableCell>Send weekly report</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Recent approvals")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Agent" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Ops assistant" })).toBeInTheDocument();
  });

  it("applies compact density and selected row state", () => {
    render(
      <Table density="compact">
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow selected>
            <TableCell>Gateway refactor</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("columnheader", { name: "Task" })).toHaveClass("h-8", "px-4");
    expect(screen.getByRole("cell", { name: "Gateway refactor" })).toHaveClass("py-2");
    expect(screen.getByText("Gateway refactor").closest("tr")).toHaveAttribute(
      "data-state",
      "selected",
    );
  });
});
