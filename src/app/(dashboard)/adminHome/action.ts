"use server";

import { db } from "../../../server/db/index";
import { members } from "../../../server/db/schema/members";
import { eq } from "drizzle-orm";

import { revalidatePath } from "next/cache";

export async function validatedAction(formdata: FormData) {
  console.log(formdata.get("userId"));
  console.log(formdata.get("newTagCode"));

  const id: number = +(formdata.get("userId") ?? 0);
  const oldCode = await db
    .select({ realScanId: members.realScanId })
    .from(members)
    .where(eq(members.id, id));
  console.log(oldCode[0]!.realScanId);

  const newCode: string = oldCode[0]!.realScanId.concat(
    String(formdata.get("newTagCode")) || " "
  );
  await db
    .update(members)
    .set({
      realScanId: newCode,
    })
    .where(eq(members.id, id))
    .then(() => {
      revalidatePath(`/adminHome`);
      console.log("updated tag");
      formdata.delete("newTagCode");
    })
    .catch((err) => {
      console.log(err);
      return { message: `error updating tag` };
    });

  return { message: `successfully updated tag` };
}
