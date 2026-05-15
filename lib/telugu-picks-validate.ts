import { MOODS, OTT_PLATFORMS, type Mood, type OTTPlatform } from "@/types/movie"
import type { TeluguPick } from "@/types/telugu-pick"

const moodSet = new Set<string>(MOODS)
const ottSet = new Set<string>(OTT_PLATFORMS)

function isHttpOrUploadUrl(value: string): boolean {
  const v = value.trim()
  if (!v) return false
  if (v.startsWith("/")) return true
  try {
    const u = new URL(v)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

export type TeluguPickInput = Omit<TeluguPick, "id" | "createdAt" | "updatedAt"> & {
  id?: number
}

export function validateTeluguPickBody(body: unknown, existing: TeluguPick[], selfId?: number): { ok: true; value: TeluguPickInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid JSON body" }
  const b = body as Record<string, unknown>

  const title = typeof b.title === "string" ? b.title.trim() : ""
  const slug = typeof b.slug === "string" ? b.slug.trim().toLowerCase() : ""
  const description = typeof b.description === "string" ? b.description.trim() : ""
  const posterUrl = typeof b.posterUrl === "string" ? b.posterUrl.trim() : ""
  const backdropUrl = typeof b.backdropUrl === "string" ? b.backdropUrl.trim() : ""
  const language = typeof b.language === "string" && b.language.trim() ? b.language.trim() : "Telugu"
  const year = typeof b.year === "number" ? b.year : Number(b.year)
  const duration = typeof b.duration === "string" ? b.duration.trim() : ""
  const rating = typeof b.rating === "number" ? b.rating : Number(b.rating)
  const ottRaw = typeof b.ott === "string" ? b.ott.trim() : ""
  const ottBadgeUrl = typeof b.ottBadgeUrl === "string" ? b.ottBadgeUrl.trim() : ""
  const trailerUrl = typeof b.trailerUrl === "string" ? b.trailerUrl.trim() : ""
  const gradientAccent = typeof b.gradientAccent === "string" && b.gradientAccent.trim() ? b.gradientAccent.trim() : "#7C3AED"
  const releaseDate = typeof b.releaseDate === "string" ? b.releaseDate.trim() : ""

  if (!title) return { ok: false, error: "Title is required" }
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { ok: false, error: "Slug must be lowercase letters, numbers, and hyphens only" }
  if (existing.some((p) => p.slug === slug && p.id !== selfId)) return { ok: false, error: "Slug already exists" }

  if (!description) return { ok: false, error: "Description is required" }
  if (posterUrl && !isHttpOrUploadUrl(posterUrl)) return { ok: false, error: "Poster URL must be a valid http(s) URL or start with /" }
  if (backdropUrl && !isHttpOrUploadUrl(backdropUrl)) return { ok: false, error: "Backdrop URL must be a valid http(s) URL or start with /" }
  if (!Number.isFinite(year) || year < 1900 || year > 2100) return { ok: false, error: "Release year is invalid" }
  if (!duration) return { ok: false, error: "Duration is required" }
  if (!Number.isFinite(rating) || rating < 0 || rating > 10) return { ok: false, error: "Rating must be between 0 and 10" }
  if (!ottRaw) return { ok: false, error: "OTT platform is required" }
  const ott: OTTPlatform | string = ottSet.has(ottRaw) ? (ottRaw as OTTPlatform) : ottRaw

  if (ottBadgeUrl && !isHttpOrUploadUrl(ottBadgeUrl)) return { ok: false, error: "OTT badge URL must be a valid http(s) URL or start with /" }
  if (trailerUrl && !isHttpOrUploadUrl(trailerUrl) && !trailerUrl.includes("youtube.com") && !trailerUrl.includes("youtu.be")) {
    return { ok: false, error: "Trailer URL looks invalid" }
  }

  const genres = Array.isArray(b.genres) ? b.genres.filter((g): g is string => typeof g === "string").map((g) => g.trim()).filter(Boolean) : []
  const moodsRaw = Array.isArray(b.moods) ? b.moods : []
  const moods: Mood[] = []
  for (const m of moodsRaw) {
    if (typeof m !== "string") continue
    const mm = m.trim()
    if (moodSet.has(mm)) moods.push(mm as Mood)
  }
  if (moods.length === 0) return { ok: false, error: "Select at least one mood" }

  const featured = Boolean(b.featured)
  const trending = Boolean(b.trending)
  const active = b.active === undefined ? true : Boolean(b.active)
  const displayOrder = typeof b.displayOrder === "number" ? b.displayOrder : Number(b.displayOrder)
  if (!Number.isFinite(displayOrder)) return { ok: false, error: "Display order must be a number" }

  let libraryMovieId: number | null | undefined
  if (b.libraryMovieId === null) libraryMovieId = null
  else if (b.libraryMovieId === undefined || b.libraryMovieId === "") libraryMovieId = undefined
  else {
    const n = typeof b.libraryMovieId === "number" ? b.libraryMovieId : Number(b.libraryMovieId)
    if (!Number.isFinite(n) || n <= 0) return { ok: false, error: "Library movie id must be a positive number" }
    libraryMovieId = n
  }

  return {
    ok: true,
    value: {
      slug,
      title,
      description,
      posterUrl,
      backdropUrl: backdropUrl || posterUrl,
      language,
      year,
      duration,
      rating,
      ott,
      ottBadgeUrl: ottBadgeUrl || undefined,
      genres,
      moods,
      featured,
      trending,
      active,
      displayOrder,
      trailerUrl: trailerUrl || "",
      libraryMovieId,
      gradientAccent,
      releaseDate: releaseDate || `${year}-01-01`,
      customPoster: typeof b.customPoster === "string" ? b.customPoster : undefined,
      customBackdrop: typeof b.customBackdrop === "string" ? b.customBackdrop : undefined,
    },
  }
}
