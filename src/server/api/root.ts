import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { memberRouter } from "./routers/member";
import { adminRouter } from "./routers/admin";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  member: memberRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
