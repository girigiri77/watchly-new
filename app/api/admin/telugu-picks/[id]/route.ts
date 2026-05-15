import { requireAdminSession } from "@/lib/admin-auth-request"
import { readTeluguPicksFromDisk, writeTeluguPicksToDisk } from "@/lib/telugu-picks-store"
import { validateTeluguPickBody } from "@/lib/telugu-picks-validate"
import type { TeluguPick } from "@/types/telugu-pick"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

type RouteContext = { params: Promise<{ id: string }> }

export async function PUT(request: Request, context: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: raw } = await context.params
  const id = Number(raw)
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const existing = await readTeluguPicksFromDisk()
  const current = existing.find((p) => p.id === id)
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const parsed = validateTeluguPickBody(body, existing, id)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const now = new Date().toISOString()
  const updated: TeluguPick = {
    ...parsed.value,
    id,
    createdAt: current.createdAt,
    updatedAt: now,
  }
  const next = existing.map((p) => (p.id === id ? updated : p))
  await writeTeluguPicksToDisk(next)
  return NextResponse.json({ pick: updated })
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: raw } = await context.params
  const id = Number(raw)
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  const existing = await readTeluguPicksFromDisk()
  const next = existing.filter((p) => p.id !== id)
  if (next.length === existing.length) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await writeTeluguPicksToDisk(next)
  return NextResponse.json({ ok: true })
}
