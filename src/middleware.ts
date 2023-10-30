import { authMiddleware } from "@clerk/nextjs/server";

const publicRoutes = [
  "/api(.*)",
  "/info(.*)",
  "/proxy(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
];

export default authMiddleware({ publicRoutes });

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
