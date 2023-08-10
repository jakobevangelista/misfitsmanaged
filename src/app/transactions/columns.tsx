"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Router } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteTransaction } from "./deleteTransaction";

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
  {
    id: "action",
    header: "Actions",
    cell: function Cell({ row }) {
      const router = useRouter();
      const [open, setOpen] = useState(false);
      return (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">DELETE</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Are you sure you want to
                  permanently delete this transaction?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => {
                    deleteTransaction(row.original.id);
                    router.refresh();
                    setOpen(false);
                  }}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
