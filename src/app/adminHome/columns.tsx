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
import {
  cashTransactionWater,
  cashTransactionDayPass,
} from "./cashTransaction";
import { useTransition } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: number;
  realScanId: string;
  name: string;
  contractStatus: "active" | "expired" | "none";
  emailAddress: string | null;
};

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
      let [isPending, startTransition] = useTransition();
      const handleCheckout = async (data: string) => {
        try {
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

      return (
        <Dialog>
          <DialogTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full mx-auto">
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
                variant="outline"
                onClick={() => handleCheckout("water")}
                className="flex-grow"
              >
                Charge Water
              </Button>
            </div>
            <Label>Cash Transactions:</Label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <form action={cashTransactionWater}>
                <Button
                  variant="secondary"
                  className="flex flex-grow"
                  type="submit"
                >
                  Cash Water
                </Button>
                <Input
                  type="hidden"
                  name="email"
                  value={String(row.original.emailAddress!)}
                />
              </form>
              <form action={cashTransactionDayPass}>
                <Button
                  variant="secondary"
                  className="flex flex-grow"
                  type="submit"
                >
                  Cash Day Pass
                </Button>
                <Input
                  type="hidden"
                  name="email"
                  value={String(row.original.emailAddress!)}
                />
              </form>
            </div>
            {/* <div className="items-top flex space-x-2">
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
            </div> */}
            <div className="flex flex-col gap-4 py-4">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <form action={validatedAction}>
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
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "realScanId",
  },
];
