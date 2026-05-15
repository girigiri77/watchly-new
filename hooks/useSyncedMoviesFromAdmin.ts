"use client"

import { movies as seedMovies } from "@/data/movies"
import { supabase } from "@/lib/supabase"
import type { MovieCurated } from "@/types/movie"
import { useCallback, useEffect, useState } from "react"

export type SyncedMoviesFromAdmin = {
  movies: MovieCurated[]
  moodOrders: Record<string, number[]>
  storageHydrated: boolean
  loading: boolean
  error: string | null
}

/**
 * Maps Supabase snake_case columns back to our camelCase MovieCurated interface
 */
function mapFromSupabase(row: any): MovieCurated {
  return {
    id: row.tmdb_id || 0, // using tmdb_id as the unique numeric ID if available
    tmdbId: row.tmdb_id,
    title: row.title,
    moods: row.moods || [],
    ottPlatform: row.ott,
    language: row.language,
    rating: row.rating || 0,
    youtubeTrailer: row.youtube_trailer,
    featured: row.featured,
    categories: row.categories || [],
    year: row.year,
    duration: row.duration,
    weeklyOTTRelease: row.weekly_ott_release,
    trending: row.trending,
    latestRelease: row.latest_release,
    heroFeatured: row.hero_featured,
    editorialTagline: row.editorial_tagline,
    weeklyOrder: row.weekly_order,
    trendingOrder: row.trending_order,
    homepageRows: row.homepage_rows || [],
    editorialPick: row.editorial_pick,
    latestMovie: row.latest_movie,
    acrossPlatforms: row.across_platforms,
    featuredCollection: row.featured_collection,
    poster: row.poster,
    backdrop: row.backdrop,
    customPoster: row.custom_poster,
    customBackdrop: row.custom_backdrop,
    overview: row.description || row.overview,
    releaseDate: row.release_date,
    genre: row.genre || [],
    gradientAccent: row.gradient_accent,
  }
}

export function useSyncedMoviesFromAdmin(): SyncedMoviesFromAdmin {
  const [list, setList] = useState<MovieCurated[]>(() => seedMovies)
  const [moodOrders, setMoodOrders] = useState<Record<string, number[]>>({})
  const [storageHydrated, setStorageHydrated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMovies = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: sbError } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false })

      if (sbError) {
        console.error('Supabase fetch error:', sbError)
        setError(sbError.message)
        return
      }

      if (data && data.length > 0) {
        setList(data.map(mapFromSupabase))
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setStorageHydrated(true)
    }
  }, [])

  useEffect(() => {
    fetchMovies()

    // Real-time subscription to 'movies' table
    const channel = supabase
      .channel('movies_changes')
      .on('postgres_changes', { event: '*', table: 'movies' }, () => {
        fetchMovies()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchMovies])

  return { movies: list, moodOrders, storageHydrated, loading, error }
}
