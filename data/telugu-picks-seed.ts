import { movies } from "@/data/movies"
import type { TeluguPick } from "@/types/telugu-pick"

/** Initial Telugu Picks derived from the seed movie library (Telugu only). */
export const seedTeluguPicks: TeluguPick[] = movies
  .filter((m) => m.language === "Telugu")
  .slice(0, 8)
  .map((m, i) => {
    const now = new Date().toISOString()
    const baseSlug = m.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)
    return {
      id: i + 1,
      slug: `${baseSlug || "pick"}-${m.id}`.slice(0, 90),
      title: m.title,
      description: m.overview,
      posterUrl: m.poster,
      backdropUrl: m.backdrop ?? m.poster,
      language: "Telugu",
      year: m.year,
      duration: m.duration,
      rating: m.rating,
      ott: m.ottPlatform,
      ottBadgeUrl: "",
      genres: [...m.genre],
      moods: [...m.moods],
      featured: Boolean(m.featured),
      trending: Boolean(m.trending),
      active: true,
      displayOrder: i + 1,
      trailerUrl: m.youtubeTrailer,
      libraryMovieId: m.id,
      gradientAccent: m.gradientAccent,
      releaseDate: m.releaseDate,
      createdAt: now,
      updatedAt: now,
    } satisfies TeluguPick
  })
