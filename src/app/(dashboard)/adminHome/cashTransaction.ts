"use server";

import { db } from "@/server/db";
import {
  contracts,
  members,
  products,
  transactions,
} from "@/server/db/schema/members";
import { eq } from "drizzle-orm";
import { DateTime } from "luxon";

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
  const now = DateTime.now().setZone("America/Chicago");
  const tomorrow = now.plus({ days: 1 });
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
    startDate: now.toJSDate(),
    endDate: tomorrow.toJSDate(),
    stripeId: Math.random().toString(),
  });
  await db
    .insert(transactions)
    .values({
      ownerId: emailAddress,
      amount: 1500,
      date: now.toLocaleString(DateTime.DATETIME_SHORT),
      paymentMethod: "cash",
      type: "Day Pass",
      createdAt: now.toJSDate(),
    })
    .then((res) => {
      // revalidatePath(`/adminHome/${customerId!.emailAddress}`);
      return { message: `successfully updated transactions` };
    })
    .catch((err) => {
      return { message: `failed` };
    });
  return { message: `successfully updated transactions` };
}

export async function cashTransactionCorruptedSaturday(emailAddress: string) {
  const now = DateTime.now().setZone("America/Chicago");
  const tomorrow = now.plus({ days: 1 });

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
    type: "Corrupted Saturday Day Pass",
    startDate: now.toJSDate(),
    endDate: tomorrow.toJSDate(),
    stripeId: Math.random().toString(),
  });
  await db
    .insert(transactions)
    .values({
      ownerId: emailAddress,
      amount: 1000,
      date: now.toLocaleString(DateTime.DATETIME_SHORT),
      paymentMethod: "cash",
      type: "Corrupted Saturday Day Pass",
      createdAt: now.toJSDate(),
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

  // for (let i = 0; i < cartItems.length; i++) {
  //   const amount = await db.query.products.findFirst({
  //     where: eq(products.priceId, cartItems[i]!.price),
  //     columns: {
  //       price: true,
  //       name: true,
  //     },
  //   });
  //   await db.insert(transactions).values({
  //     ownerId: customer!.customerId!,
  //     amount: amount!.price,
  //     date: now.toLocaleString(),
  //     paymentMethod: "cash",
  //     type: amount!.name,
  //     createdAt: now,
  //   });
  // }

  for (const item of cartItems) {
    const amount = await db.query.products.findFirst({
      where: eq(products.priceId, item.price),
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
