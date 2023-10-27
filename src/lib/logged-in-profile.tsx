import { db } from "@/db";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { members } from "@/db/schema/members";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const getLoggedInUser = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.query.members.findFirst({
    where: eq(members.emailAddress, user.emailAddresses[0].emailAddress),
  });

  if (!profile) {
    return redirect("/register");
  }

  return profile;
};
