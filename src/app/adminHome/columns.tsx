"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ArrowUpDown,
  CheckIcon,
  ChevronsUpDown,
  MoreHorizontal,
} from "lucide-react";
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
import { postData, customCheckoutPost } from "../../../utils/helpers";
import { getStripe } from "../../../utils/stripe-client";
import Link from "next/link";
import { redirect } from "next/navigation";

import { validatedAction } from "./action";
import { useZact } from "zact/client";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useFieldArray, useForm } from "react-hook-form";
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
import { stripe } from "../../../utils/stripe";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const items = [
  { label: "Day Pass", value: "price_1NYRbKD5u1cDehOfapzIEhrJ" },
  { label: "Small Water Bottle", value: "price_1NYRaXD5u1cDehOfi3XqF0jV" },
  { label: "Large Water Bottle", value: "price_1NYReSD5u1cDehOfo1oxyhvs" },
  { label: "Monthly Membership", value: "price_1NYRcWD5u1cDehOfiPRDAB3v" },
  { label: "Monthly Membership Initiation Fee", value: "price_1NYU4xD5u1cDehOfzRdl9hRN" },
  { label: "Month-to-Month Membership", value: "price_1NYRbrD5u1cDehOfLWSsrUWc" },
] as const;

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: number;
  realScanId: string;
  name: string;
  contractStatus:
  | "active"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "none";
  emailAddress: string;
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
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("contractStatus") === "active" ? (
            <div className="text-emerald-400">
              {row.getValue("contractStatus")}
            </div>
          ) : (
            <div className="text-red-600">{row.getValue("contractStatus")}</div>
          )}
        </>
      );
    },
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
      const { toast } = useToast();
      const [isPending, startTransition] = useTransition();
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
      const [realTagId, setRealTagId] = useState("");

      const checkoutCartFormSchema = z.object({
        cartItems: z
          .array(
            z.object({
              price: z.string().min(1, {
                message: "Please select a product",
              }),
              quantity: z.literal(1),
            })
          )
          .nonempty(),
      });
      const form = useForm<z.infer<typeof checkoutCartFormSchema>>({
        resolver: zodResolver(checkoutCartFormSchema),
        defaultValues: {
          cartItems: [{ price: "", quantity: 1 }],
        },
      });
      const { fields, append, remove } = useFieldArray({
        name: "cartItems",
        control: form.control,
      });

      const checkoutSubmit = async (
        values: z.infer<typeof checkoutCartFormSchema>
      ) => {
        try {
          const { sessionId } = await customCheckoutPost(
            values,
            row.original.emailAddress,
            "/api/customCheckoutSession"
          );
          console.log(sessionId);
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
          <DialogContent className="w-full mx-auto">
            <div className="flex flex-row space-x-4 mx-auto">
              <div className="flex flex-col space-y-4 mx-auto">
                <DialogHeader className="mx-auto">
                  <DialogTitle>Member quick actions</DialogTitle>
                  <DialogDescription>
                    Use these for quick checkouts.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    onClick={() => handleCheckout("Day Pass")}
                    className="flex"
                  >
                    Charge Day Pass
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCheckout("Water")}
                    className="flex"
                  >
                    Charge Small Water Bottle
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCheckout("month")}
                    className="flex"
                  >
                    Charge Month
                  </Button>
                </div>
                <Label>Cash Transactions:</Label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <form action={cashTransactionWater}>
                    <Button
                      variant="secondary"
                      className="flex flex-grow"
                      type="submit"
                      onClick={() => {
                        toast({
                          title: "Water Cash Transaction Recorded",
                        });
                      }}
                    >
                      Small Water Bottle: $1
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
                      onClick={() => {
                        toast({
                          title: "Day Pass Cash Transaction Recorded",
                        });
                      }}
                    >
                      Day Pass: $15
                    </Button>
                    <Input
                      type="hidden"
                      name="email"
                      value={String(row.original.emailAddress!)}
                    />
                  </form>
                </div>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <form action={validatedAction}>
                      <Input
                        type="text"
                        placeholder="Click here and scan tag"
                        name="newTagCode"
                        value={tagId}
                        onChange={(e) => {
                          setTagId(e.target.value);
                        }}
                      />

                      <Input
                        type="hidden"
                        name="userId"
                        value={String(rowId)}
                      />
                      <Button
                        type="submit"
                        onSubmit={() => { }}
                        onClick={() => {
                          // setTagId("");
                          setTimeout(() => {
                            setTagId("");
                          }, 10);
                          toast({
                            title: "✅ Tag Updated",
                          });
                        }}
                      >
                        Update Tag
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(checkoutSubmit)}
                  className="space-y-8"
                >
                  <DialogHeader className="mx-auto">
                    <DialogTitle>Multi-item Checkout</DialogTitle>
                    <DialogDescription>
                      Add the multiple items to the cart then press the checkout button.
                    </DialogDescription>
                  </DialogHeader>
                  {fields.map((field, index) => {
                    return (
                      <FormField
                        control={form.control}
                        key={field.id}
                        name={`cartItems.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-[200px] justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? items.find(
                                        (item) =>
                                          item.value === field.value
                                      )?.label
                                      : "Select item"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0">
                                <Command>
                                  <CommandInput placeholder="Search item..." />
                                  <CommandEmpty>
                                    No item found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {items.map((item) => (
                                      <CommandItem // need to close on select ---------------------------------------------------------------
                                        value={item.value}
                                        key={item.value}
                                        onSelect={() => {
                                          form.setValue(
                                            `cartItems.${index}.price`,
                                            item.value
                                          );
                                        }}
                                      >
                                        <CheckIcon
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            item.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {item.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => remove(index)}
                            >
                              DELETE ITEM
                            </Button>
                          </FormItem>
                        )}
                      />
                    );
                  })}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ price: "", quantity: 1 })}
                  >
                    Add Item
                  </Button>
                  <div>
                    <Button type="submit" variant="green">Checkout</Button>
                  </div>
                </form>
              </Form>
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
