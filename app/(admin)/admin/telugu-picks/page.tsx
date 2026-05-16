"use client"

/* eslint-disable @next/next/no-img-element */

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Copy,
  ExternalLink,
  Film,
  GripVertical,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Shield,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import TeluguPickFormModal from "@/components/admin/TeluguPickFormModal"
import { ADMIN_MOVIES_STORAGE_KEY } from "@/lib/admin-movies-storage"
import { getTeluguPickPoster } from "@/lib/movie-images"
import type { MovieCurated } from "@/types/movie"
import type { TeluguPick } from "@/types/telugu-pick"

function parseMoviesFromStorage(): MovieCurated[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(ADMIN_MOVIES_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed as MovieCurated[]
  } catch {
    return []
  }
}

export default function TeluguPicksAdminPage() {
  const [picks, setPicks] = useState<TeluguPick[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Set<number>>(() => new Set())
  const [toast, setToast] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TeluguPick | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [libraryMovies, setLibraryMovies] = useState<{ uuid: string; title: string }[]>([])

  const [dragId, setDragId] = useState<number | null>(null)

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3200)
  }, [])

  const loadPicks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/telugu-picks")
      const data = (await res.json().catch(() => ({}))) as { picks?: TeluguPick[]; error?: string }
      if (!res.ok) {
        showToast(data.error || "Failed to load picks")
        setPicks([])
        return
      }
      setPicks(Array.isArray(data.picks) ? data.picks : [])
    } catch {
      showToast("Network error loading picks")
      setPicks([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    void loadPicks()
    setLibraryMovies(
      parseMoviesFromStorage()
        .map((m) => ({ uuid: m.uuid, title: m.title }))
        .sort((a, b) => a.title.localeCompare(b.title)),

    )
  }, [loadPicks])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return picks
    return picks.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.ott.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }, [picks, query])

  const sortedForDisplay = useMemo(
    () => filtered.slice().sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id),
    [filtered],
  )

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAllVisible = () => {
    const ids = sortedForDisplay.map((p) => p.id)
    const allSelected = ids.length > 0 && ids.every((id) => selected.has(id))
    setSelected(allSelected ? new Set() : new Set(ids))
  }

  const bulk = async (action: "delete" | "activate" | "deactivate") => {
    const ids = [...selected]
    if (ids.length === 0) {
      showToast("Select at least one row")
      return
    }
    const res = await fetch("/api/admin/telugu-picks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ids }),
    })
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    if (!res.ok) {
      showToast(data.error || "Bulk action failed")
      return
    }
    setSelected(new Set())
    await loadPicks()
    showToast("Updated")
  }

  const duplicate = async (id: number) => {
    const res = await fetch(`/api/admin/telugu-picks?duplicateFrom=${id}`, { method: "POST" })
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    if (!res.ok) {
      showToast(data.error || "Duplicate failed")
      return
    }
    await loadPicks()
    showToast("Duplicated")
  }

  const removeOne = async (id: number) => {
    if (!window.confirm("Delete this Telugu pick?")) return
    const res = await fetch(`/api/admin/telugu-picks/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      showToast(data.error || "Delete failed")
      return
    }
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    await loadPicks()
    showToast("Deleted")
  }

  const patchActive = async (pick: TeluguPick, active: boolean) => {
    const res = await fetch(`/api/admin/telugu-picks/${pick.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...pick, active }),
    })
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    if (!res.ok) {
      showToast(data.error || "Update failed")
      return
    }
    await loadPicks()
  }

  const onDropReorder = async (targetId: number) => {
    if (dragId === null || dragId === targetId) return
    const orderIds = picks
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id)
      .map((p) => p.id)
    const from = orderIds.indexOf(dragId)
    const to = orderIds.indexOf(targetId)
    if (from < 0 || to < 0) return
    const nextOrder = [...orderIds]
    nextOrder.splice(from, 1)
    nextOrder.splice(to, 0, dragId)
    const res = await fetch("/api/admin/telugu-picks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reorder", order: nextOrder }),
    })
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    if (!res.ok) {
      showToast(data.error || "Reorder failed")
      return
    }
    setDragId(null)
    await loadPicks()
    showToast("Order saved")
  }

  async function signOut() {
    setSidebarOpen(false)
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/admin/login"
  }

  return (
    <main className="relative flex min-h-screen bg-[#FAFAF7] text-[#111827]">
      {toast ? (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 rounded-full border border-[rgba(124,58,237,0.2)] bg-white px-5 py-2 text-sm font-semibold text-[#111827] shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          {toast}
        </div>
      ) : null}

      {sidebarOpen && (
        <button
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
            <button
              type="button"
              className="rounded-lg p-2 text-[#6B7280] hover:bg-[#F3F4F6] lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/admin"
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#4B5563] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
              onClick={() => setSidebarOpen(false)}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <div className="flex w-full items-center gap-3 rounded-lg bg-[#7C3AED] px-4 py-3 text-sm font-medium text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)]">
              <Sparkles size={16} />
              Telugu Picks
            </div>
          </nav>

          <div className="border-t border-[rgba(124,58,237,0.1)] p-4">
            <button
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
              <button
                type="button"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(124,58,237,0.15)] bg-white text-[#4B5563] shadow-sm transition hover:border-[#7C3AED]/40 hover:text-[#111827] lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <h1 className="truncate text-lg font-semibold text-[#111827] sm:text-xl">Telugu Picks</h1>
              <Link href="/admin" className="ml-2 hidden shrink-0 text-sm font-medium text-[#7C3AED] underline-offset-4 hover:underline md:inline">
                Main admin
              </Link>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditing(null)
                  setModalOpen(true)
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#7C3AED] px-3 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)] transition hover:bg-[#6D28D9] sm:px-4"
              >
                <Plus size={16} />
                Add pick
              </button>
            </div>
          </header>

          <div className="border-b border-[rgba(124,58,237,0.1)] bg-white/95 px-4 py-3">
            <div className="relative mx-auto max-w-6xl">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Telugu picks…"
                className="w-full rounded-full border border-[rgba(124,58,237,0.12)] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-6xl space-y-4">
              {selected.size > 0 ? (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-violet-100 bg-violet-50/80 p-3 text-sm text-[#4B5563]">
                  <span className="font-semibold text-[#111827]">{selected.size} selected</span>
                  <button type="button" onClick={() => void bulk("activate")} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] shadow-sm ring-1 ring-black/5 hover:bg-[#F3F4F6]">
                    Activate
                  </button>
                  <button type="button" onClick={() => void bulk("deactivate")} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] shadow-sm ring-1 ring-black/5 hover:bg-[#F3F4F6]">
                    Deactivate
                  </button>
                  <button type="button" onClick={() => void bulk("delete")} className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-500/15">
                    Delete
                  </button>
                  <button type="button" onClick={() => setSelected(new Set())} className="ml-auto text-xs font-semibold text-[#7C3AED] hover:underline">
                    Clear selection
                  </button>
                </div>
              ) : null}

              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-[var(--card-shadow)]">
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />
                    ))}
                  </div>
                ) : sortedForDisplay.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                      <Sparkles size={22} />
                    </div>
                    <div className="text-lg font-semibold text-[#111827]">No Telugu Picks added yet</div>
                    <p className="mx-auto mt-2 max-w-md text-sm text-[#6B7280]">Add movies from the library to showcase the best of Tollywood. Changes will persist across refreshes.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(null)
                        setModalOpen(true)
                      }}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(124,58,237,0.35)] transition hover:bg-[#6D28D9]"
                    >
                      <Plus size={16} />
                      Add Telugu pick
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-sm">
                      <thead className="text-xs uppercase tracking-wider text-[#6B7280]">
                        <tr>
                          <th className="px-2 py-3 text-left">
                            <input type="checkbox" onChange={toggleSelectAllVisible} checked={sortedForDisplay.length > 0 && sortedForDisplay.every((p) => selected.has(p.id))} />
                          </th>
                          <th className="px-2 py-3 text-left"> </th>
                          <th className="px-3 py-3 text-left">Poster</th>
                          <th className="px-3 py-3 text-left">Title</th>
                          <th className="px-3 py-3 text-left">OTT</th>
                          <th className="px-3 py-3 text-left">Year</th>
                          <th className="px-3 py-3 text-left">Rating</th>
                          <th className="px-3 py-3 text-left">Order</th>
                          <th className="px-3 py-3 text-left">Status</th>
                          <th className="px-3 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sortedForDisplay.map((pick) => (
                          <tr
                            key={pick.id}
                            className="hover:bg-violet-50/60"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => void onDropReorder(pick.id)}
                          >
                            <td className="px-2 py-3 align-middle">
                              <input type="checkbox" checked={selected.has(pick.id)} onChange={() => toggleSelect(pick.id)} />
                            </td>
                            <td className="px-1 py-3 align-middle text-[#9CA3AF]">
                              <button
                                type="button"
                                draggable
                                onDragStart={() => setDragId(pick.id)}
                                onDragEnd={() => setDragId(null)}
                                className="rounded-md p-2 hover:bg-gray-100"
                                aria-label="Drag to reorder"
                              >
                                <GripVertical size={16} />
                              </button>
                            </td>
                            <td className="px-3 py-3 align-middle">
                              <img src={getTeluguPickPoster(pick)} alt="" className="h-14 w-10 rounded-md object-cover ring-1 ring-black/5" />
                            </td>
                            <td className="px-3 py-3 align-middle">
                              <div className="font-semibold text-[#111827]">{pick.title}</div>
                              <div className="text-xs text-[#6B7280]">{pick.slug}</div>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {pick.featured ? (
                                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">Featured</span>
                                ) : null}
                                {pick.trending ? (
                                  <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-800">Trending</span>
                                ) : null}
                              </div>
                            </td>
                            <td className="px-3 py-3 align-middle">{pick.ott}</td>
                            <td className="px-3 py-3 align-middle">{pick.year}</td>
                            <td className="px-3 py-3 align-middle">{Number(pick.rating || 0).toFixed(1)}</td>

                            <td className="px-3 py-3 align-middle">{pick.displayOrder}</td>
                            <td className="px-3 py-3 align-middle">
                              <button
                                type="button"
                                onClick={() => void patchActive(pick, !pick.active)}
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  pick.active ? "bg-emerald-500/15 text-emerald-800" : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {pick.active ? "Active" : "Inactive"}
                              </button>
                            </td>
                            <td className="px-3 py-3 align-middle text-right">
                              <div className="flex justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const href = pick.libraryMovieId ? `/movie/${pick.libraryMovieId}` : "/telugu"
                                    window.open(href, "_blank", "noopener,noreferrer")
                                  }}
                                  className="rounded-lg p-2 text-[#6B7280] hover:bg-gray-100"
                                  title="Preview"
                                >
                                  <ExternalLink size={16} />
                                </button>
                                <button type="button" onClick={() => void duplicate(pick.id)} className="rounded-lg p-2 text-[#6B7280] hover:bg-gray-100" title="Duplicate">
                                  <Copy size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditing(pick)
                                    setModalOpen(true)
                                  }}
                                  className="rounded-lg px-2 py-1 text-xs font-semibold text-[#7C3AED] hover:bg-violet-50"
                                >
                                  Edit
                                </button>
                                <button type="button" onClick={() => void removeOne(pick.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-500/10">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TeluguPickFormModal
        open={modalOpen}
        initial={editing}
        libraryMovies={libraryMovies}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSaved={async () => {
          await loadPicks()
          setLibraryMovies(
            parseMoviesFromStorage()
              .map((m) => ({ id: m.id, title: m.title }))
              .sort((a, b) => a.title.localeCompare(b.title)),
          )
          showToast("Saved")
        }}
      />
    </main>
  )
}
