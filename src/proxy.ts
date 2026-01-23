import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
export { auth } from "@/auth"
import { getToken } from 'next-auth/jwt'
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  
  const token = await getToken({req:request,secret:process.env.AUTH_SECRET})
  const url = request.nextUrl;
  const path = url.pathname;  


  if(token && (path==='/sign-up' || path==='/sign-in' || path.includes('/verify'))){
    return NextResponse.redirect(new URL("/dashboard",request.url));
  }

  if(!token && (path=="/dashboard")){
    return NextResponse.redirect(new URL("/sign-in",request.url));
  }
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: ['/sign-in','/sign-up','/','/dashboard/:path*','/verify/:path*'],
}