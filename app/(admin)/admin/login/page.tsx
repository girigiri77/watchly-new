"use client"

import { Shield } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { FormEvent, Suspense, useState } from "react"

function AdminLoginForm() {
  const search = useSearchParams()
  const nextPath = search.get("next") || "/admin"
  const misconfigured = search.get("misconfigured") === "1"

  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(data.error || (res.status === 401 ? "Invalid password." : "Sign-in failed."))
        return
      }
      const dest = nextPath.startsWith("/admin") ? nextPath : "/admin"
      window.location.assign(dest)
    } catch {
      setError("Network error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-6 text-[#111827]">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[rgba(124,58,237,0.12)] bg-white p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <Shield className="mb-5 text-[#7C3AED]" size={34} aria-hidden />
        <h1 className="font-playfair text-2xl font-black text-[#111827]">Editorial Admin</h1>
        <p className="mt-3 text-sm leading-6 text-[#4B5563]">
          Sign in with the password from your server env file (see <code className="rounded bg-gray-100 px-1 text-xs">.env.example</code>).
        </p>

        {misconfigured && (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Missing <code className="text-xs">ADMIN_SESSION_SECRET</code> or <code className="text-xs">ADMIN_PASSWORD</code>. Add them to{" "}
            <code className="text-xs">.env.local</code> and restart the dev server.
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#FAFAF7] px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#7C3AED]"
              placeholder="Admin password"
              required
              disabled={loading}
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7C3AED] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_8px_24px_rgba(124,58,237,0.35)] transition hover:bg-[#6D28D9] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-6 text-[#6B7280]">Loading…</main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}
