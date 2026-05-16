"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Save, X } from "lucide-react"
import { LANGUAGES, MOODS, OTT_PLATFORMS, type Mood, type MovieLanguage, type OTTPlatform } from "@/types/movie"
import type { TeluguPick } from "@/types/telugu-pick"

import AdminModal from "./AdminModal"
import { MovieImageUpload } from "./MovieImageUpload"

export const TELUGU_PICK_GENRES = [
  "Drama",
  "Romance",
  "Action",
  "Thriller",
  "Comedy",
  "Crime",
  "Family",
  "Fantasy",
  "Horror",
  "Sci-Fi",
  "Musical",
  "Period",
  "Adventure",
  "Mystery",
] as const

export type LibraryMovieOption = { uuid: string; title: string }


type FormState = {
  title: string
  slug: string
  description: string
  language: MovieLanguage | string
  year: string
  duration: string
  rating: string
  posterUrl: string
  backdropUrl: string
  customPoster: string
  customBackdrop: string
  ott: OTTPlatform | string
  ottBadgeUrl: string
  genres: string[]
  moods: Mood[]
  featured: boolean
  trending: boolean
  active: boolean
  displayOrder: string
  trailerUrl: string
  libraryMovieId: string
  gradientAccent: string
  releaseDate: string
}

function pickToForm(p: TeluguPick): FormState {
  return {
    title: p.title,
    slug: p.slug,
    description: p.description,
    language: p.language,
    year: String(p.year),
    duration: p.duration,
    rating: String(p.rating),
    posterUrl: p.posterUrl,
    backdropUrl: p.backdropUrl,
    customPoster: p.customPoster ?? "",
    customBackdrop: p.customBackdrop ?? "",
    ott: p.ott,
    ottBadgeUrl: p.ottBadgeUrl ?? "",
    genres: [...p.genres],
    moods: [...p.moods],
    featured: p.featured,
    trending: p.trending,
    active: p.active,
    displayOrder: String(p.displayOrder),
    trailerUrl: p.trailerUrl,
    libraryMovieId: p.libraryMovieId ? p.libraryMovieId : "",

    gradientAccent: p.gradientAccent,
    releaseDate: p.releaseDate,
  }
}

const emptyForm: FormState = {
  title: "",
  slug: "",
  description: "",
  language: "Telugu",
  year: "2026",
  duration: "2h 20m",
  rating: "8",
  posterUrl: "",
  backdropUrl: "",
  customPoster: "",
  customBackdrop: "",
  ott: "Netflix",
  ottBadgeUrl: "",
  genres: [],
  moods: ["Emotional"],
  featured: false,
  trending: false,
  active: true,
  displayOrder: "1",
  trailerUrl: "",
  libraryMovieId: "",
  gradientAccent: "#7C3AED",
  releaseDate: "2026-05-12",
}

function slugifyTitle(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

export default function TeluguPickFormModal({
  open,
  initial,
  libraryMovies,
  onClose,
  onSaved,
}: {
  open: boolean
  initial: TeluguPick | null
  libraryMovies: LibraryMovieOption[]
  onClose: () => void
  onSaved: () => Promise<void>
}) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoSlug, setAutoSlug] = useState(true)

  useEffect(() => {
    if (!open) return
    setError(null)
    setSaving(false)
    if (initial) {
      setForm(pickToForm(initial))
      setAutoSlug(false)
    } else {
      setForm(emptyForm)
      setAutoSlug(true)
    }
  }, [open, initial])

  const titleForSlug = useMemo(() => form.title, [form.title])
  useEffect(() => {
    if (!open || !autoSlug || initial) return
    setForm((f) => ({ ...f, slug: slugifyTitle(titleForSlug) }))
  }, [autoSlug, initial, open, titleForSlug])

  const toggleGenre = (g: string) => {
    setForm((f) => ({
      ...f,
      genres: f.genres.includes(g) ? f.genres.filter((x) => x !== g) : [...f.genres, g],
    }))
  }

  const toggleMood = (m: Mood) => {
    setForm((f) => ({
      ...f,
      moods: f.moods.includes(m) ? f.moods.filter((x) => x !== m) : [...f.moods, m],
    }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const libraryMovieId = form.libraryMovieId.trim() || null


      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        language: form.language,
        year: Number(form.year),
        duration: form.duration.trim(),
        rating: Number(form.rating || 0),

        posterUrl: form.posterUrl.trim(),
        backdropUrl: form.backdropUrl.trim(),
        customPoster: form.customPoster.trim(),
        customBackdrop: form.customBackdrop.trim(),
        ott: form.ott,
        ottBadgeUrl: form.ottBadgeUrl.trim(),
        genres: form.genres,
        moods: form.moods,
        featured: form.featured,
        trending: form.trending,
        active: form.active,
        displayOrder: Number(form.displayOrder),
        trailerUrl: form.trailerUrl.trim(),
        libraryMovieId: libraryMovieId,

        gradientAccent: form.gradientAccent.trim(),
        releaseDate: form.releaseDate.trim(),
      }

      const url = initial ? `/api/admin/telugu-picks/${initial.id}` : "/api/admin/telugu-picks"
      const res = await fetch(url, {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(data.error || "Save failed")
        return
      }
      await onSaved()
      onClose()
    } catch {
      setError("Network error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminModal
      isOpen={open}
      onClose={onClose}
      title={initial ? "Edit Telugu Pick" : "Add Telugu Pick"}
      maxWidth="max-w-4xl"
    >
      <form onSubmit={submit}>
        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <Field label="Movie Title">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>

          <Field label="Slug">
            <div className="flex items-center gap-2">
              <input
                required
                value={form.slug}
                onChange={(e) => {
                  setAutoSlug(false)
                  setForm({ ...form, slug: e.target.value })
                }}
              />
              <label className="flex items-center gap-2 whitespace-nowrap text-xs text-[#6B7280]">
                <input type="checkbox" checked={autoSlug && !initial} onChange={(e) => setAutoSlug(e.target.checked)} disabled={Boolean(initial)} />
                Auto
              </label>
            </div>
          </Field>

          <Field label="Language">
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Release Year">
            <input
              required
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </Field>

          <Field label="Duration">
            <input
              required
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </Field>

          <Field label="Rating (0-10)">
            <input
              required
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            />
          </Field>

          <Field label="OTT Platform">
            <select
              value={form.ott}
              onChange={(e) => setForm({ ...form, ott: e.target.value })}
            >
              {OTT_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Display Order">
            <input
              required
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
            />
          </Field>

          <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
            <MovieImageUpload
              label="Upload Poster"
              kind="poster"
              slug={form.title || "pick"}
              storedPath={form.customPoster}
              onPathChange={(path) => setForm({ ...form, customPoster: path })}
              fallbackLabel="poster URL field below"
            />
            <MovieImageUpload
              label="Upload Backdrop"
              kind="backdrop"
              slug={form.title || "pick"}
              storedPath={form.customBackdrop}
              onPathChange={(path) => setForm({ ...form, customBackdrop: path })}
              fallbackLabel="backdrop URL field below"
            />
          </div>

          <Field label="Poster URL (fallback)">
            <input
              value={form.posterUrl}
              onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
              placeholder="https://example.com/poster.jpg"
            />
          </Field>

          <Field label="Backdrop URL (fallback)">
            <input
              value={form.backdropUrl}
              onChange={(e) => setForm({ ...form, backdropUrl: e.target.value })}
              placeholder="https://example.com/backdrop.jpg"
            />
          </Field>

          <Field label="YouTube Trailer URL">
            <input
              value={form.trailerUrl}
              onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })}
            />
          </Field>

          <Field label="OTT Logo / Badge URL (optional)">
            <input
              value={form.ottBadgeUrl}
              onChange={(e) => setForm({ ...form, ottBadgeUrl: e.target.value })}
            />
          </Field>

          <Field label="Release Date">
            <input
              type="date"
              value={form.releaseDate}
              onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
            />
          </Field>

          <Field label="Gradient Accent">
            <input
              value={form.gradientAccent}
              onChange={(e) => setForm({ ...form, gradientAccent: e.target.value })}
            />
          </Field>

          <Field label="Link to Library Movie (optional)">
            <select
              value={form.libraryMovieId}
              onChange={(e) => setForm({ ...form, libraryMovieId: e.target.value })}
            >
              <option value="">None</option>
              {libraryMovies.map((m) => (
                <option key={m.uuid} value={m.uuid}>
                  {m.title}
                </option>

              ))}
            </select>
          </Field>

          <label className="md:col-span-2">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Description / Overview</span>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="min-h-24 w-full rounded-lg border border-gray-200 bg-[#FAFAF7] px-4 py-3 text-sm text-[#111827] outline-none transition-colors focus:border-[#7C3AED]"
            />
          </label>
        </div>

        <div className="mb-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Genres</div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {TELUGU_PICK_GENRES.map((g) => (
              <label key={g} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-[#FAFAF7] p-3 transition-colors hover:bg-gray-100">
                <input type="checkbox" checked={form.genres.includes(g)} onChange={() => toggleGenre(g)} className="rounded border-gray-200 bg-gray-50 text-[#7C3AED] focus:ring-[#7C3AED]" />
                <span className="text-sm">{g}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Moods</div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {MOODS.map((m) => (
              <label key={m} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-[#FAFAF7] p-3 transition-colors hover:bg-gray-100">
                <input type="checkbox" checked={form.moods.includes(m)} onChange={() => toggleMood(m)} className="rounded border-gray-200 bg-gray-50 text-[#7C3AED] focus:ring-[#7C3AED]" />
                <span className="text-sm">{m}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Flags</div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-[#FAFAF7] p-3 transition-colors hover:bg-gray-100">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-gray-200 bg-gray-50 text-[#7C3AED] focus:ring-[#7C3AED]" />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-[#FAFAF7] p-3 transition-colors hover:bg-gray-100">
              <input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} className="rounded border-gray-200 bg-gray-50 text-[#7C3AED] focus:ring-[#7C3AED]" />
              <span className="text-sm">Trending</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-[#FAFAF7] p-3 transition-colors hover:bg-gray-100">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-gray-200 bg-gray-50 text-[#7C3AED] focus:ring-[#7C3AED]" />
              <span className="text-sm">Active</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-[#111827] transition-colors hover:bg-gray-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6D28D9] disabled:opacity-60"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save Telugu Pick"}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">{label}</span>
      <div className="[&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-gray-200 [&_input]:bg-[#FAFAF7] [&_input]:px-4 [&_input]:py-2 [&_input]:text-sm [&_input]:text-[#111827] [&_input]:outline-none [&_input]:focus:border-[#7C3AED] [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-gray-200 [&_select]:bg-[#FAFAF7] [&_select]:px-4 [&_select]:py-2 [&_select]:text-sm [&_select]:text-[#111827] [&_select]:outline-none [&_select]:focus:border-[#7C3AED]">
        {children}
      </div>
    </label>
  )
}
