"use server";

import { z } from "zod";
import { zact } from "zact/server";

import { db } from "../../db/index";
import { members } from "../../db/schema/members";
import { createOrRetrieveCustomer } from "../../../utils/dbHelper";

export const validatedAction = zact(
  z.object({
    username: z.string().min(2),
    waiverAccept: z.literal<boolean>(true),
    emailAddress: z.string().min(1),
    qrCode: z.string().min(1),
    userId: z.string().min(1),
    waiverSignature: z.string().min(1),
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
  return { message: `successfully registered` };
});
