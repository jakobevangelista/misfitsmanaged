"use server";

import { db } from "@/server/db";
import { transactions } from "@/server/db/schema/members";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteTransaction(transactionId: number) {
  await db.delete(transactions).where(eq(transactions.id, transactionId));
  revalidatePath(`/transactions`);
}
