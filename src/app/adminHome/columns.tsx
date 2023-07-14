"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
import Link from "next/link";
import { redirect } from "next/navigation";

import { validatedAction } from "./action";
import { useZact } from "zact/client";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { members, transactions } from "@/db/schema/members";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { InputForm } from "./inputForm";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: number;
  realScanId: string;
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
  // {
  //   invoice: "INV005",
  //   paymentStatus: "Paid",
  //   totalAmount: "$550.00",
  //   category: "Contract",
  //   paymentMethod: "PayPal",
  // },
  // {
  //   invoice: "INV006",
  //   paymentStatus: "Pending",
  //   totalAmount: "$200.00",
  //   category: "Merchandise",
  //   paymentMethod: "Bank Transfer",
  // },
  // {
  //   invoice: "INV007",
  //   paymentStatus: "Paid",
  //   totalAmount: "$1.00",
  //   category: "Food",
  //   paymentMethod: "Cash",
  // },
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
          className="text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contract Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    // cell: ({ row }) => {
    //   return (
    //     <div className="text-center font-medium">
    //       {row.getValue("contractStatus")}
    //     </div>
    //   );
    // },
  },
  {
    accessorKey: "emailAddress",
    header: "Email",
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      // const user = row.original.id;
      // return (
      //   <>
      //     <Button variant="ghost" className="h-8 w-8 p-0" asChild>
      //       <a href={`/${row.original.id}`}>
      //         <MoreHorizontal className="h-4 w-4" />
      //       </a>
      //     </Button>
      //   </>
      // );
      const handleCheckout = async (data: string) => {
        if (cash) {
          console.log(data);

          const now = new Date();
          if (data == "daypass") {
            console.log("made it");
            await db
              .insert(transactions)
              .values({
                ownerId: row.original.emailAddress!,
                amount: 15,
                date: now.toLocaleString(),
                paymentMethod: "cash",
                type: "day pass",
                createdAt: new Date(),
              })
              .then((res) => {
                console.log(res);
                return;
              });
          }
          return;
        }
        try {
          // console.log(row.original.id);
          const { sessionId } = await postData({
            url: "/api/create-checkout-session",
            data: { data: data, id: row.original.id },
          });
          const stripe = await getStripe();
          stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
          return alert((error as Error)?.message);
        }
      };
      const rowId = row.original.id;
      const [tagId, setTagId] = useState("");
      const [cash, setCash] = useState(false);

      return (
        <Dialog>
          <DialogTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="DialogOverlay sm:max-w-[425px] mx-auto">
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
            <div className="items-top flex space-x-2">
              <Checkbox
                id="terms1"
                checked={cash}
                onCheckedChange={(e) => {
                  e.valueOf() ? setCash(true) : setCash(false);
                }}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Pay with cash {cash ? "✅" : "❌"}
                </label>
              </div>
              {/* <label>
                <input
                  type="checkbox"
                  checked={cash}
                  onChange={(e) => {
                    setCash(e.target.checked);
                  }}
                />
                Pay with Cash
              </label> */}
            </div>
            <div className="flex flex-col gap-4 py-4">
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tag" className="text-right">
                  Update Tag
                </Label>
                <Input
                  id="tag"
                  value="Click here then scan tag"
                  className="col-span-3"
                />
              </div> */}
              <div className="flex w-full max-w-sm items-center space-x-2">
                <form
                  // onSubmit={async (event) => {
                  //   event.preventDefault();
                  //   const form = event.target as HTMLFormElement;
                  //   const formData = new FormData(form);
                  //   await db
                  //     .execute(
                  //       sql`UPDATE ${members} SET ${
                  //         members.realScanId
                  //       } = CONCAT(${members.realScanId}, ${formData.get(
                  //         "newTag"
                  //       )}) WHERE ${members.userId} = ${String(rowId)};`
                  //     )
                  //     .then(() => {
                  //       console.log("updated");
                  //     });
                  //   console.log("submitting");
                  // }}
                  action={validatedAction}
                >
                  <Input
                    type="text"
                    placeholder="Click here and scan tag"
                    name="newTagCode"
                    value={tagId}
                    onChange={(e) => setTagId(e.target.value)}
                  />
                  <Input type="hidden" name="userId" value={String(rowId)} />
                  <Button
                    type="submit"
                    onSubmit={() => {
                      setTagId("");
                    }}
                  >
                    Update Tag
                  </Button>
                </form>
              </div>
              {/* <InputForm userId={String(rowId)} /> */}
              {/* <div className="flex flex-col items-center gap-4">
                <Label htmlFor="Transaction History" className="text-right">
                  Transaction History
                </Label>
              </div> */}
            </div>
            {/* <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter> */}
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "realScanId",
  },
];
