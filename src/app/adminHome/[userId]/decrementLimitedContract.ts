"use server";

import { db } from "@/db";
import { contracts } from "@/db/schema/members";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function decrementLimitedContractDay(
  subscription: string,
  numberOfDaysLeft: number
) {
  await db
    .update(contracts)
    .set({
      remainingDays: numberOfDaysLeft - 1,
    })
    .where(eq(contracts.stripeId, subscription));
  revalidatePath(`/adminHome`);

  revalidatePath(`/adminHome/[userId]`);
}
