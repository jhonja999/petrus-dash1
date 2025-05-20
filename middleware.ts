import { authMiddleware, clerkClient } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export default authMiddleware({
  // Rutas públicas que no requieren autenticación
  publicRoutes: ["/", "/api/webhook", "/auth/login"],

  async afterAuth(auth, req) {
    // Si el usuario no está autenticado y la ruta no es pública, redirigir a login
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    // Si el usuario está autenticado, verificar su rol
    if (auth.userId) {
      const user = await clerkClient.users.getUser(auth.userId)
      const role = user.publicMetadata.role as string

      // Ruta de admin pero el usuario no es admin
      if (req.nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/conductor/dashboard", req.url))
      }

      // Ruta de conductor pero el usuario es admin
      if (req.nextUrl.pathname.startsWith("/conductor") && role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url))
      }

      // Si el usuario está autenticado pero está en la página de login, redirigir según su rol
      if (req.nextUrl.pathname === "/auth/login") {
        if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        } else {
          return NextResponse.redirect(new URL("/conductor/dashboard", req.url))
        }
      }
    }

    return NextResponse.next()
  },
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
