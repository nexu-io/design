import * as React from "react";

import { cn } from "../lib/cn";

type TableDensity = "default" | "compact";

const TableContext = React.createContext<{ density: TableDensity; hoverable: boolean }>({
  density: "default",
  hoverable: true,
});

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  density?: TableDensity;
  hoverable?: boolean;
}

function useTableContext() {
  return React.useContext(TableContext);
}

export function Table({ className, density = "default", hoverable = true, ...props }: TableProps) {
  return (
    <TableContext.Provider value={{ density, hoverable }}>
      <div data-slot="table-container" className="relative w-full overflow-x-auto">
        <table
          data-slot="table"
          className={cn("w-full caption-bottom text-sm", className)}
          {...props}
        />
      </div>
    </TableContext.Provider>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

export function TableRow({
  className,
  selected,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }) {
  const { hoverable } = useTableContext();

  return (
    <tr
      data-slot="table-row"
      data-state={selected ? "selected" : undefined}
      className={cn(
        "border-b border-border transition-colors data-[state=selected]:bg-accent/5",
        hoverable && "hover:bg-surface-2/60",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  const { density } = useTableContext();

  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-left align-middle font-medium text-text-muted",
        density === "compact" ? "h-9 px-3 text-[11px]" : "h-11 px-4 text-xs",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  const { density } = useTableContext();

  return (
    <td
      data-slot="table-cell"
      className={cn(
        "align-middle text-text-primary",
        density === "compact" ? "px-3 py-2 text-[12px]" : "px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-3 text-sm text-text-muted", className)}
      {...props}
    />
  );
}
