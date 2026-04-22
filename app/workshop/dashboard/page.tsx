"use client"

import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle, Clock3, Loader2, Send, ShieldCheck } from "lucide-react"

type WorkshopRegistration = {
  id: number
  registration_id: string
  workshop_id: number
  workshop_title: string
  full_name: string
  email: string
  phone: string
  institution: string
  designation: string
  participant_type: string
  fee_amount: string
  transaction_id: string | null
  status: string
  status_display: string
  admin_notes: string | null
  created_at: string
  updated_at: string
}

const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "https://tdmtg.iiti.ac.in"

export default function WorkshopDashboardPage() {
  const router = useRouter()
  const [registrationId, setRegistrationId] = useState("")
  const [email, setEmail] = useState("")
  const [registration, setRegistration] = useState<WorkshopRegistration | null>(null)
  const [transactionId, setTransactionId] = useState("")
  const [loading, setLoading] = useState(false)
  const [submittingTransaction, setSubmittingTransaction] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

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
    setMessage(null)

    try {
      const params = new URLSearchParams()
      if (registrationId) params.set("registration_id", registrationId.trim())
      if (email) params.set("email", email.trim().toLowerCase())

      const res = await fetch(`${DJANGO_API_URL}/api/workshop-registrations/lookup/?${params.toString()}`)
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setRegistration(null)
        setError(data?.detail || "Workshop registration not found.")
        return
      }

      setRegistration(data)
      setTransactionId(data.transaction_id || "")
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "workshop_registration",
          JSON.stringify({ registration_id: data.registration_id, email: data.email, workshop_id: data.workshop_id }),
        )
      }
    } catch {
      setError("Could not connect to the workshop registration service.")
    } finally {
      setLoading(false)
    }
  }

  const submitTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!registration || !transactionId.trim()) {
      setError("Enter the transaction ID before submitting.")
      return
    }

    setSubmittingTransaction(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch(`${DJANGO_API_URL}/api/workshop-registrations/submit-transaction/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_id: registration.id,
          email: registration.email,
          transaction_id: transactionId.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data?.detail || "Unable to submit transaction ID.")
        return
      }

      setRegistration(data)
      setMessage("Transaction ID submitted. Your payment is now awaiting admin verification.")
    } catch {
      setError("Could not submit the transaction ID right now.")
    } finally {
      setSubmittingTransaction(false)
    }
  }

  const status = registration?.status || ""
  const canSubmitTransaction = status === "Approved for Payment" && !registration?.transaction_id

  return (
    <div className="min-h-screen bg-[color:var(--primary-foreground)]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--primary)] mb-2">Workshop Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[color:var(--nav)]">Registration status and payment control</h1>
            <p className="mt-3 text-[color:var(--nav)]/70 max-w-2xl">
              Track your Workshop 1 application, see whether it is under review or approved for payment, and submit your transaction ID only after the committee unlocks it.
            </p>
          </div>
          <button
            onClick={() => router.push("/workshop")}
            className="shrink-0 rounded-xl border border-[color:var(--nav)]/10 px-4 py-2 text-sm font-semibold text-[color:var(--nav)] hover:bg-[color:var(--nav)]/5 transition-colors"
          >
            Back to Workshop
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-[color:var(--nav)]/10 bg-white shadow-lg p-6 md:p-8">
            <div className="flex items-start gap-3 mb-6">
              <div className="rounded-2xl bg-[color:var(--primary)]/10 p-3 text-[color:var(--primary)]">
                <Clock3 size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[color:var(--nav)]">Find your registration</h2>
                <p className="text-sm text-[color:var(--nav)]/60">Use the registration reference from your success screen or the email address you used to register.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[color:var(--nav)] mb-2">Registration Reference</label>
                <input
                  value={registrationId}
                  onChange={(e) => setRegistrationId(e.target.value)}
                  placeholder="WS1-123"
                  className="w-full rounded-xl border border-[color:var(--nav)]/15 px-4 py-3 outline-none focus:border-[color:var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[color:var(--nav)] mb-2">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institute.edu"
                  className="w-full rounded-xl border border-[color:var(--nav)]/15 px-4 py-3 outline-none focus:border-[color:var(--primary)]"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <button
                onClick={fetchRegistration}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--primary)] px-5 py-3 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                {loading ? "Loading..." : "Load Registration"}
              </button>
            </div>

            {registration && (
              <div className="mt-8 rounded-3xl border border-[color:var(--nav)]/10 bg-[color:var(--primary-foreground)] p-5 md:p-6">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--primary)] font-semibold">Current Status</p>
                    <h3 className="text-2xl font-bold text-[color:var(--nav)] mt-1">{registration.status_display}</h3>
                  </div>
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-[color:var(--nav)]/10 text-[color:var(--nav)]">
                    {registration.registration_id}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 text-sm">
                  <div className="rounded-2xl bg-white p-4 border border-[color:var(--nav)]/10">
                    <p className="text-[color:var(--nav)]/50 text-xs uppercase tracking-wide">Name</p>
                    <p className="font-semibold text-[color:var(--nav)] mt-1">{registration.full_name}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-[color:var(--nav)]/10">
                    <p className="text-[color:var(--nav)]/50 text-xs uppercase tracking-wide">Email</p>
                    <p className="font-semibold text-[color:var(--nav)] mt-1 break-all">{registration.email}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-[color:var(--nav)]/10">
                    <p className="text-[color:var(--nav)]/50 text-xs uppercase tracking-wide">Participant Type</p>
                    <p className="font-semibold text-[color:var(--nav)] mt-1 capitalize">{registration.participant_type}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-[color:var(--nav)]/10">
                    <p className="text-[color:var(--nav)]/50 text-xs uppercase tracking-wide">Fee</p>
                    <p className="font-semibold text-[color:var(--nav)] mt-1">INR {registration.fee_amount}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-[color:var(--nav)]/5 p-4 text-sm text-[color:var(--nav)]/75">
                  {status === "Under Process" && "Your application is under review. The transaction field will appear only after admin approval for payment."}
                  {status === "Approved for Payment" && "Your application is approved for payment. Submit your transaction ID below after payment."}
                  {status === "Payment Submitted" && "Your transaction ID has been received and is awaiting final verification."}
                  {status === "Accepted" && "Your registration has been confirmed."}
                  {status === "Rejected" && "Your registration was rejected by the committee."}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-[color:var(--nav)]/10 bg-[linear-gradient(180deg,rgba(8,84,120,0.08),rgba(255,255,255,0.85))] p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-2xl bg-white/80 p-3 text-[color:var(--primary)]">
                  <Send size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[color:var(--nav)]">Transaction ID</h2>
                  <p className="text-sm text-[color:var(--nav)]/65">This field appears only after committee approval for payment.</p>
                </div>
              </div>

              {canSubmitTransaction ? (
                <form onSubmit={submitTransaction} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--nav)] mb-2">Transaction ID</label>
                    <input
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter payment transaction ID"
                      className="w-full rounded-xl border border-[color:var(--nav)]/15 px-4 py-3 outline-none focus:border-[color:var(--primary)]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingTransaction}
                    className="w-full rounded-xl bg-[color:var(--primary)] px-5 py-3 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submittingTransaction ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {submittingTransaction ? "Submitting..." : "Submit Transaction ID"}
                  </button>
                </form>
              ) : (
                <div className="rounded-2xl border border-dashed border-[color:var(--nav)]/15 bg-white/70 p-4 text-sm text-[color:var(--nav)]/65">
                  {registration?.transaction_id
                    ? `Transaction ID already submitted: ${registration.transaction_id}`
                    : "Once the admin approves your registration for payment, this area will unlock automatically."}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-[color:var(--nav)]/10 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-bold text-[color:var(--nav)] mb-3">Workflow</h2>
              <ol className="space-y-3 text-sm text-[color:var(--nav)]/75">
                <li className="flex gap-3"><span className="font-bold text-[color:var(--primary)]">1.</span> Register for Workshop 1 without paying.</li>
                <li className="flex gap-3"><span className="font-bold text-[color:var(--primary)]">2.</span> Wait for the committee to approve or reject your request.</li>
                <li className="flex gap-3"><span className="font-bold text-[color:var(--primary)]">3.</span> If approved for payment, submit the transaction ID here.</li>
                <li className="flex gap-3"><span className="font-bold text-[color:var(--primary)]">4.</span> Final acceptance or rejection is recorded by the admin team.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
