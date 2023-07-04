import { db } from "../../db/index";
import { members } from "../../db/schema/members";
import { UserButton, auth, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import RegisterForm from "./RegisterForm";

export default async function Page() {
  const { userId } = auth();
  const user = await currentUser();

  const isRegistered = await db.query.members.findFirst({
    where: eq(members.userId, userId!),
  });

  // if (isRegistered) {
  //   redirect("/memberHome");
  // }

  const customCode: string | null = await QRCode.toDataURL(userId!, {
    errorCorrectionLevel: "H",
  });

  return (
    <>
      <UserButton afterSignOutUrl="/" />
      <div>{userId}</div>
      <RegisterForm
        qrCode={customCode}
        userId={userId!}
        emailAddress={user!.emailAddresses[0].emailAddress}
      />
    </>
  );
}
