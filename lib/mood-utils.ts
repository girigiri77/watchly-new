import { MovieCurated } from "@/types/movie"

export function getMoviesByMoodOrdered(
  movies: MovieCurated[],
  moodOrders: Record<string, number[]>,
  mood: string
): MovieCurated[] {
  const inMood = movies.filter((m) => m.moods.includes(mood as any))
  const order = moodOrders[mood]
  
  if (!order || order.length === 0) return inMood
  
  const movieMap = new Map(inMood.map((m) => [m.id, m]))
  const result: MovieCurated[] = []
  
  // 1. Add movies that are in the custom order list
  order.forEach((id) => {
    const m = movieMap.get(id)
    if (m) {
      result.push(m)
      movieMap.delete(id)
    }
  })
  
  // 2. Append any movies tagged with this mood that weren't in the order list
  // Sort them by ID or title as fallback
  const remaining = Array.from(movieMap.values()).sort((a, b) => b.id - a.id)
  result.push(...remaining)
  
  return result
}
