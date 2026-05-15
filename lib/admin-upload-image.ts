/**
 * Client helper: POST multipart to local disk (`public/uploads`).
 * For production, replace the route implementation to stream to Supabase / Cloudinary / S3 — this API stays the same.
 */
export async function uploadAdminMovieImage(file: File, kind: "poster" | "backdrop", slug: string): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("kind", kind)
  formData.append("slug", slug.trim() || "movie")
  const res = await fetch("/api/admin/upload-image", { method: "POST", body: formData })
  const body = (await res.json().catch(() => ({}))) as { error?: string; path?: string }
  if (!res.ok) throw new Error(body.error ?? "Upload failed")
  if (!body.path) throw new Error("Upload response missing path")
  return body.path
}
