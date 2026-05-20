"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FormEvent, ReactElement, useCallback, useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Edit3,
  ExternalLink,
  Film,
  LayoutDashboard,
  Menu,
  Monitor,
  Plus,
  Save,
  Search,
  Shield,
  Sparkles,
  Star,
  Tags,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react"
import AdminModal from "@/components/admin/AdminModal"
import TeluguPickFormModal from "@/components/admin/TeluguPickFormModal"
import { MovieImageUpload } from "@/components/admin/MovieImageUpload"
import { movies as seedMovies } from "@/data/movies"
import { ADMIN_MOVIES_STORAGE_KEY, MOOD_ORDERS_STORAGE_KEY, notifyMoodOrdersUpdated, notifyMoviesUpdated } from "@/lib/admin-movies-storage"
import { getMoviesByMoodOrdered } from "@/lib/mood-utils"
import { LANGUAGES, MOODS, OTT_PLATFORMS, type Mood, type MovieCurated, type MovieLanguage, type OTTPlatform } from "@/types/movie"

type DraftMovie = Omit<MovieCurated, "uuid" | "moods" | "genre"> & {
  uuid?: string
  moods: string[]
  genre: string
}


const emptyDraft: DraftMovie = {
  uuid: undefined,
  title: "",
  description: "",
  poster: "",
  backdrop: "",
  ott: "Netflix",
  language: "Telugu",
  release_date: "2026-05-12",
  moods: ["Emotional"],
  rating: 8,
  trailer: "",
  genre: "Drama",
  trending: false,
  weekly: false,
  featured: false,
  mood_order: 99,
}


function toDraft(movie: MovieCurated): DraftMovie {
  return {
    ...movie,
    moods: movie.moods,
    genre: movie.genre.join(", "),
  }
}


function toMovie(draft: DraftMovie, fallbackUuid: string): MovieCurated {
  return {
    ...draft,
    uuid: draft.uuid ?? fallbackUuid,
    moods: draft.moods as Mood[],
    ott: draft.ott as OTTPlatform,
    language: draft.language as MovieLanguage,
    genre: draft.genre.split(",").map((item) => item.trim()).filter(Boolean),
    description: draft.description || "",
    poster: draft.poster || "",
    backdrop: draft.backdrop || "",
    release_date: draft.release_date || "",
    trailer: draft.trailer || "",
  }
}


function getMoodEmoji(mood: Mood): string {
  const moodEmojiMap: Record<Mood, string> = {
    Love: "❤️",
    Emotional: "🥹",
    Mass: "🔥",
    Thriller: "🕵️",
    Action: "💥",
    "Feel Good": "✨",
    Comedy: "😂",
    Dark: "🌑",
    Motivational: "🏆",
    Family: "👨‍👩‍👧‍👦",
    "Sci-Fi": "🚀",
    "Mind Bending": "🧠",
  }

  return moodEmojiMap[mood] ?? "🎬"
}

import { supabase } from "@/lib/supabase"

/**
 * Maps camelCase MovieCurated back to Supabase snake_case columns
 */
function mapToSupabase(movie: MovieCurated) {
  return {
    uuid: movie.uuid,
    title: movie.title,
    description: movie.description,
    poster: movie.poster,
    backdrop: movie.backdrop,
    ott: movie.ott,
    language: movie.language,
    release_date: movie.release_date,
    moods: movie.moods,
    rating: Number(movie.rating || 0),

    trailer: movie.trailer,
    genre: movie.genre,
    trending: movie.trending,
    weekly: movie.weekly,
    featured: movie.featured,
    mood_order: movie.mood_order,
  }
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


export default function AdminPage() {
  const pathname = usePathname()
  const [movies, setMovies] = useState<MovieCurated[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState<OTTPlatform | "All">("All")
  const [moodFilter, setMoodFilter] = useState<Mood | "All">("All")
  const [modalOpen, setModalOpen] = useState(false)
  const [moodOrderModalOpen, setMoodOrderModalOpen] = useState(false)
  const [selectedMoodForOrder, setSelectedMoodForOrder] = useState<Mood | null>(null)
  const [draft, setDraft] = useState<DraftMovie>(emptyDraft)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchMovies = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (!supabase) {
        console.error('Supabase Error: Supabase client not initialized. Check environment variables.')
        setError('Supabase not configured')
        setLoading(false)
        return
      }

      const { data, error: sbError } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false })

      if (sbError) {
        console.error('Supabase Full Error:', JSON.stringify(sbError, null, 2))
        throw sbError
      }
      setMovies(data?.map(mapFromSupabase) || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])





  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])


  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesQuery = movie.title.toLowerCase().includes(query.toLowerCase())
      const matchesPlatform = platformFilter === "All" || movie.ott === platformFilter
      const matchesMood = moodFilter === "All" || movie.moods.includes(moodFilter)
      return matchesQuery && matchesPlatform && matchesMood
    })
  }, [movies, moodFilter, platformFilter, query])

  const weeklyMovies = useMemo(
    () => movies.filter((movie) => movie.weekly).sort((a, b) => (a.mood_order ?? 999) - (b.mood_order ?? 999)),
    [movies],
  )

  const trendingMovies = useMemo(
    () => movies.filter((movie) => movie.trending).sort((a, b) => (a.mood_order ?? 999) - (b.mood_order ?? 999)),
    [movies],
  )


  const stats = useMemo(() => ({
    totalMovies: movies.length,
    weeklyReleases: movies.filter(m => m.weekly).length,
    featuredMovies: movies.filter(m => m.featured).length,
    platforms: new Set(movies.map(m => m.ott)).size,
  }), [movies])


  const openCreate = () => {
    setDraft(emptyDraft)
    setModalOpen(true)
  }

  const openCreateWithMoods = (moods: Mood[]) => {
    setDraft({ ...emptyDraft, moods: moods.length > 0 ? moods : (emptyDraft.moods as Mood[]) })
    setModalOpen(true)
  }

  const goToMovieLibraryForMood = (mood: Mood) => {
    setMoodFilter(mood)
    setPlatformFilter("All")
    setQuery("")
    setActiveSection("movies")
    setSidebarOpen(false)
  }

  const openEdit = (movie: MovieCurated) => {
    setDraft(toDraft(movie))
    setModalOpen(true)
  }

  const saveMovie = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      if (!supabase) {
        console.error('Supabase Error: Supabase client not initialized. Check environment variables.')
        setError('Supabase not configured')
        setLoading(false)
        return
      }

      const savedMovie = toMovie(draft, crypto.randomUUID())
      const payload = mapToSupabase(savedMovie)
      
      // If adding new, remove uuid so DB generates it (if preferred) or keep it.
      // Since it's upsert, we need a conflict target.
      const { error: sbError } = await supabase
        .from('movies')
        .upsert(payload, { onConflict: 'uuid' })

      if (sbError) {
        console.error('Supabase Full Error:', JSON.stringify(sbError, null, 2))
        throw sbError
      }

      setModalOpen(false)
      fetchMovies()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


  const updateMovie = async (uuid: string, patch: Partial<MovieCurated>) => {
    try {
      if (!supabase) {
        console.error('Supabase Error: Supabase client not initialized. Check environment variables.')
        setError('Supabase not configured')
        return
      }

      const movie = movies.find(m => m.uuid === uuid)
      if (!movie) return

      const updated = { ...movie, ...patch }
      const payload = mapToSupabase(updated)

      const { error: sbError } = await supabase
        .from('movies')
        .update(payload)
        .eq('uuid', uuid)

      if (sbError) {
        console.error('Supabase Full Error:', JSON.stringify(sbError, null, 2))
        throw sbError
      }
      fetchMovies()
    } catch (err: any) {
      setError(err.message)
    }
  }


  const deleteMovie = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return
    try {
      if (!supabase) {
        console.error('Supabase Error: Supabase client not initialized. Check environment variables.')
        setError('Supabase not configured')
        return
      }

      const { error: sbError } = await supabase
        .from('movies')
        .delete()
        .eq('uuid', uuid)

      if (sbError) {
        console.error('Supabase Full Error:', JSON.stringify(sbError, null, 2))
        throw sbError
      }
      fetchMovies()
    } catch (err: any) {
      setError(err.message)
    }
  }


  const moveWeekly = async (uuid: string, direction: -1 | 1) => {
    const ordered = weeklyMovies.map((movie) => movie.uuid)
    const index = ordered.indexOf(uuid)
    const target = index + direction
    if (target < 0 || target >= ordered.length) return
    const swapped = [...ordered]
    ;[swapped[index], swapped[target]] = [swapped[target], swapped[index]]
    
    // Optimistic update
    const updatedMovies = movies.map((movie) =>
      swapped.includes(movie.uuid) ? { ...movie, mood_order: swapped.indexOf(movie.uuid) + 1 } : movie
    )
    setMovies(updatedMovies)

    try {
      const updates = updatedMovies
        .filter(m => swapped.includes(m.uuid))
        .map(m => mapToSupabase(m))
      
      const { error: sbError } = await supabase.from('movies').upsert(updates)
      if (sbError) {
        console.error('Supabase Full Error:', JSON.stringify(sbError, null, 2))
        throw sbError
      }
    } catch (err: any) {
      setError("Failed to sync weekly order: " + err.message)
      fetchMovies() // rollback
    }
  }


  const moveTrending = async (uuid: string, direction: -1 | 1) => {
    const ordered = trendingMovies.map((movie) => movie.uuid)
    const index = ordered.indexOf(uuid)
    const target = index + direction
    if (target < 0 || target >= ordered.length) return
    const swapped = [...ordered]
    ;[swapped[index], swapped[target]] = [swapped[target], swapped[index]]
    
    // Optimistic update
    const updatedMovies = movies.map((movie) =>
      swapped.includes(movie.uuid) ? { ...movie, mood_order: swapped.indexOf(movie.uuid) + 1 } : movie
    )
    setMovies(updatedMovies)

    try {
      const updates = updatedMovies
        .filter(m => swapped.includes(m.uuid))
        .map(m => mapToSupabase(m))
      
      const { error: sbError } = await supabase.from('movies').upsert(updates)
      if (sbError) {
        console.error('Supabase Full Error:', JSON.stringify(sbError, null, 2))
        throw sbError
      }
    } catch (err: any) {
      setError("Failed to sync trending order: " + err.message)
      fetchMovies() // rollback
    }
  }


  async function signOut() {
    setSidebarOpen(false)
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/admin/login"
  }

  if (loading && movies.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent" />
      </div>
    )
  }

  return (
    <main className="relative flex min-h-screen bg-[#FAFAF7] text-[#111827]">
      {error && (
        <div className="fixed top-4 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg animate-in fade-in slide-in-from-top-4">
          Error: {error}
          <button onClick={() => setError(null)} className="ml-4 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}
      {sidebarOpen && (
        <button suppressHydrationWarning
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-[#111827]/25 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex w-full">
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-shrink-0 flex-col border-r border-[rgba(124,58,237,0.1)] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-out lg:static lg:z-0 lg:translate-x-0 lg:shadow-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[rgba(124,58,237,0.1)] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED] text-white shadow-[0_8px_24px_rgba(124,58,237,0.35)]">
                <Film size={18} />
              </div>
              <div>
                <div className="font-playfair text-lg font-bold text-[#111827]">Absolute</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7C3AED]">Cinema Admin</div>
              </div>
            </div>
            <button suppressHydrationWarning
              type="button"
              className="rounded-lg p-2 text-[#6B7280] hover:bg-[#F3F4F6] lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "movies", label: "Movies", icon: Film },
              { id: "moods", label: "Moods", icon: Tags },
              { id: "weekly", label: "Weekly Releases", icon: Clock },
              { id: "trending", label: "Trending Now", icon: TrendingUp },
              { id: "latest", label: "Latest Movies", icon: Star },
            ].map((item) => (
              <button suppressHydrationWarning
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveSection(item.id)
                  setSidebarOpen(false)
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "bg-[#7C3AED] text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)]"
                    : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
            <Link
              href="/admin/telugu-picks"
              onClick={() => setSidebarOpen(false)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                pathname.startsWith("/admin/telugu-picks")
                  ? "bg-[#7C3AED] text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)]"
                  : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]"
              }`}
            >
              <Sparkles size={16} />
              Telugu Picks
            </Link>
          </nav>

          <div className="border-t border-[rgba(124,58,237,0.1)] p-4">
            <button suppressHydrationWarning
              type="button"
              onClick={() => void signOut()}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#4B5563] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
            >
              <Shield size={16} />
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col lg:ml-0">
          <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[rgba(124,58,237,0.1)] bg-white/90 px-4 backdrop-blur-md sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button suppressHydrationWarning
                type="button"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(124,58,237,0.15)] bg-white text-[#4B5563] shadow-sm transition hover:border-[#7C3AED]/40 hover:text-[#111827] lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <h1 className="truncate text-lg font-semibold capitalize text-[#111827] sm:text-xl">{activeSection}</h1>
              <Link
                href="/"
                className="ml-2 hidden shrink-0 text-sm font-medium text-[#7C3AED] underline-offset-4 hover:underline md:inline"
              >
                View site
              </Link>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2 sm:gap-4">
              <div className="relative hidden sm:block">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input suppressHydrationWarning
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search movies..."
                  className="w-48 rounded-full border border-[rgba(124,58,237,0.12)] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#7C3AED] md:w-64"
                />
              </div>
              <button suppressHydrationWarning
                type="button"
                onClick={openCreate}
                className="hidden items-center gap-2 rounded-full bg-[#7C3AED] px-3 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)] transition hover:bg-[#6D28D9] sm:flex sm:px-4"
              >
                <Plus size={16} />
                Add Movie
              </button>
            </div>
          </header>

          <div className="border-b border-[rgba(124,58,237,0.1)] bg-white/95 px-4 py-3 sm:hidden">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input suppressHydrationWarning
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search movies..."
                className="w-full rounded-full border border-[rgba(124,58,237,0.12)] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#7C3AED]"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
            {activeSection === "dashboard" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Total Movies" value={stats.totalMovies} icon={Film} color="#7C3AED" />
                  <StatCard label="Weekly Releases" value={stats.weeklyReleases} icon={Clock} color="#10B981" />
                  <StatCard label="Featured Movies" value={stats.featuredMovies} icon={Star} color="#F59E0B" />
                  <StatCard label="Platforms" value={stats.platforms} icon={Monitor} color="#3B82F6" />
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-[var(--card-shadow)] p-6">
                  <h2 className="text-lg font-semibold mb-4">Recent Movies</h2>
                  <div className="space-y-3">
                    {movies.slice(0, 5).map((movie) => (
                      <div key={movie.uuid} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
                            <Film size={16} className="text-[#7C3AED]" />
                          </div>
                          <div>
                            <div className="font-medium">{movie.title}</div>
                            <div className="text-xs text-[#6B7280]">{movie.ott} • {movie.year}</div>
                          </div>
                        </div>
                        <button suppressHydrationWarning onClick={() => openEdit(movie)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <Edit3 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "moods" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-violet-100 bg-violet-50/80 p-4 text-sm text-[#4B5563] shadow-[var(--card-shadow)]">
                  <p className="font-medium text-[#111827]">How moods reach the homepage</p>
                  <p className="mt-2 leading-relaxed">
                    Each movie can have several moods. The public site filters the grid by the mood chips users tap (for example Love). Use{" "}
                    <span className="font-semibold text-[#5B21B6]">Add Movie</span> or the pencil on any row, then in the form scroll to{" "}
                    <span className="font-semibold text-[#5B21B6]">Moods</span> and tick every emotion that applies. Saving updates the site immediately (same browser).
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {MOODS.map((mood) => {
                    const inMood = movies.filter((m) => m.moods.includes(mood))
                    const emoji = getMoodEmoji(mood)
                    return (
                      <div key={mood} className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-[var(--card-shadow)]">
                        <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="text-xl" aria-hidden>
                              {emoji}
                            </span>
                            <span className="truncate font-semibold text-[#111827]">{mood}</span>
                          </div>
                          <span className="shrink-0 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-[#5B21B6]">{inMood.length}</span>
                        </div>
                        <ul className="mt-3 min-h-[4.5rem] flex-1 space-y-1 text-sm text-[#6B7280]">
                          {inMood.length === 0 ? (
                            <li className="italic text-[#9CA3AF]">No movies tagged yet</li>
                          ) : (
                            inMood.slice(0, 6).map((m) => (
                              <li key={m.id} className="truncate">
                                {m.title}
                              </li>
                            ))
                          )}
                          {inMood.length > 6 ? <li className="text-xs text-[#9CA3AF]">+{inMood.length - 6} more</li> : null}
                        </ul>
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                          <button suppressHydrationWarning
                            type="button"
                            onClick={() => openCreateWithMoods([mood])}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#7C3AED] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#6D28D9]"
                          >
                            <Plus size={14} />
                            Add movie
                          </button>
                          <button suppressHydrationWarning
                            type="button"
                            onClick={() => {
                              setSelectedMoodForOrder(mood)
                              setMoodOrderModalOpen(true)
                            }}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-[#111827] transition-colors hover:bg-gray-50"
                          >
                            Reorder
                          </button>
                          <button suppressHydrationWarning
                            type="button"
                            onClick={() => goToMovieLibraryForMood(mood)}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-[#111827] transition-colors hover:bg-gray-50"
                          >
                            Open library
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeSection === "movies" && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-[var(--card-shadow)] sm:p-6">
                <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-base font-semibold sm:text-lg">Movie Library</h2>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select suppressHydrationWarning value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value as OTTPlatform | "All")} className="w-full rounded-lg border border-gray-200 bg-[#FAFAF7] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#7C3AED] sm:w-auto">
                      <option>All Platforms</option>
                      {OTT_PLATFORMS.map((platform) => <option key={platform}>{platform}</option>)}
                    </select>
                    <select suppressHydrationWarning value={moodFilter} onChange={(event) => setMoodFilter(event.target.value as Mood | "All")} className="w-full rounded-lg border border-gray-200 bg-[#FAFAF7] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#7C3AED] sm:w-auto">
                      <option>All Moods</option>
                      {MOODS.map((mood) => <option key={mood}>{mood}</option>)}
                    </select>
                  </div>
                </div>

                <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead className="text-xs uppercase tracking-wider text-[#6B7280]">
                      <tr>
                        <th className="text-left py-3 px-4">Movie</th>
                        <th className="text-left py-3 px-4">OTT</th>
                        <th className="text-left py-3 px-4">Moods</th>
                        <th className="text-left py-3 px-4">Rating</th>
                        <th className="text-left py-3 px-4">Flags</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredMovies.map((movie) => (
                        <tr key={movie.uuid} className="hover:bg-violet-50/80">
                          <td className="py-3 px-4">
                            <div className="font-medium">{movie.title}</div>
                            <div className="text-xs text-[#6B7280]">{movie.language} • {movie.year}</div>
                          </td>
                          <td className="py-3 px-4">{movie.ott}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {movie.moods.slice(0, 2).map((mood) => (
                                <span key={mood} className="rounded-full bg-violet-50 px-2 py-0.5 text-xs text-[#5B21B6]">
                                  {mood}
                                </span>
                              ))}
                              {movie.moods.length > 2 && <span className="text-xs text-[#6B7280]">+{movie.moods.length - 2}</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4">{Number(movie.rating || 0).toFixed(1)}</td>
                          <td className="py-3 px-4 text-xs text-[#6B7280]">
                            {[movie.featured && "Featured", movie.trending && "Trending", movie.weekly && "Weekly"].filter(Boolean).join(", ") || "-"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button suppressHydrationWarning onClick={() => openEdit(movie)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <Edit3 size={14} />
                              </button>
                              <button suppressHydrationWarning onClick={() => deleteMovie(movie.uuid)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSection === "weekly" && (
              <div className="rounded-xl border border-gray-200 bg-white shadow-[var(--card-shadow)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Weekly OTT Releases</h2>
                  <p className="text-sm text-[#6B7280]">Drag to reorder • Click to remove</p>
                </div>

                <div className="space-y-2">
                  {weeklyMovies.map((movie, index) => (
                    <div key={movie.uuid} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center text-sm font-bold text-[#A78BFA]">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{movie.title}</div>
                          <div className="text-xs text-[#6B7280]">{movie.ott} • {movie.language}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button suppressHydrationWarning onClick={() => moveWeekly(movie.uuid, -1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" disabled={index === 0}>
                          ↑
                        </button>
                        <button suppressHydrationWarning onClick={() => moveWeekly(movie.uuid, 1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" disabled={index === weeklyMovies.length - 1}>
                          ↓
                        </button>
                        <button suppressHydrationWarning onClick={() => updateMovie(movie.uuid, { weekly: false })} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">

                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {weeklyMovies.length === 0 && (
                    <div className="text-center py-12 text-[#6B7280]">
                      <Clock size={32} className="mx-auto mb-3 opacity-50" />
                      <p>No weekly releases configured</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === "latest" && (
              <div className="rounded-xl border border-gray-200 bg-white shadow-[var(--card-shadow)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Latest Movies</h2>
                </div>

                <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                  <table className="w-full min-w-[400px] text-sm">
                    <thead className="text-xs uppercase tracking-wider text-[#6B7280]">
                      <tr>
                        <th className="text-left py-3 px-4">Movie</th>
                        <th className="text-left py-3 px-4">OTT</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {movies.filter(m => m.featured).map((movie) => (
                        <tr key={movie.uuid} className="hover:bg-violet-50/80">
                          <td className="py-3 px-4">
                            <div className="font-medium">{movie.title}</div>
                            <div className="text-xs text-[#6B7280]">{movie.language} • {new Date(movie.release_date).getFullYear()}</div>
                          </td>

                          <td className="py-3 px-4">{movie.ott}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">Active</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button suppressHydrationWarning onClick={() => openEdit(movie)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <Edit3 size={14} />
                              </button>
                              <button suppressHydrationWarning onClick={() => updateMovie(movie.uuid, { featured: false })} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">

                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSection === "trending" && (
              <div className="rounded-xl border border-gray-200 bg-white shadow-[var(--card-shadow)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Trending Management</h2>
                  <p className="text-sm text-[#6B7280]">Sorting controls for Homepage & Trending page</p>
                </div>

                <div className="space-y-2">
                  {trendingMovies.map((movie, index) => (
                    <div key={movie.uuid} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center text-sm font-bold text-[#A78BFA]">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{movie.title}</div>
                          <div className="text-xs text-[#6B7280]">{movie.ott} • {Number(movie.rating || 0).toFixed(1)} Rating</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button suppressHydrationWarning onClick={() => moveTrending(movie.uuid, -1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" disabled={index === 0}>
                          ↑
                        </button>
                        <button suppressHydrationWarning onClick={() => moveTrending(movie.uuid, 1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" disabled={index === trendingMovies.length - 1}>
                          ↓
                        </button>
                        <button suppressHydrationWarning onClick={() => updateMovie(movie.uuid, { trending: false })} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {trendingMovies.length === 0 && (
                    <div className="text-center py-12 text-[#6B7280]">
                      <TrendingUp size={32} className="mx-auto mb-3 opacity-50" />
                      <p>No trending movies configured</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={draft.uuid ? "Edit Movie" : "Add Movie"}

        maxWidth="max-w-4xl"
      >
        <form suppressHydrationWarning onSubmit={saveMovie}>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Field label="Movie Title"><input suppressHydrationWarning required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></Field>
            <Field label="OTT Platform"><select suppressHydrationWarning value={draft.ott} onChange={(event) => setDraft({ ...draft, ott: event.target.value as OTTPlatform })}>{OTT_PLATFORMS.map((platform) => <option key={platform}>{platform}</option>)}</select></Field>

            <Field label="Language"><select suppressHydrationWarning value={draft.language} onChange={(event) => setDraft({ ...draft, language: event.target.value as MovieLanguage })}>{LANGUAGES.map((language) => <option key={language}>{language}</option>)}</select></Field>
            <Field label="Rating"><input suppressHydrationWarning type="number" min="0" max="10" step="0.1" value={draft.rating} onChange={(event) => setDraft({ ...draft, rating: Number(event.target.value) })} /></Field>
            <Field label="Release Date"><input suppressHydrationWarning type="date" value={draft.release_date} onChange={(event) => setDraft({ ...draft, release_date: event.target.value })} /></Field>
            <Field label="YouTube Trailer"><input suppressHydrationWarning value={draft.trailer} onChange={(event) => setDraft({ ...draft, trailer: event.target.value })} /></Field>
            <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
              <MovieImageUpload
                label="Upload Poster"
                kind="poster"
                slug={draft.title || "movie"}
                storedPath={draft.poster}
                onPathChange={(path) => setDraft({ ...draft, poster: path })}
                fallbackLabel="poster URL field below"
              />
              <MovieImageUpload
                label="Upload Backdrop"
                kind="backdrop"
                slug={draft.title || "movie"}
                storedPath={draft.backdrop}
                onPathChange={(path) => setDraft({ ...draft, backdrop: path })}
                fallbackLabel="backdrop URL field below"
              />
            </div>
            <Field label="Poster URL (fallback)"><input suppressHydrationWarning value={draft.poster} onChange={(event) => setDraft({ ...draft, poster: event.target.value })} /></Field>
            <Field label="Backdrop URL (fallback)"><input suppressHydrationWarning value={draft.backdrop ?? ""} onChange={(event) => setDraft({ ...draft, backdrop: event.target.value })} /></Field>
            <label className="md:col-span-2">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Description</span>
              <textarea suppressHydrationWarning value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="min-h-20 w-full rounded-lg border border-gray-200 bg-[#FAFAF7] px-4 py-3 text-sm text-[#111827] outline-none transition-colors focus:border-[#7C3AED]" />
            </label>

          </div>

          <div className="mb-6" id="admin-modal-moods">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Moods</div>
            <p className="mb-3 text-xs text-[#6B7280]">These tags control which mood rows on the public homepage include this title (users can pick Love, Comedy, and so on).</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {MOODS.map((mood) => (
                <label key={mood} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-[#FAFAF7] p-3 transition-colors hover:bg-gray-100">
                  <input suppressHydrationWarning
                    type="checkbox"
                    checked={draft.moods.includes(mood)}
                    onChange={(event) => {
                      setDraft({
                        ...draft,
                        moods: event.target.checked ? [...draft.moods, mood] : draft.moods.filter((item) => item !== mood),
                      })
                    }}
                    className="rounded border-gray-200 bg-gray-50 text-[#7C3AED] focus:ring-[#7C3AED]"
                  />
                  <span className="text-sm">{mood}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Flags</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                ["featured", "Featured"],
                ["trending", "Trending"],
                ["weekly", "Weekly"],
              ].map(([key, label]) => (

                <label key={key} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-[#FAFAF7] p-3 transition-colors hover:bg-gray-100">
                  <input suppressHydrationWarning type="checkbox" checked={Boolean(draft[key as keyof DraftMovie])} onChange={(event) => setDraft({ ...draft, [key]: event.target.checked })} className="rounded border-gray-200 bg-gray-50 text-[#7C3AED] focus:ring-[#7C3AED]" />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Ordering</div>
            <Field label="Mood Order"><input suppressHydrationWarning type="number" value={draft.mood_order} onChange={(event) => setDraft({ ...draft, mood_order: Number(event.target.value) })} /></Field>
          </div>


          <div className="mb-6">
            {/* Homepage row flag removed from schema, can be determined by trending/featured/weekly */}
          </div>


          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button suppressHydrationWarning type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-[#111827] transition-colors hover:bg-gray-100">
              Cancel
            </button>
            <button suppressHydrationWarning type="submit" className="flex items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6D28D9]">
              <Save size={14} />
              Save Movie
            </button>
          </div>
        </form>
      </AdminModal>
      <MoodOrderModal
        isOpen={moodOrderModalOpen}
        onClose={() => {
          setMoodOrderModalOpen(false)
          setSelectedMoodForOrder(null)
        }}
        mood={selectedMoodForOrder}
        movies={movies}
        onOrderChange={async (newOrder) => {
          if (!selectedMoodForOrder) return
          
          // Optimistic local update
          setMovies(prev => prev.map(m => {
            const idx = newOrder.indexOf(m.uuid)
            if (idx !== -1) return { ...m, mood_order: idx + 1 }
            return m
          }))

          try {
            // Update Supabase for each movie in the new order
            const promises = newOrder.map((uuid, index) => 
              supabase
                .from('movies')
                .update({ mood_order: index + 1 })
                .eq('uuid', uuid)
            )
            
            const results = await Promise.all(promises)
            const error = results.find(r => r.error)?.error
            if (error) throw error
          } catch (err: any) {
            console.error('Failed to save mood orders:', err)
            setError("Failed to save mood orders.")
          }
        }}
      />

      <button
        type="button"
        onClick={openCreate}
        aria-label="Add movie"
        className="fixed bottom-6 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#7C3AED] text-white shadow-[0_8px_32px_rgba(124,58,237,0.45)] transition active:scale-95 hover:bg-[#6D28D9] lg:hidden"
        style={{ marginBottom: 'max(0px, env(safe-area-inset-bottom))' }}
        suppressHydrationWarning
      >
        <Plus size={22} />
      </button>
    </main>
  )
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-[var(--card-shadow)] p-6">
      <div className="flex items-center justify-between mb-4">
        <Icon size={20} style={{ color }} />
        <span className="text-2xl font-bold text-[#111827]">{value}</span>
      </div>
      <div className="text-sm text-[#6B7280]">{label}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactElement }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">{label}</span>
      <div className="[&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-gray-200 [&_input]:bg-[#FAFAF7] [&_input]:px-4 [&_input]:py-2 [&_input]:text-sm [&_input]:text-[#111827] [&_input]:outline-none [&_input]:focus:border-[#7C3AED] [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-gray-200 [&_select]:bg-[#FAFAF7] [&_select]:px-4 [&_select]:py-2 [&_select]:text-sm [&_select]:text-[#111827] [&_select]:outline-none [&_select]:focus:border-[#7C3AED]">
        {children}
      </div>
    </label>
  )
}

function PositionInput({
  value,
  max,
  onChange,
}: {
  value: number
  max: number
  onChange: (val: number) => void
}) {
  const [local, setLocal] = useState(value.toString())

  useEffect(() => {
    setLocal(value.toString())
  }, [value])

  const commit = () => {
    const n = parseInt(local, 10)
    if (!isNaN(n) && n !== value) {
      onChange(Math.max(1, Math.min(max, n)))
    } else {
      setLocal(value.toString())
    }
  }

  return (
    <div className="relative group">
      <input
        type="number"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            commit()
            ;(e.target as HTMLInputElement).blur()
          }
          if (e.key === "Escape") {
            setLocal(value.toString())
            ;(e.target as HTMLInputElement).blur()
          }
        }}
        onFocus={(e) => e.target.select()}
        className="w-16 rounded-xl border-2 border-transparent bg-white py-2.5 text-center text-base font-black text-[#7C3AED] shadow-[0_2px_8px_rgba(124,58,237,0.12)] outline-none transition-all group-hover:border-[#7C3AED]/20 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/10"
      />
      <div className="absolute -top-2 -right-1 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-[#7C3AED] text-[10px] text-white font-bold">#</div>
    </div>
  )
}

function MoodOrderModal({
  isOpen,
  onClose,
  mood,
  movies,
  onOrderChange,
}: {
  isOpen: boolean
  onClose: () => void
  mood: Mood | null
  movies: MovieCurated[]
  onOrderChange: (newOrder: string[]) => void
}) {

  const [lastMovedId, setLastMovedId] = useState<string | null>(null)

  const orderedMovies = useMemo(() => {
    if (!mood) return []
    return getMoviesByMoodOrdered(movies, mood)
  }, [movies, mood])


  if (!mood) return null

  const moveItem = (uuid: string, direction: -1 | 1) => {
    const uuids = orderedMovies.map((m) => m.uuid)
    const index = uuids.indexOf(uuid)
    const target = index + direction
    if (target < 0 || target >= uuids.length) return
    const newUuids = [...uuids]
    ;[newUuids[index], newUuids[target]] = [newUuids[target], newUuids[index]]
    setLastMovedId(uuid)
    onOrderChange(newUuids)
    setTimeout(() => setLastMovedId(null), 1000)
  }

  const handlePositionChange = (uuid: string, newPos: number) => {
    const uuids = orderedMovies.map((m) => m.uuid)
    const oldIndex = uuids.indexOf(uuid)
    const newIndex = newPos - 1

    if (oldIndex === newIndex) return

    const newUuids = [...uuids]
    const [removed] = newUuids.splice(oldIndex, 1)
    newUuids.splice(newIndex, 0, removed)
    setLastMovedId(uuid)
    onOrderChange(newUuids)
    setTimeout(() => setLastMovedId(null), 1000)
  }


  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={`Ranking: ${mood}`} maxWidth="max-w-2xl">
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/50 p-4 text-xs text-[#5B21B6]">
          <Sparkles size={16} className="shrink-0" />
          <p className="font-medium">
            Type a number to jump to a specific rank, or use arrows to shift. The row will glow when moved.
          </p>
        </div>

        <div className="custom-scrollbar max-h-[60vh] overflow-y-auto pr-2 space-y-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {orderedMovies.map((movie, index) => (
              <motion.div
                key={movie.uuid}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  backgroundColor: lastMovedId === movie.uuid ? "#F5F3FF" : "#F9FAFB",
                  borderColor: lastMovedId === movie.uuid ? "#DDD6FE" : "#F3F4F6",
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  layout: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="flex items-center justify-between rounded-2xl border p-3 shadow-sm transition-colors hover:bg-white hover:shadow-md"
              >
                <div className="flex items-center gap-5">
                  <PositionInput
                    value={index + 1}
                    max={orderedMovies.length}
                    onChange={(val) => handlePositionChange(movie.uuid, val)}
                  />
                  
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-[#111827]">{movie.title}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#6B7280]">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5">{movie.language}</span>
                      <span>•</span>
                      <span>{new Date(movie.release_date).getFullYear()}</span>

                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl bg-white p-1 shadow-inner border border-gray-100">
                  <button
                    type="button"
                    onClick={() => moveItem(movie.uuid, -1)}
                    disabled={index === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] transition-all hover:bg-violet-50 hover:text-[#7C3AED] disabled:opacity-20 active:scale-90"
                  >
                    <ChevronUp size={20} />
                  </button>
                  <div className="h-4 w-px bg-gray-100" />
                  <button
                    type="button"
                    onClick={() => moveItem(movie.uuid, 1)}
                    disabled={index === orderedMovies.length - 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] transition-all hover:bg-violet-50 hover:text-[#7C3AED] disabled:opacity-20 active:scale-90"
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {orderedMovies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-3xl">🎬</div>
              <p className="text-sm font-semibold text-[#111827]">No movies in this category</p>
              <p className="mt-1 text-xs text-[#6B7280]">Tag some movies with this mood to start ranking.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl bg-[#111827] px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#1f2937] hover:-translate-y-0.5 active:translate-y-0"
        >
          Close Ranking
        </button>
      </div>
    </AdminModal>
  )
}

