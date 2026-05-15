import { readTeluguPicksFromDisk, sortPublicTeluguPicks } from "@/lib/telugu-picks-store"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  const picks = sortPublicTeluguPicks(await readTeluguPicksFromDisk())
  return NextResponse.json({ picks }, { headers: { "Cache-Control": "no-store" } })
}
