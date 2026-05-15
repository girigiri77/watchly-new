"use client"

import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react"
import { useCallback, useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react"
import { uploadAdminMovieImage } from "@/lib/admin-upload-image"

type MovieImageUploadProps = {
  label: string
  kind: "poster" | "backdrop"
  slug: string
  /** Stored path e.g. `/uploads/foo.jpg` or empty string when none */
  storedPath: string
  onPathChange: (path: string) => void
  /** Shown in helper text (e.g. "poster URL field below") */
  fallbackLabel: string
}

export function MovieImageUpload({ label, kind, slug, storedPath, onPathChange, fallbackLabel }: MovieImageUploadProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  const previewSrc = localPreview || (storedPath.trim() ? storedPath.trim() : null)

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  const runUpload = useCallback(
    async (file: File, objectPreviewUrl: string | null) => {
      setError(null)
      setUploading(true)
      try {
        const path = await uploadAdminMovieImage(file, kind, slug)
        if (objectPreviewUrl) URL.revokeObjectURL(objectPreviewUrl)
        setLocalPreview(null)
        onPathChange(path)
      } catch (e) {
        if (objectPreviewUrl) URL.revokeObjectURL(objectPreviewUrl)
        setLocalPreview(null)
        setError(e instanceof Error ? e.message : "Upload failed")
      } finally {
        setUploading(false)
      }
    },
    [kind, onPathChange, slug],
  )

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (localPreview) URL.revokeObjectURL(localPreview)
    const objectPreviewUrl = URL.createObjectURL(file)
    setLocalPreview(objectPreviewUrl)
    void runUpload(file, objectPreviewUrl)
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    const file = event.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith("image/")) {
      setError("Drop a single image file")
      return
    }
    if (localPreview) URL.revokeObjectURL(localPreview)
    const objectPreviewUrl = URL.createObjectURL(file)
    setLocalPreview(objectPreviewUrl)
    void runUpload(file, objectPreviewUrl)
  }

  const clearCustom = () => {
    setError(null)
    if (localPreview) URL.revokeObjectURL(localPreview)
    setLocalPreview(null)
    onPathChange("")
  }

  const aspectClass = kind === "poster" ? "aspect-[2/3] max-h-52" : "aspect-video max-h-40"

  const onKeyDownZone = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-[#FAFAF7] p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">{label}</span>
        {storedPath.trim() ? (
          <button
            type="button"
            onClick={clearCustom}
            disabled={uploading}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={12} />
            Remove custom
          </button>
        ) : null}
      </div>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={onKeyDownZone}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-4 transition ${
          dragOver ? "border-[#7C3AED] bg-violet-50/80" : "border-gray-300 bg-white hover:border-[#7C3AED]/50"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input ref={inputRef} id={inputId} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={onInputChange} disabled={uploading} />

        {previewSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewSrc} alt="" className={`w-full max-w-[200px] rounded-md object-cover shadow-sm ${aspectClass}`} />
        ) : (
          <div className={`flex w-full max-w-[200px] items-center justify-center rounded-md bg-gray-100 ${aspectClass}`}>
            <ImagePlus className="text-gray-400" size={36} strokeWidth={1.25} />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 text-center">
          {uploading ? (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#5B21B6]">
              <Loader2 className="animate-spin" size={16} />
              Uploading…
            </span>
          ) : (
            <>
              <Upload size={16} className="text-[#7C3AED]" />
              <span className="text-sm text-[#4B5563]">
                Drop image here or <span className="font-semibold text-[#7C3AED]">browse</span>
              </span>
            </>
          )}
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-[#9CA3AF]">
        Overrides the {fallbackLabel}. Saved under <code className="rounded bg-gray-100 px-1">/public/uploads</code> — swap the API handler later for CDN/S3/Supabase/Cloudinary.
      </p>

      {error ? <p className="mt-2 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  )
}
