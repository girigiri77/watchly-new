"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo, useState } from "react"
import MovieCard from "@/components/MovieCard"
import { useSyncedMoviesFromAdmin } from "@/hooks/useSyncedMoviesFromAdmin"
import type { MovieCurated } from "@/types/movie"

type TabId = "week" | "latest" | "all"

function isTab(value: string | null): value is TabId {
  return value === "week" || value === "latest" || value === "all"
}

function ReleasesContent() {
  const searchParams = useSearchParams()
  const urlTab = searchParams.get("tab")
  const initialTab: TabId = isTab(urlTab) ? urlTab : "week"
  const [tab, setTab] = useState<TabId>(initialTab)

  useEffect(() => {
    if (isTab(urlTab)) setTab(urlTab)
  }, [urlTab])

  const { movies } = useSyncedMoviesFromAdmin()

  const thisWeek = useMemo(
    () =>
      movies
        .filter((m) => m.weeklyOTTRelease)
        .sort((a, b) => (a.weeklyOrder ?? 999) - (b.weeklyOrder ?? 999)),
    [movies],
  )

  const newReleases = useMemo(() => movies.filter((m) => m.latestMovie), [movies])

  const allSorted = useMemo(
    () => [...movies].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title)),
    [movies],
  )

  const list: MovieCurated[] = tab === "week" ? thisWeek : tab === "latest" ? newReleases : allSorted

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "week", label: "This week’s OTT", count: thisWeek.length },
    { id: "latest", label: "New releases", count: newReleases.length },
    { id: "all", label: "All titles", count: allSorted.length },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-24 text-[#111827]">
      {/* Hero: own stacking context + padding so nothing sits under the fixed navbar */}
      <header className="relative z-0 border-b border-[rgba(124,58,237,0.1)] bg-gradient-to-b from-white to-[#FAFAF7] px-4 pb-10 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">Curated from admin</p>
          <h1 className="mt-3 font-playfair text-4xl font-black leading-[1.05] tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
            OTT Releases
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#4B5563] sm:text-lg">
            Weekly queue, new-release flags, and your full library — synced from the admin panel.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Tabs on their own row with scroll on small screens */}
        <div
          role="tablist"
          aria-label="Release lists"
          className="flex flex-wrap gap-2 border-b border-gray-200/90 py-6"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              suppressHydrationWarning
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm transition sm:px-5 ${
                tab === t.id
                  ? "bg-[#7C3AED] text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)]"
                  : "border border-gray-200 bg-white text-[#4B5563] hover:border-[#7C3AED]/45 hover:text-[#111827]"
              }`}
            >
              <span className="whitespace-nowrap">{t.label}</span>
              <span
                className={`ml-2 inline-flex min-w-[1.5rem] justify-center rounded-full px-2 py-0.5 text-xs tabular-nums ${
                  tab === t.id ? "bg-white/25 text-white" : "bg-gray-100 text-[#6B7280]"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm sm:py-20">
            <div className="text-5xl">🎬</div>
            <p className="mt-4 text-lg font-semibold text-[#111827]">Nothing in this list yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#6B7280]">
              In admin, turn on <strong className="text-[#111827]">Weekly OTT</strong> or{" "}
              <strong className="text-[#111827]">Latest Movie</strong>, or add titles to your library.
            </p>
            <Link
              href="/admin/login"
              suppressHydrationWarning
              className="mt-8 inline-flex rounded-full bg-[#7C3AED] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)] transition hover:bg-[#6D28D9]"
            >
              Open admin
            </Link>
          </div>
        ) : (
          <div
            className="mt-8 grid gap-8 pb-8 sm:mt-10"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
          >
            {list.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        )}

        <div className="mt-12 border-t border-gray-200/80 pt-10 text-center">
          <Link
            href="/"
            suppressHydrationWarning
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(124,58,237,0.25)] bg-white px-6 py-3 text-sm font-semibold text-[#7C3AED] shadow-sm transition hover:bg-[#7C3AED]/5"
          >
            ← Back to discovery
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ReleasesPageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF7] px-8 pb-24 pt-8 text-[#6B7280] sm:pt-12">Loading releases…</div>
      }
    >
      <ReleasesContent />
    </Suspense>
  )
}
