import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  if (nextUrl.pathname.startsWith("/admin")) {
    if (nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = req.cookies.get("admin_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    const session = await verifySession(token);
    if (!session) {
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.set("admin_session", "", { maxAge: 0, path: "/" });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
);
