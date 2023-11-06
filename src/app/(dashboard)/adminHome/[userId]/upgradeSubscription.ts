"use server";

import { db } from "@/server/db";
import { contracts, members } from "@/server/db/schema/members";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { stripe } from "../../../../../utils/stripe";
import { DateTime } from "luxon";

export async function upgradeSubscription(
  subscription: string,
  ownerId: string
) {
  const now = DateTime.now().setZone("America/Chicago");
  const startOfTheNextMonth = now.plus({ months: 1 }).startOf("month");
  const subscriptionObject = await stripe.subscriptions.retrieve(subscription);

  await stripe.subscriptions.cancel(subscription, {
    prorate: true,
  });
  const newContract = await stripe.subscriptions.create({
    customer: ownerId,
    items: [
      {
        price: "price_1NVLLzD5u1cDehOfDPCQ0SGN",
      },
    ],
    billing_cycle_anchor: startOfTheNextMonth.toUnixInteger(),
  });

  revalidatePath(`/adminHome`);
  revalidatePath(`/adminHome/${ownerId}`);
}
