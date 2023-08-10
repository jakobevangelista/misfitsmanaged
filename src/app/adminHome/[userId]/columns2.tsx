"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useTransition } from "react";
import { decrementLimitedContractDay } from "./decrementLimitedContract";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
      const localDate = new Date(row.original.endDate);
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
    header: "Remaining Days (For Limited Contracts)",
    cell: function Cell({ row }) {
      const [isPending, startTransition] = useTransition();

      if (row.original.remainingDays === null) return <></>;

      return (
        <>
          {row.original.remainingDays > 0 ? (
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
          )}
        </>
      );
    },
  },
];
