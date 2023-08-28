"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useTransition } from "react";
import { decrementLimitedContractDay } from "./decrementLimitedContract";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { cancelActiveSubscription } from "./cancelActiveSubscription";

export type Contract = {
  stripeId: string;
  ownerId: string;
  status: string;
  type: string;
  startDate: Date;
  endDate: Date;
  remainingDays: number | null;
};

export const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: "stripeId",
    header: "ID",
  },
  {
    accessorKey: "ownerId",
    header: "Owner ID",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      function renderStatus(contractStatus: string) {
        switch (contractStatus) {
          case "active":
            return <Badge variant="active">Active</Badge>;
          case "inactive":
          case "Inactive":
            return <Badge variant="inactive">Inactive</Badge>;
          case "Limited":
            return <Badge variant="limited">Limited</Badge>;
          case "canceled":
            return <Badge variant="canceled">Canceled</Badge>;
          default:
            return <Badge>None</Badge>;
        }
      }
      return <>{renderStatus(row.getValue("status"))}</>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const localDate = new Date(row.original.startDate);
      //   localDate.setHours(localDate.getHours() + 7);
      return localDate.toLocaleString();
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const localDate = new Date(row.original.endDate);
      //   localDate.setHours(localDate.getHours() + 7);
      return localDate.toLocaleString();
    },
  },
  {
    accessorKey: "remainingDays",
    header: "Actions",
    cell: function Cell({ row }) {
      const [isPending, startTransition] = useTransition();
      let isDaysLeft = true;

      if (
        row.original.remainingDays === null ||
        row.original.remainingDays === 0
      )
        isDaysLeft = false;

      return (
        <>
          {/* {row.original.remainingDays > 0 ? (
            <Button
              onClick={() =>
                startTransition(() =>
                  decrementLimitedContractDay(
                    row.original.stripeId,
                    row.original.remainingDays!
                  )
                )
              }
            >
              Click to Decrement: {row.original.remainingDays}
            </Button>
          ) : (
            <Label>Expired</Label>
          )} */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {row.original.status === "active" ? (
                <DropdownMenuItem
                  onClick={() =>
                    startTransition(() =>
                      cancelActiveSubscription(
                        row.original.stripeId,
                        row.original.ownerId
                      )
                    )
                  }
                >
                  Cancel Membership
                </DropdownMenuItem>
              ) : null}

              {isDaysLeft ? (
                <DropdownMenuItem
                  onClick={() =>
                    startTransition(() =>
                      decrementLimitedContractDay(
                        row.original.stripeId,
                        row.original.remainingDays!
                      )
                    )
                  }
                >
                  Click to Decrement: {row.original.remainingDays}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>Expired</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
