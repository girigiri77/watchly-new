import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session"
import { randomBytes } from "crypto"
import { mkdir, writeFile } from "fs/promises"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import path from "path"

export const runtime = "nodejs"

const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

const extByMime: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
}

function slugFromInput(raw: string): string {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
  return s || "movie"
}

export async function POST(request: Request) {
  const secret = process.env.ADMIN_SESSION_SECRET
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!secret || !(await verifySessionToken(secret, token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
  }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 })
  }

  const mime = file.type || ""
  if (!ALLOWED_MIME.has(mime)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, or GIF images are allowed" }, { status: 400 })
  }

  const slug = slugFromInput(typeof formData.get("slug") === "string" ? (formData.get("slug") as string) : "")
  const kind = formData.get("kind") === "backdrop" ? "backdrop" : "poster"
  const ext = extByMime[mime] ?? ".bin"
  const unique = randomBytes(5).toString("hex")
  const filename = `${slug}-${kind}-${Date.now()}-${unique}${ext}`

  const uploadsDir = path.join(process.cwd(), "public", "uploads")
  await mkdir(uploadsDir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadsDir, filename), buffer)

  const publicPath = `/uploads/${filename}`
  return NextResponse.json({ path: publicPath })
}
