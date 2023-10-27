import { db } from "../../db/index";
import { members } from "../../db/schema/members";
import { UserButton, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import RegisterForm from "./RegisterForm";

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const isRegistered = await db.query.members.findFirst({
    where: eq(members.userId, user.emailAddresses[0].emailAddress),
  });

  if (isRegistered) {
    redirect("/memberHome");
  }

  const customCode: string = await QRCode.toDataURL(user.id, {
    errorCorrectionLevel: "H",
  });

  return (
    <>
      <UserButton afterSignOutUrl="/" />
      <RegisterForm qrCode={customCode} userId={user.id} />
    </>
  );
}
