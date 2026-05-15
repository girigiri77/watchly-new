import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session"
import { cookies } from "next/headers"

export async function requireAdminSession(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return false
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value
  return verifySessionToken(secret, token)
}
