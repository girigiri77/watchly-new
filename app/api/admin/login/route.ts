import { ADMIN_SESSION_COOKIE, signSessionToken, timingSafeStringEqual } from "@/lib/admin-session"
import { NextResponse } from "next/server"

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

export async function POST(request: Request) {
  const password = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_SESSION_SECRET

  if (!password || !secret) {
    return NextResponse.json(
      { error: "Server is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in .env.local." },
      { status: 503 },
    )
  }

  let body: { password?: string }
  try {
    body = (await request.json()) as { password?: string }
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const given = typeof body.password === "string" ? body.password : ""
  if (!timingSafeStringEqual(given, password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const token = await signSessionToken(secret, SESSION_TTL_MS)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  })
  return res
}
