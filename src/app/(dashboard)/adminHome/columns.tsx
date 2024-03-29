"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CheckIcon,
  ChevronsUpDown,
  MoreHorizontal,
  User as UserIcon,
  UserSquare2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ScrollArea } from "@/components/ui/scroll-area";
import { customCheckoutPost, postData } from "../../../../utils/helpers";
import { getStripe } from "../../../../utils/stripe-client";

import { useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import {
  cashTransactionCorruptedSaturday,
  cashTransactionCustom,
  cashTransactionDayPass,
} from "./cashTransaction";
import { DataTable } from "./data-table";
import { api } from "@/trpc/react";

// const items = [
//   { label: "Day Pass", value: "price_1NYRbKD5u1cDehOfapzIEhrJ" },
//   { label: "Small Water Bottle", value: "price_1NYRaXD5u1cDehOfi3XqF0jV" },
//   { label: "Large Water Bottle", value: "price_1NYReSD5u1cDehOfo1oxyhvs" },
//   { label: "Monthly Membership", value: "price_1NYRcWD5u1cDehOfiPRDAB3v" },
//   {
//     label: "Monthly Membership Initiation Fee",
//     value: "price_1NYU4xD5u1cDehOfzRdl9hRN",
//   },
//   {
//     label: "Month-to-Month Membership",
//     value: "price_1NYRbrD5u1cDehOfLWSsrUWc",
//   },
// ] as const;

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: number;
  realScanId: string;
  name: string;
  contractStatus: string;
  emailAddress: string;
  profilePicture: string | null;
};

export const DataTableWithColumns = (props: {
  data: User[];
  products: {
    name: string;
    priceId: string;
    price: number;
  }[];
}) => {
  const fetchProducts = props.products;
  let items: { label: string; value: string }[];

  if (props.products[0] !== undefined) {
    items = fetchProducts.map((product) => ({
      label: product.name,
      value: product.priceId,
    }));
  }
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
    },
    {
      accessorKey: "profilePicture",
    },
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
        function renderStatus(contractStatus: string) {
          // if (contractStatus.toLowerCase() === "inactive") {
          //   return <Badge variant="inactive">{contractStatus}</Badge>;
          // }
          if (contractStatus.toLowerCase().includes("active:")) {
            return <Badge variant="active">{contractStatus}</Badge>;
          }

          switch (contractStatus) {
            case "Active":
              return <Badge variant="active">Active</Badge>;
            case "inactive":
            case "Inactive":
              return <Badge variant="inactive">Inactive</Badge>;
            case "Limited":
              return <Badge variant="limited">Limited</Badge>;
            case "Unpaid":
            case "unpaid":
              return <Badge variant="destructive">Unpaid</Badge>;
            case "incomplete":
              return <Badge variant="destructive">Incomplete</Badge>;

            default:
              return <Badge>{contractStatus}</Badge>;
          }
        }
        return <>{renderStatus(row.getValue("contractStatus"))}</>;
      },
    },
    {
      accessorKey: "emailAddress",
      header: "Email",
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        // return (
        //   <>
        //     <Button variant="ghost" className="h-8 w-8 p-0" asChild>
        //       <a href={`/${row.original.id}`}>
        //         <MoreHorizontal className="h-4 w-4" />
        //       </a>
        //     </Button>
        //   </>
        // );

        const changeTag = api.admin.updateTag.useMutation({
          onSuccess: () => {
            setTagId("");
            toast({
              title: "✅ Tag Updated",
            });
          },
        });
        const { toast } = useToast();
        const [multiCashAmount, setMultiCashAmount] = useState<number>(0);
        const handleCheckout = async (data: string) => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const { sessionId } = await postData({
              url: "/api/create-checkout-session",
              data: { data: data, id: row.original.id },
            });
            const stripe = await getStripe();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            await stripe?.redirectToCheckout({ sessionId });
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
                quantity: z.coerce.number().gt(0, {
                  message: "Please enter a quantity greater than 0",
                }),
              })
            )
            .nonempty(),
          isCash: z.boolean().default(false).optional(),
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

        const quickDayPassCashTransactionSchema = z.object({
          cashAmount: z.coerce.number().gte(15, {
            message: "Please collect more than 15 dollars for day pass",
          }),
        });
        const quickDayPassCashTransactionForm = useForm<
          z.infer<typeof quickDayPassCashTransactionSchema>
        >({
          resolver: zodResolver(quickDayPassCashTransactionSchema),
          defaultValues: {
            cashAmount: 0,
          },
        });
        const quickDayPassCashTransactionOnSubmit = async (
          values: z.infer<typeof quickDayPassCashTransactionSchema>
        ) => {
          // Do something with the form values.
          // ✅ This will be type-safe and validated.
          console.log("hwer");
          console.log(values);
          await cashTransactionDayPass(row.original.emailAddress);
        };

        const quickCsSaturdayCashTransactionSchema = z.object({
          cashAmount: z.coerce.number().gte(10, {
            message: "Please collect more than 10 dollars for day pass",
          }),
        });
        const quickCsSaturdayCashTransactionForm = useForm<
          z.infer<typeof quickCsSaturdayCashTransactionSchema>
        >({
          resolver: zodResolver(quickCsSaturdayCashTransactionSchema),
          defaultValues: {
            cashAmount: 0,
          },
        });
        const quickCsSaturdayTransactionOnSubmit = async (
          values: z.infer<typeof quickCsSaturdayCashTransactionSchema>
        ) => {
          // Do something with the form values.
          // ✅ This will be type-safe and validated.
          console.log("hwer");
          console.log(values);
          await cashTransactionCorruptedSaturday(row.original.emailAddress);
        };

        const checkoutSubmit = async (
          values: z.infer<typeof checkoutCartFormSchema>
        ) => {
          if (values.isCash) {
            // match items in cart to prices in products array and subtract from total cash amount
            // if cash amount is less than 0, return error else query transaction table and add transaction and return change
            let total = 0;
            console.log(values.cartItems);
            for (const item of values.cartItems) {
              const price = fetchProducts.find(
                (product) => product.priceId === item.price
              )?.price;
              total += price!;
            }
            if (multiCashAmount * 100 - total < 0) {
              toast({
                title: "❌ Not enough cash given",
              });
            } else {
              await cashTransactionCustom(
                Number(row.original.id),
                total,
                values.cartItems
              );
              toast({
                title: `Change: $${(multiCashAmount - total / 100.0).toFixed(
                  2
                )}`,
              });
            }
          } else {
            try {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              const { sessionId } = await customCheckoutPost(
                values,
                row.original.emailAddress,
                "/api/customCheckoutSession"
              );
              console.log(sessionId);
              const stripe = await getStripe();
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              await stripe?.redirectToCheckout({ sessionId });
            } catch (error) {
              return alert((error as Error)?.message);
            }
          }
        };

        const handleChangeTag = () => {
          // console.log("rowId: ", rowId);
          // console.log("new Tag: ", tagId);
          changeTag.mutate({
            userId: rowId,
            newTagCode: tagId,
          });
        };

        return (
          <div className="xl:hidden">
            <Dialog>
              <DialogTrigger>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="DialogOverlay w-full mx-auto">
                <div className="flex flex-col space-y-4 mx-auto">
                  <div className="mx-auto">
                    {row.original.profilePicture ? (
                      <Image
                        src={row.original.profilePicture}
                        width={250}
                        height={250}
                        alt="no profile picture"
                        className="rounded-md"
                      />
                    ) : (
                      <div className="mx-auto text-center">
                        <UserSquare2 className="mx-auto" size={48} />
                        <Label>No Profile Picture</Label>
                      </div>
                    )}
                  </div>
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
                          onClick={() => handleCheckout("cssat")}
                          className="flex"
                        >
                          Charge Corrupted Saturday Pass
                        </Button>
                      </div>
                      {/* <Label>Cash Transactions:</Label> */}
                      <div className="flex flex-row w-full max-w-sm items-center space-x-2">
                        <Form {...quickDayPassCashTransactionForm}>
                          <form
                            onSubmit={quickDayPassCashTransactionForm.handleSubmit(
                              quickDayPassCashTransactionOnSubmit
                            )}
                            className="space-y-8"
                          >
                            <FormField
                              control={quickDayPassCashTransactionForm.control}
                              name="cashAmount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Quick $15 Day Pass Cash Transaction
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Cash Amount"
                                      type="number"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              variant="green"
                              onSubmit={() => {
                                console.log("clicked");
                              }}
                              onClick={() => {
                                // setTimeout()
                                if (
                                  quickDayPassCashTransactionForm.getValues(
                                    "cashAmount"
                                  )! < 15
                                ) {
                                  toast({
                                    title: "❌ Not enough cash given",
                                  });
                                } else {
                                  toast({
                                    title: "Day Pass Cash Transaction Recorded",
                                    description: `Change: ${
                                      quickDayPassCashTransactionForm.getValues(
                                        "cashAmount"
                                      )! - 15
                                    }`,
                                  });
                                }
                                // quickDayPassCashTransactionForm.reset();
                              }}
                              type="submit"
                            >
                              Transact Cash Day Pass
                            </Button>
                          </form>
                        </Form>
                        <Form {...quickCsSaturdayCashTransactionForm}>
                          <form
                            onSubmit={quickCsSaturdayCashTransactionForm.handleSubmit(
                              quickCsSaturdayTransactionOnSubmit
                            )}
                            className="space-y-8"
                          >
                            <FormField
                              control={
                                quickCsSaturdayCashTransactionForm.control
                              }
                              name="cashAmount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Quick $10 Corrupted Saturday Cash
                                    Transaction
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Cash Amount"
                                      type="number"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              variant="green"
                              onSubmit={() => {
                                console.log("clicked");
                              }}
                              onClick={() => {
                                // setTimeout()
                                if (
                                  quickDayPassCashTransactionForm.getValues(
                                    "cashAmount"
                                  )! < 10
                                ) {
                                  toast({
                                    title: "❌ Not enough cash given",
                                  });
                                } else {
                                  toast({
                                    title: "Day Pass Cash Transaction Recorded",
                                    description: `Change: ${
                                      quickCsSaturdayCashTransactionForm.getValues(
                                        "cashAmount"
                                      )! - 10
                                    }`,
                                  });
                                }
                                // quickDayPassCashTransactionForm.reset();
                              }}
                              type="submit"
                            >
                              Transact Cash CS Saturday
                            </Button>
                          </form>
                        </Form>
                      </div>
                      <div className="flex flex-col gap-4 py-4">
                        <div className="flex w-full max-w-sm items-center space-x-2">
                          <form onSubmit={handleChangeTag}>
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
                              onClick={() => {
                                // setTimeout(() => {
                                //   setTagId("");
                                // }, 10);
                                // toast({
                                //   title: "✅ Tag Updated",
                                // });
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
                            Add the multiple items to the cart then press the
                            checkout button.
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
                                  <Label>Select Item:</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          className={cn(
                                            "w-[200px] justify-between",
                                            !field.value &&
                                              "text-muted-foreground"
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
                                        <CommandList>
                                          <CommandEmpty>
                                            No item found.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            <ScrollArea>
                                              {items.map((item) => (
                                                <CommandItem // need to close on select ---------------------------------------------------------------
                                                  value={item.label}
                                                  key={item.label}
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
                                            </ScrollArea>
                                          </CommandGroup>
                                        </CommandList>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                  <FormField
                                    control={form.control}
                                    name={`cartItems.${index}.quantity`}
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row">
                                        <FormLabel className="my-auto">
                                          Quantity:
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            className="w-1/6"
                                            placeholder="Quantity"
                                            type="number"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
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
                          variant="creme"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            append({ price: "", quantity: 1 });
                          }}
                        >
                          Add Item
                        </Button>
                        <div className="flex flex-col">
                          <div className="flex flex-row">
                            <FormField
                              control={form.control}
                              name="isCash"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md  p-4 shadow">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="flex-row space-y-1 leading-none">
                                    <FormLabel>Cash Payment?</FormLabel>
                                    <FormDescription>
                                      NO MEMBERSHIPS
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <Label className="ml-4 my-auto">Cash Given:</Label>
                            <Input
                              disabled={!form.watch("isCash")}
                              className="w-1/5 my-auto"
                              placeholder="Input Cash Paid Here"
                              value={multiCashAmount}
                              type="number"
                              onChange={(e) => {
                                e.target.value === ""
                                  ? setMultiCashAmount(0)
                                  : setMultiCashAmount(
                                      parseFloat(e.target.value)
                                    );
                              }}
                              onSubmit={() => {
                                console.log("submit");
                              }}
                            />
                          </div>

                          <Button type="submit" variant="green">
                            Checkout
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                  <div className="p-4 mx-auto">
                    <Button variant="secondary" asChild>
                      <a href={`/adminHome/${row.original.id}`}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        Click Here to See More Info
                      </a>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
    {
      accessorKey: "realScanId",
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={props.data}
        products={props.products}
      />
    </>
  );
};
