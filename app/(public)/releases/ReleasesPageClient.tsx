"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo, useState } from "react"
import MovieCard from "@/components/MovieCard"
import MoodCinemaSection from "@/components/MoodCinemaSection"
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
        .filter((m) => m.weekly)
        .sort((a, b) => (a.mood_order ?? 999) - (b.mood_order ?? 999)),
    [movies],
  )

  const newReleases = useMemo(() => movies.filter((m) => m.featured), [movies])

  const allSorted = useMemo(
    () => [...movies].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime() || a.title.localeCompare(b.title)),
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
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">Fresh Discoveries</p>
          <h1 className="mt-3 font-playfair text-4xl font-black leading-[1.05] tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
            OTT Releases
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#4B5563] sm:text-lg">
            Discover this week's digital premieres, trending theatrical releases, and our complete handpicked movie library.
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
          <div className="py-12">
            {/* Elegant Minimal Empty State Card */}
            <div className="mx-auto max-w-[460px] rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-violet-50 text-[#7C3AED]">
                <span className="text-2xl" role="img" aria-label="movie icon">🎬</span>
              </div>
              <h2 className="mt-4 font-playfair text-xl font-bold text-[#111827]">
                No OTT releases yet
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">
                Check back this Friday for the latest OTT and theatrical releases.
              </p>
            </div>

            {/* Trending Movies Section - Pushed lower with proper spacing */}
            <section id="trending-section" className="mt-28 border-t border-gray-200/80 pt-16">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C3AED]">Trending Now</span>
                <h3 className="mt-2 font-playfair text-3xl font-black text-[#111827] sm:text-4xl">
                  Most Popular Choices
                </h3>
              </div>

              {movies.filter(m => m.trending).length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6 lg:gap-8">
                  {movies
                    .filter((m) => m.trending)
                    .sort((a, b) => (a.mood_order ?? 999) - (b.mood_order ?? 999))
                    .slice(0, 5)
                    .map((movie, i) => (
                      <MovieCard key={movie.uuid} movie={movie} index={i} />
                    ))}
                </div>
              ) : (
                <p className="text-sm text-[#6B7280]">No trending titles found.</p>
              )}
            </section>

            {/* Mood Cinema Recommendations Section */}
            <div className="mt-20 border-t border-gray-200/80 pt-16 -mx-4 sm:-mx-8 lg:-mx-12">
              <MoodCinemaSection title="Discovery Recommendations" subtitle="Find Movies For\nEvery Emotion" />
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6 lg:gap-8 pb-8 sm:mt-10">
            {list.map((movie, i) => (
              <MovieCard key={movie.uuid} movie={movie} index={i} />
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
