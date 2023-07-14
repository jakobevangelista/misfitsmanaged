"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { members } from "@/db/schema/members";
import { eq } from "drizzle-orm";
import { useAuth } from "@clerk/nextjs";
import { get } from "http";
import { postData } from "../../../utils/helpers";
import { getStripe } from "../../../utils/stripe-client";

// handle checkout does not work yet

export default async function Page({ params }: { params: { userId: string } }) {
  const { userId } = useAuth();
  const memberId: number = +params.userId;
  console.log(memberId);

  const checkAdmin = await db.query.members.findFirst({
    where: eq(members.userId, userId!),
    columns: {
      isAdmin: true,
    },
  });

  if (checkAdmin?.isAdmin !== true) {
    redirect("/memberHome");
  }

  const getMember = await db.query.members.findFirst({
    where: eq(members.id, memberId!),
  }); //|| { customerId: "cus_J0Z0Z0Z0Z0Z0Z0Z0" };

  //   if (!getMember) {
  //     redirect("/adminHome");
  //     console.log("does not exist");
  //   }
  const handleCheckout = async (data: string) => {
    try {
      // console.log(row.original.id);
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { data: data, id: memberId },
      });
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    }
  };
  return (
    <>
      <div className="flex flex-col">
        <div className="flex ml-10 mt-10">
          <Link
            href="/adminHome"
            className={buttonVariants({ variant: "creme" })}
          >
            <MoveLeft /> Go Back To Admin Home
          </Link>
        </div>
        <div className="mx-auto mt-10">User Page {getMember?.customerId}</div>
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
      </div>
    </>
  );
}
