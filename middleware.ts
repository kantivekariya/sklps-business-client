import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Middleware runs on the edge - JWT in localStorage is not accessible here.
// Auth protection is handled client-side via PrivateRoute component.
// This middleware can be extended for cookie-based auth or other checks.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static files and API routes
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
