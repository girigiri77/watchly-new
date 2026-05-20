'use client'

import Link from 'next/link'

import Hero from '@/components/Hero'
import MovieCard from '@/components/MovieCard'
import TeluguPickCard from '@/components/TeluguPickCard'
import MoodCinemaSection from '@/components/MoodCinemaSection'
import HomeSkeleton from '@/components/ui/HomeSkeleton'
import FadeInView from '@/components/motion/FadeInView'

import MouseGlow from '@/components/effects/MouseGlow'
import ParallaxWrapper from '@/components/effects/ParallaxWrapper'

import { useSyncedMoviesFromAdmin } from '@/hooks/useSyncedMoviesFromAdmin'
import { usePublicTeluguPicks } from '@/hooks/usePublicTeluguPicks'

import { getHomepageTrending } from '@/lib/trending'
import { TRENDING_CONFIG } from '@/data/trending'

const tickerItems = [
  'Netflix',
  'Prime Video',
  'Hotstar',
  'Telugu Cinema',
  'Tamil Stories',
  'Bollywood',
  'Malayalam Gems',
  'Weekly Releases',
  'Mood Discovery',
  'Zee5',
  'SonyLIV',
]

export default function HomePage() {
  const { movies: allMovies, loading, error } =
    useSyncedMoviesFromAdmin()

  const {
    picks: teluguPicks,
    loading: teluguPicksLoading,
  } = usePublicTeluguPicks()

  if (loading) {
    return <HomeSkeleton />
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0F] px-6 text-center text-white">
        <div className="mb-4 text-5xl">⚠️</div>

        <h2 className="mb-2 text-3xl font-bold">
          Connection Error
        </h2>

        <p className="text-neutral-400">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="btn-premium mt-8 px-8 py-3"
        >
          Retry
        </button>
      </div>
    )
  }

  /* =========================
     MOVIE SECTIONS
  ========================= */

  const weeklyReleases = allMovies
    .filter((m) => m.weekly)
    .slice(0, 8)

  const latestMovies = allMovies
    .filter((m) => m.featured)
    .slice(0, 8)

  const trendingMovies = getHomepageTrending(
    allMovies,
    TRENDING_CONFIG.HOME_LIMIT
  )

  return (
    <main className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#0B0B0F] text-white">
      <MouseGlow />

      {/* ================= HERO ================= */}

      <Hero />

      {/* ================= OTT RELEASES ================= */}

      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/15 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInView>
            <ParallaxWrapper multiplier={5}>
              <div className="mb-6 sm:mb-10">
                <p className="text-eyebrow mb-2 text-purple-400">THIS WEEK&apos;S OTT RELEASES</p>
                <h2 className="section-title">
                  Latest Movies & Shows
                  <br />
                  <span className="gradient-text-purple">Across All Platforms</span>
                </h2>
              </div>
            </ParallaxWrapper>
          </FadeInView>

          <FadeInView delay={0.06}>
          <div className="movie-row movie-row-peek">
            {weeklyReleases.map((movie, i) => (
              <MovieCard
                key={movie.uuid}
                movie={movie}
                index={i}
              />
            ))}
          </div>
          </FadeInView>

          <FadeInView delay={0.1} className="mt-8 text-center sm:mt-12">
            <Link
              href="/releases"
              className="btn-premium touch-target inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider active:scale-[0.98] sm:px-8 sm:py-4 sm:text-sm"
            >
              View All Releases
              <span>→</span>
            </Link>
          </FadeInView>
        </div>
      </section>

      <section className="section-padding bg-[#111827]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInView>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-10 sm:gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-eyebrow mb-2 text-purple-400">Latest Movies</p>
              <h2 className="section-title">
                Fresh Releases
                <br />
                <span className="text-neutral-400">Handpicked for You</span>
              </h2>
            </div>

            <Link
              href="/releases"
              className="btn-glass touch-target inline-flex w-fit items-center gap-2 self-start px-5 py-2.5 text-xs uppercase tracking-wider active:scale-[0.98] sm:px-7 sm:py-3 sm:text-sm"
            >
              View All
              <span>→</span>
            </Link>
          </div>
          </FadeInView>

          <FadeInView delay={0.06}>
          <div className="movie-row movie-row-peek">
            {latestMovies.map((movie, i) => (
              <MovieCard
                key={movie.uuid}
                movie={movie}
                index={i}
              />
            ))}
          </div>
          </FadeInView>
        </div>
      </section>

      {/* ================= TICKER ================= */}

      <div className="overflow-hidden bg-gradient-to-r from-purple-700 to-fuchsia-600 py-3 sm:py-4">
        <div className="ticker-animate">
          {[...tickerItems, ...tickerItems].map(
            (item, i) => (
              <span
                key={i}
                className="px-4 text-xs font-bold uppercase tracking-[0.2em] text-white sm:px-8 sm:text-sm sm:tracking-[0.25em]"
              >
                {item}
                <span className="mx-3 text-white/50">
                  ✦
                </span>
              </span>
            )
          )}
        </div>
      </div>

      {/* ================= STATS ================= */}

      <section className="grid grid-cols-2 gap-px bg-purple-500/10 md:grid-cols-4">
        {[
          ['500+', 'Curated Films'],
          ['8', 'Streaming Platforms'],
          ['7', 'Cinematic Moods'],
          ['12', 'Languages'],
        ].map(([num, label]) => (
          <div
            key={label}
            className="group relative overflow-hidden bg-[#111827] py-6 text-center transition-all hover:bg-[#151b2d] sm:py-10"
          >
            <div className="font-playfair mb-2 text-2xl font-black text-white sm:mb-3 sm:text-4xl md:text-5xl">
              {num}
            </div>

            <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 sm:text-xs sm:tracking-[0.25em]">
              {label}
            </div>
          </div>
        ))}
      </section>

      {/* ================= MOOD SECTION ================= */}

      <MoodCinemaSection />

      {/* ================= TRENDING ================= */}

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInView>
            <p className="text-eyebrow mb-2 text-purple-400">{TRENDING_CONFIG.LABEL}</p>
            <h2 className="section-title mb-6 sm:mb-10">{TRENDING_CONFIG.SECTION_TITLE}</h2>
          </FadeInView>

          <FadeInView delay={0.06}>
          <div className="movie-row movie-row-peek">
            {trendingMovies.map((movie, i) => (
              <MovieCard
                key={movie.uuid}
                movie={movie}
                index={i}
              />
            ))}
          </div>
          </FadeInView>

          <FadeInView delay={0.1} className="mt-8 text-center sm:mt-12">
            <Link
              href="/trending"
              className="btn-glass touch-target inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider active:scale-[0.98] sm:px-8 sm:py-4 sm:text-sm"
            >
              View Trending
              <span>→</span>
            </Link>
          </FadeInView>
        </div>
      </section>

      <section className="section-padding bg-[#111827]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInView>
            <p className="text-eyebrow mb-2 text-red-400">Telugu Picks</p>
            <h2 className="section-title mb-6 sm:mb-10">
              Curated Tollywood
              <br />
              <span className="text-neutral-400">Masterpieces</span>
            </h2>
          </FadeInView>

          <FadeInView delay={0.06}>
          <div className="movie-row movie-row-peek">
            {teluguPicksLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))
            ) : teluguPicks.length > 0 ? (
              teluguPicks.map((pick) => (
                <TeluguPickCard
                  key={pick.id}
                  pick={pick}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-neutral-500">
                No Telugu Picks added yet.
              </div>
            )}
          </div>
          </FadeInView>

          <FadeInView delay={0.1} className="mt-8 text-center sm:mt-12">
            <Link
              href="/search?q=Telugu"
              className="btn-glass touch-target inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider active:scale-[0.98] sm:px-8 sm:py-4 sm:text-sm"
            >
              Explore Telugu
              <span>→</span>
            </Link>
          </FadeInView>
        </div>
      </section>

      {/* Home footer — PublicChrome hides global footer on home */}
      <footer className="border-t border-white/5 bg-[#0B0B0F] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 sm:gap-10 md:flex-row md:justify-between">
            <div className="max-w-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-lg font-black text-white">
                  🎬
                </div>
                <span className="font-playfair text-xl font-black sm:text-2xl">
                  Absolute
                  <span className="gradient-text-purple"> Cinema</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-400">
                Premium cinematic discovery platform for every mood, every story, every emotion.
              </p>
            </div>
            <div className="flex flex-wrap gap-10 sm:gap-16">
              <div>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-purple-400">Discover</h4>
                <div className="flex flex-col gap-2.5">
                  <Link href="/releases" className="text-sm text-neutral-400 transition hover:text-white">Releases</Link>
                  <Link href="/mood" className="text-sm text-neutral-400 transition hover:text-white">Mood Cinema</Link>
                  <Link href="/trending" className="text-sm text-neutral-400 transition hover:text-white">Trending</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-center text-xs text-neutral-500 sm:mt-10 sm:flex-row sm:text-left">
            <span>© 2026 Absolute Cinema. Premium cinematic discovery.</span>
            <span className="text-purple-400">Cinema for Every Emotion</span>
          </div>
        </div>
      </footer>
    </main>
  )
}