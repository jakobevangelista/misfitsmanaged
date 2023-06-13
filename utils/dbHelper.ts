import { db } from "@/db";
import { stripe } from "./stripe";
import { members } from "@/db/schema/members";
import { eq } from "drizzle-orm";

export const createOrRetrieveCustomer = async ({
  email,
  userId,
  name,
}: {
  email: string;
  userId: string;
  name: string;
}) => {
  const customer = await stripe.customers.list({ email: email });
  if (customer.data.length > 0) {
    return customer.data[0].id;
  } else {
    const customer = await stripe!.customers.create({
      email: email,
      metadata: {
        clerkUserId: userId,
      },
      name: name,
    });

    await db
      .update(members)
      .set({ customerId: customer.id })
      .where(eq(members.userId, userId));
    return customer.id;
  }
};
