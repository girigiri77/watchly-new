"use client"

/* eslint-disable @next/next/no-img-element */

import Link from "next/link"
import { Calendar, ExternalLink, Play, Star } from "lucide-react"
import { startTransition, useMemo, useState } from "react"
import type { MovieCurated } from "@/types/movie"
import { getResolvedPosterUrl } from "@/lib/movie-images"
import TiltCard from "@/components/effects/TiltCard"

type MovieCardProps = {
  movie: MovieCurated
  index?: number
}

const platformStyle: Record<string, { bg: string; label: string; gradient: string }> = {
  Netflix: { bg: "#E50914", label: "NETFLIX", gradient: "linear-gradient(135deg, #E50914 0%, #B20710 100%)" },
  "Prime Video": { bg: "#00A8E0", label: "PRIME", gradient: "linear-gradient(135deg, #00A8E0 0%, #0066CC 100%)" },
  Hotstar: { bg: "#1F80E0", label: "HOTSTAR", gradient: "linear-gradient(135deg, #1F80E0 0%, #0066B3 100%)" },
  Zee5: { bg: "#8B2FC9", label: "ZEE5", gradient: "linear-gradient(135deg, #8B2FC9 0%, #6B1FA9 100%)" },
  SonyLIV: { bg: "#FF5722", label: "SONY", gradient: "linear-gradient(135deg, #FF5722 0%, #E64A19 100%)" },
  Aha: { bg: "#F97316", label: "AHA", gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" },
  JioCinema: { bg: "#D946EF", label: "JIO", gradient: "linear-gradient(135deg, #D946EF 0%, #7C3AED 100%)" },
}

function getYouTubeEmbedUrl(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/)
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const platform = platformStyle[movie.ottPlatform] ?? {
    bg: "#52525B",
    label: movie.ottPlatform,
    gradient: "linear-gradient(135deg, #52525B 0%, #27272A 100%)",
  }
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(movie.youtubeTrailer), [movie.youtubeTrailer])
  const posterUrl = useMemo(() => {
    const url = getResolvedPosterUrl(movie)
    return url === "" ? "/placeholder.jpg" : url
  }, [movie.customPoster, movie.poster])

  return (
    <>
      <TiltCard intensity={10} className="block h-full w-full">
        <article className="h-full group overflow-hidden rounded-[20px] border border-white/10 bg-[#111111] shadow-[0_24px_70px_rgba(0,0,0,0.22)] transition-transform duration-300 ease-out hover:-translate-y-2">
          <Link href={`/movie/${movie.id}`} className="block">
          <div className="relative aspect-[2/3] overflow-hidden bg-[#191919]">
            {!imageFailed ? (
              <img
                key={posterUrl}
                src={posterUrl}
                alt={movie.title}
                onError={() => {
                  startTransition(() => setImageFailed(true))
                }}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
            ) : (
              <div
                className="flex h-full flex-col items-center justify-center px-6 text-center"
                style={{
                  background: `linear-gradient(160deg, ${movie.gradientAccent}33, #0B0B0F 75%)`,
                }}
              >
                <div className="mb-5 text-5xl">🎬</div>
                <div className="font-playfair text-xl font-black text-white">{movie.title}</div>
                <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">{movie.language}</div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

            <div
              className="absolute left-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-lg"
              style={{ background: platform.gradient }}
            >
              {platform.label}
            </div>

            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
              <Star size={12} fill="#F5C542" stroke="none" />
              {movie.rating.toFixed(1)}
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              {movie.editorialTagline && (
                <p className="line-clamp-2 text-sm font-medium leading-5 text-white/85">{movie.editorialTagline}</p>
              )}
            </div>
          </div>
        </Link>

        <div className="space-y-4 p-4">
          <div>
            <Link href={`/movie/${movie.id}`} className="font-playfair text-xl font-black leading-tight text-white transition group-hover:text-[#C4B5FD]">
              {movie.title}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              <span>{movie.language}</span>
              <span>•</span>
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.duration}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {movie.moods.slice(0, 3).map((mood) => (
              <span key={mood} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/70">
                {mood}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white/45">
              <Calendar size={13} />
              {movie.releaseDate}
            </div>
            <button
              type="button"
              onClick={() => setTrailerOpen(true)}
              suppressHydrationWarning
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#C4B5FD]"
            >
              <Play size={13} fill="currentColor" />
              Trailer
            </button>
          </div>
        </div>
      </article>
      </TiltCard>

      {trailerOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0F] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <div className="font-playfair text-2xl font-black text-white">{movie.title}</div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Manual trailer link</div>
              </div>
              <button
                type="button"
                onClick={() => setTrailerOpen(false)}
                suppressHydrationWarning
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/70 hover:text-white"
              >
                Close
              </button>
            </div>

            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${movie.title} trailer`}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center text-white">
                <p className="max-w-md text-white/70">This trailer URL cannot be embedded, but the manual link can open directly.</p>
                <button
                  type="button"
                  onClick={() => window.open(movie.youtubeTrailer, "_blank", "noopener,noreferrer")}
                  suppressHydrationWarning
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black"
                >
                  <ExternalLink size={15} />
                  Open Trailer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
