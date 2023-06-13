import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { db } from "../../db/index";
import { eq } from "drizzle-orm";
import { members } from "@/db/schema/members";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ManageAccountButton from "./ManageAccountButton";

export default async function Page() {
  const { userId } = auth();

  const user = await db.query.members.findFirst({
    where: eq(members.userId, userId!),
  });

  if (!user) {
    redirect("/register");
  }

  return (
    <>
      <div className="flex flex-col bg:[url('https://misfitsmanaged.vercel.app/croppedMisfitsLogo.png')]">
        <div className="flex justify-end">
          <UserButton afterSignOutUrl="/" />
        </div>
        {user == null ? (
          <div className="mx-auto">is null</div>
        ) : (
          <div className="mx-auto">real user</div>
        )}
        <div className="mx-auto">
          <Image
            src={user.qrCodeUrl}
            alt="QR Code to check in"
            width={300}
            height={300}
          />
        </div>
        <ManageAccountButton />
        {user.isAdmin ? (
          <Button className="mx-auto">
            <Link href="/adminHome">Admin</Link>
          </Button>
        ) : null}
      </div>
    </>
  );
}
