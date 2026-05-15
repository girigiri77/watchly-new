import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/admin/login")) {
    const secret = process.env.ADMIN_SESSION_SECRET
    if (secret) {
      const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
      if (await verifySessionToken(secret, token)) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    }
    return NextResponse.next()
  }

  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("misconfigured", "1")
    return NextResponse.redirect(url)
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const ok = await verifySessionToken(secret, token)
  if (!ok) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
