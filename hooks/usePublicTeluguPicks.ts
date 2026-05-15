"use client"

import type { TeluguPick } from "@/types/telugu-pick"
import { useCallback, useEffect, useState } from "react"

export function usePublicTeluguPicks() {
  const [picks, setPicks] = useState<TeluguPick[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/telugu-picks", { cache: "no-store" })
      const data = (await res.json().catch(() => ({}))) as { picks?: TeluguPick[]; error?: string }
      if (!res.ok) {
        setError(data.error || "Failed to load Telugu picks")
        setPicks([])
        return
      }
      setPicks(Array.isArray(data.picks) ? data.picks : [])
    } catch {
      setError("Network error loading Telugu picks")
      setPicks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") void refetch()
    }
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [refetch])

  return { picks, loading, error, refetch }
}
