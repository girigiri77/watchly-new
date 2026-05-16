import type { MovieCurated } from "@/types/movie"
import type { TeluguPick } from "@/types/telugu-pick"

/** Static fallback when neither custom nor TMDB poster is usable. */
export const FALLBACK_POSTER_PATH = "/placeholder.jpg"

/**
 * Ensures an image source is never an empty string.
 */
export function getSafeImageUrl(url: string | null | undefined, fallback = FALLBACK_POSTER_PATH): string {
  const trimmed = url?.trim()
  return trimmed || fallback
}

/**
 * Display priority for Library Movies: `customPoster` → TMDB `poster` → fallback.
 */
export function getResolvedPosterUrl(movie: Pick<MovieCurated, "poster">): string {
  return getSafeImageUrl(movie.poster)
}


/**
 * Display priority for Telugu Picks: `customPoster` → `posterUrl` → fallback.
 */
export function getTeluguPickPoster(pick: Pick<TeluguPick, "customPoster" | "posterUrl">): string {
  return getSafeImageUrl(pick.customPoster || pick.posterUrl)
}

/** `customBackdrop` → TMDB `backdrop` → `undefined` (caller may omit image). */
export function getResolvedBackdropUrl(movie: Pick<MovieCurated, "backdrop">): string | undefined {
  const tmdb = movie.backdrop?.trim()
  return tmdb || undefined
}

