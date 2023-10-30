import { stripe } from "../../../../utils/stripe";
import { getURL } from "../../../../utils/helpers";
import { createOrRetrieveCustomer } from "../../../../utils/dbHelper";
import { currentUser } from "@clerk/nextjs";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response(
      JSON.stringify({
        error: { statusCode: 500, message: "User is not defined" },
      }),
      { status: 500 }
    );
  }

  if (req.method === "POST") {
    try {
      const customer = await createOrRetrieveCustomer({
        userId: user.id,
        email: user.emailAddresses[0]!.emailAddress,
        name: `${user.firstName} ${user.lastName}`,
      });

      if (!customer) throw Error("Could not get customer");
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getURL()}/memberHome`, // might be bad
      });
      return new Response(JSON.stringify({ url }), {
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return new Response(JSON.stringify({ error: { statusCode: 500 } }), {
        status: 500,
      });
    }
  } else {
    return new Response("Method Not Allowed", {
      headers: { Allow: "POST" },
      status: 405,
    });
  }
}
