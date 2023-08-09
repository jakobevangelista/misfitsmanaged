"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type Contract = {
  stripeId: string;
  ownerId: string;
  status: string;
  type: string;
  startDate: Date;
  endDate: Date;
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
];
