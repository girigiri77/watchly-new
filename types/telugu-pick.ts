import type { Mood, OTTPlatform } from "@/types/movie"

/** Curated row for the homepage “Telugu Picks” rail (managed from admin). */
export interface TeluguPick {
  id: number
  slug: string
  title: string
  description: string
  posterUrl: string
  backdropUrl: string
  language: string
  year: number
  duration: string
  rating: number
  /** OTT platform label (must match `OTTPlatform` when possible for badge styling). */
  ott: string
  /** Optional small logo URL shown on the card badge area. */
  ottBadgeUrl?: string
  genres: string[]
  moods: Mood[]
  featured: boolean
  trending: boolean
  active: boolean
  displayOrder: number
  trailerUrl: string
  /** When set, “Preview” / primary tap can deep-link into the main movie detail page. */
  libraryMovieId?: string | null

  gradientAccent: string
  releaseDate: string
  customPoster?: string
  customBackdrop?: string
  createdAt: string
  updatedAt: string
}
