import Stripe from "stripe";
import { stripe } from "../../../../utils/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { members, transactions, contracts } from "@/db/schema/members";
import { eq } from "drizzle-orm";
import { string } from "zod";
import { createOrRetrieveCustomer } from "../../../../utils/dbHelper";
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
  const secret = "whsec_1GELcqsBjQT3lighVRSc0e7PerHopo2s";
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    secret
  ) as Stripe.DiscriminatedEvent;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      console.log(event.id);
      console.log(new Date().toISOString().slice(0, 19).replace("T", " "));
      try {
        // const session = await stripe.checkout.sessions.retrieve(sessionId, {
        //   expand: ["customer"],
        // });
        // if (event.data.object.subscription != " ") {
        //   const subscriptionId = event.data.object.subscription?.toString();
        //   const subscription = await stripe.subscriptions.retrieve(
        //     subscriptionId!
        //   );

        //   //implement subscription logic here
        // }

        const memberEmail = event.data.object.customer_details?.email || " ";
        const transactionAmount = event.data.object.amount_total || 0;
        if (event.data.object.amount_total === 1500) {
          const now = new Date();
          const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
          const date = new Date(now);
          date.setHours(date.getHours() - 5);

          await db.insert(contracts).values({
            ownerId: memberEmail!,
            status: "active",
            type: "day pass",
            length: "1 day",
            startDate: now,
            endDate: tomorrow,
          });
          await db.insert(transactions).values({
            ownerId: memberEmail,
            amount: transactionAmount,
            date: date.toLocaleString(), //.toISOString().slice(0, 19).replace("T", " "),
            paymentMethod: "card",
            type: "day pass",
            createdAt: now,
          });
          break;
          // const customerId =
          //   (await createOrRetrieveCustomer({ email: memberEmail })) || " ";
          // const subscription = await stripe.subscriptions.create({
          //   customer: customerId,
          //   items: [
          //     { price: "price_1NSzYjJfUfWpyMyyifDl1LCB" },
          //     {
          //       price_data: {
          //         currency: "usd",
          //         product: "prod_OFUXzirHxR26ou",
          //         recurring: {
          //           interval: "day",
          //           interval_count: 1,
          //         },
          //         unit_amount: 1500,
          //       },
          //     },
          //   ],
          //   cancel_at_period_end: true,
          // });
          // const startDate = new Date(subscription.current_period_start);
          // const endDate = new Date(subscription.current_period_end);
          // await db.insert(contracts).values({
          //   ownerId: memberEmail!,
          //   status: "active",
          //   type: "day pass",
          //   length: "1 day",
          //   startDate: startDate,
          //   endDate: endDate,
          // });
        }
        const now = new Date();
        const date = new Date(now);
        date.setHours(date.getHours() - 5);
        // date.setHours(now.getHours() - 5);
        await db.insert(transactions).values({
          ownerId: memberEmail,
          amount: transactionAmount,
          date: date.toLocaleString(),
          paymentMethod: "card",
          type: "water",
          createdAt: date,
        });
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error(error);
      }
      break;
    case "customer.subscription.created":
      const customerSubscriptionCreated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.created
      break;
    case "customer.subscription.updated":
      const customerSubscriptionUpdated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.updated
      break;
  }
  // if (event.type === "checkout.session.completed") {
  //   const sessionId = event.data.object.id;
  //   console.log(event.id);
  //   console.log(new Date().toISOString().slice(0, 19).replace("T", " "));
  //   try {
  //     const session = await stripe.checkout.sessions.retrieve(sessionId, {
  //       expand: ["customer"],
  //     });
  //     // console.log("we fuckin did it");
  //     // console.log(event.data.object.customer_details.email);
  //     const memberEmail = session.customer_email || " ";
  //     const transactionAmount = session.amount_total || 0;
  //     const subscription = session.subscription?.toString() || " ";
  //     // const now: string = new Date()
  //     //   .toISOString()
  //     //   .slice(0, 19)
  //     //   .replace("T", " ");
  //     const now = new Date();
  //     console.log(memberEmail);
  //     console.log(transactionAmount);
  //     await db.insert(transactions).values({
  //       ownerId: memberEmail,
  //       amount: transactionAmount,
  //       date: now.toISOString().slice(0, 19).replace("T", " "),
  //       paymentMethod: "card",
  //       type: subscription,
  //       createdAt: now,
  //     });
  //   } catch (error) {
  //     // Handle any errors that occur during the API call
  //     console.error(error);
  //   }
  // } else if (event.type === 'subscription_schedule.created') {

  // }
  //   switch (event.type) {
  //     case "checkout.session.completed":
  //       const sessionId = event.data.object.id;
  //       console.log(event.id);
  //       try {
  //         const session = await stripe.checkout.sessions.retrieve(sessionId, {
  //           expand: ["customer"],
  //         });
  //         // console.log("we fuckin did it");
  //         // console.log(event.data.object.customer_details.email);
  //         const memberEmail = session.customer_email;
  //         const transactionAmount = session.amount_total;
  //         console.log(memberEmail);
  //         console.log(transactionAmount);
  //         const now: String = new Date()
  //           .toISOString()
  //           .slice(0, 19)
  //           .replace("T", " ");
  //         await db.insert(transactions).values({
  //           ownerId: Number(1),
  //           amount: transactionAmount,
  //           createdAt: "323",
  //           type: "dkfjd",
  //           paymentMethod: "card",
  //           date: String(new Date().toISOString().slice(0, 19).replace("T", " ")),
  //         });
  //       } catch (error) {
  //         // Handle any errors that occur during the API call
  //         console.error(error);
  //       }
  //       break;
  //     default:
  //       console.log(`Unhandled event type ${event.type}`);
  //   }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
