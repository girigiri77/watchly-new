import { movies } from "@/data/movies"
import type { Mood, MovieCurated, OTTPlatform } from "@/types/movie"

export function getMoviesByOTT(platform: OTTPlatform | "All", source: MovieCurated[] = movies) {
  return platform === "All" ? source : source.filter((movie) => movie.ottPlatform === platform)
}

export function getMoviesByMood(mood: Mood | string | null, source: MovieCurated[] = movies) {
  if (!mood) return source
  return source.filter((movie) => movie.moods.includes(mood as Mood))
}

export function getFeaturedMovies(source: MovieCurated[] = movies) {
  return source.filter((movie) => movie.featured)
}

export function getTrendingMovies(source: MovieCurated[] = movies) {
  return source.filter((movie) => movie.trending).sort((a, b) => b.rating - a.rating)
}

export function getLatestReleases(source: MovieCurated[] = movies) {
  return source.filter((movie) => movie.latestRelease).sort((a, b) => b.year - a.year)
}

export function getWeeklyOTTReleases(source: MovieCurated[] = movies) {
  return source
    .filter((movie) => movie.weeklyOTTRelease)
    .sort((a, b) => (a.weeklyOrder ?? 999) - (b.weeklyOrder ?? 999))
}

export function getHeroFeaturedMovie(source: MovieCurated[] = movies) {
  return source.find((movie) => movie.heroFeatured) ?? getFeaturedMovies(source)[0] ?? source[0]
}

export function getEditorialPicks(source: MovieCurated[] = movies) {
  return source.filter((movie) => movie.editorialPick || movie.categories.includes("Top Picks"))
}

export function getMoviesByCategory(category: string, source: MovieCurated[] = movies) {
  return source.filter((movie) => movie.categories.includes(category) || movie.homepageRows?.includes(category))
}
