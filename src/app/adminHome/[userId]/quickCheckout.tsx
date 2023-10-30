"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { members } from "@/server/db/schema/members";
import { eq } from "drizzle-orm";
import { useAuth } from "@clerk/nextjs";
import { get } from "http";
import { postData } from "../../../../utils/helpers";
import { getStripe } from "../../../../utils/stripe-client";

export default function QuickCheckout(props: { userId: string }) {
  const { userId } = useAuth();
  const memberId: number = +props.userId;
  console.log(memberId);

  const handleCheckout = async (data: string) => {
    try {
      console.log("hanndle checkout");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { data: data, id: memberId },
      });
      const stripe = await getStripe();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    }
  };
  return (
    <>
      <div className="mx-auto">
        <div className="flex flex-row">
          <Button
            variant="outline"
            onClick={() => handleCheckout("daypass")}
            className="flex-grow"
          >
            Charge Day Pass
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleCheckout("month")}
            className="flex-grow"
          >
            Charge Month to Month
          </Button>
          <Button
            variant="outline"
            onClick={() => handleCheckout("water")}
            className="flex-grow"
          >
            Charge Water
          </Button>
        </div>
      </div>
    </>
  );
}
