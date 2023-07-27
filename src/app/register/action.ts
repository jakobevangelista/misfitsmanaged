"use server";

import { z } from "zod";
import { zact } from "zact/server";

import { db } from "../../db/index";
import { members } from "../../db/schema/members";
import { createOrRetrieveCustomer } from "../../../utils/dbHelper";
import { revalidateTag } from "next/cache";

export const validatedAction = zact(
  z.object({
    username: z.string().min(2),
    waiverAccept: z.literal<boolean>(true),
    emailAddress: z.string().min(1),
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
    .catch((err) => {
      console.log(err);
      return { message: `error inserting member` };
    });

  await createOrRetrieveCustomer({
    userId: input.userId,
    email: input.emailAddress,
    name: input.username,
  }).catch((err) => {
    console.log(err);
    return { message: `error creating customer` };
  });
  revalidateTag('/adminHome')
  return { message: `successfully registered` };
});
