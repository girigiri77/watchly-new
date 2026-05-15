import { requireAdminSession } from "@/lib/admin-auth-request"
import { readTeluguPicksFromDisk, writeTeluguPicksToDisk } from "@/lib/telugu-picks-store"
import { validateTeluguPickBody } from "@/lib/telugu-picks-validate"
import type { TeluguPick } from "@/types/telugu-pick"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const picks = (await readTeluguPicksFromDisk()).slice().sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id)
  return NextResponse.json({ picks })
}

export async function POST(request: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const duplicateFrom = url.searchParams.get("duplicateFrom")

  const existing = await readTeluguPicksFromDisk()

  if (duplicateFrom) {
    const sourceId = Number(duplicateFrom)
    const src = existing.find((p) => p.id === sourceId)
    if (!src) return NextResponse.json({ error: "Source pick not found" }, { status: 404 })
    const nextId = existing.reduce((m, p) => Math.max(m, p.id), 0) + 1
    const now = new Date().toISOString()
    const copy: TeluguPick = {
      ...src,
      id: nextId,
      slug: `${src.slug}-copy-${nextId}`,
      title: `${src.title} (Copy)`,
      displayOrder: existing.reduce((m, p) => Math.max(m, p.displayOrder), 0) + 1,
      createdAt: now,
      updatedAt: now,
    }
    const next = [...existing, copy]
    await writeTeluguPicksToDisk(next)
    return NextResponse.json({ pick: copy })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = validateTeluguPickBody(body, existing)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const nextId = existing.reduce((m, p) => Math.max(m, p.id), 0) + 1
  const now = new Date().toISOString()
  const pick: TeluguPick = {
    ...parsed.value,
    id: nextId,
    createdAt: now,
    updatedAt: now,
  }
  const next = [...existing, pick]
  await writeTeluguPicksToDisk(next)
  return NextResponse.json({ pick })
}

/** Bulk actions + reorder */
export async function PATCH(request: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const b = body as { action?: string; ids?: unknown; order?: unknown }
  const existing = await readTeluguPicksFromDisk()

  if (b.action === "reorder" && Array.isArray(b.order)) {
    const order = b.order.filter((id): id is number => typeof id === "number" && Number.isFinite(id))
    const idSet = new Set(existing.map((p) => p.id))
    if (!order.every((id) => idSet.has(id))) {
      return NextResponse.json({ error: "Reorder payload must include every pick id exactly once" }, { status: 400 })
    }
    if (order.length !== existing.length) {
      return NextResponse.json({ error: "Reorder payload length mismatch" }, { status: 400 })
    }
    const byId = new Map(existing.map((p) => [p.id, p] as const))
    const now = new Date().toISOString()
    const next = order.map((id, idx) => {
      const p = byId.get(id)!
      return { ...p, displayOrder: idx + 1, updatedAt: now }
    })
    await writeTeluguPicksToDisk(next)
    return NextResponse.json({ ok: true, picks: next })
  }

  const ids = Array.isArray(b.ids) ? b.ids.filter((id): id is number => typeof id === "number" && Number.isFinite(id)) : []
  if (ids.length === 0) return NextResponse.json({ error: "No ids provided" }, { status: 400 })

  if (b.action === "delete") {
    const next = existing.filter((p) => !ids.includes(p.id))
    await writeTeluguPicksToDisk(next)
    return NextResponse.json({ ok: true, picks: next })
  }

  if (b.action === "activate" || b.action === "deactivate") {
    const active = b.action === "activate"
    const now = new Date().toISOString()
    const next = existing.map((p) => (ids.includes(p.id) ? { ...p, active, updatedAt: now } : p))
    await writeTeluguPicksToDisk(next)
    return NextResponse.json({ ok: true, picks: next })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
