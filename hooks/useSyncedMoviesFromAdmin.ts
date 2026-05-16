"use client"

import { movies as seedMovies } from "@/data/movies"
import { supabase } from "@/lib/supabase"
import type { MovieCurated } from "@/types/movie"
import { useCallback, useEffect, useState } from "react"

export type SyncedMoviesFromAdmin = {
  movies: MovieCurated[]
  storageHydrated: boolean
  loading: boolean
  error: string | null
}



/**
 * Maps Supabase snake_case columns back to our camelCase MovieCurated interface
 */
function mapFromSupabase(row: any): MovieCurated {
  return {
    uuid: row.uuid,
    created_at: row.created_at,
    title: row.title,
    description: row.description || "",
    poster: row.poster || "",
    backdrop: row.backdrop || "",
    ott: row.ott,
    language: row.language,
    release_date: row.release_date || "",
    moods: row.moods || [],
    rating: Number(row.rating || 0),

    trailer: row.trailer || "",
    genre: row.genre || [],
    trending: row.trending || false,
    weekly: row.weekly || false,
    featured: row.featured || false,
    mood_order: row.mood_order || 0,
  }
}

export function useSyncedMoviesFromAdmin(): SyncedMoviesFromAdmin {
  const [list, setList] = useState<MovieCurated[]>(() => seedMovies)

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
        console.error('Supabase Full Error:', JSON.stringify(sbError, null, 2))
        setError(sbError.message)
        return
      }

      setList(data?.map(mapFromSupabase) || [])

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setStorageHydrated(true)
    }
  }, [])

  useEffect(() => {
    fetchMovies()

    if (!supabase) return

    const client = supabase
    const channelId = `movies_changes_${Date.now()}`
    const channel = client
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'movies',
        },
        () => {
          fetchMovies()
        }
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [])



  return { movies: list, storageHydrated, loading, error }

}
