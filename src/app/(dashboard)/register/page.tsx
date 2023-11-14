import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "../../../server/db/index";
import { members } from "../../../server/db/schema/members";
import RegisterForm from "./RegisterForm";

export default async function Page() {
  const user = await currentUser();

  if (user?.emailAddresses[0] === undefined) {
    redirect("/sign-in");
  }

  const isRegistered = await db.query.members.findFirst({
    where: eq(members.emailAddress, user.emailAddresses[0].emailAddress),
  });

  if (isRegistered) {
    redirect("/memberHome");
  }

  return (
    <>
      <RegisterForm userId={user.id} />
    </>
  );
}
