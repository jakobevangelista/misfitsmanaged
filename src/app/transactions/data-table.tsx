"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoveDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
export const revalidate = 15; // revalidate this page every 15 seconds

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sortType, setSortType] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [dateOpen, setDateOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      //   columnVisibility: { realScanId: false, actions: true },
      pagination: { pageSize: 10 }, // total sorts by total filtered
    },
  });

  function sortByFilters(type: string) {
    switch (type) {
      case "cash":
        table.getColumn("paymentMethod")?.setFilterValue("cash");
      case "card":
        table.getColumn("paymentMethod")?.setFilterValue("cash");
      default:
        table.getColumn("paymentMethod")?.setFilterValue("");
    }
  }

  function filterBadge() {
    switch (sortType) {
      case "cash":
        return <Badge className="ml-2">Cash</Badge>;
      case "card":
        return <Badge className="ml-2">Card</Badge>;
      case "":
        return <Badge className="ml-2">All</Badge>;
    }
  }

  return (
    <>
      <div className="w-full">
        <div className="flex flex-row py-4">
          {/* <Input
            placeholder="Filter dates..."
            value={(table.getColumn("date")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("date")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          /> */}
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "PPP")
                ) : (
                  <span>Pick a date to filter transactions</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                onDayClick={(event) => {
                  setDateOpen(false);
                  // console.log(`${date?.getMonth()} / ${date?.getDate()}`);
                  console.log(
                    `${
                      event.getMonth() + 1
                    }/${event.getDate()}/${event.getFullYear()}`
                  );
                  table
                    .getColumn("date")
                    ?.setFilterValue(
                      `${
                        event.getMonth() + 1
                      }/${event.getDate()}/${event.getFullYear()}`
                    );
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            className="px-1"
            onClick={() => {
              table.getColumn("date")?.setFilterValue("");
              setDate(undefined);
            }}
          >
            <Label>Clear Date</Label>
          </Button>
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline">
                  Filter Transactions By:
                  {filterBadge()}
                  <MoveDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSortType("");
                    table.getColumn("paymentMethod")?.setFilterValue("");
                  }}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortType("cash");
                    table.getColumn("paymentMethod")?.setFilterValue("cash");
                  }}
                >
                  Cash
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortType("card");
                    table.getColumn("paymentMethod")?.setFilterValue("card");
                  }}
                >
                  Card
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          </Table>

          <div className="flex items-center justify-end space-x-2 py-4">
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
