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
  uuid: string
  created_at?: string
  title: string
  description: string
  poster: string
  backdrop: string
  ott: OTTPlatform
  language: MovieLanguage
  release_date: string
  moods: Mood[]
  rating: number | string
  trailer: string
  genre: string[]
  trending: boolean
  weekly: boolean
  featured: boolean
  mood_order: number
}

