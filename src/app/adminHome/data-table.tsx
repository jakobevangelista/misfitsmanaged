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
  getPaginationRowModel,
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
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { db } from "@/db";
import { contracts, members } from "@/db/schema/members";
import { eq } from "drizzle-orm";
import Menu from "./menu";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  products: {
    name: string;
    priceId: string;
    price: number;
  }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  products,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [sortType, setSortType] = React.useState<String>("realScanId");
  const [specificSortType, setSpecificSortType] = React.useState<String>("");
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
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
    initialState: {
      columnVisibility: {
        realScanId: false,
        actions: true,
        id: false,
        profilePicture: false,
      },
      pagination: { pageSize: 15 },
    },
  });
  const [searchId, setSearchId] = useState("");
  function sortByFilters(type: String) {
    switch (type) {
      case "email":
        return (
          <Input
            autoFocus
            placeholder="Search emails..."
            value={
              (table.getColumn("emailAddress")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) => {
              table.getColumn("name")?.setFilterValue("");
              table.getColumn("realScanId")?.setFilterValue("");
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
            placeholder="Search names..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("emailAddress")?.setFilterValue("");
              table.getColumn("realScanId")?.setFilterValue("");
              table.getColumn("name")?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />
        );
      case "realScanId":
        console.log(table.getColumn("realScanId")?.getFilterValue() as string);
        return (
          <>
            <form
              className="hidden xl:block w-full"
              onSubmit={(e) => {
                e.preventDefault();
                setlocalId(table.getRowModel().rows[0].getValue("id"));
                setlocalEmail(
                  table.getRowModel().rows[0].getValue("emailAddress")
                );
                setlocalName(table.getRowModel().rows[0].getValue("name"));
                setlocalProfilePic(
                  table.getRowModel().rows[0].getValue("profilePicture")
                );
                setLocalContractStatus(
                  table.getRowModel().rows[0].getValue("contractStatus")
                );
                setTimeout(() => {
                  table.getColumn("realScanId")?.setFilterValue("");
                }, 500);
              }}
            >
              <Input
                autoFocus
                placeholder="Search ID's..."
                value={
                  (table.getColumn("realScanId")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) => {
                  table.getColumn("emailAddress")?.setFilterValue("");
                  table.getColumn("name")?.setFilterValue("");
                  table
                    .getColumn("realScanId")
                    ?.setFilterValue(event.target.value);
                }}
                className="w-full"
              />
            </form>
            <Input
              autoFocus
              placeholder="Search ID's..."
              value={
                (table.getColumn("realScanId")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) => {
                table.getColumn("emailAddress")?.setFilterValue("");
                table.getColumn("name")?.setFilterValue("");
                table
                  .getColumn("realScanId")
                  ?.setFilterValue(event.target.value);
              }}
              className="xl:hidden"
            />
          </>
        );
      // default:
      //   return (
      //     <Input
      //       autoFocus
      //       placeholder="Filter emails..."
      //       value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
      //       onChange={(event) => {
      //         table.getColumn("realScanId")?.setFilterValue("");
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
    // router.refresh();
    if (data) {
      table.getColumn("emailAddress")?.setFilterValue("");
      table.getColumn("name")?.setFilterValue("");
      table.getColumn("realScanId")?.setFilterValue("");
      setSortType("realScanId");
      table.getColumn("realScanId")?.setFilterValue(data);
      table.getColumn("realScanId")?.getFilterValue() as string;
      // setlocalId(table.getRowModel().rows[0].getValue("id"));
      // setlocalEmail(table.getRowModel().rows[0].getValue("emailAddress"));
      // setlocalName(table.getRowModel().rows[0].getValue("name"));
      // setlocalProfilePic(
      //   table.getRowModel().rows[0].getValue("profilePicture")
      // );
      // setTimeout(() => {
      //   table.getColumn("realScanId")?.setFilterValue("");
      // }, 5000);
    }
  }

  function specificFilterBadge() {
    switch (specificSortType) {
      case "Unpaid":
        return <Badge className="ml-2">Cash</Badge>;
      case "Active":
        return <Badge className="ml-2">Card</Badge>;
      case "":
        return <Badge className="ml-2">All</Badge>;
    }
  }

  const [localId, setlocalId] = useState("");
  const [localEmail, setlocalEmail] = useState("");
  const [localName, setlocalName] = useState("");
  const [localProfilePic, setlocalProfilePic] = useState("");
  const [localContractStatus, setLocalContractStatus] = useState("");

  return (
    <>
      <div className="flex flex-row">
        <div className="">
          <BarcodeReader onScan={handleScan} />

          <div className="flex items-center py-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="ml-1" variant="outline">
                  Search By:
                  {filterBadge(sortType)}
                  <MoveDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortType("realScanId")}>
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
            {sortByFilters(sortType)}

            <div className="ml-auto">
              {" "}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline">
                    Filter Contracts:
                    {specificFilterBadge()}
                    <MoveDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSpecificSortType("");
                      table.getColumn("contractStatus")?.setFilterValue("");
                    }}
                  >
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSpecificSortType("Unpaid");
                      table
                        .getColumn("contractStatus")
                        ?.setFilterValue("Unpaid");
                    }}
                  >
                    Unpaid
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
                      onClick={() => {
                        // console.log("for later");
                        // const date = new Date();
                        // console.log(date.toLocaleString());
                        // router.push(`/adminHome/${row.original}`);
                        // console.log(row.original.id);
                        setlocalId(row.getValue("id"));
                        setlocalEmail(row.getValue("emailAddress"));
                        setlocalName(row.getValue("name"));
                        setlocalProfilePic(row.getValue("profilePicture"));
                        setLocalContractStatus(row.getValue("contractStatus"));
                      }}
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
                {/* </tr> */}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <div className="space-x-2 pr-3">
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
        {/* <Input
          value={fakeProp}
          onChange={(e) => {
            setFakeProp(e.target.value);
          }}
        ></Input> */}
        <div className="hidden flex-none mx-auto xl:flex xl:w-fulll xl:mx-auto">
          <Menu
            id={localId}
            email={localEmail}
            name={localName}
            profilePic={localProfilePic}
            products={products}
            contractStatus={localContractStatus}
          />
        </div>
      </div>
    </>
  );
}
