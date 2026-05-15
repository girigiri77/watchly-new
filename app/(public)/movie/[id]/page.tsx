"use client"

/* eslint-disable @next/next/no-img-element */

import Link from "next/link"
import { Calendar, Play, Star } from "lucide-react"
import { notFound, useParams } from "next/navigation"
import { useMemo, useState, startTransition } from "react"
import { useSyncedMoviesFromAdmin } from "@/hooks/useSyncedMoviesFromAdmin"
import { getResolvedBackdropUrl, getResolvedPosterUrl } from "@/lib/movie-images"

const platformStyle: Record<string, { label: string; gradient: string }> = {
  Netflix: { label: "NETFLIX", gradient: "linear-gradient(135deg, #E50914 0%, #B20710 100%)" },
  "Prime Video": { label: "PRIME", gradient: "linear-gradient(135deg, #00A8E0 0%, #0066CC 100%)" },
  Hotstar: { label: "HOTSTAR", gradient: "linear-gradient(135deg, #1F80E0 0%, #0066B3 100%)" },
  Zee5: { label: "ZEE5", gradient: "linear-gradient(135deg, #8B2FC9 0%, #6B1FA9 100%)" },
  SonyLIV: { label: "SONY", gradient: "linear-gradient(135deg, #FF5722 0%, #E64A19 100%)" },
  Aha: { label: "AHA", gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" },
  JioCinema: { label: "JIO", gradient: "linear-gradient(135deg, #D946EF 0%, #7C3AED 100%)" },
}

function MovieTitle({ title }: { title: string }) {
  const m = title.match(/^(.+?)(\s+(\d+|[IVXLCDM]+))$/)
  if (m && m[2]) {
    return (
      <span className="font-playfair tracking-tight text-white">
        <span>{m[1]}</span>
        <span className="text-[#7C3AED]">{m[2]}</span>
      </span>
    )
  }
  return <span className="font-playfair tracking-tight text-white">{title}</span>
}

export default function MoviePage() {
  const params = useParams()
  const rawId = params?.id
  const id = typeof rawId === "string" ? Number(rawId) : Number.NaN
  const { movies, storageHydrated } = useSyncedMoviesFromAdmin()
  const movie = Number.isFinite(id) ? movies.find((item) => item.id === id) : undefined

  const posterUrl = useMemo(() => (movie ? getResolvedPosterUrl(movie) : "/placeholder.jpg"), [movie])
  const backdropUrl = useMemo(() => (movie ? getResolvedBackdropUrl(movie) : undefined), [movie])
  const heroBgUrl = backdropUrl || posterUrl || "/placeholder.jpg"

  const [posterFailed, setPosterFailed] = useState(false)

  const platform = movie
    ? platformStyle[movie.ottPlatform] ?? {
        label: movie.ottPlatform.toUpperCase().slice(0, 8),
        gradient: "linear-gradient(135deg, #52525B 0%, #27272A 100%)",
      }
    : null

  if (!storageHydrated) {
    return (
      <main className="flex min-h-[50vh] w-full items-center justify-center bg-[#FAFAF7] text-[#111827]">
        <p className="text-sm font-medium tracking-wide text-[#6B7280]">Loading movie…</p>
      </main>
    )
  }

  if (!movie) notFound()

  return (
    <main
      key={movie.id}
      id="movie-detail"
      className="relative w-full overflow-hidden bg-[#070707] text-white [-webkit-font-smoothing:antialiased]"
    >
      {/* Cinematic full-bleed backdrop */}
      <div
        className="absolute inset-0 z-0 bg-black"
        style={heroBgUrl ? { backgroundImage: `url(${heroBgUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      />
      <div className="absolute inset-0 z-0 bg-black/70 backdrop-blur-[2px]" />

      {/* Centered hero */}
      <section className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 pb-20 pt-24 text-center sm:px-6 lg:px-8">
        {/* Poster */}
        <div className="mb-10 flex flex-col items-center">
          <div className="relative w-[260px] h-[390px] rounded-[28px] bg-black/40 shadow-[0_0_60px_rgba(0,0,0,0.8)] ring-2 ring-white/5 sm:w-[300px] sm:h-[440px] md:w-[320px] md:h-[480px]">
            <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-b from-white/10 via-transparent to-[#7C3AED]/25 opacity-60 blur-lg" />
            <div className="relative h-full w-full overflow-hidden rounded-[32px] shadow-[0_0_80px_rgba(124,58,237,0.35)] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_0_120px_rgba(124,58,237,0.6)]">
              {!posterFailed ? (
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                  onError={() => startTransition(() => setPosterFailed(true))}
                />
              ) : (
                <div
                  className="flex h-full w-full flex-col items-center justify-center px-8 text-center"
                  style={{
                    background: `linear-gradient(160deg, ${movie.gradientAccent}55, #111111 85%)`,
                  }}
                >
                  <span className="mb-4 text-5xl">🎬</span>
                  <span className="font-playfair text-2xl font-black text-white">{movie.title}</span>
                </div>
              )}
            </div>

            {/* Rating + platform pill on the poster edge */}
            <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-white/10" />
            <div
              className="absolute left-4 top-4 flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-lg"
              style={{ background: platform?.gradient }}
            >
              {platform?.label}
            </div>
            <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <Star size={14} fill="#F5C542" stroke="none" />
              {movie.rating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Text stack */}
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
          <h1 className="font-playfair text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            <MovieTitle title={movie.title} />
          </h1>

          {movie.editorialTagline ? (
            <p className="max-w-2xl text-base font-medium uppercase tracking-[0.3em] text-[#A1A1AA] sm:text-sm">
              {movie.editorialTagline}
            </p>
          ) : null}

          <p className="max-w-3xl text-balance text-xl leading-relaxed text-zinc-300">
            {movie.overview}
          </p>

          {/* Metadata row */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold tracking-[0.28em] text-[#A1A1AA] sm:text-sm">
            <span className="uppercase">
              {movie.language} • {movie.year} • {movie.duration}
            </span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="uppercase">
              {movie.ottPlatform}
            </span>
          </div>

          {/* Mood tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {movie.moods.map((mood) => (
              <span
                key={mood}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-200"
              >
                {mood}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={movie.youtubeTrailer}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#7C3AED] to-[#6D28D9] px-8 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_18px_60px_rgba(124,58,237,0.6)] transition hover:brightness-110 hover:shadow-[0_22px_70px_rgba(124,58,237,0.85)]"
            >
              <Play size={18} fill="currentColor" className="text-white" />
              Watch trailer
            </a>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_12px_45px_rgba(0,0,0,0.7)] transition hover:border-white/40 hover:bg-white/10"
            >
              Watch on {platform?.label ?? movie.ottPlatform.toUpperCase()}
            </button>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="text-sm font-semibold text-[#A1A1AA] underline-offset-4 transition hover:text-white hover:underline"
            >
              ← Back to discovery
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
