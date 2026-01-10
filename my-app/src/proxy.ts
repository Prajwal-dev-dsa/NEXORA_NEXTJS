import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoutes = [
    "/login",
    "/register",
    "/api/auth/*",
    "/favicon.ico",
    "/_next/static/*",
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const session = await auth();
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/user") && session.user?.role !== "user") {
    return NextResponse.redirect(new URL("unauthorized", request.url));
  }

  if (pathname.startsWith("/admin") && session.user?.role !== "admin") {
    return NextResponse.redirect(new URL("unauthorized", request.url));
  }

  if (pathname.startsWith("/vendor") && session.user?.role !== "vendor") {
    return NextResponse.redirect(new URL("unauthorized", request.url));
  }

  if (
    pathname.startsWith("/delivery") &&
    session.user?.role !== "deliveryGuy"
  ) {
    return NextResponse.redirect(new URL("unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
