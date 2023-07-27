"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema/members";
import { User } from "./columns";
import { Row } from "@tanstack/table-core/build/lib/types";

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
  console.log(formdata.get("email")?.toString());
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
