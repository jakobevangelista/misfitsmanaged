"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { postData } from "../../../utils/helpers";
import { getStripe } from "../../../utils/stripe-client";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: number;
  userId: string;
  name: string;
  contractStatus: "active" | "expired" | "none";
  emailAddress: string | null;
};

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    category: "Contract",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    category: "Merchandise",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    category: "Food",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    category: "Contract",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    category: "Contract",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    category: "Merchandise",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Paid",
    totalAmount: "$1.00",
    category: "Food",
    paymentMethod: "Cash",
  },
];

const contracts = [
  {
    type: "Month to Month",
    contractStatus: "Active",
    endDate: "December 31, 2023",
  },
  {
    type: "Day Pass",
    contractStatus: "Expired",
    endDate: "May 31, 2023 3:23pm",
  },
];

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "contractStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contract Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "emailAddress",
    header: "Email",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const handleCheckout = async (data: string) => {
        try {
          const { sessionId } = await postData({
            url: "/api/create-checkout-session",
            data: { data },
          });

          const stripe = await getStripe();
          stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
          return alert((error as Error)?.message);
        }
      };
      return (
        <Dialog>
          <DialogTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Member profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-row">
              <Button
                variant="outline"
                onClick={() => handleCheckout("daypass")}
                className="flex-grow"
              >
                Charge Day Pass
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleCheckout("month")}
                className="flex-grow"
              >
                Charge Month to Month
              </Button>
              <Button
                variant="outline"
                onClick={() => handleCheckout("water")}
                className="flex-grow"
              >
                Charge Water
              </Button>
            </div>
            <div className="flex flex-col gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Update name" className="col-span-3" />
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="w-full">
                  <Label htmlFor="Transaction History" className="text-right">
                    Contract History
                  </Label>
                  <Table>
                    <TableCaption>
                      A list of this member&apos;s recent contracts.
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          Contract Type
                        </TableHead>
                        <TableHead>Contract Status</TableHead>
                        <TableHead>Contract End Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contracts.map((contract) => (
                        <TableRow key={contract.type}>
                          <TableCell className="font-medium">
                            {contract.type}
                          </TableCell>
                          <TableCell>{contract.contractStatus}</TableCell>
                          <TableCell>{contract.endDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <Label htmlFor="Transaction History" className="text-right">
                  Transaction History
                </Label>
                <Table>
                  <TableCaption>
                    A list of this member&apos;s invoices.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      {/* <TableHead className="w-[100px]">Invoice</TableHead> */}
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.invoice}>
                        {/* <TableCell className="font-medium">
                          {invoice.invoice}
                        </TableCell> */}
                        <TableCell>{invoice.paymentStatus}</TableCell>
                        <TableCell>{invoice.paymentMethod}</TableCell>
                        <TableCell>{invoice.category}</TableCell>
                        <TableCell className="text-right">
                          {invoice.totalAmount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "userId",
  },
];

// export const columns: ColumnDef<Payment>[] = [

// ];
