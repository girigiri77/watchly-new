/** HttpOnly cookie name for admin session (set by `/api/admin/login`). */
export const ADMIN_SESSION_COOKIE = "cinema_admin_session"

const text = new TextEncoder()

export async function signSessionToken(secret: string, ttlMs: number): Promise<string> {
  const exp = Date.now() + ttlMs
  const sig = await hmacSha256Hex(secret, String(exp))
  return `${exp}.${sig}`
}

export async function verifySessionToken(secret: string, token: string | undefined): Promise<boolean> {
  if (!token || !secret) return false
  const dot = token.indexOf(".")
  if (dot <= 0) return false
  const expStr = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || Date.now() > exp) return false
  const expected = await hmacSha256Hex(secret, expStr)
  return timingSafeEqualHex(sig, expected)
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", text.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const buf = await crypto.subtle.sign("HMAC", key, text.encode(message))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    const ba = hexToBytes(a)
    const bb = hexToBytes(b)
    if (ba.length !== bb.length) return false
    let diff = 0
    for (let i = 0; i < ba.length; i++) diff |= ba[i]! ^ bb[i]!
    return diff === 0
  } catch {
    return false
  }
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

/** Constant-time-ish compare when lengths match (for password check in route handler). */
export function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}
