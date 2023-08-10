"use server";

import { db } from "@/db";
import { contracts } from "@/db/schema/members";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { stripe } from "../../../../utils/stripe";

export async function cancelActiveSubscription(subscription: string) {
  await stripe.subscriptions.cancel(subscription);
  revalidatePath(`/adminHome`);
  revalidatePath(`/adminHome/[userId]`);
}
