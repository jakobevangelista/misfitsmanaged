"use server";

import { db } from "@/db";
import { contracts, members, transactions } from "@/db/schema/members";
import { User, columns } from "./columns";
import { Row } from "@tanstack/table-core/build/lib/types";
import { eq } from "drizzle-orm";

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

export async function cashTransactionDayPass(formdata: FormData) {
  //   console.log(row.original.emailAddress);
  const now = new Date();
  console.log(now.toString())
  console.log(formdata.get("email")?.toString());
  const tomorrow = new Date()
  tomorrow.setHours(tomorrow.getHours() + 24)
  const localNow = new Date(now.toLocaleString())
  const localTomorrow = new Date(tomorrow.toLocaleString())
  const customerId = await db.query.members.findFirst({
    where: (eq(members.emailAddress, formdata.get("email")!.toString())),
    columns: {
      customerId: true
    }
  })
  console.log(now.toLocaleString())
  await db
    .insert(contracts)
    .values({
      ownerId: customerId!.customerId!,
      status: "active",
      type: 'day pass',
      startDate: localNow,
      endDate: localTomorrow,
      stripeId: Math.random().toString(),
    });
  await db
    .insert(transactions)
    .values({
      ownerId: formdata.get("email")!.toString(),
      amount: 1500,
      date: now.toLocaleString(),
      paymentMethod: "cash",
      type: "day pass",
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
