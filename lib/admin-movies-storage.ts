/** Same key as `app/(admin)/admin/page.tsx` — curated list persisted in localStorage. */
export const ADMIN_MOVIES_STORAGE_KEY = "absolute-cinema-admin-movies"
export const MOOD_ORDERS_STORAGE_KEY = "absolute-cinema-mood-orders"

export const MOVIES_UPDATED_EVENT = "absolute-cinema-movies-updated"
export const MOOD_ORDERS_UPDATED_EVENT = "absolute-cinema-mood-orders-updated"

export function notifyMoviesUpdated() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(MOVIES_UPDATED_EVENT))
}

export function notifyMoodOrdersUpdated() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(MOOD_ORDERS_UPDATED_EVENT))
}
