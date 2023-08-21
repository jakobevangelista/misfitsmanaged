"use server";

import { db } from "@/db";
import {
  contracts,
  members,
  products,
  transactions,
} from "@/db/schema/members";
import { User } from "./columns";
import { Row } from "@tanstack/table-core/build/lib/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function cashTransactionWater(formdata: FormData) {
  //   console.log(row.original.emailAddress);
  const now = new Date();
  console.log(formdata.get("email")?.toString());
  await db
    .insert(transactions)
    .values({
      ownerId: formdata.get("email")!.toString(),
      amount: 100,
      date: now.toLocaleString(),
      paymentMethod: "cash",
      type: "water",
      createdAt: now,
    })
    .then((res) => {
      return { message: `successfully updated transactions` };
    })
    .catch((err) => {
      return { message: `failed` };
    });
  return { message: `successfully updated transactions` };
}

export async function cashTransactionDayPass(emailAddress: string) {
  //   console.log(row.original.emailAddress);
  const now = new Date();

  const tomorrow = new Date();
  tomorrow.setHours(tomorrow.getHours() + 24);
  const localNow = new Date(now.toLocaleString());
  localNow.setHours(localNow.getHours() - 5);
  const localTomorrow = new Date(tomorrow.toLocaleString());
  localTomorrow.setHours(localTomorrow.getHours() - 5);
  // console.log(localNow.toLocaleString());
  // console.log(localTomorrow.toLocaleString());
  // return;
  const customerId = await db.query.members.findFirst({
    where: eq(members.emailAddress, emailAddress),
    columns: {
      customerId: true,
      emailAddress: true,
    },
  });
  console.log(now.toLocaleString());
  await db.insert(contracts).values({
    ownerId: customerId!.customerId!,
    status: "active",
    type: "Day Pass",
    startDate: localNow,
    endDate: localTomorrow,
    stripeId: Math.random().toString(),
  });
  await db
    .insert(transactions)
    .values({
      ownerId: emailAddress,
      amount: 1500,
      date: now.toLocaleString(),
      paymentMethod: "cash",
      type: "Day Pass",
      createdAt: now,
    })
    .then((res) => {
      return { message: `successfully updated transactions` };
      // revalidatePath(`/adminHome/${customerId!.emailAddress}`);
    })
    .catch((err) => {
      return { message: `failed` };
    });
  return { message: `successfully updated transactions` };
}

export async function cashTransactionCustom(
  id: number,
  total: number,
  cartItems: [
    {
      price: string;
      quantity: number;
    },
    ...{
      price: string;
      quantity: number;
    }[]
  ]
) {
  console.log(id);
  console.log(total);
  const customer = await db.query.members.findFirst({
    where: eq(members.id, id),
    columns: {
      customerId: true,
    },
  });
  const now = new Date();
  console.log(cartItems);

  for (let i = 0; i < cartItems.length; i++) {
    const amount = await db.query.products.findFirst({
      where: eq(products.priceId, cartItems[i].price),
      columns: {
        price: true,
        name: true,
      },
    });
    await db.insert(transactions).values({
      ownerId: customer!.customerId!,
      amount: amount!.price,
      date: now.toLocaleString(),
      paymentMethod: "cash",
      type: amount!.name,
      createdAt: now,
    });
  }
}
