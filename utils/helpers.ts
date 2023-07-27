import { z } from "zod";

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: { data: string; id: number };
}) => {
  console.log("posting,", url);

  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    mode: "no-cors",
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("Error in postData", { url, res });

    throw Error(res.statusText);
  }

  return res.json();
};

// export const checkoutPost = async ({
//   data
// }: {
//   data: z.object({
//     cartItems: z
//       .array(
//         z.object({
//           name: z.string().min(1),
//         })
//       )
//       .nonempty(),
//   })
// }) => {
//   console.log("posting,", url);

//   const res = await fetch(url, {
//     method: "POST",
//     headers: new Headers({ "Content-Type": "application/json" }),
//     credentials: "same-origin",
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     console.log("Error in postData", { url, res });

//     throw Error(res.statusText);
//   }

//   return res.json();
// };
export const customCheckoutPost = z
  .function()
  .args(
    z.object({
      cartItems: z
        .array(
          z.object({
            price: z.string().min(1),
            quantity: z.literal(1),
          })
        )
        .nonempty(),
    }),
    z.string(),
    z.string()
  )
  .implement(async (arg, email, url) => {
    // console.log(console.log(JSON.stringify({ arg, email })));
    // console.log(console.log(arg.cartItems));
    const res = await fetch(url, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ arg, email }),
    });

    console.log(res);

    if (!res.ok) {
      console.log("Error in customCheckoutPost", { url, res });
      console.log(res);

      throw Error(res.statusText);
    }
    return res.json();
  });
