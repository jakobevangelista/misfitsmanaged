import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { members } from "@/server/db/schema/members";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const adminRouter = createTRPCRouter({
  updateTag: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        newTagCode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const oldCode = await ctx.db.query.members.findFirst({
        where: eq(members.id, input.userId),
      });
      if (!oldCode) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const newCode = oldCode.realScanId.concat(input.newTagCode);
      await ctx.db
        .update(members)
        .set({
          realScanId: newCode,
        })
        .where(eq(members.id, input.userId));

      return { message: `successfully updated tag` };
    }),
});
