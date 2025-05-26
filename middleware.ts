import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

interface SessionClaims {
  metadata?: {
    role?: string;
  };
}

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/settings(.*)','/dashboard(.*)',]);
const isConductorRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/driver(.*)',
  '/trucks(.*)',
  '/customers(.*)',
  '/assignment(.*)',
  '/discharges(.*)',
  '/reports(.*)',
  '/users(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // 🔒 Prevención de null
  const role = sessionClaims?.metadata?.role;

  // 🔓 Si no hay sesión o no hay rol, continuar
  if (!userId || !role) {
    return NextResponse.next();
  }

  // 🔐 Protege rutas de admin
  if (isAdminRoute(req)) {
    if (role !== 'admin') {
      const url = new URL('/unauthorized', req.url);
      return NextResponse.redirect(url);
    }
  }

  // 🔐 Protege rutas de conductor
  if (isConductorRoute(req)) {
    if (role !== 'admin' && role !== 'conductor') {
      const url = new URL('/unauthorized', req.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
