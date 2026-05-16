import { MovieCurated } from "@/types/movie"

export function getMoviesByMoodOrdered(
  movies: MovieCurated[],
  mood: string
): MovieCurated[] {
  return movies
    .filter((m) => m.moods.includes(mood as any))
    .sort((a, b) => (a.mood_order || 999) - (b.mood_order || 999) || a.title.localeCompare(b.title))
}


