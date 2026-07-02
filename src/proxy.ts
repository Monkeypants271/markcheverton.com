import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/admin-session";

const ADMIN_COOKIE = "mc_admin_session";

// Renamed from `middleware` — the middleware convention is deprecated in
// Next.js 16 and replaced by `proxy`.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public admin routes: the login/recovery flow must be reachable while signed out.
  if (
    !pathname.startsWith("/admin") ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/forgot") ||
    pathname.startsWith("/admin/magic")
  ) {
    return NextResponse.next();
  }

  const ok = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
