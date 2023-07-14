"use server";

import { number, z } from "zod";
import { zact } from "zact/server";

import { db } from "../../db/index";
import { members } from "../../db/schema/members";
import { eq, sql } from "drizzle-orm";

import { createOrRetrieveCustomer } from "../../../utils/dbHelper";

export async function validatedAction(formdata: FormData) {
  console.log(formdata.get("userId"));
  console.log(formdata.get("newTagCode"));

  const id: number = +(formdata.get("userId") || 0);
  const oldCode = await db
    .select({ realScanId: members.realScanId })
    .from(members)
    .where(eq(members.id, id));
  console.log(oldCode[0].realScanId);

  //   const newCode: string = (String(formdata.get("newTagCode")) || " ").concat(
  //     oldCode[0].realScanId
  //   );

  const newCode: string = oldCode[0].realScanId.concat(
    String(formdata.get("newTagCode")) || " "
  );
  await db
    .update(members)
    .set({
      realScanId: newCode,
    })
    .where(eq(members.id, id))
    .then(() => {
      console.log("updated tag");
      formdata.delete("newTagCode");
    })
    .catch((err) => {
      console.log(err);
      return { message: `error updating tag` };
    });
  //   await db.execute(
  //     sql`UPDATE ${members} SET ${members.realScanId} = CONCAT(${
  //       members.realScanId
  //     }, ${formdata.get("newTagCode")}) WHERE ${members.userId} = ${formdata.get(
  //       "newTagCode"
  //     )};`
  //   );

  return { message: `successfully updated tag` };
}

// export const validatedAction = zact(
//     z.object({
//       userId: z.string().min(2),
//       newTagCode: z.string().min(2),
//     })
//   )(async (input) => {
//     console.log("[SERVER]: Received input", input);

//       await db
//         .update(members)
//         .set({
//           realScanId: input.newTagCode,
//         })
//         .where(eq(members.userId, input.userId))
//         .catch((err) => {
//           console.log(err);
//           return { message: `error updating tag` };
//         });
//     await db.execute(
//       sql`UPDATE ${members} SET ${members.realScanId} = CONCAT(${members.realScanId}, ${input.newTagCode}) WHERE ${members.userId} = ${input.userId};`
//     );

//     return { message: `successfully updated tag` };
//   });
