import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const path = request.nextUrl.pathname;

  const isAuthenticated = Boolean(request.auth);
  const isAuthRoute = path === "/sign-in" || path === "/sign-up";
  const isVerifyRoute = path.startsWith("/verify");
  const isProtectedRoute = path.startsWith("/dashboard");

  if (isAuthenticated && (isAuthRoute || isVerifyRoute)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/dashboard",
    "/dashboard/:path*",
    "/verify/:path*",
  ],
}
