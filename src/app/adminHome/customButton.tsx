"use client"

import { Button } from "@/components/ui/button"
import { getURL, postData } from "../../../utils/helpers"
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import { getStripe } from "../../../utils/stripe-client";
import { stripe } from "../../../utils/stripe";


export default function CustomButton() {
    async function handleOnclick() {
        try {
            const { sessionId } = await postData({
                url: "/api/create-checkout-session",
                data: { data: 'deeznuts', id: 8 },
            });
            const stripe = await getStripe();
            stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            return alert((error as Error)?.message);
        }
    }
    return (<>
        <Button variant="red" className="mx-auto my-4" onClick={handleOnclick} >
            Quick Charge Day Pass
            {/* <a href="https://buy.stripe.com/8wM7vufo3eSs11u28l">Charge Day Pass</a> */}
        </Button>
    </>);
}