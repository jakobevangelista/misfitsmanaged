"use server";

import { db } from "@/db";
import { contracts, members } from "@/db/schema/members";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { stripe } from "../../../../utils/stripe";

export async function cancelActiveSubscription(subscription: string, ownerId: string) {
  // await stripe.subscriptions.cancel(subscription);
  await stripe.subscriptions.update(subscription, {
    cancel_at_period_end: true,
  })
  await db.update(contracts).set({
    status: "Ending at the end of the billing period",
  }).where(eq(contracts.stripeId, subscription));
  await db.update(members).set({
    contractStatus: "Ending at the end of the billing period",
  }).where(eq(members.customerId, ownerId));
  revalidatePath(`/adminHome`);
  revalidatePath(`/adminHome/[userId]`);
}
