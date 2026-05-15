import { seedTeluguPicks } from "@/data/telugu-picks-seed"
import type { TeluguPick } from "@/types/telugu-pick"
import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"

export const TELUGU_PICKS_FILE = path.join(process.cwd(), "data", "telugu-picks.json")

export async function readTeluguPicksFromDisk(): Promise<TeluguPick[]> {
  try {
    const raw = await readFile(TELUGU_PICKS_FILE, "utf8")
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed as TeluguPick[]
  } catch {
    return []
  }
}

export async function writeTeluguPicksToDisk(picks: TeluguPick[]): Promise<void> {
  await mkdir(path.dirname(TELUGU_PICKS_FILE), { recursive: true })
  await writeFile(TELUGU_PICKS_FILE, `${JSON.stringify(picks, null, 2)}\n`, "utf8")
}

/** Active picks for the public homepage: featured first, then display order. */
export function sortPublicTeluguPicks(picks: TeluguPick[]): TeluguPick[] {
  return picks
    .filter((p) => p.active)
    .slice()
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder
      return a.title.localeCompare(b.title)
    })
}
