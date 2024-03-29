/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { stripe } from "../../../../utils/stripe";
import { getURL } from "../../../../utils/helpers";
import { currentUser } from "@clerk/nextjs";
import { createOrRetrieveCustomer } from "../../../../utils/dbHelper";
import { revalidatePath } from "next/cache";
import { DateTime } from "luxon";

export async function POST(req: Request) {
  if (req.method === "POST") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      email: data.email,
    });

    try {
      for (const item of data.arg.cartItems) {
        if (
          item.price === "price_1NYRbKD5u1cDehOfapzIEhrJ" || // yearly membership
          item.price === "price_1NYRcWD5u1cDehOfiPRDAB3v" ||
          item.price === "price_1NYRbrD5u1cDehOfLWSsrUWc" ||
          item.price === "price_1NdRU4D5u1cDehOfQPQPLvIz" ||
          item.price === "price_1NjPG7D5u1cDehOf42qaFmXy" // corrupted saturday
        ) {
          if (item.price === "price_1NYRcWD5u1cDehOfiPRDAB3v") {
            const now = DateTime.now().setZone("America/Chicago");
            const startOfTheNextMonth = now
              .plus({ months: 1 })
              .startOf("month");

            const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              billing_address_collection: "auto",
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
          }
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            billing_address_collection: "auto",
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

      // for (let i = 0; i < data.arg.cartItems.length; i++) {
      //   if (
      //     data.arg.cartItems[i].price === "price_1NYRbKD5u1cDehOfapzIEhrJ" || // yearly membership
      //     data.arg.cartItems[i].price === "price_1NYRcWD5u1cDehOfiPRDAB3v" ||
      //     data.arg.cartItems[i].price === "price_1NYRbrD5u1cDehOfLWSsrUWc" ||
      //     data.arg.cartItems[i].price === "price_1NdRU4D5u1cDehOfQPQPLvIz" ||
      //     data.arg.cartItems[i].price === "price_1NjPG7D5u1cDehOf42qaFmXy" // corrupted saturday
      //   ) {
      //     if (
      //       data.arg.cartItems[i].price === "price_1NYRcWD5u1cDehOfiPRDAB3v"
      //     ) {
      //       const now = DateTime.now().setZone("America/Chicago");
      //       const startOfTheNextMonth = now
      //         .plus({ months: 1 })
      //         .startOf("month");

      //       let session;
      //       session = await stripe.checkout.sessions.create({
      //         payment_method_types: ["card"],
      //         billing_address_collection: "auto",
      //         customer,
      //         customer_update: {
      //           address: "auto",
      //         },
      //         line_items: data.arg.cartItems,

      //         mode: "subscription",
      //         allow_promotion_codes: true,
      //         // payment_intent_data: {
      //         //   setup_future_usage: "off_session",
      //         // },
      //         success_url: `${getURL()}/adminHome`,
      //         cancel_url: `${getURL()}/adminHome`,
      //         subscription_data: {
      //           billing_cycle_anchor: startOfTheNextMonth.toUnixInteger(),
      //         },
      //       });

      //       if (session) {
      //         revalidatePath("/adminHome");
      //         revalidatePath("/transactions");
      //         return new Response(JSON.stringify({ sessionId: session.id }), {
      //           status: 200,
      //         });
      //       } else {
      //         return new Response(
      //           JSON.stringify({
      //             error: { statusCode: 500, message: "Session is not defined" },
      //           }),
      //           { status: 500 }
      //         );
      //       }
      //     }
      //     let session;
      //     session = await stripe.checkout.sessions.create({
      //       payment_method_types: ["card"],
      //       billing_address_collection: "auto",
      //       customer,
      //       customer_update: {
      //         address: "auto",
      //       },
      //       line_items: data.arg.cartItems,

      //       mode: "subscription",
      //       allow_promotion_codes: true,
      //       // payment_intent_data: {
      //       //   setup_future_usage: "off_session",
      //       // },
      //       success_url: `${getURL()}/adminHome`,
      //       cancel_url: `${getURL()}/adminHome`,
      //     });

      //     if (session) {
      //       revalidatePath("/adminHome");
      //       revalidatePath("/transactions");
      //       console.log("we not seeing anything");
      //       console.log(session.id);
      //       return new Response(JSON.stringify({ sessionId: session.id }), {
      //         status: 200,
      //       });
      //     } else {
      //       console.log("error");
      //       return new Response(
      //         JSON.stringify({
      //           error: { statusCode: 500, message: "Session is not defined" },
      //         }),
      //         { status: 500 }
      //       );
      //     }
      //   }
      // }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "auto",
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
