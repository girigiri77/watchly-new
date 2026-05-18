import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session"
import { randomBytes } from "crypto"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

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

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("posters")
      .upload(filename, buffer, {
        contentType: mime,
        upsert: true,
      })

    if (uploadError) {
      console.error("Supabase Storage Upload Error:", uploadError)
      return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from("posters")
      .getPublicUrl(filename)

    return NextResponse.json({ path: publicUrl })
  } catch (err: any) {
    console.error("Upload error caught:", err)
    return NextResponse.json({ error: err.message || "Internal server error during upload" }, { status: 500 })
  }
}
