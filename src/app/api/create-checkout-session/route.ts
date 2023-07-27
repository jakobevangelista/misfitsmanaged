import { stripe } from "../../../../utils/stripe";
import { getURL } from "../../../../utils/helpers";
import { currentUser } from "@clerk/nextjs";
import { createOrRetrieveCustomer } from "../../../../utils/dbHelper";
import { members } from "@/db/schema/members";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { SYSTEM_ENTRYPOINTS } from "next/dist/shared/lib/constants";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const data = await req.json();
    console.log(data);
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
      userId: data.id,
      email: memberEmail!.emailAddress,
      // name: `${user.firstName} ${user.lastName}`,
    });
    console.log(data);

    try {
      if (data.data === "month") {
        console.log("here");

        let session;
        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          billing_address_collection: "required",
          customer,
          customer_update: {
            address: "auto",
          },
          line_items: [
            {
              // price: "price_1NVLLCD5u1cDehOfchFtQrz6", // month-to-month
              price: "price_1NVLLzD5u1cDehOfDPCQ0SGN", // montly membership
              quantity: 1,
            },
          ],

          mode: "subscription",
          allow_promotion_codes: true,
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
      } else if (data.data === "Water") {
        let session;
        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          billing_address_collection: "required",
          customer,
          customer_update: {
            address: "auto",
          },
          line_items: [
            {
              // price: "price_1NB9geJfUfWpyMyy9FOo7rbp",
              // price: "price_1NVIr6D5u1cDehOfJUA0JI6k",
              price: "price_1NIEbYJfUfWpyMyyPh0WqUTM", // personal test mode
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
        let session;
        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          billing_address_collection: "required",
          customer,
          customer_update: {
            address: "auto",
          },
          line_items: [
            {
              price: "price_1NXFYAD5u1cDehOfSgf9D1AQ",
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
    } catch (err: any) {
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
