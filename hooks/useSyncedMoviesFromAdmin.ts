"use client"

import { movies as seedMovies } from "@/data/movies"
import {
  ADMIN_MOVIES_STORAGE_KEY,
  MOOD_ORDERS_STORAGE_KEY,
  MOOD_ORDERS_UPDATED_EVENT,
  MOVIES_UPDATED_EVENT,
} from "@/lib/admin-movies-storage"
import type { MovieCurated } from "@/types/movie"
import { useCallback, useEffect, useState } from "react"

function parseStoredMovies(raw: string | null): MovieCurated[] | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed) || parsed.length === 0) return null
    return parsed as MovieCurated[]
  } catch {
    return null
  }
}

function parseStoredOrders(raw: string | null): Record<string, number[]> {
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Record<string, number[]>
  } catch {
    return {}
  }
}

export type SyncedMoviesFromAdmin = {
  movies: MovieCurated[]
  moodOrders: Record<string, number[]>
  /**
   * `true` after the first client-side read of `localStorage` (or immediately after each reload from storage events).
   * Stays `false` during SSR and the first client paint so lists match server HTML and avoid hydration mismatches.
   */
  storageHydrated: boolean
}

/**
 * Movie list from `localStorage` when the admin panel has saved data, otherwise seed data from `data/movies`.
 * Subscribes to cross-tab `storage` and same-tab updates from the admin panel.
 */
export function useSyncedMoviesFromAdmin(): SyncedMoviesFromAdmin {
  const [list, setList] = useState<MovieCurated[]>(() => seedMovies)
  const [moodOrders, setMoodOrders] = useState<Record<string, number[]>>({})
  const [storageHydrated, setStorageHydrated] = useState(false)

  const reload = useCallback(() => {
    if (typeof window === "undefined") return
    const fromStore = parseStoredMovies(window.localStorage.getItem(ADMIN_MOVIES_STORAGE_KEY))
    setList(fromStore ?? seedMovies)
    
    const orders = parseStoredOrders(window.localStorage.getItem(MOOD_ORDERS_STORAGE_KEY))
    setMoodOrders(orders)
    
    setStorageHydrated(true)
  }, [])

  useEffect(() => {
    reload()
    const onStorage = (event: StorageEvent) => {
      if (
        event.key === ADMIN_MOVIES_STORAGE_KEY || 
        event.key === MOOD_ORDERS_STORAGE_KEY || 
        event.key === null
      ) {
        reload()
      }
    }
    window.addEventListener("storage", onStorage)
    window.addEventListener(MOVIES_UPDATED_EVENT, reload)
    window.addEventListener(MOOD_ORDERS_UPDATED_EVENT, reload)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(MOVIES_UPDATED_EVENT, reload)
      window.removeEventListener(MOOD_ORDERS_UPDATED_EVENT, reload)
    }
  }, [reload])

  return { movies: list, moodOrders, storageHydrated }
}
