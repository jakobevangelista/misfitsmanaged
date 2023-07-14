"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transaction = {
  id: number;
  ownerId: string;
  type: string;
  amount: number;
  paymentMethod: string;
  date: string;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "ownerId",
    header: "Transaction Owner",
    footer: "Total:",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "amount",
    // header: "Amount in USD",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount in USD
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dollarAmount = parseFloat(
        (Math.round(row.original.amount) / 100).toFixed(2)
      );
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(dollarAmount);
      return formatted;
    },
    footer: ({ table }) => {
      const total = parseFloat(
        (
          Math.round(
            table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) => total + Number(row.getValue("amount")),
                0
              )
          ) / 100
        ).toFixed(2)
      );

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(total);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
  },
  {
    accessorKey: "date",
    header: "Transaction Date",
    // cell: ({ row }) => {
    //   const date = new Date(row.original.date);
    //   date.setHours(date.getHours() - 5);
    //   return <div>{date.toLocaleString()}</div>;
    // },
  },
];
