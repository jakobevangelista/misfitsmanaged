import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { db } from "../../db/index";
import { eq } from "drizzle-orm";
import { members } from "@/db/schema/members";
import { redirect } from "next/navigation";

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
      <div className="flex flex-col">
        <div className="mx-auto">
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className="mx-auto">User Id: {userId}</div>
        <div className="mx-auto">You are member gang {user.name}</div>
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
        {user.isAdmin ? (
          <div className="mx-auto">Admin</div>
        ) : (
          <div className="mx-auto">Not Admin</div>
        )}
      </div>
    </>
  );
}
