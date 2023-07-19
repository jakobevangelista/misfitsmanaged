import { db } from "@/db";
import { stripe } from "./stripe";
import { members, transactions } from "@/db/schema/members";
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
  // const customer = await stripe.customers.list({ email: email });
  const customer = await db.query.members.findFirst({
    where: eq(members.emailAddress, email),
  });
  if (customer?.customerId !== null) {
    return customer?.customerId;
  } else {
    const customer = await stripe!.customers.create({
      email: email,
    });

    await db
      .update(members)
      .set({ customerId: customer.id })
      .where(eq(members.id, Number(userId)));

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
