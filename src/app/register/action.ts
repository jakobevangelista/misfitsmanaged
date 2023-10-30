"use server";

import { z } from "zod";
import { zact } from "zact/server";

import { db } from "../../server/db/index";
import { members } from "../../server/db/schema/members";
import { createOrRetrieveCustomer } from "../../../utils/dbHelper";
import { revalidatePath, revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { stripe } from "../../../utils/stripe";

export const validatedAction = zact(
  z.object({
    username: z.string().min(2),
    waiverAccept: z.literal<boolean>(true),
    emailAddress: z.string().email(),
    qrCode: z.string().min(1),
    userId: z.string().min(1),
    waiverSignature: z.string().min(1),
    waiverSignDate: z.string().min(1),
    parentName: z.string().min(1).optional(),
    parentSignature: z.string().min(1).optional(),
    minorDOB: z.string().optional(),
  })
)(async (input) => {
  console.log("[SERVER]: Received input", input);
  const customer = await db.query.members.findFirst({
    where: eq(members.emailAddress, input.emailAddress),
  });
  if (customer) {
    await db
      .update(members)
      .set({
        userId: input.userId,
        name: input.username,
        qrCodeUrl: input.qrCode,
        isWaiverSigned: input.waiverAccept,
        waiverSignature: input.waiverSignature,
        waiverSignDate: input.waiverSignDate,
        realScanId: input.userId,
        parentName: input.parentName,
        parentSignature: input.parentSignature,
        minorDOB: input.minorDOB,
      })
      .where(eq(members.emailAddress, input.emailAddress))
      .then(async () => {
        revalidatePath(`/adminHome`);

        await createOrRetrieveCustomer({
          userId: input.userId,
          email: input.emailAddress,
          name: input.username,
        }).catch((err) => {
          console.log(err);
          return { message: `error creating customer` };
        });
        return { message: `successfully inserted member` };
      });
    return { message: `email already exists` };
  }

  await db
    .insert(members)
    .values({
      userId: input.userId,
      name: input.username,
      qrCodeUrl: input.qrCode,
      emailAddress: input.emailAddress,
      isWaiverSigned: input.waiverAccept,
      waiverSignature: input.waiverSignature,
      waiverSignDate: input.waiverSignDate,
      realScanId: input.userId,
      parentName: input.parentName,
      parentSignature: input.parentSignature,
      minorDOB: input.minorDOB,
    })
    .then(async () => {
      await stripe.customers.create({ email: input.emailAddress });
      // await createOrRetrieveCustomer({
      //   userId: input.userId,
      //   email: input.emailAddress,
      //   name: input.username,
      // }).catch((err) => {
      //   console.log(err);
      //   return { message: `error creating customer` };
      // });
      revalidatePath(`/adminHome`);
      return { message: `successfully inserted member` };
    })
    .catch((err) => {
      console.log(err);
      return { message: `error inserting member` };
    });

  revalidateTag("/adminHome");
  return { message: `successfully registered` };
});
