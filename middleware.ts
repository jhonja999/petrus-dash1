import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

interface SessionClaims {
  metadata?: {
    role?: string;
  };
}

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/settings(.*)']);
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
  const claims = sessionClaims as SessionClaims;
  const userRole = claims.metadata?.role;

  if (!userId) {
    return NextResponse.next();
  }

  if (isAdminRoute(req)) {
    if (userRole !== 'admin') {
      const url = new URL('/unauthorized', req.url);
      return NextResponse.redirect(url);
    }
  }

  if (isConductorRoute(req)) {
    if (userRole !== 'admin' && userRole !== 'conductor') {
      const url = new URL('/unauthorized', req.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
