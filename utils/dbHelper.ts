import { db } from "@/db";
import { stripe } from "./stripe";
import { contracts, members, transactions } from "@/db/schema/members";
import { eq } from "drizzle-orm";
import { User } from "../src/app/adminHome/columns";
import { Row } from "@tanstack/table-core/build/lib/types";

export const createOrRetrieveCustomer = async ({
  email,
  userId,
  name,
}: {
  email: string;
  userId?: string;
  name?: string;
}) => {
  const stripeCustomer = await stripe.customers.list({
    email: email,
  });
  if (stripeCustomer.data.length > 0) {
    return stripeCustomer.data[0].id;
  } else {
    const customer = await stripe.customers.create({
      email: email,
    });

    await db
      .update(members)
      .set({ customerId: customer.id })
      .where(eq(members.emailAddress, email));
    return customer.id;
  }
  return "idk how we got here";
};

export async function cashTransaction(data: string, row: Row<User>) {
  console.log(row.original.emailAddress);
  await db.query.transactions
    .findFirst()
    .then((res) => {
      return { message: `successfully updated transactions` };
    })
    .catch((err) => {
      console.log(err);
      return { message: `failed` };
    });
  return { message: `successfully updated transactions` };
}

export async function manageSubscription(
  subscriptionId: string,
  customerId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  const product = await stripe.products.retrieve(
    subscription.items.data[0].price.product as string
  );

  if (product.name === "5 Day Pass") {
    return;
  }

  await db
    .insert(contracts)
    .values({
      ownerId: customerId,
      status: subscription.status,
      type: product.name,
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000),
      stripeId: subscription.id,
    })
    .onDuplicateKeyUpdate({
      set: {
        status: subscription.status,
        startDate: new Date(subscription.current_period_start * 1000),
        endDate: new Date(subscription.current_period_end * 1000),
      },
    });
}
