import { buttonVariants } from "@/components/ui/button";
import { members } from "@/server/db/schema/members";
import { cn } from "@/lib/utils";
import { UserButton, auth, currentUser, redirectToSignIn } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "../../../server/db/index";
import ManageAccountButton from "./ManageAccountButton";
export const runtime = "edge";
export default async function Page() {
  const loggedInUser = await currentUser();

  if (!loggedInUser?.emailAddresses[0]) {
    redirect("/sign-in");
  }
  console.log(loggedInUser.emailAddresses[0].emailAddress);

  const user = await db.query.members.findFirst({
    where: eq(
      members.emailAddress,
      loggedInUser.emailAddresses[0].emailAddress
    ),
    columns: {
      isWaiverSigned: true,
      qrCodeUrl: true,
      isAdmin: true,
    },
  });

  if (!user || user.isWaiverSigned !== true) {
    redirect("/register");
  }

  return (
    <>
      <div className="flex flex-col bg:[url('https://misfitsmanaged.vercel.app/croppedMisfitsLogo.png')]">
        <div className="flex text-[#EFE1B2] text-3xl md:text-9xl text-center font-sans font-black mx-auto">
          Welcome Misfits!
        </div>
        <div className="mx-auto mb-4">
          <Image
            src={user.qrCodeUrl}
            alt="QR Code to check in"
            width={300}
            height={300}
          />
        </div>
        <ManageAccountButton />
      </div>
    </>
  );
}
