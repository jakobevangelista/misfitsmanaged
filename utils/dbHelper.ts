import { db } from "@/db";
import { stripe } from "./stripe";
import { members } from "@/db/schema/members";
import { eq } from "drizzle-orm";
import { StringDecoder } from "string_decoder";

export const createOrRetrieveCustomer = async ({
  email,
  userId,
  name,
}: {
  email: string;
  userId?: string;
  name?: string;
}) => {
  // const customer = await stripe.customers.list({ email: email });
  const customer = await db.query.members.findFirst({
    where: eq(members.emailAddress, email),
  });
  if (customer?.customerId !== null) {
    return customer?.customerId;
  } else {
    const customer = await stripe!.customers.create({
      email: email,
      // metadata: {
      //   clerkUserId: userId,
      // },
      // name: name,
    });

    await db
      .update(members)
      .set({ customerId: customer.id })
      .where(eq(members.id, Number(userId)));
    return customer.id;
  }
  return "idk how we got here";
};
