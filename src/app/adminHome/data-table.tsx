"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoveDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BarcodeReader from "react-barcode-reader";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [sortType, setSortType] = React.useState<String>("userId");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
  });

  function sortByFilters(type: String) {
    switch (type) {
      case "email":
        return (
          <Input
            autoFocus
            placeholder="Filter emails..."
            value={
              (table.getColumn("emailAddress")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) => {
              table.getColumn("name")?.setFilterValue("");
              table.getColumn("userId")?.setFilterValue("");
              table
                .getColumn("emailAddress")
                ?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />
        );
      case "name":
        return (
          <Input
            autoFocus
            placeholder="Filter names..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("emailAddress")?.setFilterValue("");
              table.getColumn("userId")?.setFilterValue("");
              table.getColumn("name")?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />
        );
      case "userId":
        return (
          <Input
            autoFocus
            placeholder="Filter ID's..."
            value={
              (table.getColumn("userId")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              table.getColumn("emailAddress")?.setFilterValue("");
              table.getColumn("name")?.setFilterValue("");
              table.getColumn("userId")?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />
        );
      // default:
      //   return (
      //     <Input
      //       autoFocus
      //       placeholder="Filter emails..."
      //       value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
      //       onChange={(event) => {
      //         table.getColumn("userId")?.setFilterValue("");
      //         table.getColumn("name")?.setFilterValue("");
      //         table.getColumn("email")?.setFilterValue(event.target.value);
      //       }}
      //       className="max-w-sm"
      //     />
      //   );
    }
  }

  function filterBadge(type: String) {
    switch (sortType) {
      case "email":
        return <Badge className="ml-2">Email</Badge>;
      case "name":
        return <Badge className="ml-2">Name</Badge>;
      case "id":
        return <Badge className="ml-2">ID</Badge>;
      default:
        return <Badge className="ml-2">ID</Badge>;
    }
  }
  function handleScan(data: string) {
    if (data) {
      table.getColumn("emailAddress")?.setFilterValue("");
      table.getColumn("name")?.setFilterValue("");
      setSortType("userId");
      table.getColumn("userId")?.setFilterValue(data);
      table.getColumn("userId")?.getFilterValue() as string;
    }
  }

  return (
    <div className="rounded-md border">
      <BarcodeReader onScan={handleScan} />

      <div className="flex items-center py-4">
        {sortByFilters(sortType)}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">
              Sort By:
              {filterBadge(sortType)}
              <MoveDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortType("userId")}>
              ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortType("name")}>
              Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortType("email")}>
              Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
