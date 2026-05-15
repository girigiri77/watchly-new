export type TmdbMovieMetadata = {
  poster: string
  backdrop?: string
  overview: string
  releaseDate: string
  genre: string[]
}

export async function fetchTmdbMovieMetadata(_tmdbId: number): Promise<TmdbMovieMetadata | null> {
  void _tmdbId
  // Future integration point: TMDB should enrich only visual and release metadata.
  return null
}
