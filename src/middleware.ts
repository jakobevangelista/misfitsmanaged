import { authMiddleware } from "@clerk/nextjs/server";

const publicRoutes = ["/api(.*)", "/info(.*)", "/proxy(.*)"];

export default authMiddleware({ publicRoutes });

export const config = {
  // matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public folder
     */
    // "/((?!static|.*\\..*|_next|favicon.ico).*)",
    // "/",
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
