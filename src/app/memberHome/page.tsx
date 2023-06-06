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

  const user = await currentUser();

  const isRegistered = await db.query.members.findFirst({
    where: eq(members.userId, userId!),
  });

  const isAdmin = await db.query.members.findFirst({
    where: eq(members.isAdmin, true),
  });
  if (!isRegistered) {
    redirect("/register");
  }

  return (
    <>
      <UserButton afterSignOutUrl="/" />
      <div>User Id: {!!userId}</div>
      <div>You are member gang {user?.firstName}</div>
      <div>
        hello
        {isRegistered == null ? <div>is null</div> : <div>real user</div>}
      </div>
      <div>
        <Image
          src={isRegistered.qrCodeUrl}
          alt="QR Code to check in"
          width={300}
          height={300}
        />
      </div>
      {isAdmin ? <div>Admin</div> : <div>Not Admin</div>}
    </>
  );
}
