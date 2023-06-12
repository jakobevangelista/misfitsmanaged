import { stripe } from "../../../../utils/stripe";
import { getURL } from "../../../../utils/helpers";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const { data } = await req.json();
    try {
      if (data === "month") {
        let session;
        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          billing_address_collection: "required",
          line_items: [
            {
              price: "price_1NB9e8JfUfWpyMyySn584xXA",
              quantity: 1,
            },
          ],

          mode: "subscription",
          allow_promotion_codes: true,
          success_url: `${getURL()}/adminHome`,
          cancel_url: `${getURL()}/adminHome`,
        });

        if (session) {
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
      } else if (data === "water") {
        let session;
        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          billing_address_collection: "required",
          line_items: [
            {
              price: "price_1NB9geJfUfWpyMyy9FOo7rbp",
              quantity: 1,
            },
          ],

          mode: "payment",
          allow_promotion_codes: true,
          success_url: `${getURL()}/adminHome`,
          cancel_url: `${getURL()}/adminHome`,
        });

        if (session) {
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
      } else if (data === "daypass") {
        let session;
        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          billing_address_collection: "required",
          line_items: [
            {
              price: "price_1NB9dfJfUfWpyMyy5QkdLiyP",
              quantity: 1,
            },
          ],

          mode: "payment",
          allow_promotion_codes: true,
          success_url: `${getURL()}/adminHome`,
          cancel_url: `${getURL()}/adminHome`,
        });

        if (session) {
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
