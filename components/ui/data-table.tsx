import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";

interface DataTableProps<TData> {
  columns: {
    header: string;
    accessorKey: keyof TData | string;
    cell?: (item: TData) => ReactNode;
  }[];
  data: TData[];
  emptyMessage?: string;
}

export function DataTable<TData>({ columns, data, emptyMessage = "No results found." }: DataTableProps<TData>) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className="font-semibold">{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {column.cell
                      ? column.cell(row)
                      : (row as any)[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
