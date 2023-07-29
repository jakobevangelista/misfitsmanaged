import Stripe from "stripe";
import { stripe } from "../../../../utils/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  members,
  transactions,
  contracts,
  products,
} from "@/db/schema/members";
import { eq } from "drizzle-orm";
import { string } from "zod";
import {
  createOrRetrieveCustomer,
  manageSubscription,
} from "../../../../utils/dbHelper";
import { check } from "drizzle-orm/mysql-core";
/// <reference types="stripe-event-types" />

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  const body = await req.text();
  //   let event: Stripe.Event;
  const sig = headers().get("Stripe-Signature") as string;
  // const secret = "whsec_1GELcqsBjQT3lighVRSc0e7PerHopo2s"; // personal test mode
  // const secret = "whsec_GmTLlRKwQ5Xh1XLm9ezQFhsJihueNeqb"; // personal live
  const secret = process.env.STRIPE_WEBHOOK_SECRET as string;
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    secret
  ) as Stripe.DiscriminatedEvent;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      const now = new Date();
      const date = new Date(now);
      // date.setHours(date.getHours() - 5);

      const itemsPurchased = await stripe.checkout.sessions.listLineItems(
        checkoutSession.id,
        {
          limit: 100,
        }
      );

      for (var i = 0; i < itemsPurchased.data.length; i++) {
        const itemName = await stripe.products.retrieve(
          itemsPurchased.data[i].price!.product as string
        );
        await db.insert(transactions).values({
          ownerId: event.data.object.customer_details?.email || " ",
          amount: itemsPurchased.data[i].amount_total,
          date: date.toLocaleString(),
          paymentMethod: "card",
          type: itemName.name,
          createdAt: date,
        });
      }

      if (checkoutSession.mode === "subscription") {
        const subscriptionId = checkoutSession.subscription as string;
        const customer = checkoutSession.customer as string;
        manageSubscription(subscriptionId!, customer!);
        break;
      }

      break;
    case "customer.subscription.created":
      const customerSubscriptionCreated = event.data
        .object as Stripe.Subscription;
      // Then define and call a function to handle the event customer.subscription.created
      if (
        customerSubscriptionCreated.items.data[0].price.recurring?.interval ===
        "day"
      ) {
        await stripe.subscriptions.update(customerSubscriptionCreated.id, {
          cancel_at_period_end: true,
        });
      }
      break;
    case "customer.subscription.updated":
      const customerSubscriptionUpdated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.updated
      const subscriptionUpdate = event.data.object as Stripe.Subscription;

      const subscriptionId = subscriptionUpdate.id as string;
      const customer = subscriptionUpdate.customer as string;
      manageSubscription(subscriptionId!, customer!);
      break;

    case "customer.subscription.deleted":
      // Then define and call a function to handle the event customer.subscription.updated
      const subscriptionDelete = event.data.object as Stripe.Subscription;

      const subscriptionIdDelete = subscriptionDelete.id as string;
      const customerDelete = subscriptionDelete.customer as string;
      manageSubscription(subscriptionIdDelete!, customerDelete!);
      break;

    case "charge.succeeded":
      const chargeSucceeded = event.data.object;
      console.log(chargeSucceeded.metadata.line_items);
      console.log(chargeSucceeded.customer);

      break;
    case "price.created":
    case "price.updated":
      const updatePrice = event.data.object as Stripe.Price;
      const productName = await stripe.products.retrieve(
        updatePrice.product as string
      );
      console.log(updatePrice);
      await db
        .insert(products)
        .values({
          priceId: updatePrice.id,
          name: productName.name,
          price: updatePrice.unit_amount!,
        })
        .onDuplicateKeyUpdate({
          set: {
            price: updatePrice.unit_amount!,
          },
        });
      break;
    case "price.deleted":
      const deletePrice = event.data.object as Stripe.Price;

      await db.delete(products).where(eq(products.priceId, deletePrice.id));
      break;
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
