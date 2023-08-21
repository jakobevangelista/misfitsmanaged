import { stripe } from "../../../../utils/stripe";
import { getURL } from "../../../../utils/helpers";
import { currentUser } from "@clerk/nextjs";
import { createOrRetrieveCustomer } from "../../../../utils/dbHelper";
import { members } from "@/db/schema/members";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { SYSTEM_ENTRYPOINTS } from "next/dist/shared/lib/constants";
import { type } from "os";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const data = await req.json();
    // console.log(data.arg.cartItems.length);
    // let arr: Array<Object> = [];
    // for (let i = 0; i < data.arg.cartItems.length; i++) {
    //   arr.push({
    //     price: data.arg.cartItems[i].price,
    //     quantity: data.arg.cartItems[i].quantity,
    //   });
    // }
    // console.log(typeof arr[0]);

    // console.log(data);
    const user = await currentUser();

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
      email: data.email,
    });

    try {
      for (let i = 0; i < data.arg.cartItems.length; i++) {
        if (
          data.arg.cartItems[i].price === "price_1NYRbKD5u1cDehOfapzIEhrJ" ||
          data.arg.cartItems[i].price === "price_1NYRcWD5u1cDehOfiPRDAB3v" ||
          data.arg.cartItems[i].price === "price_1NYRbrD5u1cDehOfLWSsrUWc" || 
          data.arg.cartItems[i].price === "price_1NdRU4D5u1cDehOfQPQPLvIz"
        ) {
          let session;
          session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            billing_address_collection: "required",
            customer,
            customer_update: {
              address: "auto",
            },
            line_items: data.arg.cartItems,

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
            console.log("we not seeing anything");
            console.log(session.id);
            return new Response(JSON.stringify({ sessionId: session.id }), {
              status: 200,
            });
          } else {
            console.log("error");
            return new Response(
              JSON.stringify({
                error: { statusCode: 500, message: "Session is not defined" },
              }),
              { status: 500 }
            );
          }
        }
      }
      let session;
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "required",
        customer,
        customer_update: {
          address: "auto",
        },
        line_items: data.arg.cartItems,

        mode: "payment",
        allow_promotion_codes: false,
        payment_intent_data: {
          setup_future_usage: "off_session",
        },
        success_url: `${getURL()}/adminHome`,
        cancel_url: `${getURL()}/adminHome`,
      });

      if (session) {
        revalidatePath("/adminHome");
        revalidatePath("/transactions");
        console.log("we not seeing anything");
        console.log(session.id);
        return new Response(JSON.stringify({ sessionId: session.id }), {
          status: 200,
        });
      } else {
        console.log("error");
        return new Response(
          JSON.stringify({
            error: { statusCode: 500, message: "Session is not defined" },
          }),
          { status: 500 }
        );
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
