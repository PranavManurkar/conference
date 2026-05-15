"use client"

import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ShieldCheck } from "lucide-react"

const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "https://tdmtg.iiti.ac.in"

export default function WorkshopDashboardPage() {
  const router = useRouter()
  const [registrationId, setRegistrationId] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const stored = window.localStorage.getItem("workshop_registration")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.registration_id) setRegistrationId(parsed.registration_id)
        if (parsed?.email) setEmail(parsed.email)
      }
    } catch {
      // ignore storage issues
    }
  }, [])

  const fetchRegistration = async () => {
    if (!registrationId && !email) {
      setError("Enter your registration reference or email.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (registrationId) params.set("registration_reference", registrationId.trim())
      if (email) params.set("email", email.trim().toLowerCase())

      const res = await fetch(`${DJANGO_API_URL}/api/workshop-registrations/lookup/?${params.toString()}`)
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data?.detail || "Workshop registration not found.")
        return
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "workshop_registration",
          JSON.stringify({ registration_id: data.registration_id, email: data.email, workshop_id: data.workshop_id }),
        )
      }

      router.push(`/workshop/dashboard/${encodeURIComponent(data.registration_id)}?email=${encodeURIComponent(data.email)}`)
    } catch {
      setError("Could not connect to the workshop registration service.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[color:var(--primary-foreground)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl rounded-3xl border border-[color:var(--nav)]/10 bg-white shadow-xl p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--primary)] mb-2">Workshop Dashboard</p>
            <h1 className="text-3xl font-bold text-[color:var(--nav)]">Load your workshop registration</h1>
            <p className="mt-2 text-sm text-[color:var(--nav)]/65 max-w-xl">
              Enter the workshop reference and email to open your status page.
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={(e: FormEvent) => { e.preventDefault(); void fetchRegistration() }}>
          <div>
            <label className="block text-sm font-semibold text-[color:var(--nav)] mb-2">Workshop Reference</label>
            <input
              value={registrationId}
              onChange={(e) => setRegistrationId(e.target.value)}
              placeholder="WS1-123 or WS2-456"
              className="w-full rounded-2xl border border-[color:var(--nav)]/15 px-4 py-3.5 outline-none focus:border-[color:var(--primary)] focus:ring-4 focus:ring-[color:var(--primary)]/10 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[color:var(--nav)] mb-2">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@institute.edu"
              className="w-full rounded-2xl border border-[color:var(--nav)]/15 px-4 py-3.5 outline-none focus:border-[color:var(--primary)] focus:ring-4 focus:ring-[color:var(--primary)]/10 transition"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--primary),#8a2d73)] px-5 py-3.5 font-semibold text-white shadow-md hover:shadow-lg hover:translate-y-[-1px] transition-all disabled:opacity-60 disabled:translate-y-0"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
            {loading ? "Loading..." : "Load Registration"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/workshop")}
            className="w-full rounded-2xl border border-[color:var(--nav)]/10 px-5 py-3.5 font-semibold text-[color:var(--nav)] bg-white hover:bg-[color:var(--nav)]/5 transition-colors"
          >
            Back to workshop registration
          </button>
        </form>
      </div>
    </div>
  )
}
