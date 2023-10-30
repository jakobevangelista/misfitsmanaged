"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getURL, postData } from "../../../utils/helpers";
import { redirect } from "next/navigation";
import { getStripe } from "../../../utils/stripe-client";
import { stripe } from "../../../utils/stripe";

export default function CustomButton() {
  const router = useRouter();
  function handleOnclick() {
    // try {
    //     const { sessionId } = await postData({
    //         url: "/api/create-checkout-session",
    //         data: { data: 'deeznuts', id: 8 },
    //     });
    //     const stripe = await getStripe();
    //     stripe?.redirectToCheckout({ sessionId });
    // } catch (error) {
    //     return alert((error as Error)?.message);
    // }
    router.refresh();
  }
  return (
    <>
      <Button variant="red" className="mx-auto my-4" onClick={handleOnclick}>
        Click After New User Signs Up
      </Button>
    </>
  );
}
