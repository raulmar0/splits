import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/env";

const PUBLIC_PATHS = ["/login", "/signup"];
const PUBLIC_PREFIXES = ["/api/strava/webhook", "/api/strava/callback", "/_next", "/favicon"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const hasSession = req.cookies.get(SESSION_COOKIE)?.value;
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (!hasSession && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  if (hasSession && isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
