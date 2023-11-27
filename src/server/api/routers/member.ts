import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { members } from "@/server/db/schema/members";
import { eq } from "drizzle-orm";

import QRCode from "qrcode";
import { createOrRetrieveCustomer } from "utils/dbHelper";
import { stripe } from "utils/stripe";

export const memberRouter = createTRPCRouter({
  register: protectedProcedure
    .input(
      z.object({
        username: z.string().min(2),
        waiverAccept: z.literal<boolean>(true),
        emailAddress: z.string().email(),
        userId: z.string().min(1),
        waiverSignature: z.string().min(1),
        waiverSignDate: z.string().min(1),
        parentName: z.string().min(1).optional(),
        parentSignature: z.string().min(1).optional(),
        parentDOB: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db.query.members.findFirst({
        where: eq(members.emailAddress, input.emailAddress),
      });

      const customCode = await QRCode.toDataURL(input.userId, {
        errorCorrectionLevel: "H",
      });

      if (customer) {
        await ctx.db
          .update(members)
          .set({
            userId: input.userId,
            name: input.username,
            qrCodeUrl: customCode,
            isWaiverSigned: input.waiverAccept,
            waiverSignature: input.waiverSignature,
            waiverSignDate: input.waiverSignDate,
            realScanId: input.userId,
            parentName: input.parentName,
            parentSignature: input.parentSignature,
            parentDOB: input.parentDOB,
          })
          .where(eq(members.emailAddress, input.emailAddress))
          .then(async () => {
            await createOrRetrieveCustomer({
              email: input.emailAddress,
            }).catch((err) => {
              console.log(err);
              return { message: `error creating customer` };
            });
            return { message: `successfully inserted member` };
          });
        return { message: `email already exists` };
      }
      await ctx.db
        .insert(members)
        .values({
          userId: input.userId,
          name: input.username,
          qrCodeUrl: customCode,
          emailAddress: input.emailAddress,
          isWaiverSigned: input.waiverAccept,
          waiverSignature: input.waiverSignature,
          waiverSignDate: input.waiverSignDate,
          realScanId: input.userId,
          parentName: input.parentName,
          parentSignature: input.parentSignature,
          parentDOB: input.parentDOB,
        })
        .then(async () => {
          // await stripe.customers.create({ email: input.emailAddress });
          await createOrRetrieveCustomer({
            email: input.emailAddress,
          }).catch((err) => {
            console.log(err);
            return { message: `error creating customer` };
          });
          return { message: `successfully inserted member` };
        })
        .catch((err) => {
          console.log(err);
          return { message: `error inserting member` };
        });

      return { message: `successfully registered` };
    }),
});
