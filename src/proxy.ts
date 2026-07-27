import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

const LOGIN_PATH = "/login";
const DEFAULT_APP_PATH = "/user-management";

export function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.has(SESSION_COOKIE);
  const { pathname } = request.nextUrl;
  const isLoginPath = pathname === LOGIN_PATH;

  if (!isAuthenticated && !isLoginPath) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isLoginPath) {
    const appUrl = new URL(DEFAULT_APP_PATH, request.url);
    return NextResponse.redirect(appUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
