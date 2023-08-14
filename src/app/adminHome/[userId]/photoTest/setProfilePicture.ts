"use server";

import { db } from "@/db";
import { members } from "@/db/schema/members";
import { eq } from "drizzle-orm";

export async function setProfilePicture(
  userId: number,
  profilePicture: string
) {
  console.log(userId);
  console.log(profilePicture);
  await db
    .update(members)
    .set({ profilePicture: profilePicture })
    .where(eq(members.id, userId));
}
