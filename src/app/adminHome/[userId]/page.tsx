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
import { postData } from "../../../../utils/helpers";
import { getStripe } from "../../../../utils/stripe-client";

export default async function Page({ params }: { params: { userId: string } }) {
  const { userId } = useAuth();
  const memberId: number = +params.userId;
  console.log("dsfa");

  const checkAdmin = await db.query.members.findFirst({
    where: eq(members.userId, userId!),
    columns: {
      isAdmin: true,
    },
  });

  if (checkAdmin?.isAdmin === false) {
    redirect("/memberHome");
  }

  const getMember = await db.query.members.findFirst({
    where: eq(members.id, memberId!),
  });

  if (!getMember) {
    // redirect("/adminHome");
    console.log("does not exist");
  }
  const handleCheckout = async (data: string) => {
    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { data },
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
