import Stripe from "stripe";
import { stripe } from "../../../../utils/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import {
  members,
  transactions,
  contracts,
  products,
} from "@/server/db/schema/members";
import { eq } from "drizzle-orm";
import { string } from "zod";
import {
  createOrRetrieveCustomer,
  manageSubscription,
} from "../../../../utils/dbHelper";
import { check } from "drizzle-orm/mysql-core";
import { revalidate } from "@/app/transactions/data-table";
import { revalidatePath } from "next/cache";
import { DateTime } from "luxon";

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

interface PriceData {
  priceId: string;
  quantity: number;
}

export async function POST(req: Request) {
  const body = await req.text();
  //   let event: Stripe.Event;
  const sig = headers()!.get("Stripe-Signature")!;
  // const secret = "whsec_1GELcqsBjQT3lighVRSc0e7PerHopo2s"; // personal test mode
  // const secret = "whsec_Xjcs5cS81VExzwEIsVF12d2ePx0Kp8KL"; // personal live
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    secret
  ) as Stripe.DiscriminatedEvent;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSession = event.data.object;

      const now = DateTime.now().setZone("America/Chicago");

      const itemsPurchased = await stripe.checkout.sessions.listLineItems(
        checkoutSession.id,
        {
          limit: 100,
        }
      );

      // for (let i = 0; i < itemsPurchased.data.length; i++) {
      //   const itemName = await stripe.products.retrieve(
      //     itemsPurchased.data[i]!.price!.product as string
      //   );
      //   await db.insert(transactions).values({
      //     ownerId: event.data.object.customer_details?.email || " ",
      //     amount: itemsPurchased.data[i]!.amount_total,
      //     date: now.toLocaleString(DateTime.DATETIME_SHORT),
      //     paymentMethod: "card",
      //     type: itemName.name,
      //     createdAt: now.toJSDate(),
      //     quantity: itemsPurchased.data[i]!.quantity,
      //   });
      // }

      for (const item of itemsPurchased.data) {
        const itemName = await stripe.products.retrieve(
          item.price!.product as string
        );
        await db.insert(transactions).values({
          ownerId: event.data.object.customer_details!.email!,
          amount: item.amount_total,
          date: now.toLocaleString(DateTime.DATETIME_SHORT),
          paymentMethod: "card",
          type: itemName.name,
          createdAt: now.toJSDate(),
          quantity: item.quantity,
        });
      }

      if (checkoutSession.mode === "subscription") {
        const subscriptionId = checkoutSession.subscription as string;
        const customer = checkoutSession.customer as string;
        await manageSubscription(subscriptionId, customer);
        revalidatePath(`/adminHome`);

        break;
      }
      revalidatePath(`/adminHome`);

      break;
    case "customer.subscription.created":
      const customerSubscriptionCreated = event.data.object;
      const subscriptionCreatedId = customerSubscriptionCreated.id;
      const subscriptionCreatedCustomer =
        customerSubscriptionCreated.customer as string;
      console.log(customerSubscriptionCreated);
      const subscriptionCreated = await db.query.products.findFirst({
        where: eq(
          products.priceId,
          customerSubscriptionCreated.items.data[0]!.price.id
        ),
      });
      // Then define and call a function to handle the event customer.subscription.created
      if (
        customerSubscriptionCreated.items.data[0]!.price.recurring?.interval ===
          "day" ||
        customerSubscriptionCreated.items.data[0]!.id ===
          "price_1NYRbrD5u1cDehOfLWSsrUWc"
      ) {
        await stripe.subscriptions.update(customerSubscriptionCreated.id, {
          cancel_at_period_end: true,
        });
      }

      if (subscriptionCreated?.name === "5 Day Pass") {
        console.log("WE MADE IT HERE WOOOOOO");
        const now = DateTime.now().setZone("America/Chicago");
        const futureDate = now.plus({ years: 10 });

        await db.insert(contracts).values({
          ownerId: customerSubscriptionCreated.customer as string,
          stripeId: customerSubscriptionCreated.id,
          status: "Limited",
          type: "5 Day Pass",
          startDate: now.toJSDate(),
          endDate: futureDate.toJSDate(),
          remainingDays: 5,
        });
        // await db
        //   .update(contracts)
        //   .set({
        //     status: "Limited",
        //     type: "5 Day Pass",
        //     startDate: new Date(),
        //     endDate: futureDate,
        //     remainingDays: 5,
        //   })
        //   .where(
        //     eq(
        //       contracts.ownerId,
        //       customerSubscriptionCreated.customer as string
        //     )
        //   );
      }
      await manageSubscription(
        subscriptionCreatedId,
        subscriptionCreatedCustomer
      );

      revalidatePath(`/adminHome`);
      return NextResponse.json({ processed: "customer.subscription.created" });

      break;
    case "customer.subscription.updated":
      const customerSubscriptionUpdated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.updated
      const subscriptionUpdate = event.data.object;

      const subscriptionId = subscriptionUpdate.id;
      const customer = subscriptionUpdate.customer as string;
      await manageSubscription(subscriptionId, customer);
      revalidatePath(`/adminHome`);
      return NextResponse.json({ processed: "customer.subscription.updated" });

      break;

    case "customer.subscription.deleted":
      // Then define and call a function to handle the event customer.subscription.updated
      const subscriptionDelete = event.data.object;

      const subscriptionIdDelete = subscriptionDelete.id;
      const customerDelete = subscriptionDelete.customer as string;
      await manageSubscription(subscriptionIdDelete, customerDelete);
      revalidatePath(`/adminHome`);
      return NextResponse.json({ processed: "customer.subscription.deleted" });

      break;

    case "charge.succeeded":
      const chargeSucceeded = event.data.object;
      console.log(chargeSucceeded.metadata.line_items);
      console.log(chargeSucceeded.customer);

      const priceDataArray: PriceData[] = chargeSucceeded.metadata
        .line_items!.trim()
        .split(",")
        .map((entry) => {
          const [priceId, quantity] = entry.trim().split(":")!;
          return {
            priceId: priceId!.toString(),
            quantity: parseInt(quantity!, 10),
          };
        });
      for (const priceData of priceDataArray) {
        const singleProductAmount = await db.query.products.findFirst({
          where: eq(products.priceId, priceData.priceId),
        });
        console.log(priceData);
        const totalAmount = singleProductAmount!.price * priceData.quantity;
        console.log(singleProductAmount?.price);
        console.log(totalAmount + " total amount");

        await db.insert(transactions).values({
          ownerId: chargeSucceeded.receipt_email!,
          amount: totalAmount,
          date: DateTime.now()
            .setZone("America/Chicago")
            .toLocaleString(DateTime.DATETIME_SHORT),
          paymentMethod: "card",
          type: singleProductAmount!.name,
          createdAt: DateTime.now().setZone("America/Chicago").toJSDate(),
          quantity: priceData.quantity,
        });
      }
      revalidatePath(`/adminHome`);
      revalidatePath(`/transactions`);

      break;
    case "price.created":
    case "price.updated":
      const updatePrice = event.data.object;
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
      const deletePrice = event.data.object;

      await db.delete(products).where(eq(products.priceId, deletePrice.id));
      break;
    case "product.created":
      break;
    case "product.updated":
      const updateProduct = event.data.object;
      const updatedProductName = await stripe.products.retrieve(
        updateProduct.id
      );
      const updatedProductPrice = await stripe.prices.retrieve(
        updateProduct.default_price as string
      );
      await db
        .insert(products)
        .values({
          priceId: updateProduct.default_price as string,
          name: updatedProductName.name,
          price: updatedProductPrice.unit_amount!,
        })
        .onDuplicateKeyUpdate({
          set: {
            priceId: updateProduct.default_price as string,
            price: updatedProductPrice.unit_amount!,
          },
        });
      break;
    case "customer.created":
    case "customer.updated":
      const customerCreated = event.data.object;
      await db
        .update(members)
        .set({
          customerId: customerCreated.id,
        })
        .where(eq(members.emailAddress, customerCreated.email!));
      break;
    case "invoice.payment_failed":
      const invoicePaymentFailed = event.data.object;
      await db
        .update(contracts)
        .set({
          status: "Unpaid",
        })
        .where(
          eq(contracts.stripeId, invoicePaymentFailed.subscription as string)
        );
      await db
        .update(members)
        .set({
          contractStatus: "Unpaid",
        })
        .where(eq(members.customerId, invoicePaymentFailed.customer as string));

      await stripe.subscriptions.update(
        invoicePaymentFailed.subscription as string,
        {
          cancel_at_period_end: true,
        }
      );

      await db
        .update(members)
        .set({
          contractStatus: "Unpaid",
        })
        .where(eq(members.customerId, invoicePaymentFailed.customer as string));
      revalidatePath(`/adminHome`);
      break;
    case "invoice.paid":
      const invoicePaid = event.data.object;
      const invoicePaidSubscription = await stripe.subscriptions.retrieve(
        invoicePaid.subscription as string
      );
      await db
        .update(contracts)
        .set({
          status: "Active",
          startDate: new Date(
            invoicePaidSubscription.current_period_start * 1000
          ),
          endDate: new Date(invoicePaidSubscription.current_period_end * 1000),
        })
        .where(eq(contracts.stripeId, invoicePaid.subscription as string));
      revalidatePath(`/adminHome`);
      break;
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
