import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define which routes should be PUBLIC (no login required)
const isPublicRoute = createRouteMatcher([
  '/', 
  '/api/webhooks/clerk', 
  '/api/webhooks/stripe',
  '/sign-in(.*)', 
  '/sign-up(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. If the route is NOT public, force authentication
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};