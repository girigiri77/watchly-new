import type { MovieCurated } from "@/types/movie"

/**
 * Returns a list of movies marked as trending, sorted by their `trendingOrder`.
 * Falls back to rating and title if order is missing.
 */
export function getTrendingMovies(movies: MovieCurated[]): MovieCurated[] {
  return movies
    .filter((m) => m.trending)
    .sort((a, b) => {
      if (a.trendingOrder !== undefined && b.trendingOrder !== undefined) {
        return a.trendingOrder - b.trendingOrder
      }
      if (a.trendingOrder !== undefined) return -1
      if (b.trendingOrder !== undefined) return 1
      
      // Fallback: Rating desc, then Title asc
      if (b.rating !== a.rating) return b.rating - a.rating
      return a.title.localeCompare(b.title)
    })
}

/**
 * Returns the movies for the homepage trending section (capped at 10 items by default).
 */
export function getHomepageTrending(movies: MovieCurated[], limit = 10): MovieCurated[] {
  return getTrendingMovies(movies).slice(0, limit)
}
