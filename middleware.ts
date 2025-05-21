import { authMiddleware, clerkClient } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export default authMiddleware({
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)"],
  async afterAuth(auth, req) {
    // If the user is authenticated but trying to access sign-in/sign-up, redirect them
    if (auth.userId && (req.nextUrl.pathname.startsWith("/sign-in") || req.nextUrl.pathname.startsWith("/sign-up"))) {
      const user = await clerkClient.users.getUser(auth.userId)
      const role = (user.publicMetadata.role as string) || "conductor"

      if (role === "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      } else {
        return NextResponse.redirect(new URL("/driver", req.url))
      }
    }

    // If the user is not authenticated and trying to access protected routes
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    // Role-based access control
    if (auth.userId) {
      const user = await clerkClient.users.getUser(auth.userId)
      const role = (user.publicMetadata.role as string) || "conductor"

      // Admin routes protection
      if (req.nextUrl.pathname.startsWith("/dashboard") && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }

      // Driver routes protection
      if (req.nextUrl.pathname.startsWith("/driver") && role !== "conductor") {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
    }

    return NextResponse.next()
  },
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
