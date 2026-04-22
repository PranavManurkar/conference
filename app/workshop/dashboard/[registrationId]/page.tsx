"use client"

import type { FormEvent } from "react"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, Clock, ExternalLink, Loader2, MapPin, Send, ShieldCheck, Users } from "lucide-react"

const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "https://tdmtg.iiti.ac.in"

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

type StatusTheme = {
  accent: string
  accentSoft: string
  text: string
  border: string
  label: string
  panel: string
}

const STATUS_THEME: Record<string, StatusTheme> = {
  "Under Process": {
    accent: "bg-slate-500",
    accentSoft: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    label: "Under Process",
    panel: "bg-slate-50",
  },
  "Approved for Payment": {
    accent: "bg-amber-500",
    accentSoft: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    label: "Approved for Payment",
    panel: "bg-amber-50",
  },
  "Payment Submitted": {
    accent: "bg-sky-500",
    accentSoft: "bg-sky-100",
    text: "text-sky-700",
    border: "border-sky-200",
    label: "Payment Submitted",
    panel: "bg-sky-50",
  },
  Accepted: {
    accent: "bg-emerald-500",
    accentSoft: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    label: "Accepted",
    panel: "bg-emerald-50",
  },
  Rejected: {
    accent: "bg-rose-500",
    accentSoft: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
    label: "Rejected",
    panel: "bg-rose-50",
  },
}

const agenda = [
  {
    time: "10:30 – 11:30",
    title: "Latest Trends & Advancements in X-ray Diffraction (XRD)",
    speaker: "Dr. Mangesh Mahajan",
    speakerRole: "Senior Applications Specialist, Malvern Panalytical",
  },
  {
    time: "11:30 – 11:45",
    title: "Tea Break",
    isBreak: true,
  },
  {
    time: "11:45 – 12:30",
    title: "Role of Particle Size, Zeta Potential & Rheology in Powders & Slurries",
    speaker: "Mr. Tejas Kharva",
    speakerRole: "Application Specialist, Aimil",
    highlight: true,
  },
  {
    time: "12:30 – 01:30",
    title: "Elemental Analysis Using X-ray Fluorescence (XRF)",
    speaker: "Dr. Dhrubajyoti Gupta",
    speakerRole: "Applications Specialist, Malvern Panalytical",
  },
  {
    time: "01:30 – 02:30",
    title: "Lunch Break",
    isBreak: true,
  },
  {
    time: "02:30 – 03:30",
    title: "Advanced Particle Characterization: Solutions from Malvern Panalytical",
    speaker: "Mr. Kunal Sharma",
    speakerRole: "Application Specialist, Malvern Panalytical",
  },
  {
    time: "03:30 – 04:15",
    title: "Sample Handling & Preparation Best Practices",
    speaker: "Workshop Faculty",
    speakerRole: "XRD and XRF sample handling guidance",
  },
  {
    time: "04:15 – 04:30",
    title: "Tea Break",
    isBreak: true,
  },
  {
    time: "04:30 – 05:30",
    title: "Live Demonstration: Multi-Purpose Empyrean XRD & Zetasizer",
    speaker: "Industry Experts",
    speakerRole: "Hands-on live demo",
  },
  {
    time: "05:30",
    title: "Networking & End of Programme",
    isBreak: true,
  },
]

function AgendaTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[color:var(--nav)]/10 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[color:var(--nav)] text-white">
            <th className="py-3 px-4 text-left font-semibold whitespace-nowrap w-32">Time</th>
            <th className="py-3 px-4 text-left font-semibold">Session Title</th>
            <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Speaker</th>
          </tr>
        </thead>
        <tbody>
          {agenda.map((item, index) => {
            if (item.isBreak) {
              return (
                <tr key={index} className="bg-[color:var(--primary)]/5 border-y border-[color:var(--primary)]/10">
                  <td className="py-2 px-4 text-xs text-[color:var(--nav)]/60 font-medium whitespace-nowrap">{item.time}</td>
                  <td colSpan={2} className="py-2 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-[color:var(--nav)]/60 font-semibold text-xs uppercase tracking-widest">
                      {item.title.toLowerCase().includes("tea") && <Clock size={12} />}
                      {item.title.toLowerCase().includes("lunch") && <Users size={12} />}
                      {item.title}
                    </span>
                  </td>
                </tr>
              )
            }

            return (
              <tr
                key={index}
                className={`border-b border-[color:var(--nav)]/5 ${item.highlight ? "bg-yellow-50" : index % 2 === 0 ? "bg-[color:var(--primary-foreground)]" : "bg-[color:var(--nav)]/[0.02]"}`}
              >
                <td className="py-3 px-4 text-xs font-semibold text-[color:var(--primary)] whitespace-nowrap align-top">{item.time}</td>
                <td className="py-3 px-4 align-top">
                  <p className={`font-semibold text-[color:var(--nav)] ${item.highlight ? "text-yellow-800" : ""}`}>{item.title}</p>
                </td>
                <td className="py-3 px-4 align-top">
                  <div>
                    <p className={`font-semibold text-xs ${item.highlight ? "text-yellow-800" : "text-[color:var(--nav)]"}`}>{item.speaker}</p>
                    <p className="text-[10px] text-[color:var(--nav)]/60 mt-0.5 leading-snug">{item.speakerRole}</p>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function WorkshopRegistrationStatusPage() {
  const router = useRouter()
  const params = useParams() as { registrationId?: string }
  const searchParams = useSearchParams()

  const registrationId = decodeURIComponent(params.registrationId || "")
  const email = searchParams.get("email") || ""

  const [registration, setRegistration] = useState<WorkshopRegistration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [agendaOpen, setAgendaOpen] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [submittingTransaction, setSubmittingTransaction] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const theme = useMemo(() => STATUS_THEME[registration?.status || "Under Process"] ?? STATUS_THEME["Under Process"], [registration?.status])
  const showWorkshopDetails = registration?.status === "Approved for Payment" || registration?.status === "Payment Submitted" || registration?.status === "Accepted"
  const canSubmitTransaction = registration?.status === "Approved for Payment" && !registration?.transaction_id

  useEffect(() => {
    if (!registrationId) {
      setLoading(false)
      setError("Missing workshop reference in the URL.")
      return
    }

    const loadRegistration = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.set("registration_reference", registrationId)
        if (email) params.set("email", email)

        const res = await fetch(`${DJANGO_API_URL}/api/workshop-registrations/lookup/?${params.toString()}`)
        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          setError(data?.detail || "Workshop registration not found.")
          setRegistration(null)
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

    void loadRegistration()
  }, [registrationId, email])

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

  const statusCopy: Record<string, string> = {
    "Under Process": "Your application is under review. The payment field is locked until the committee approves it.",
    "Approved for Payment": "Your registration is approved for payment. Submit your transaction ID below.",
    "Payment Submitted": "Your transaction ID has been received and is waiting for admin verification.",
    Accepted: "Your workshop registration is confirmed.",
    Rejected: "Your workshop registration was rejected by the committee.",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--primary-foreground)] flex items-center justify-center px-4">
        <div className="rounded-3xl border border-[color:var(--nav)]/10 bg-white px-8 py-10 shadow-lg text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[color:var(--primary)]" />
          <p className="mt-4 text-[color:var(--nav)]/70">Loading workshop registration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.panel} from-white via-white to-[color:var(--primary)]/5`}>
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-12">
        <div className={`rounded-[2rem] border ${theme.border} bg-white shadow-xl overflow-hidden`}>
          <div className={`h-2 ${theme.accent}`} />
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="max-w-2xl">
                <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.text} mb-2`}>Workshop Registration Status</p>
                <h1 className="text-3xl md:text-4xl font-bold text-[color:var(--nav)]">{registration?.registration_id || registrationId}</h1>
                <p className="mt-3 text-[color:var(--nav)]/70">
                  {statusCopy[registration?.status || "Under Process"]}
                </p>
                {error && (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {message && (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}
              </div>

              <div className={`rounded-2xl ${theme.accentSoft} ${theme.text} border ${theme.border} px-4 py-3 self-start`}>
                <p className="text-xs uppercase tracking-wide font-semibold">Status</p>
                <p className="text-lg font-bold mt-1">{registration?.status_display || theme.label}</p>
              </div>
            </div>

            {registration && (
              <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-[color:var(--nav)]/10 bg-[color:var(--primary-foreground)] p-4">
                      <p className="text-xs uppercase tracking-wide text-[color:var(--nav)]/50">Name</p>
                      <p className="mt-1 font-semibold text-[color:var(--nav)]">{registration.full_name}</p>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--nav)]/10 bg-[color:var(--primary-foreground)] p-4">
                      <p className="text-xs uppercase tracking-wide text-[color:var(--nav)]/50">Email</p>
                      <p className="mt-1 font-semibold text-[color:var(--nav)] break-all">{registration.email}</p>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--nav)]/10 bg-[color:var(--primary-foreground)] p-4">
                      <p className="text-xs uppercase tracking-wide text-[color:var(--nav)]/50">Participant Type</p>
                      <p className="mt-1 font-semibold text-[color:var(--nav)] capitalize">{registration.participant_type}</p>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--nav)]/10 bg-[color:var(--primary-foreground)] p-4">
                      <p className="text-xs uppercase tracking-wide text-[color:var(--nav)]/50">Fee</p>
                      <p className="mt-1 font-semibold text-[color:var(--nav)]">INR {registration.fee_amount}</p>
                    </div>
                  </div>

                  <div className={`rounded-3xl border ${theme.border} ${theme.panel} p-5 md:p-6`}>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${theme.text}`}>Committee update</p>
                        <h2 className="text-xl font-bold text-[color:var(--nav)] mt-1">{registration.status_display}</h2>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${theme.accentSoft} ${theme.text}`}>
                        {registration.registration_id}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-[color:var(--nav)]/75 leading-relaxed">{statusCopy[registration.status] || statusCopy["Under Process"]}</p>
                  </div>

                  {showWorkshopDetails && (
                    <div className="rounded-3xl border border-[color:var(--nav)]/10 bg-white p-5 md:p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--primary)] mb-2">Workshop Details</p>
                          <h2 className="text-2xl font-bold text-[color:var(--nav)]">Workshop 1: XRD & XRF Characterization</h2>
                          <p className="mt-2 text-[color:var(--nav)]/70 max-w-2xl">
                            A full-day pre-conference workshop on XRD & XRF fundamentals, particle characterization, sample preparation best practices, and a live Empyrean XRD & Zetasizer demonstration.
                          </p>
                        </div>
                        <a
                          href="/workshop"
                          className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-[color:var(--primary)] hover:bg-[color:var(--primary)] hover:text-white transition-colors"
                        >
                          View Workshop Page <ExternalLink size={14} />
                        </a>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3 text-sm">
                        <div className="rounded-2xl bg-[color:var(--primary-foreground)] p-4 border border-[color:var(--nav)]/10">
                          <p className="text-[color:var(--nav)]/50 text-xs uppercase tracking-wide">Date</p>
                          <p className="font-semibold text-[color:var(--nav)] mt-1">June 23, 2026</p>
                        </div>
                        <div className="rounded-2xl bg-[color:var(--primary-foreground)] p-4 border border-[color:var(--nav)]/10">
                          <p className="text-[color:var(--nav)]/50 text-xs uppercase tracking-wide">Venue</p>
                          <p className="font-semibold text-[color:var(--nav)] mt-1">IIT Indore</p>
                        </div>
                        <div className="rounded-2xl bg-[color:var(--primary-foreground)] p-4 border border-[color:var(--nav)]/10">
                          <p className="text-[color:var(--nav)]/50 text-xs uppercase tracking-wide">Partners</p>
                          <p className="font-semibold text-[color:var(--nav)] mt-1">Malvern Panalytical & Aimil</p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--nav)]/10 bg-[color:var(--nav)]/5 px-4 py-3 text-sm text-[color:var(--nav)]/75">
                        <span className="font-semibold text-[color:var(--nav)]">Agenda</span>
                        <button
                          type="button"
                          onClick={() => setAgendaOpen((value) => !value)}
                          className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--nav)]/10 bg-white px-4 py-2 font-semibold text-[color:var(--nav)] hover:bg-[color:var(--primary)] hover:text-white hover:border-[color:var(--primary)] transition-colors"
                        >
                          {agendaOpen ? <><ChevronUp size={14} /> Hide Agenda</> : <><ChevronDown size={14} /> View Full Agenda</>}
                        </button>
                      </div>

                      {agendaOpen && (
                        <div className="mt-4">
                          <AgendaTable />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-[color:var(--nav)]/10 bg-[linear-gradient(180deg,rgba(8,84,120,0.08),rgba(255,255,255,0.9))] p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`rounded-2xl ${theme.accentSoft} p-3 ${theme.text}`}>
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[color:var(--nav)]">Payment status</h2>
                        <p className="text-sm text-[color:var(--nav)]/65">Transaction ID is available only after approval for payment.</p>
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
                          className="w-full rounded-xl bg-[linear-gradient(135deg,var(--primary),#8a2d73)] px-5 py-3 font-semibold text-white shadow-md hover:shadow-lg hover:translate-y-[-1px] transition-all disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2"
                        >
                          {submittingTransaction ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                          {submittingTransaction ? "Submitting..." : "Submit Transaction ID"}
                        </button>
                      </form>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[color:var(--nav)]/15 bg-white/70 p-4 text-sm text-[color:var(--nav)]/65 leading-relaxed">
                        {registration.transaction_id
                          ? `Transaction ID already submitted: ${registration.transaction_id}`
                          : "The transaction field unlocks after the committee selects you for payment."}
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
            )}
          </div>
        </div>

        {registration?.status === "Rejected" && (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700 text-sm">
            This workshop registration has been rejected. You may contact the organizers if you need clarification.
          </div>
        )}
      </div>
    </div>
  )
}
