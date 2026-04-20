import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
  const url = request.nextUrl;
  const path = url.pathname;

  const isAuthRoute = path === '/sign-in' || path === '/sign-up';
  const isVerifyRoute = path.startsWith('/verify');
  const isProtectedRoute =
    path.startsWith('/dashboard') || path.startsWith('/profile');

  // Signed-in users should not revisit auth/verification screens.
  if (token && (isAuthRoute || isVerifyRoute)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Guests cannot access authenticated pages.
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Everyone can access landing page and other public routes.
  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard',
    '/dashboard/:path*',
    '/profile',
    '/profile/:path*',
    '/verify/:path*',
  ],
}