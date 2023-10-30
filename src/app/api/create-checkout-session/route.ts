/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { stripe } from "../../../../utils/stripe";
import { getURL } from "../../../../utils/helpers";
import { currentUser } from "@clerk/nextjs";
import { createOrRetrieveCustomer } from "../../../../utils/dbHelper";
import { members } from "@/server/db/schema/members";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { DateTime } from "luxon";

export async function POST(req: Request) {
  if (req.method === "POST") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await req.json();
    // console.log(data);
    const user = await currentUser();
    const memberEmail = await db.query.members.findFirst({
      columns: {
        emailAddress: true,
      },
      where: eq(members.id, Number(data.id)),
    });

    if (!user) {
      return new Response(
        JSON.stringify({
          error: { statusCode: 500, message: "User is not defined" },
        }),
        { status: 500 }
      );
    }

    const customer = await createOrRetrieveCustomer({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      userId: data.id,
      email: memberEmail!.emailAddress,
      // name: `${user.firstName} ${user.lastName}`,
    });
    // console.log(data);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (data.data === "month") {
        console.log("here");

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          billing_address_collection: "auto",
          customer,
          customer_update: {
            address: "auto",
          },
          line_items: [
            {
              // price: "price_1NYRbrD5u1cDehOfLWSsrUWc", // live mode month to month membership
              price: "price_1NVLLCD5u1cDehOfchFtQrz6", // test mode month to month membership
              quantity: 1,
            },
          ],

          mode: "subscription",
          allow_promotion_codes: true,
          // payment_intent_data: {
          //   setup_future_usage: "off_session",
          // },
          success_url: `${getURL()}/adminHome`,
          cancel_url: `${getURL()}/adminHome`,
        });

        if (session) {
          revalidatePath("/adminHome");
          revalidatePath("/transactions");
          return new Response(JSON.stringify({ sessionId: session.id }), {
            status: 200,
          });
        } else {
          return new Response(
            JSON.stringify({
              error: { statusCode: 500, message: "Session is not defined" },
            }),
            { status: 500 }
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      } else if (data.data === "yearly") {
        console.log("here");
        const now = DateTime.now().setZone("America/Chicago");
        const startOfTheNextMonth = now.plus({ months: 1 }).startOf("month");

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          billing_address_collection: "auto",
          customer,
          customer_update: {
            address: "auto",
          },
          line_items: [
            {
              price: "price_1NVLLzD5u1cDehOfDPCQ0SGN", // test mode yearly membership
              quantity: 1,
            },
          ],

          mode: "subscription",
          allow_promotion_codes: true,
          // payment_intent_data: {
          //   setup_future_usage: "off_session",
          // },
          success_url: `${getURL()}/adminHome`,
          cancel_url: `${getURL()}/adminHome`,
          subscription_data: {
            billing_cycle_anchor: startOfTheNextMonth.toUnixInteger(),
          },
        });

        if (session) {
          revalidatePath("/adminHome");
          revalidatePath("/transactions");
          return new Response(JSON.stringify({ sessionId: session.id }), {
            status: 200,
          });
        } else {
          return new Response(
            JSON.stringify({
              error: { statusCode: 500, message: "Session is not defined" },
            }),
            { status: 500 }
          );
        }
      } else if (data.data === "Water") {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          billing_address_collection: "auto",
          customer,
          customer_update: {
            address: "auto",
          },
          line_items: [
            {
              // price: "price_1NYRaXD5u1cDehOfi3XqF0jV", // personal test mode
              price: "price_1NJ5vUD5u1cDehOfPyC6RenZ", // cs live mode
              // price: "price_1NVLLzD5u1cDehOfDPCQ0SGN", // cs test mode yearly subscriptions
              quantity: 1,
            },
          ],

          mode: "payment",
          payment_intent_data: {
            setup_future_usage: "off_session",
          },
          allow_promotion_codes: false,
          success_url: `${getURL()}/adminHome`,
          cancel_url: `${getURL()}/adminHome`,
        });

        if (session) {
          revalidatePath("/adminHome");
          revalidatePath("/transactions");
          console.log(session.id);
          // redirect(session.url!)
          return new Response(JSON.stringify({ sessionId: session.id }), {
            status: 200,
          });
        } else {
          return new Response(
            JSON.stringify({
              error: { statusCode: 500, message: "Session is not defined" },
            }),
            { status: 500 }
          );
        }
      } else if (data.data === "cssat") {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          billing_address_collection: "auto",
          customer,
          customer_update: {
            address: "auto",
          },
          line_items: [
            {
              price: "price_1NjPG7D5u1cDehOf42qaFmXy", //live mode price id for day pass
              // price: "price_1NXFYAD5u1cDehOfSgf9D1AQ", // test mode price id for day pass
              quantity: 1,
            },
          ],

          mode: "subscription",
          allow_promotion_codes: false,
          // payment_intent_data: {
          //   setup_future_usage: "off_session",
          // },
          success_url: `${getURL()}/adminHome`,
          cancel_url: `${getURL()}/adminHome`,
        });

        if (session) {
          revalidatePath("/adminHome");
          revalidatePath("/transactions");
          return new Response(JSON.stringify({ sessionId: session.id }), {
            status: 200,
          });
        } else {
          return new Response(
            JSON.stringify({
              error: { statusCode: 500, message: "Session is not defined" },
            }),
            { status: 500 }
          );
        }
      } else if (data.data === "Day Pass") {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          billing_address_collection: "auto",
          customer,
          customer_update: {
            address: "auto",
          },
          line_items: [
            {
              price: "price_1NYRbKD5u1cDehOfapzIEhrJ", //live mode price id for day pass
              // price: "price_1NXFYAD5u1cDehOfSgf9D1AQ", // test mode price id for day pass
              quantity: 1,
            },
          ],

          mode: "subscription",
          allow_promotion_codes: false,
          // payment_intent_data: {
          //   setup_future_usage: "off_session",
          // },
          success_url: `${getURL()}/adminHome`,
          cancel_url: `${getURL()}/adminHome`,
        });

        if (session) {
          revalidatePath("/adminHome");
          revalidatePath("/transactions");
          return new Response(JSON.stringify({ sessionId: session.id }), {
            status: 200,
          });
        } else {
          return new Response(
            JSON.stringify({
              error: { statusCode: 500, message: "Session is not defined" },
            }),
            { status: 500 }
          );
        }
      } else {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],

          line_items: [
            {
              price: "price_1NYRbKD5u1cDehOfapzIEhrJ",
              quantity: 1,
            },
          ],

          mode: "subscription",
          allow_promotion_codes: false,
          success_url: `${getURL()}/adminHome`,
          cancel_url: `${getURL()}/adminHome`,
        });

        if (session) {
          revalidatePath("/adminHome");
          revalidatePath("/transactions");
          return new Response(JSON.stringify({ sessionId: session.id }), {
            status: 200,
          });
        } else {
          return new Response(
            JSON.stringify({
              error: { statusCode: 500, message: "Session is not defined" },
            }),
            { status: 500 }
          );
        }
      }
    } catch (err) {
      console.log(err);
      return new Response(JSON.stringify(err), { status: 500 });
    }
  } else {
    return new Response("Method Not Allowed", {
      headers: { Allow: "POST" },
      status: 405,
    });
  }
}
