import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isProtectedRoute = createRouteMatcher(['/Myappointements(.*)', '/appointments(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Allow access to home, about, and contact pages without sign-in
  if (["/", "/about", "/contact"].includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }
  // Protect specific routes
  if (isProtectedRoute(req) && !userId) {
    const url = new URL("/sign-in", req.url);
    return NextResponse.redirect(url);
  }

  // Protect all routes starting with `/admin`
  if (
    isAdminRoute(req) &&
    (await auth()).sessionClaims?.metadata?.role !== "admin"
  ) {
    const url = new URL("/sign-in", req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
