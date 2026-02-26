import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedRoutes =
    pathname === "/" ||
    pathname.startsWith("/progress") ||
    pathname.startsWith("/study") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/profile");

  if (!protectedRoutes) return NextResponse.next();

  const hasAuthCookie =
    req.cookies.get("sb-access-token") ||
    req.cookies.get("sb-refresh-token") ||
    req.cookies.getAll().some((c) => c.name.startsWith("sb-"));

  if (!hasAuthCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/progress/:path*", "/study/:path*", "/community/:path*", "/profile/:path*"],
};
