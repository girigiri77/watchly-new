export const MOODS = [
  "Love",
  "Emotional",
  "Mass",
  "Thriller",
  "Action",
  "Feel Good",
  "Comedy",
  "Dark",
  "Motivational",
  "Family",
  "Sci-Fi",
  "Mind Bending",
] as const

export const OTT_PLATFORMS = [
  "Netflix",
  "Prime Video",
  "Hotstar",
  "Zee5",
  "SonyLIV",
  "Aha",
  "JioCinema",
] as const

export const LANGUAGES = [
  "Telugu",
  "Tamil",
  "Hindi",
  "Malayalam",
  "Kannada",
  "English",
] as const

export type Mood = (typeof MOODS)[number]
export type OTTPlatform = (typeof OTT_PLATFORMS)[number]
export type MovieLanguage = (typeof LANGUAGES)[number]

export interface MovieCurated {
  id: number
  tmdbId: number
  title: string
  moods: Mood[]
  ottPlatform: OTTPlatform
  language: MovieLanguage
  rating: number
  youtubeTrailer: string
  featured: boolean
  categories: string[]
  year: number
  duration: string
  weeklyOTTRelease: boolean
  trending: boolean
  latestRelease: boolean
  heroFeatured: boolean
  editorialTagline?: string
  weeklyOrder?: number
  trendingOrder?: number
  homepageRows?: string[]
  editorialPick?: boolean

  // Admin-controlled homepage section flags
  latestMovie: boolean
  acrossPlatforms: boolean
  featuredCollection: boolean

  // Poster / backdrop URLs (remote or manual). See `lib/movie-images.ts` for display priority.
  poster: string
  backdrop?: string
  /** Local or CDN path from admin upload; wins over `poster` (e.g. `/uploads/hi-nanna-poster.jpg`). */
  customPoster?: string
  customBackdrop?: string
  overview: string
  releaseDate: string
  genre: string[]
  gradientAccent: string
}
